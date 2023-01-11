/* eslint-disable max-len */
import React, { useEffect, useState } from "react";

// Icon
import IconBell from "@/assets/images/icons/IconBellNavigation";
import IconGroup from "@/assets/images/icons/IconGroup";
import IconActions from "@/assets/images/icons/IconActions";
import IconPencilEdit from "@/assets/images/icons/IconPencilEdit";

import { selectBrowser, toggleActiveTabDrawer } from "@/store/browser";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectProperty } from "@/store/tags";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";

import {
  getEntityTitleProperty,
  getEntityTypeLabel,
  getEntityTypeGroup,
  getEntityStrIcon,
} from "@/constants/entity-related";
import { getTagColor, getTagLabel } from "@/constants/tags";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import Options from "@/components/Options/Options";
import {
  createConnectionFromTo,
  createEntities,
  createLinksEntities,
  selectGraph,
  setIsOverviewInitialized,
  updateGraphRectThenFitToView,
} from "@/store/graph";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";
import {
  addEntities,
  addPlaneFlightCoord,
  MapState,
  selectMap,
  setOnImportEntitiesWithoutGeo,
  setValidTypeEntities,
} from "@/store/map";
import IconList from "@/assets/images/icons/IconList";
import IconMap from "@/assets/images/icons/IconMap";
import IconGraphNetwork from "@/assets/images/icons/IconGraphNetwork";
import IconLink from "@/assets/images/icons/IconLink";
import IconNote from "@/assets/images/icons/IconNote";
import IconExplorer from "@/assets/images/icons/IconExplorer";

import ModalTypes from "@/constants/modal";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import cx from "classnames";
import NovaImage from "@/components/NovaImage/NovaImage";
import { selectOntologyConfig } from "@/store/ontology";
import { isDark } from "@/utils/colors";
import {
  castEntitiesToConnections,
  relatedWithIds,
  sortLinksByIdObjet,
} from "@/utils/graph";
import { addEntitiesExplorer } from "@/store/explorer";
import { convertToEntityDto2 } from "@/API/DataModels/DTO/entityDto";
import ApiFactory from "@/API/controllers/api-factory";
import SearchApi from "@/API/controllers/search-api";
import styles from "./styles.scss";

const EntityHeader = ({ entity }: { entity: any }) => {
  const browserState = useAppSelector(selectBrowser);
  const { ont } = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();
  const mapState = useAppSelector<MapState>(selectMap);
  const graphState = useAppSelector(selectGraph);
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const apiClient = ApiFactory.create<SearchApi>("SearchApi");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const Icon = getEntityStrIcon(entity, ont);

  const handleOnClick = () => {
    dispatch(selectProperty(undefined));
    if (
      browserState.activeBrowserTabIndex &&
      browserState?.tabs[browserState.activeBrowserTabIndex].isDrawerCollapsed
    ) {
      dispatch(toggleActiveTabDrawer());
    }
  };

  const toggleActionMenu = () => {
    setIsActionMenuOpen(!isActionMenuOpen);
  };

  const addCurrentEntityToGraph = () => {
    const graphInitialization = () => {
      if (
        !graphState.isGraphRectInitialized &&
        !graphState.isOverviewInitialized
      ) {
        dispatch(updateGraphRectThenFitToView());
        dispatch(setIsOverviewInitialized(true));
      }
    };

    const init = async () => {
      if (entity) {
        dispatch(createEntities([convertToEntityDto2(entity, ont)]));
      }
      navigate(APP_ROUTES.graph.path);
    };

    const SearchLinksEntities = async () => {
      const objectIds = [entity.id];
      const linksResult = await apiClient.search_links(objectIds);

      const resultSortLinksByIdObjet = await sortLinksByIdObjet(
        linksResult.events
      );
      const resultRelatedWithIds = relatedWithIds(
        entity,
        resultSortLinksByIdObjet?.[entity.id],
        linksResult.events,
        ont
      );
      const dto2 = convertToEntityDto2(entity, ont, resultRelatedWithIds);
      if (Array.isArray(dto2.related.links)) {
        const connections = castEntitiesToConnections(
          dto2.related.links || [],
          ont
        );
        // @ts-ignore
        if (connections.length) {
          // @ts-ignore
          connections.forEach((c) => dispatch(createConnectionFromTo(c)));
        }
      }

      if (dto2) {
        dispatch(createLinksEntities([dto2]));
      }
    };

    graphInitialization();
    init();
    SearchLinksEntities();
  };

  const duplicateEntitiesMap = (data: EntityDto[]) => {
    const entityIdsAsMap = mapState.entities.reduce(
      (acc: { [entityId: string]: boolean }, e) => {
        acc[e.id] = true;
        return acc;
      },
      {}
    );
    const alreadyInMap: EntityDto[] = [];
    // avoid duplication
    data.filter((e) => {
      // prevent override, same as in Graph
      if (!entityIdsAsMap[e.id]) {
        entityIdsAsMap[e.id] = true;
        return true;
      }
      alreadyInMap.push(e);
      return false;
    });
    if (alreadyInMap.length > 0) {
      return false;
    }

    return true;
  };
  const formatCoordGeo = (entityGeo) => {
    const regex = /_/i;
    const valid_COORD_GEO = entityGeo.replace(regex, ",");
    const coords = valid_COORD_GEO.split(",");
    return coords;
  };

  const addCurrentEntityToMap = () => {
    if (entity.COORD_GEO_DEPART && entity.COORD_GEO_ARRIVEE) {
      const coords_depart = formatCoordGeo(entity.COORD_GEO_DEPART);
      const coords_arrivee = formatCoordGeo(entity.COORD_GEO_ARRIVEE);

      const planeFlightCoord = [coords_depart, coords_arrivee];

      dispatch(
        addPlaneFlightCoord({ entity, ont, coordinates: planeFlightCoord })
      );
      navigate(APP_ROUTES.map.path);
    }

    const typeGroupProp = getEntityTypeGroup(entity, ont);

    if (typeGroupProp === "LINK") {
      toast.info(
        <>
          <p>L'objet n'est pas importable sur la carte.</p>
        </>
      );
    }
    if (entity.COORDONNEES_GEO && typeGroupProp !== "LINK") {
      const coords = formatCoordGeo(entity.COORDONNEES_GEO);
      const entityWithCoordGeo = [entity].map((d) => ({
        ...d,
        geometry: {
          coordinates: [parseFloat(coords[1]), parseFloat(coords[0])],
          type: "Point",
        },
      }));

      dispatch(addEntities(entityWithCoordGeo));
      navigate(APP_ROUTES.map.path);
    }
    if (
      !entity.COORDONNEES_GEO &&
      typeGroupProp !== "LINK" &&
      !entity.COORD_GEO_DEPART &&
      !entity.COORD_GEO_ARRIVEE
    ) {
      // entite non geolocalisee, ouvrir la modal de geoetiquetage
      const validTypeEntities = [entity].map((d) => ({
        ...d,
        geometry: { coordinates: [0, 0], type: "Point" },
      }));

      if (duplicateEntitiesMap(validTypeEntities)) {
        dispatch(setValidTypeEntities(validTypeEntities));
        dispatch(setOnImportEntitiesWithoutGeo(true));
        navigate(APP_ROUTES.map.path);
      } else {
        toast.info(
          <>
            <p>L'objet suivant importé est déjà présent sur la carte.</p>
          </>,
          {
            style: {
              width: "50vw",
              transform: "translate(-50%, 0)",
            },
          }
        );
      }
    }
  };

  const addEntityAndCoToGraph = async () => {
    const { entities, links } = entity.related;
    dispatch(createEntities([entity, ...(entities || [])]));

    if (Array.isArray(links)) {
      const connections = castEntitiesToConnections(links || [], ont);
      // @ts-ignore
      if (connections.length) {
        // @ts-ignore
        connections.forEach((c) => dispatch(createConnectionFromTo(c)));
      }
    }
    navigate(APP_ROUTES.graph.path);
  };

  const addEntityAndCoToMap = async () => {
    const entities: EntityDto[] = [entity, ...entity.__related];
    const typeGroupProp = getEntityTypeGroup(entities, ont);
    let validTypeEntities: EntityDto[] = [];
    let entityWithCoordGeo: EntityDto[] = [];

    entities.forEach((element) => {
      if (element.COORDONNEES_GEO && typeGroupProp !== "LINK") {
        const coords = formatCoordGeo(element.COORDONNEES_GEO);
        entityWithCoordGeo = [element].map((d) => ({
          ...d,
          geometry: {
            coordinates: [parseFloat(coords[1]), parseFloat(coords[0])],
            type: "Point",
          },
        }));
        if (duplicateEntitiesMap(entityWithCoordGeo)) {
          dispatch(addEntities(entityWithCoordGeo));
          navigate(APP_ROUTES.map.path);
        }
      } else if (!entity.COORDONNEES_GEO) {
        validTypeEntities = [entity].map((d) => ({
          ...d,
          geometry: { coordinates: [0, 0], type: "Point" },
        }));
        if (duplicateEntitiesMap(validTypeEntities)) {
          dispatch(setValidTypeEntities(validTypeEntities));
          dispatch(setOnImportEntitiesWithoutGeo(true));
          navigate(APP_ROUTES.map.path);
        }
      }
    });
    if (
      !duplicateEntitiesMap(validTypeEntities) ||
      !duplicateEntitiesMap(entityWithCoordGeo)
    ) {
      toast.info(
        <>
          <p>Les objets suivant importés sont déjà présent sur la carte.</p>
        </>,
        {
          style: {
            width: "50vw",
            transform: "translate(-50%, 0)",
          },
        }
      );
    }
  };

  const addCurrentEntityToNote = () => {
    const content = JSON.stringify([entity]);
    localStorage.setItem("note-insertedEntities", content);
    navigate(APP_ROUTES.note.path);
  };

  const addEntityAndCoToNote = async () => {
    const content = JSON.stringify([entity, ...entity.__related]);
    localStorage.setItem("note-insertedEntities", content);
    navigate(APP_ROUTES.note.path);
  };

  const addEntityToList = () => {
    showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities: [entity] });
  };

  const addEntityAndCoToList = async () => {
    const relatedEntities: EntityDto[] = [entity, ...entity.__related];
    showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities: relatedEntities });
  };

  const addEntityToExplorer = () => {
    dispatch(addEntitiesExplorer({ entities: [entity], source: "/browser" }));
    navigate(APP_ROUTES.explorer.path);
  };

  const addEntityAndCoToExplorer = () => {
    const test = [entity, ...entity.__related];
    dispatch(addEntitiesExplorer({ entities: test, source: "/browser" }));
    navigate(APP_ROUTES.explorer.path);
  };

  const [menuOptions, setMenuOptions] = useState<Array<{}>>([]);

  // pour éviter la mémoïsation du useState tout en ne redéclarant pas à chaque cycle
  useEffect(() => {
    setMenuOptions([
      {
        label: "Ouvrir dans",
        isDivider: true,
      },
      {
        label: "Liste",
        icon: <IconList />,
        onClick: addEntityToList,
      },
      {
        label: "Liste avec ses relations",
        icon: <IconLink />,
        onClick: addEntityAndCoToList,
      },
      {
        label: "Graph",
        icon: <IconGraphNetwork />,
        onClick: addCurrentEntityToGraph,
      },
      {
        label: "Graph avec ses relations",
        icon: <IconLink />,
        onClick: addEntityAndCoToGraph,
      },
      {
        label: "Map",
        icon: <IconMap />,
        onClick: addCurrentEntityToMap,
      },
      {
        label: "Map avec ses relations",
        icon: <IconLink />,
        onClick: addEntityAndCoToMap,
      },
      {
        label: "Note",
        icon: <IconNote />,
        onClick: addCurrentEntityToNote,
      },
      {
        label: "Note avec ses relations",
        icon: <IconLink />,
        onClick: addEntityAndCoToNote,
      },
      {
        label: "Exploitation",
        icon: <IconExplorer />,
        onClick: addEntityToExplorer,
      },
      {
        label: "Exploitation avec ses relations",
        icon: <IconLink />,
        onClick: addEntityAndCoToExplorer,
      },
      {
        label: "Affichage",
        isDivider: true,
      },
      {
        label: "Éditer la fiche",
        icon: <IconPencilEdit />,
        onClick: undefined,
      },
      {
        label: "Éditer la valeur de confiance",
        icon: <IconPencilEdit />,
        onClick: undefined,
      },
    ]);
  }, [ont, entity]);

  // click-away
  useEffect(() => {
    if (isActionMenuOpen) document.addEventListener("click", toggleActionMenu);
    return () => {
      document.removeEventListener("click", toggleActionMenu);
    };
  });

  return (
    entity && (
      <div className={styles.headerEntity}>
        {entity.avatar ? (
          <NovaImage
            fileId={entity.avatar?.id}
            alt={entity.avatar?.value?.title}
          />
        ) : (
          <div className={styles.headerEntityIcon}>{Icon && <Icon />}</div>
        )}
        <div className={styles.headerEntityIdentity}>
          <p className={styles.headerEntityIdentityName}>
            {getEntityTitleProperty(entity, ont)}
          </p>
          <p className={styles.headerEntityIdentityType}>
            {getEntityTypeLabel(entity, ont)}
          </p>
        </div>
        {entity._MARKINGS?.length && (
          <>
            <div className={styles.headerEntityDivider} />
            <div className={styles.headerEntityLabel}>
              {Array.isArray(entity?._MARKINGS) ? (
                entity._MARKINGS?.map((tag, index) => (
                  <span
                    key={index}
                    className={cx(commons.tag, {
                      // @ts-ignore
                      [commons.tagLight]: isDark(getTagColor(tag, null)),
                    })}
                    // @ts-ignore
                    style={{ backgroundColor: getTagColor(tag, null) }}
                    onClick={handleOnClick}
                  >
                    {getTagLabel(
                      tag, // @ts-ignore
                      null
                    )}
                  </span>
                ))
              ) : (
                <span
                  key={`m-${entity._MARKINGS}`}
                  className={cx(commons.tag, {
                    [commons.tagLight]: isDark(
                      getTagColor(
                        entity._MARKINGS,
                        // @ts-ignore
                        null
                      )
                    ),
                  })}
                  style={{
                    // @ts-ignore
                    backgroundColor: getTagColor(entity._MARKINGS, null),
                  }}
                >
                  {getTagLabel(
                    entity._MARKINGS,
                    // @ts-ignore
                    null
                  )}
                </span>
              )}
            </div>
          </>
        )}
        <div className={styles.headerEntityAction}>
          <IconBell />
          <IconGroup />
          <IconActions
            className={commons.clickable}
            onClick={toggleActionMenu}
          />
          {isActionMenuOpen && (
            <Options
              className={styles.MenuOptions}
              setOpen={toggleActionMenu}
              // @ts-ignore
              list={menuOptions}
            />
          )}
        </div>
      </div>
    )
  );
};

export default EntityHeader;
