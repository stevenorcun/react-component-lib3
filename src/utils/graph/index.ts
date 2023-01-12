/* eslint-disable import/no-cycle */
import { GraphState } from "../../store/graph";
import {
  EntityDto,
  GraphElementMandatoryProps,
  GraphEntityProperties,
} from "../../API/DataModels/Database/NovaObject";
import Graph from "../../API/DataModels/GraphRepresentation/Graph";
import {
  DEFAULT_TILE_HEIGHT,
  DEFAULT_TILE_HITBOX,
  DEFAULT_TILE_WIDTH,
} from "../../constants/graph";
import { AnnotationDto } from "../../API/DataModels/Entities/AnnotationEntity";
import Vertex from "../../API/DataModels/GraphRepresentation/Vertex";
import { Coordinates2D, pythagorean } from "../../utils/trigonometry";
import { CanImplementHistogramState } from "../../store/shared/histogram";
import { CanImplementTimelineState } from "../../store/shared/timeline";
import {
  getEntityTitleProperty,
  getEntityTypeGroup,
  getIdProperty,
  getOntPropertyByTypeByObjectType,
  ONTOLOGY_TYPES_GROUPS,
} from "../../constants/entity-related";
import { ConnectionProps } from "../../components/Connection/Connection";
import { convertToEntityDto2 } from "../../API/DataModels/DTO/entityDto";
import { GRAPH_OFFSET } from "../../constants/graph-offset";

// /!\ HORRIBLE SCALING /!\
// TODO:
//  - turn selection into a Map
//  - get `isHighlightingTypes` and `isHighlightingProperties` from the props to avoid computation
export const isGraphEntityHighlighted = (
  {
    selection,
    histogramHighlights,
    timelineHighlightedIds,
  }: {
    selection: EntityDto["id"][];
    histogramHighlights: CanImplementHistogramState["histogramHighlights"];
    timelineHighlightedIds: CanImplementTimelineState["timelineHighlightedIds"];
  },
  entity: EntityDto
) => {
  // HORRIBLE SCALING,
  // mais on peut le faire une seule fois dans Graph
  // et avoir une variable "est en train de trier par propriétés"
  const isSelected = selection.indexOf(entity.id) > -1;
  const isHighlightingTypes = Object.keys(histogramHighlights.types).length;
  const isHighlightingProperties = Object.keys(
    histogramHighlights.properties.entityIds
  ).length;
  return !!(
    timelineHighlightedIds?.[entity.id] ||
    (isSelected &&
      // highlight par prop ET
      // pas de highlight par type OU est une intersection avec le highlight par type
      ((histogramHighlights.properties.entityIds[entity.id] &&
        (!isHighlightingTypes || histogramHighlights.types[entity.type])) ||
        (histogramHighlights.types[entity.type] && !isHighlightingProperties)))
  );
};

export const isGraphEntityHighlightedSlightlyLighter = (
  {
    histogramHighlights,
    timelineHighlightedIds,
    isSelected,
    isHighlightingTypes,
    isHighlightingProperties,
  }: {
    isSelected: boolean;
    isHighlightingTypes: boolean;
    isHighlightingProperties: boolean;
    histogramHighlights: CanImplementHistogramState["histogramHighlights"];
    timelineHighlightedIds: CanImplementTimelineState["timelineHighlightedIds"];
  },
  entity: EntityDto,
  type: number
) =>
  !!(
    timelineHighlightedIds?.[entity.id] ||
    (isSelected &&
      // highlight par prop ET
      // pas de highlight par type OU est une intersection avec le highlight par type
      ((histogramHighlights.properties.entityIds[entity.id] &&
        (!isHighlightingTypes || histogramHighlights.types[type])) ||
        (histogramHighlights.types[type] && !isHighlightingProperties)))
  );
/**
 * Returns selected entities
 * OR all entities if none are selected
 * @param state
 */
export const getSelectedEntities = (state: GraphState) => {
  let { entities } = state;
  if (state.selection.length) {
    const selectionIdsAsMap = state.selection.reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    entities = entities.filter(({ id }) => selectionIdsAsMap[id]);
  }
  return entities;
};

/**
 * Graph (math) representation of all selected entities
 * (or all entities if none are selected)
 * @param graphState
 */
export const populateGraphFromState = (graphState: GraphState) => {
  const entities = getSelectedEntities(graphState);

  if (!entities.length) return null;

  // Re-create data (nodes and edge list)
  const graph = new Graph();
  entities.forEach(({ id }) => graph.addVertex(id));

  // only add connections if both entities were added as Vertexes
  graphState.connections.forEach(({ from, to }) => {
    if (graph.nodes.has(from) && graph.nodes.has(to)) {
      graph.addEdge(from, to);
    }
  });

  return graph;
};

export interface ParallelepipedExtremes {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/**
 * Ultra naive
 * Returns a parallelepiped's extremes
 * representing the "dead-zone" where it isn't safe to place the result of our layout computation.
 *
 * If there is no deadzone, returns null instead (i.e. all entities are affected by the layout)
 *
 * @param graphState Whole state because TODO we will have to include Annotation dead-zone
 * @param entitiesToExcludeIdMap Entities to exclude from the dead-zone
 */
export const computeGraphDeadZone = (
  graphState: {
    entityGraphPropertiesMap: GraphState["entityGraphPropertiesMap"];
    annotations: GraphState["annotations"];
  },
  entitiesToExcludeIdMap: { [eId: EntityDto["id"]]: boolean }
) => {
  const deadZoneFromPosArray = (
    positions: GraphEntityProperties[] | AnnotationDto[] | unknown[],
    initialDeadZone?: ParallelepipedExtremes | null
  ) => {
    let deadZoneEntitiesCount = initialDeadZone ? 1 : 0;
    const deadZoneExtremes = {
      ...(initialDeadZone || {
        xMin: +Infinity,
        xMax: -Infinity,
        yMin: +Infinity,
        yMax: -Infinity,
      }),
    };

    positions.forEach(
      ({
        id,
        x,
        y,
        // Annotation specific
        width,
        height,
      }) => {
        // ignorer ceux présents dans
        if (entitiesToExcludeIdMap[id]) return;

        deadZoneEntitiesCount += 1;

        deadZoneExtremes.xMin = Math.min(x, deadZoneExtremes.xMin);
        deadZoneExtremes.yMin = Math.min(y, deadZoneExtremes.yMin);
        deadZoneExtremes.xMax = Math.max(
          x + (width || DEFAULT_TILE_WIDTH) + 2 * DEFAULT_TILE_HITBOX,
          deadZoneExtremes.xMax
        );
        deadZoneExtremes.yMax = Math.max(
          y + 2 * (height || DEFAULT_TILE_HEIGHT) + 2 * DEFAULT_TILE_HITBOX,
          deadZoneExtremes.yMax
        );
      }
    );
    return deadZoneEntitiesCount ? deadZoneExtremes : null;
  };

  const entitiesDeadZone = deadZoneFromPosArray(
    Object.values(graphState.entityGraphPropertiesMap)
  );
  const annotations = Object.values(graphState.annotations);
  return annotations.length
    ? deadZoneFromPosArray(annotations, entitiesDeadZone)
    : entitiesDeadZone;
};

/**
 * Updates the position of entities to be placed BELOW a dead-zone (forbidden area)
 * The positioning (BELOW) was chosen at random
 *
 * @returns GraphState['entityGraphPropertiesMap'] A modified value of the current state,
 * where only the entities listed in props were moved (according to the dead-zone)
 */
export const updatePosBasedOnDeadZone = (
  entityGraphPropertiesMap: GraphState["entityGraphPropertiesMap"],
  posToUpdate: GraphElementMandatoryProps[],
  deadZone: ParallelepipedExtremes | null = {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
  defaultOffset = { x: 0, y: 0 }
) => {
  const offset = {
    x: (deadZone?.xMin || 0) + defaultOffset.x,
    y: (deadZone?.yMax || 0) + defaultOffset.y,
  };

  const unscaledOrigin = { ...offset };

  // placer EN DESSOUS (choix au pif) de la dead-zone
  // TODO
  //  Et déplacer l'origine en dessous aussi (sinon souvent hors champ)?
  const clone: GraphState["entityGraphPropertiesMap"] = JSON.parse(
    JSON.stringify(entityGraphPropertiesMap)
  );
  posToUpdate.forEach(({ id, x, y }) => {
    if (!clone[id]) return;

    clone[id].x = offset.x + x;
    clone[id].y = offset.y + y;

    if (clone[id].x < offset.x) unscaledOrigin.x = clone[id].x;
    if (clone[id].y < offset.y) unscaledOrigin.y = clone[id].y;
  });

  return { entityGraphPropertiesMap: clone, unscaledOrigin };
};

/**
 * Compute new values for GraphState['entityGraphPropertiesMap']
 * based on a selection and an origin (default offset)
 * while staying out of a potential dead-zone
 */
export const computeDeadZoneAndPositions = (
  graphState: {
    entityGraphPropertiesMap: GraphState["entityGraphPropertiesMap"];
    annotations: GraphState["annotations"];
  },
  entityPositions: GraphElementMandatoryProps[],
  posOffset: GraphState["graphOrigin"] = { x: 0, y: 0 }
) => {
  // Only care IF there are unselected elements, otherwise we just place it all at the origin
  const entitiesToMoveIdMap = entityPositions.reduce((acc, { id }) => {
    acc[id] = true;
    return acc;
  }, {});
  const deadZoneExtremes = computeGraphDeadZone(
    graphState,
    entitiesToMoveIdMap
  );

  const { entityGraphPropertiesMap, unscaledOrigin } = updatePosBasedOnDeadZone(
    graphState.entityGraphPropertiesMap,
    entityPositions,
    deadZoneExtremes,
    posOffset
  );

  return {
    deadZone: deadZoneExtremes,
    entityGraphPropertiesMap,
    unscaledOrigin,
  };
};

export const calculateNodePositionCircle = (
  innerCircle: Map<string, Vertex>,
  outerCircle: Map<string, Vertex[]>,
  isolated: Map<string, Vertex>,
  isolatedDuos: Array<Vertex>
  // graphScale = graphState.graphScale,
) => {
  const WINDOW_WIDTH = window.innerWidth;
  const WINDOW_HEIGHT = window.innerHeight;

  // min space between two entities
  const X_SPACING = 60 + DEFAULT_TILE_WIDTH;
  const Y_SPACING = 40 + DEFAULT_TILE_HEIGHT;
  // graph origin
  const oX = 0; // graphState.graphOrigin.x;
  const oY = 0; // graphState.graphOrigin.y;
  // not dividing by 2 to have the graph slightly off-centered to the left
  const relativeCenterX = Math.floor(
    oX + WINDOW_WIDTH * 0.5 - DEFAULT_TILE_WIDTH // graphScale,
  );
  const relativeCenterY = Math.floor(
    oY + WINDOW_HEIGHT * 0.5 - DEFAULT_TILE_HEIGHT / 2 // graphScale,
  );

  const topLeftCornerPos = {
    x: relativeCenterX,
    y: relativeCenterY,
  };

  // Min Y pos from where we are allowed to "draw" the isolated
  // (and 1-link) entities without overlapping main circular layout
  let minY = innerCircle.size ? -Infinity : oY;
  // "random" 6 per row limitation
  // (even number needed for 1-link isolated entities to always appear next to one another)
  const MAX_ENTITIES_PER_ROW = 6;

  const allNodePos: Array<{ id: string; x: number; y: number }> = [];

  /* Inner circle */
  const innerCircleRadius = innerCircle.size * (DEFAULT_TILE_WIDTH / 2);
  const innerCircleSliceAngleInRad = (2 * Math.PI) / innerCircle.size;
  const innerCircleVectorById: {
    [id: string]: {
      vector: Coordinates2D;
      angle: number;
      center: Coordinates2D;
      outerNodes: Vertex[];
    };
  } = {};
  Array.from(innerCircle.values()).forEach((node, index) => {
    const angle = innerCircleSliceAngleInRad * index;
    const sliceVector = {
      x: Math.cos(angle) * innerCircleRadius,
      y: Math.sin(angle) * innerCircleRadius,
    };
    const center = {
      x: relativeCenterX + sliceVector.x - DEFAULT_TILE_WIDTH / 2,
      y: relativeCenterY + sliceVector.y - DEFAULT_TILE_HEIGHT / 2,
    };
    const nodePos = {
      id: node.value,
      x: center.x,
      y: center.y,
    };
    if (outerCircle.has(node.value)) {
      innerCircleVectorById[node.value] = {
        vector: sliceVector,
        angle,
        center,
        outerNodes: Array.from(outerCircle.get(node.value)!.values()),
      };
    }

    // update max X and Y for later drawing
    minY = Math.max(minY, nodePos.y + DEFAULT_TILE_HEIGHT);
    allNodePos.push(nodePos);

    // copy pasta to avoid looping over allNodePos at the end
    if (nodePos.x < topLeftCornerPos.x) topLeftCornerPos.x = nodePos.x;
    if (nodePos.y < topLeftCornerPos.y) topLeftCornerPos.y = nodePos.y;
  }); /* end of inner circle loop */

  /* Outer circle */
  for (const id in innerCircleVectorById) {
    const current = innerCircleVectorById[id];
    if (current.outerNodes.length) {
      // half circle values
      const halfCircleRadius =
        current.outerNodes.length *
        (1.2 * pythagorean(DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT));
      const outerCircleSliceAngleInRad =
        (5 * Math.PI) / 6 / current.outerNodes.length;
      const halfCircleCenter = current.center;

      for (let index = 0, l = current.outerNodes.length; index < l; ++index) {
        const outerNode = current.outerNodes[index];
        const outerNodeAngle =
          current.outerNodes.length > 1
            ? current.angle -
              Math.PI / 2 +
              outerCircleSliceAngleInRad * index +
              Math.PI / 6 // (should be Pi/12 but I don't get why it works "as intended" with 1/6)
            : current.angle; // - Math.PI/2;
        const outerNodePos = {
          id: outerNode.value,
          x: halfCircleCenter.x + Math.cos(outerNodeAngle) * halfCircleRadius,
          y: halfCircleCenter.y + Math.sin(outerNodeAngle) * halfCircleRadius,
        };

        // update max X and Y for later drawing
        minY = Math.max(minY, outerNodePos.y + DEFAULT_TILE_HEIGHT);
        allNodePos.push(outerNodePos);
        // copy pasta to avoid looping over allNodePos at the end
        if (outerNodePos.x < topLeftCornerPos.x)
          topLeftCornerPos.x = outerNodePos.x;
        if (outerNodePos.y < topLeftCornerPos.y)
          topLeftCornerPos.y = outerNodePos.y;
      }
    }
  } /* end of outer circle loop */

  minY += DEFAULT_TILE_HITBOX + Y_SPACING;

  /* Fully isolated nodes */
  Array.from(isolated.values()).forEach((node, index) => {
    const nodePos = {
      id: node.value,
      x: Math.floor(
        relativeCenterX + X_SPACING * (index % MAX_ENTITIES_PER_ROW)
      ),
      y: Math.floor(
        minY + Y_SPACING * Math.floor(index / MAX_ENTITIES_PER_ROW)
      ),
    };
    allNodePos.push(nodePos);
  });

  /* The "isolated duos" are displayed on the bottom left */
  isolatedDuos.forEach((node, index) => {
    const nodePos = {
      id: node.value,
      // minus for offsetting on the left
      x: Math.floor(
        relativeCenterX +
          X_SPACING *
            ((index % MAX_ENTITIES_PER_ROW) - MAX_ENTITIES_PER_ROW - 1)
      ),
      y: Math.floor(
        minY + Y_SPACING * Math.floor(index / MAX_ENTITIES_PER_ROW)
      ),
    };
    allNodePos.push(nodePos);
  });
  return { positions: allNodePos, topLeftCornerPos };
};

export const computeGraphRect = (state: GraphState) => {
  const rect = {
    left: 2147483647,
    top: 2147483647,
    right: -2147483648,
    bottom: -2147483648,
    width: 0,
    height: 0,
  };
  state.entities.forEach((a: EntityDto) => {
    rect.left = Math.min(rect.left, state.entityGraphPropertiesMap[a.id].x);
    rect.top = Math.min(rect.top, state.entityGraphPropertiesMap[a.id].y);
    rect.right = Math.max(
      rect.right,
      state.entityGraphPropertiesMap[a.id].x + 134
    );
    rect.bottom = Math.max(
      rect.bottom,
      state.entityGraphPropertiesMap[a.id].y + 197
    );
  });
  const annotations = Object.values(state.annotations);
  annotations.forEach((a: AnnotationDto) => {
    rect.left = Math.min(rect.left, a.x);
    rect.top = Math.min(rect.top, a.y);
    rect.right = Math.max(rect.right, a.x + a.width);
    rect.bottom = Math.max(rect.bottom, a.y + a.height);
  });
  if (!state.entities.length && !annotations.length) {
    rect.left = 0;
    rect.right = 0;
    rect.top = 0;
    rect.bottom = 0;
  }
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
  return {
    x: rect.left,
    y: rect.top,
    // 365px is the width of the auxiliary
    // TODO use relative width instead (20% of 1920px)
    width: rect.width + 470,
    // width: rect.width,
    height: rect.height,
  };
};

export const graphUpdateRectThenFitToView = (state: GraphState) => {
  const rect = computeGraphRect(state);
  state.graphRect = rect;
  const screen = { w: window.innerWidth, h: window.innerHeight - GRAPH_OFFSET };
  const scale =
    rect.width >= screen.w || rect.height >= screen.h
      ? Math.max(
          0.1,
          Math.min(
            2,
            Math.floor(
              10 *
                Math.min(
                  screen.w / (rect.width + 70),
                  screen.h / (rect.height + 70)
                )
            ) / 10
          )
        )
      : 1;
  state.graphScale = scale;
  state.graphOrigin = {
    x: (rect.x - 0.5 * (screen.w / scale - rect.width)) * scale,
    y: (rect.y - 0.5 * (screen.h / scale - rect.height)) * scale,
  };
};

/**
 * Extrait et transforme les objets LINK en Connection,
 * prêts à être ajoutés au graphSlice
 * @param entities
 * @param ontologyState
 */
export const castEntitiesToConnections = (
  entities: EntityDto[],
  ont: any[]
) => {
  const connectionFromPropKey = getOntPropertyByTypeByObjectType({
    ont,
    objType: ONTOLOGY_TYPES_GROUPS.LINK,
    propType: "LINK_ID_SRC",
  });
  const connectionToPropKey = getOntPropertyByTypeByObjectType({
    ont,
    objType: ONTOLOGY_TYPES_GROUPS.LINK,
    propType: "LINK_ID_DEST",
  });

  if (connectionFromPropKey?.name && connectionToPropKey?.name) {
    return entities.reduce((acc: ConnectionProps[], c) => {
      const typeGroup = getEntityTypeGroup(c, ont);
      if (
        typeGroup &&
        ONTOLOGY_TYPES_GROUPS[typeGroup] === ONTOLOGY_TYPES_GROUPS.LINK
      ) {
        const label =
          c[
            getOntPropertyByTypeByObjectType({
              ont,
              objType: ONTOLOGY_TYPES_GROUPS.LINK,
              propType: "TEXT",
            })?.name
          ];

        // @ts-ignore
        acc.push({
          from: c[connectionFromPropKey.name],
          to: c[connectionToPropKey?.name],
          // @ts-ignore
          type: undefined,
          // @ts-ignore
          label,
          isBidirectionnal: false,
          isHypothesis: false,
          ...c,
        });
      }
      return acc;
    }, []);
  }

  return [];
};

export const addIdField = (e, ont) =>
  convertToEntityDto2(
    {
      ...e,
      id: e[getIdProperty(e, ont)],
    },
    ont
  );

export const addIdLabelFields = (e, ont) =>
  convertToEntityDto2(
    {
      ...addIdField(e, ont),
      label: getEntityTitleProperty(e, ont),
    },
    ont
  );

export const sortLinksByIdObjet = (links) =>
  links.reduce((acc, curr) => {
    acc[curr.ID_SOURCE] = acc[curr.ID_SOURCE] ?? [];
    acc[curr.ID_DEST] = acc[curr.ID_DEST] ?? [];
    acc[curr.ID_SOURCE].push(curr);
    acc[curr.ID_DEST].push(curr);
    return acc;
  }, {});

export const relatedWithIds = (
  entity,
  resultSortLinksByIdObjet,
  linksResult,
  ont
) => ({
  ...entity,
  links: resultSortLinksByIdObjet?.map((e) => addIdField(e, ont)) || [],
  relations: linksResult.map((e) => addIdLabelFields(e, ont)) || [],
});
