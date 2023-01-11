/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import React from "react";
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import _ from "lodash";

import AnnotationEntity, {
  AnnotationDto,
} from "@/API/DataModels/Entities/AnnotationEntity";
import {
  DEFAULT_TILE_STYLE,
  STROKES_FILLS_COLORS,
  STYLES_BY_FILL_COLORS_OBJECT,
} from "@/constants/graph-themes";
import {
  EntityDto,
  GraphElementMandatoryProps,
  GraphEntityProperties,
  RelatedSummary,
} from "@/API/DataModels/Database/NovaObject";
import { NovaEntityConnexionType } from "@/API/DataModels/Database/NovaEntityEnum";
import { convertToEntityDto } from "@/API/DataModels/DTO/entityDto";
import { GRAPH_OFFSET } from "@/constants/graph-offset";
import { Optional } from "@/utils/types";
import {
  computeDeadZoneAndPositions,
  computeGraphRect,
  getSelectedEntities,
  graphUpdateRectThenFitToView,
  isGraphEntityHighlightedSlightlyLighter,
} from "@/utils/graph";
import { ObjectDto } from "@/API/DataModels/Entities/ObjectEntity";
import {
  CanImplementHistogramState,
  highlightReducers,
  initialHistogramState,
} from "@/store/shared/histogram";
import {
  CanImplementTimelineState,
  initTimelineState,
  timelineReducers,
} from "@/store/shared/timeline";
import { DEFAULT_TILE_HITBOX } from "@/constants/graph";
import { ConnectionProps } from "@/components/Connection/Connection";
import { OntologyConfigState } from "@/store/ontology";
import { getEntityTypeId } from "@/constants/entity-related";
import { initialStateToolbar, toolbarReducer } from "./toolbar";

/* Type for setting the current graph Layout
 * Needs to be string values as they are used in a "data-" attribute in the DOM
 */
export enum GraphLayout {
  Free = "FREE",
  Hierarchically = "HIERARCHICALLY",
  Grid = "GRID",
  Circular = "CIRCULAR",
  Star = "STAR",
  Linear = "LINEAR",
  Fadette = "FADETTE",
  Elbow = "ELBOW",
  EntityType = "ENTITY_TYPE",
  PropertyType = "PROPERTY_TYPE",
}

export const PINS_OFFSETS = [
  { x: 67, y: -15 }, // TOP
  { x: -15, y: 102 }, // LEFT
  { x: 149.5, y: 102 }, // RIGHT
  { x: 67, y: 215 }, // BOTTOM
];

export interface GraphState
  extends CanImplementHistogramState,
    CanImplementTimelineState {
  selection: string[];
  focusedEntityId: string | null;
  graphLayout: GraphLayout;
  entities: EntityDto[];
  entityGraphPropertiesMap: { [entityId: string]: GraphEntityProperties };
  // fixme: Once we have a real Connection Dto (from/toPos aren't going to be in it)
  connections: Array<ConnectionProps>;
  selectedConnections: Array<any>;
  graphScale: number;
  graphOrigin: { x: number; y: number };
  graphRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isActivePalette: boolean;
  isGridLayoutArrowDisplayed: boolean;
  positionArrowGraph: { x: number; y: number } | null;
  horizontalMargin: number;
  verticalMargin: number;
  annotations: any;
  selectedAnnotations: { [id: string]: boolean };
  isPlayingTransition: boolean;

  // used to draw an arrow while dragging a Pin
  isDraggingSrcPinPos: { x: number; y: number } | null;
  mousePos: { x: number; y: number };

  currentFill: string;
  currentStroke: string;
  currentFont: string;
  currentSizeFont: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: string;
  textColorAnnotation: string;
  thicknessAnnotation: string;

  currenColorObject: number;

  // Fit to view only on the first ever load
  isGraphRectInitialized: boolean;
  isOverviewInitialized: boolean;
}

/**
 * Sets style for all selected elements (entities AND annotations)
 *
 * @Private function not meant to be used as a dispatch action. Exists to avoid code repetition
 */
function setSelectedEntitiesStyle(
  state: Draft<GraphState>,
  style: Partial<ObjectDto>
) {
  // Update selected entities
  state.selection.forEach((id) => {
    state.entityGraphPropertiesMap[id] = {
      ...state.entityGraphPropertiesMap[id],
      ...style,
    };
  });

  // Update selected annotations
}

function setSelectedAnnotationStyle(
  state: Draft<GraphState>,
  style: Partial<AnnotationDto>
) {
  Object.keys(state.selectedAnnotations).forEach((annotationId) => {
    state.annotations[annotationId] = {
      ...state.annotations[annotationId],
      ...style,
    };
  });
}

const calculateNewEntityCoordinate2 = (
  state: GraphState,
  offset: number,
  columns: number
) => {
  const cardWidth = 165;
  const cardHeight = 220;

  let x: number = 0;
  let y: number = 0;

  const numColumn = offset % columns;
  const numLine = Math.floor(offset / columns);

  x = (cardWidth + state.horizontalMargin) * numColumn + state.graphRect.x;

  y =
    (cardHeight + state.verticalMargin) * numLine +
    state.graphRect.y +
    state.graphRect.height +
    state.verticalMargin;

  return {
    x,
    y,
    offset,
    columns,
  };
};

export const initialGraphRect = {
  x: 0,
  y: 0,
  width: window.innerWidth + 70,
  height: window.innerHeight - 120,
};
const initialState: GraphState = {
  ...initialStateToolbar,
  selection: [],
  focusedEntityId: null,
  graphLayout: GraphLayout.Free,
  isPlayingTransition: false,
  positionArrowGraph: null,
  entityGraphPropertiesMap: {},
  entities: [],
  connections: [],
  selectedConnections: [],
  graphScale: 1,
  graphOrigin: { x: 0, y: 0 },
  graphRect: initialGraphRect,
  isGridLayoutArrowDisplayed: false,
  horizontalMargin: 20,
  verticalMargin: 90,
  textColorAnnotation: STROKES_FILLS_COLORS[15],

  currenColorObject: 0,
  /*
   * Fake HashMap using an object
   * /!\ WARNING /!\ KEYS WILL BECOME STRINGS /!\ WARNING /!\
   */
  annotations: {},
  selectedAnnotations: {},
  isActivePalette: true,

  isDraggingSrcPinPos: null,
  mousePos: { x: 0, y: 0 },

  // both needed for highlighting in Histogram --> should we just make one ?
  // Timeline
  ...initTimelineState(),
  // Histogram
  ...initialHistogramState(),

  // a flag to only fit to view once, ever.
  // If the user then changes the zoom etc... it's not out problem anymore
  isGraphRectInitialized: false,
  isOverviewInitialized: false,
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    ...toolbarReducer,
    /**
     *  Create an Annotation at an offset relative to the graph's current position
     *
     *  TODO:
     *    - Scale the offset properly (if you zoom-in/out, the offset computed isn't scaled)
     */
    createAnnotationEntity: (state) => {
      // The Toolbar is 60px high and displayed OVER (in front of) the Graph component
      // We give an arbitrary 10px offset on creation, for a total of 70px
      const defCoordOffset = 70;

      const newAnnotation = AnnotationEntity({
        x: (defCoordOffset + state.graphOrigin.x) / state.graphScale,
        y: (defCoordOffset + state.graphOrigin.y) / state.graphScale,
        fill: state.currentFill,
        stroke: state.currentStroke,
        bold: state.isBold,
        isItalic: state.isItalic,
        isUnderline: state.isUnderline,
        textAlign: state.textAlign,
        textColor: state.textColorAnnotation,
        font: state.currentFont,
        fontSizeInPx: state.currentSizeFont,
        thikness: state.thicknessAnnotation,
      });

      // Add new instance to the store
      state.annotations[newAnnotation.id] = newAnnotation;
      state.selectedAnnotations[newAnnotation.id] = true;
    },
    /**
     * Delete an Annotation by key
     * @param state Current state of the store
     * @param action  Key of the Annotation we want to delete
     */
    deleteAnnotationByKey: (state, action: PayloadAction<string>) => {
      delete state.annotations[action.payload];
      delete state.selectedAnnotations[action.payload];
    },
    updateAnnotationById: (state, action) => {
      const targetedAnnotation = state.annotations[action.payload.id];
      if (targetedAnnotation && targetedAnnotation.id !== undefined) {
        state.annotations[targetedAnnotation.id] = {
          ...targetedAnnotation,
          ...action.payload,
        };
      }
    },
    /**
     * Toggle the selection of an Annotation
     */
    toggleAnnotationSelectionById: (state, action) => {
      if (state.selectedAnnotations[action.payload]) {
        delete state.selectedAnnotations[action.payload];
      } else state.selectedAnnotations[action.payload] = true;
    },

    selectEveryAnnotations: (state) => {
      const result = Object.keys(state.annotations).reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {});
      state.selectedAnnotations = result;
    },

    selectInvertSelectionAnnotations: (state) => {
      const result = Object.keys(state.annotations).reduce((acc, curr) => {
        if (!state.selectedAnnotations[curr]) {
          acc[curr] = true;
        }
        return acc;
      }, {});
      state.selectedAnnotations = result;
    },
    /**
     * Sets currently selected annotations. Useful for unselecting all annotations
     */
    setSelectedAnnotations: (state, action) => {
      state.selectedAnnotations = action.payload;
    },

    setCurrentColorObject: (state, action) => {
      state.currenColorObject = action.payload;
      setSelectedAnnotationStyle(state, { fill: action.payload });
      setSelectedEntitiesStyle(state, {
        fill: STYLES_BY_FILL_COLORS_OBJECT[action.payload].fontByDefault,
        textColor: STYLES_BY_FILL_COLORS_OBJECT[action.payload].textByDefault,
        iconColor: STYLES_BY_FILL_COLORS_OBJECT[action.payload].iconByDefault,
        strokeLabel:
          STYLES_BY_FILL_COLORS_OBJECT[action.payload].strokeLabelByDefault,
        textLabelColor:
          STYLES_BY_FILL_COLORS_OBJECT[action.payload].textLabelByDefault,
      });
    },

    /**
     *  Update a entity's attribute using its `id` to find it (style, content, position etc.)
     */
    updateEntityByID: (state, action: PayloadAction<Partial<EntityDto>>) => {
      // The expected payload is a partial entity's interface of the one we are trying to modify
      const { payload } = action;

      // find first by `id`
      let { length } = state.entities;
      let found = false;
      while (length-- && !found) {
        if (state.entities[length].id === payload.id) {
          state.entities[length] = {
            // TODO use a deep-merge algorithm
            ...state.entities[length],
            ...payload,
          };
          found = true;
        }
      }
    },
    /**
     * Updates the coordinates (x, y) of an entity
     * TODO delete redundant dispatch action ?
     *      (regroup with "update style" action, under `setEntityGraphProperties`)
     */
    updateEntityCoordinatesById: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) => {
      // The expected payload is a partial entity's interface of the one we are trying to modify
      const { payload } = action;
      state.entityGraphPropertiesMap[payload.id] = {
        ...state.entityGraphPropertiesMap[payload.id],
        x: payload.x,
        y: payload.y,
      };
    },

    toggleActivePalette: (state) => {
      state.isActivePalette = !state.isActivePalette;
    },
    /**
     * Delete an Entity
     * @param state Current state of the store
     * @param action  Id of the Entity we want to delete
     */
    deleteEntity: (state: GraphState, action: PayloadAction<string>) => {
      const { payload } = action;
      for (let index = 0; index < state.entities.length; index += 1) {
        if (state.entities[index].id === payload) {
          // Remove connections from or to this entity first
          if (state.connections.length) {
            for (let key = 0; key < state.connections.length; key += 1) {
              if (
                state.connections[key].from === payload ||
                state.connections[key].to === payload
              ) {
                state.connections.splice(key, 1);

                // remove from rowIds too (updates row selection in Histogram)
                delete state.histogramHighlights.properties.entityIds[payload];
                const rowIds = Object.keys(
                  state.histogramHighlights.properties.rowIds
                );
                rowIds.forEach((rowId) => {
                  const indexOfId =
                    state.histogramHighlights.properties.rowIds[rowId].indexOf(
                      payload
                    );
                  // remove from array
                  if (indexOfId > -1) {
                    if (
                      state.histogramHighlights.properties.rowIds[rowId]
                        .length === 1
                    ) {
                      delete state.histogramHighlights.properties.rowIds[rowId];
                    } else {
                      state.histogramHighlights.properties.rowIds[rowId].splice(
                        indexOfId,
                        1
                      );
                    }
                  }
                });
                // index -= 1; // was here because we could have duplicates
                break;
              }
            }
          }
          // remove from selection (triggers Histogram recomputing)
          state.selection.splice(
            state.selection.findIndex((id) => id === payload),
            1
          );

          state.entities.splice(index, 1);
          index -= 1;
          state.graphRect = computeGraphRect(state);
          // graphUpdateRectThenFitToView(state);
        }
      }
      // IMPORTANT
      delete state.entityGraphPropertiesMap[payload];
    },
    deleteAllSelectedElements: (state: GraphState) => {
      // delete selected Entities
      const selectedEntitiesIdMap = state.selection.reduce((acc, id) => {
        acc[id] = true;
        // IMPORTANT
        // (TODO refactor et avoir une fonction en "deleteEntity" sur laquelle deleteAll loop)
        delete state.entityGraphPropertiesMap[id];
        return acc;
      }, {});
      state.entities = state.entities.filter(
        ({ id }) => !selectedEntitiesIdMap[id]
      );
      state.connections = state.connections.filter(
        ({ from, to }) =>
          !selectedEntitiesIdMap[from] && !selectedEntitiesIdMap[to]
      );

      // remove from rowIds too (updates row selection in Histogram)
      state.selection.forEach(
        (id) => delete state.histogramHighlights.properties.entityIds[id]
      );

      const rowIds = Object.keys(state.histogramHighlights.properties.rowIds);
      rowIds.forEach((rowId) => {
        state.histogramHighlights.properties.rowIds[rowId] =
          state.histogramHighlights.properties.rowIds[rowId].filter(
            (id) => !selectedEntitiesIdMap[id]
          );
        if (!state.histogramHighlights.properties.rowIds[rowId].length) {
          delete state.histogramHighlights.properties.rowIds[rowId];
        }
      });
      state.selection = [];

      // delete selected Annotations
      Object.keys(state.selectedAnnotations).forEach((id) => {
        delete state.annotations[id];
      });
      state.selectedAnnotations = {};
    },
    setGraphFocus: (
      state,
      action: PayloadAction<GraphState["focusedEntityId"]>
    ) => {
      state.focusedEntityId = action.payload;
    },
    setGraphOrigin: (
      state,
      action: PayloadAction<GraphState["graphOrigin"]>
    ) => {
      state.graphOrigin = action.payload;
    },
    setGraphLayout: (state, action: PayloadAction<GraphLayout>) => {
      state.graphLayout = action.payload;
    },
    setGraphScale: (state, action: PayloadAction<GraphState["graphScale"]>) => {
      state.graphScale = action.payload;
    },
    updateRect: (state) => {
      state.graphRect = computeGraphRect(state);
      // flag used to trigger "fitToView" in Overview only once, ever...
      state.isGraphRectInitialized = true;
    },
    removeFromSelection: (state, action: PayloadAction<string>) => {
      state.selection = state.selection.filter(
        (id: string) => id !== action.payload
      );
    },
    addToGraphSelection: (state, action: PayloadAction<string>) => {
      if (!state.selection.includes(action.payload)) {
        state.selection = [...state.selection, action.payload];
      }
    },
    toggleGraphSelection: (state, action: PayloadAction<string>) => {
      if (!state.selection.includes(action.payload)) {
        state.selection = [...state.selection, action.payload];
      } else {
        state.selection = state.selection.filter((s) => s !== action.payload);
      }
    },
    setGraphSelection: (
      state,
      action: PayloadAction<GraphState["selection"]>
    ) => {
      state.selection = action.payload;
      state.isGridLayoutArrowDisplayed =
        state.selection.length === state.entities.length;
    },
    /**
     * Displace all selected elements (annotations and entities) by a certain offset
     */
    translateSelectedElements: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.graphLayout = GraphLayout.Free;
      state.entityGraphPropertiesMap = {
        ...state.entityGraphPropertiesMap,
        ...state.selection.reduce((acc, id) => {
          acc[id] = {
            ...state.entityGraphPropertiesMap[id],
            x: state.entityGraphPropertiesMap[id].x + action.payload.x,
            y: state.entityGraphPropertiesMap[id].y + action.payload.y,
          };
          return acc;
        }, {}),
      };

      const selectedAnnotationsKeys = Object.keys(state.selectedAnnotations);
      state.annotations = {
        ...state.annotations,
        ...selectedAnnotationsKeys.reduce((acc, id) => {
          acc[id] = {
            ...state.annotations[id],
            x: state.annotations[id].x + action.payload.x,
            y: state.annotations[id].y + action.payload.y,
          };
          return acc;
        }, {}),
      };
    },
    /**
     * Computes state.graphRect
     * then fits Graph to view by computing new scale and Origin
     * (for performances, skip graphRect update but you have to make sure it is up to date
     *  -> update it on Layout change as it "moves" Tiles
     *  but doesn't count as an "onMove" and, therefore, doesn't trigger the dispatch
     *  -> Moving an Annotation doesn't trigger it either
     * )
     */
    updateGraphRectThenFitToView: (state: GraphState) => {
      graphUpdateRectThenFitToView(state);
    },
    // fixme La flèche en bas à droite ne fonctionne plus pareil
    //  car on peut créer des sous-groupes en mode Grid etc...
    setEntityCoordinatesGrid: (state) => {
      const cardWidth = 165;
      const columns = Math.max(
        Math.round((window.innerWidth - 400) / state.graphScale / cardWidth),
        5
      );
      const cardHeight = 220;
      const initialHorizontalMargin = 50;
      const initialVerticalMargin = DEFAULT_TILE_HITBOX;

      const entities = getSelectedEntities(state);

      const positions: GraphElementMandatoryProps[] = [];

      entities.forEach((e, index) => {
        const numLine = Math.floor(index / columns);
        const numColumn = index % columns;
        const x =
          (cardWidth + state.horizontalMargin) * numColumn +
          initialHorizontalMargin;
        const y =
          state.graphOrigin.y +
          (cardHeight + state.verticalMargin) * numLine +
          initialVerticalMargin;
        positions.push({
          id: e.id,
          x,
          y,
        });
      });
      // fixme BROKEN when selecting only some entities
      state.positionArrowGraph = null;
      /*
        {
          x:
            initialHorizontalMargin
            + columns * cardWidth
            + (state.horizontalMargin * columns - 1)
            + 30,
          y:
            state.graphOrigin.y
            + initialVerticalMargin
            + nbrLines * cardHeight
            + (state.verticalMargin * nbrLines - 1)
            + 10,
        };
      */

      const { entityGraphPropertiesMap } = computeDeadZoneAndPositions(
        state,
        positions
      );
      state.entityGraphPropertiesMap = entityGraphPropertiesMap;
      graphUpdateRectThenFitToView(state);
    },
    setPositionArrowGraph: (state, { payload: { x, y } }) => {
      const columnCount = 5;
      const cardWidth = 135;
      const cardHeight = 205;
      const initialHorizontalMargin = 50;
      const initialVerticalMargin = DEFAULT_TILE_HITBOX;
      const lineCount = Math.ceil(state.entities.length / columnCount);
      const horizontalMargin = Math.floor(
        (x - initialHorizontalMargin - columnCount * cardWidth) /
          (columnCount - 1)
      );
      state.horizontalMargin = horizontalMargin < 10 ? 10 : horizontalMargin;
      const verticalMargin = Math.floor(
        (y -
          state.graphOrigin.y -
          initialVerticalMargin -
          lineCount * cardHeight) /
          (lineCount - 1)
      );
      state.verticalMargin = verticalMargin < 10 ? 10 : verticalMargin;

      state.positionArrowGraph = {
        x: horizontalMargin < 10 ? state.positionArrowGraph?.x : x + 30,
        y: verticalMargin < 10 ? state.positionArrowGraph?.y : y + 10,
      };
      const columns = 5;
      state.entities.forEach((e, index) => {
        const numLine = Math.floor(index / columns);
        const numColumn = index % columns;
        const xx =
          (cardWidth + state.horizontalMargin) * numColumn +
          initialHorizontalMargin;
        const yy =
          (cardHeight + state.verticalMargin) * numLine +
          initialVerticalMargin +
          state.graphOrigin.y;

        state.entityGraphPropertiesMap[e.id] = {
          ...state.entityGraphPropertiesMap[e.id],
          x: xx,
          y: yy,
        };
      });
    },
    setIsPlayingTransition: (state, action: PayloadAction<boolean>) => {
      state.isPlayingTransition = action.payload;
    },
    forceConnectionRendering: (state) => {
      state.selection = JSON.parse(JSON.stringify(state.selection));
    },
    /**
     * Create and place entities
     * and automatically selects them
     * fixme: create should call `convertToEntityDto`
     *  but we should have a second function for "just" adding entities (already are DTOs)
     */
    createEntities: (state, action: PayloadAction<EntityDto[]>) => {
      if (!action.payload || !Array.isArray(action.payload)) return;
      // TODO handle case where entities already exist in the graph
      const newEntities: EntityDto[] = [];
      const newEntitiesCoordinates: Optional<
        GraphEntityProperties,
        "fill" | "stroke"
      >[] = [];
      let error = false;
      const alreadyInGraph: Partial<EntityDto>[] = [];

      // reset all selections (
      state.selection = [];
      state.selectedAnnotations = {};
      state.selectedConnections = [];
      state.focusedEntityId = null;
      const cardWidth = 165;
      const cardHeight = 220;

      const result: EntityDto[] = [];
      action.payload.forEach((entity) => {
        if (state.entityGraphPropertiesMap[entity.id]) {
          alreadyInGraph.push([entity.id, entity.label]);
        } else {
          result.push(entity);
        }
      });
      const test = state.isActivePalette ? 400 : 0;
      const l = result.length;
      const columns = Math.round(Math.sqrt(l) * (cardHeight / cardWidth));
      state.graphScale = Math.min(
        1,
        Math.max(
          0.1,
          Math.floor(
            ((window.innerWidth - test) /
              columns /
              (cardWidth + state.horizontalMargin)) *
              10
          ) / 10
        )
      );

      // pour le positionnement du rect
      state.graphOrigin = {
        x: state.graphRect.x - state.horizontalMargin,
        y: state.graphRect.y + state.graphRect.height - state.horizontalMargin,
      };

      for (let i = 0; i < l; ++i) {
        const entity = result[i];
        // ultra giga basic null check, because id is a central attribute.
        // That said, the user should not have the possibility to create an entity "by hand"
        // so this problem shouldn't even occur
        if (entity.id) {
          const { id } = entity;
          state.selection.push(id);
          state.focusedEntityId = id;
          // TODO aussi sélectionner toutes les connections ?
          //  Elles n'existent pas et ne viendront que depuis une 2e requête

          const coordinates = calculateNewEntityCoordinate2(state, i, columns);
          if (coordinates) {
            newEntitiesCoordinates.push({
              id,
              x: coordinates.x,
              y: coordinates.y,
            });
            newEntities.push(entity);
          } else {
            error = true;
            break;
          }
        }
      }

      if (!error) {
        newEntities.forEach((entity) =>
          state.entities.push(convertToEntityDto(entity))
        );
        newEntitiesCoordinates.forEach((eGP) => {
          state.entityGraphPropertiesMap[eGP.id] = {
            ...eGP,
            ...DEFAULT_TILE_STYLE,
          };
        });
        if (alreadyInGraph.length) {
          toast.info(
            <>
              <p>
                Les objets suivant importés sont déjà présent sur le graphe:
              </p>
              <ul>
                {alreadyInGraph.map(
                  (
                    // @ts-ignore
                    [key, label]
                  ) => (
                    <li key={key}>{label}</li>
                  )
                )}
              </ul>
              <p>
                Il n&apos;ont pas été importés de nouveau et feront partie des
                objets sélectionnés après l&apos;import
              </p>
            </>,
            {
              style: {
                width: "50vw",
                transform: "translate(-50%, 0)",
              },
            }
          );
        }
      } else {
        toast.error(
          "Aucun emplacement disponible. Veuillez nettoyer votre graphe ou déposer moins d'objets."
        );
      }
    },

    createLinksEntities: (state, action) => {
      const copyEntities = _.cloneDeep(state.entities);
      const result = copyEntities.map(
        (entity) => action.payload.find((el) => el.id === entity.id) || entity
      );
      state.entities = result;
    },

    selectConnection: (state, action) => {
      if (!state.selectedConnections.includes(action.payload)) {
        state.selectedConnections = [
          ...state.selectedConnections,
          action.payload,
        ];
      }
    },
    unselectConnection: (state, action) => {
      if (state.selectedConnections.includes(action.payload)) {
        const index = state.selectedConnections.findIndex(
          (co) => co === action.payload
        );
        state.selectedConnections.splice(index, 1);
      }
    },
    setSelectedConnections: (state, action) => {
      state.selectedConnections = action.payload;
    },
    // TODO remove ? Useless now, since related summaries will be "snapshots"
    updateEntityRelatedSummaryById: (
      state,
      action: PayloadAction<{
        entityId: string;
        summary: RelatedSummary;
        relatedKey: "entities" | "events" | "documents";
      }>
    ) => {
      state.entities = state.entities.map((entity) => {
        // find entity by ID
        if (entity.id !== action.payload.entityId) return entity;
        // find event to update by ID and overwrite
        const relatedValues = entity.related[
          action.payload.relatedKey
        ].values.map((relatedSummary) => {
          if (relatedSummary.id !== action.payload.summary.id) {
            return relatedSummary;
          }
          return action.payload.summary;
        });

        return {
          ...entity,
          related: {
            ...entity.related,
            [action.payload.relatedKey]: {
              count: relatedValues.length,
              values: relatedValues,
            },
          },
        };
      });
    },
    createConnectionFromTo: (
      state,
      action: PayloadAction<{
        from: string;
        to: string;
        type: NovaEntityConnexionType;
        label: string;
        isBidirectionnal: boolean;
        isHypothesis: boolean;
        fromPos: { x: number; y: number };
        toPos: { x: number; y: number };
      }>
    ) => {
      state.connections.push({ ...action.payload });
    },
    setIsDraggingPin: (
      state,
      action: PayloadAction<{ x: number; y: number } | null>
    ) => {
      state.isDraggingSrcPinPos = action.payload
        ? {
            x: action.payload.x,
            y: action.payload.y,
          }
        : null;
    },
    // sets the position of the head of the Dragging arrow
    setMousePos: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.mousePos = {
        x: (action.payload.x + state.graphOrigin.x) / state.graphScale,
        y:
          (action.payload.y - GRAPH_OFFSET + state.graphOrigin.y) /
          state.graphScale,
      };
    },

    setIsGraphRectInitialized: (state, action: PayloadAction<boolean>) => {
      state.isGraphRectInitialized = action.payload;
    },
    setIsOverviewInitialized: (state, action: PayloadAction<boolean>) => {
      state.isOverviewInitialized = action.payload;
    },

    /** **********
     * SHORTCUTS *
     *********** */
    /**
     * Invert the selection based on context:
     * - if nothing is highlighted, it's a simple inversion
     * - if some entities are highlighted, we want to invert that
     */
    invertSelection: (
      state,
      action: PayloadAction<OntologyConfigState["ont"]>
    ) => {
      // reset
      state.selectedConnections = [];
      // TODO handle annotations

      const highlightedIds = {
        ...state.histogramHighlights.properties.entityIds,
        ...state.timelineHighlightedIds,
      };
      const highlightedTypes = state.histogramHighlights.types;
      const isHighlighting =
        Object.keys(highlightedIds).length ||
        Object.keys(highlightedTypes).length;

      const selectedEntitiesById = state.selection.reduce(
        (acc: { [id: string]: boolean }, id) => {
          acc[id] = true;
          return acc;
        },
        {}
      );

      const newSelection: string[] = [];
      // fixme: duplication
      const isHighlightingTypes = !!Object.keys(state.histogramHighlights.types)
        .length;
      const isHighlightingProperties = !!Object.keys(
        state.histogramHighlights.properties.entityIds
      ).length;

      state.entities.forEach((entity) => {
        const entityTypeId = getEntityTypeId(entity, action.payload);
        if (
          // case: nothing is highlighted
          (!isHighlighting && !selectedEntitiesById[entity.id]) ||
          // case: invert highlight
          (isHighlighting &&
            !isGraphEntityHighlightedSlightlyLighter(
              {
                histogramHighlights: state.histogramHighlights,
                timelineHighlightedIds: state.timelineHighlightedIds,
                isSelected: selectedEntitiesById[entity.id],
                isHighlightingTypes,
                isHighlightingProperties,
              },
              entity,
              +entityTypeId!
            ))
        ) {
          newSelection.push(entity.id);
        }
      });
      state.selection = newSelection;
    },
    /**
     * Select everything highlighted (meaning everything, if nothing is highlighted)
     */
    selectEveryEntity: (state) => {
      // reset
      state.selectedConnections = [];
      state.selectedAnnotations = Object.keys(state.annotations).reduce(
        (acc, aId) => {
          acc[aId] = true;
          return acc;
        },
        {}
      );

      state.selection = state.entities.reduce(
        (acc: GraphState["selection"], e) => {
          if (e.id) acc.push(e.id);
          return acc;
        },
        []
      );

      // TODO select Connections
    },

    /** *********
     * TIMELINE *
     ********** */
    ...timelineReducers,

    /** **********************
     * HIGHLIGHT / HISTOGRAM *
     *********************** */
    ...highlightReducers,
    setEntityGraphPropertiesMap: (
      state: GraphState,
      action: PayloadAction<GraphState["entityGraphPropertiesMap"]>
    ) => {
      state.entityGraphPropertiesMap = action.payload;
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setGraphFocus,
  addToGraphSelection,
  removeFromSelection,
  toggleGraphSelection,
  setGraphLayout,
  setGraphSelection,
  setGraphOrigin,
  setGraphScale,
  updateRect,
  setEntityCoordinatesGrid,
  setEntityGraphPropertiesMap,
  setPositionArrowGraph,
  setIsPlayingTransition,
  forceConnectionRendering,
  createEntities,
  deleteEntity,
  createLinksEntities,
  deleteAllSelectedElements,
  selectConnection,
  unselectConnection,
  setSelectedConnections,
  updateEntityCoordinatesById,
  updateEntityRelatedSummaryById,
  createConnectionFromTo,
  setIsDraggingPin,
  setMousePos,
  setIsGraphRectInitialized,
  setIsOverviewInitialized,
  translateSelectedElements,
  updateGraphRectThenFitToView,
  toggleActivePalette,
  // TOOLBAR
  createAnnotationEntity,
  deleteAnnotationByKey,
  updateAnnotationById,
  toggleAnnotationSelectionById,
  setSelectedAnnotations,
  selectEveryAnnotations,
  selectInvertSelectionAnnotations,
  updateEntityByID,
  setCurrentStrokeColour,
  applyStrokeColor,
  setCurrentFillColour,
  setCurrentFont,
  applySizeFont,
  applyFontStyle,
  setCurrentSizeFont,
  setIsBold,
  applyBoldStyle,
  setIsItalic,
  applyItalicStyle,
  setIsUnderline,
  applyUnderlineStyle,
  setTextAlign,
  setTextColorAnnotation,
  applyTextColorAnnotation,
  setCurrentThiknessAnnotation,
  applyThiknessAnnotation,
  setCurrentColorObject,
  setListFonts,
  // TIMELINE
  setIsTimelineWidgetExpanded,
  setTimelineHighlightedIds,
  setTimelineLeftSelectionProps,
  setTimelineRightSelectionProps,
  clearTimelineHighlight,
  setStartDateTimeline,
  setEndDateTimeline,
  // HISTOGRAM / HIGHLIGHT
  toggleAuxiliaryHistogramHighlightedTypes,
  clearAuxiliaryHistogramHighlightedTypes,
  clearAuxiliaryHistogramHighlightedProperties,
  toggleAuxiliaryHistogramHighlightedProperty,
  // SHORTCUTS
  invertSelection,
  selectEveryEntity,
  // reset slice
  resetSlice: resetSliceGraph,
} = graphSlice.actions;

export const selectGraph = (state) => state.graph;

export default graphSlice.reducer;
