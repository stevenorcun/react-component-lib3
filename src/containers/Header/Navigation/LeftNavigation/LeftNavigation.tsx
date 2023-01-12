/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import cx from "classnames";

import ApiFactory from "../../../../API/controllers/api-factory";
import { ExternalApp } from "../../../../API/controllers/applicative-api";
import { convertToEntityDto2 } from "../../../../API/DataModels/DTO/entityDto";
import SearchApi from "../../../../API/controllers/search-api";
import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import {
  createConnectionFromTo,
  createEntities,
  createLinksEntities,
  selectGraph,
  setIsOverviewInitialized,
  updateGraphRectThenFitToView,
} from "../../../../store/graph";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";
import { addEntitiesExplorer } from "../../../../store/explorer";
import {
  addEntities as addMapEntities,
  addPlaneFlightCoord,
  setOnImportEntitiesWithoutGeo,
  setValidTypeEntities,
} from "../../../../store/map";
import { handleEntityOrSummaryDrop } from "../../../../utils/drag-events";
import { preventDefault } from "../../../../utils/DOM";
import {
  castEntitiesToConnections,
  relatedWithIds,
  sortLinksByIdObjet,
} from "../../../../utils/graph";
import { APP_ROUTES, EXTERNAL_APP_ROUTE } from "../../../../constants/routes";
import DRAG_EVENT_TYPES from "../../../../constants/drag-events-types";
import {
  getEntityTypeGroup,
  ONTOLOGY_TYPES_GROUPS,
} from "../../../../constants/entity-related";

import NavigationItem from "../../../../components/Navigation/NavigationItem";

import IconExternalApps from "../../../../assets/images/icons/menuItems/IconExternalApps";
import IconGraph from "../../../../assets/images/icons/IconGraph";
import IconFolder from "../../../../assets/images/icons/IconFolderNav";
import IconMap from "../../../../assets/images/icons/IconMap";
import IconExplorer from "../../../../assets/images/icons/IconExplorer";
import IconNote from "../../../../assets/images/icons/IconNoteNav";
import IconBrowser from "../../../../assets/images/icons/IconBrowser";

import stylesGlobal from "../styles.scss";

interface NavBarItem {
  className?: string;
  route: string;
  icon?: React.ReactNode;
  label: string;
  isAlwaysVisible?: boolean;
  onDragEnter?: React.DragEventHandler;
  onDrop?: React.DragEventHandler;
}

const LeftNavigation = ({
  activeMenu,
  openInNewWindow,
  navigateTo,
  caseState,
}: any) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();
  const graphState = useAppSelector(selectGraph);
  const apiClient = ApiFactory.create<SearchApi>("SearchApi");

  const externalApps: ExternalApp[] = []; // FIXME: use global settings usePreferences(LOCAL_STORAGE_KEYS.externalAppsConfig);
  const [navItems, setNavItems] = useState<NavBarItem[]>([]);
  const [activePage] = useState(activeMenu);

  useEffect(() => {
    const defaultNavItems: NavBarItem[] = [
      {
        route: APP_ROUTES.dashboard.path,
        icon: <IconFolder fill="#fff" />,
        label: "Dashboard",
        isAlwaysVisible: true,
      },
      {
        route: APP_ROUTES.browser.path,
        icon: <IconBrowser fill="#fff" />,
        label: "Navigateur",
      },
      {
        route: APP_ROUTES.graph.path,
        onDragEnter: preventDefault,
        onDrop: (e) => {
          handleEntityOrSummaryDrop(e, async (entities) => {
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
              if (entities?.length) {
                dispatch(
                  createEntities(
                    entities.map((entity) => convertToEntityDto2(entity, ont))
                  )
                );
              }
              navigateTo(APP_ROUTES.graph.path);
            };
            const SearchLinksEntities = async () => {
              const objectIds = entities.map((entity) => entity.id);
              const linksResult = await apiClient.search_links(objectIds);
              const resultSortLinksByIdObjet = await sortLinksByIdObjet(
                linksResult.events
              );
              const drops = entities.reduce(
                (acc, entity: EntityDto) => {
                  const copyAcc = { ...acc };
                  const resultRelatedWithIds = relatedWithIds(
                    entity,
                    resultSortLinksByIdObjet?.[entity.id],
                    linksResult.events,
                    ont
                  );
                  const dto2 = convertToEntityDto2(
                    entity,
                    ont,
                    resultRelatedWithIds
                  );
                  const typeGroup = getEntityTypeGroup(dto2, ont);
                  if (Array.isArray(dto2.related.links)) {
                    const connections = castEntitiesToConnections(
                      dto2.related.links || [],
                      ont
                    );

                    // @ts-ignore
                    if (connections.length) {
                      connections.forEach((c) =>
                        // @ts-ignore
                        dispatch(createConnectionFromTo(c))
                      );
                    }
                  }
                  if (
                    typeGroup &&
                    ONTOLOGY_TYPES_GROUPS[typeGroup] ===
                      ONTOLOGY_TYPES_GROUPS.LINK
                  ) {
                    // @ts-ignore
                    copyAcc.connections.push(dto2);
                  } else {
                    // @ts-ignore
                    copyAcc.entities.push(dto2);
                  }
                  return copyAcc;
                },
                {
                  entities: [],
                  connections: [],
                }
              );

              if (drops?.entities?.length) {
                dispatch(createLinksEntities(drops.entities));
              }
            };

            graphInitialization();
            init();
            SearchLinksEntities();
          });
        },
        icon: <IconGraph fill="#fff" />,
        label: "Graph",
      },
      {
        route: APP_ROUTES.map.path,
        icon: <IconMap fill="#fff" />,
        label: "Carte",
        onDragEnter: preventDefault,
        onDrop: (e) => {
          // Allow drop
          e.preventDefault();
          const rawEntities = e.dataTransfer.getData(
            DRAG_EVENT_TYPES.searchResultEntity
          );
          if (rawEntities) {
            try {
              const entities = JSON.parse(rawEntities);
              const typeGroupProp = getEntityTypeGroup(entities[0], ont);
              if (typeGroupProp === "LINK") {
                toast.info(
                  <>
                    <p>L'objet n'est pas importable sur la carte.</p>
                  </>
                );
              }

              const formatCoordGeo = (entityGeo) => {
                const regex = /_/i;
                const validCoordGeo = entityGeo.replace(regex, ",");
                const coords = validCoordGeo.split(",");
                return coords;
              };

              if (
                entities[0].COORD_GEO_DEPART &&
                entities[0].COORD_GEO_ARRIVEE
              ) {
                entities.forEach((element) => {
                  const coordsDepart = formatCoordGeo(element.COORD_GEO_DEPART);
                  const coordsArrivee = formatCoordGeo(
                    element.COORD_GEO_ARRIVEE
                  );

                  const planeFlightCoord = [coordsDepart, coordsArrivee];

                  dispatch(
                    addPlaneFlightCoord({
                      entity: element,
                      ont,
                      coordinates: planeFlightCoord,
                    })
                  );
                  const entityWithCoordGeo = [element].map((d) => ({
                    ...d,
                    geometry: {},
                  }));
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  dispatch(addMapEntities(entityWithCoordGeo));
                });
                navigateTo(APP_ROUTES.map.path);
              }

              if (entities[0].COORDONNEES_GEO && typeGroupProp !== "LINK") {
                entities.forEach((element) => {
                  const coords = formatCoordGeo(element.COORDONNEES_GEO);
                  const entityWithCoordGeo = [element].map((d) => ({
                    ...d,
                    geometry: {
                      coordinates: [
                        parseFloat(coords[1]),
                        parseFloat(coords[0]),
                      ],
                      type: "Point",
                    },
                  }));
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  dispatch(addMapEntities(entityWithCoordGeo));
                });
                navigateTo(APP_ROUTES.map.path);
              } else if (
                !entities[0].COORDONNEES_GEO &&
                typeGroupProp !== "LINK" &&
                !entities[0].COORD_GEO_DEPART &&
                !entities[0].COORD_GEO_ARRIVEE
              ) {
                // entite non geolocalisee, ouvrir la modal de geoetiquetage
                const validTypeEntities = entities.map((d) => ({
                  ...d,
                  geometry: { coordinates: [0, 0], type: "Point" },
                }));
                dispatch(setValidTypeEntities(validTypeEntities));
                dispatch(setOnImportEntitiesWithoutGeo(true));
                navigateTo(APP_ROUTES.map.path);
              }
            } catch (err: unknown) {
              console.error(
                "Error while attempting to drop Nova Entity summaries",
                err
              );
            }
          }
        },
      },
      {
        route: APP_ROUTES.explorer.path,
        icon: <IconExplorer fill="#fff" />,
        label: "Explorateur",
        onDragEnter: preventDefault,
        onDrop: (e) => {
          handleEntityOrSummaryDrop(e, (entities) => {
            // if _DATATYPE:"liens" --> c'est une Connection que l'on veut ajouter au graph
            const drops = entities.reduce(
              (acc, e) => {
                const typeGroup = getEntityTypeGroup(e, ont);
                if (
                  typeGroup &&
                  ONTOLOGY_TYPES_GROUPS[typeGroup] ===
                    ONTOLOGY_TYPES_GROUPS.LINK
                ) {
                  // @ts-ignore
                  acc.connections.push(e);
                } else {
                  // @ts-ignore
                  acc.entities.push(e);
                }
                return acc;
              },
              {
                entities: [],
                connections: [],
              }
            );

            if (drops.entities.length) {
              dispatch(
                addEntitiesExplorer({
                  entities: drops.entities,
                  source: activePage,
                  type: "dragAndDrop",
                })
              );
            }
            navigateTo(APP_ROUTES.explorer.path);
          });
        },
      },
      // {
      //   route: APP_ROUTES.media.path,
      //   icon: <IconPicture />,
      //   label: 'Media',
      // },
      // {
      //   route: APP_ROUTES.calcul.path,
      //   icon: <IconCalculations />,
      //   label: 'Calcul',
      // },
      {
        route: APP_ROUTES.note.path,
        onDragEnter: preventDefault,
        onDrop: (e) => {
          // Allow drop
          e.preventDefault();
          const content = e.dataTransfer.getData(
            DRAG_EVENT_TYPES.searchResultEntity
          );
          localStorage.setItem("note-insertedEntities", content);
          navigateTo(APP_ROUTES.note.path);
        },
        icon: <IconNote />,
        label: "Note",
      },
      // {
      //   route: APP_ROUTES.communication.path,
      //   icon: <IconCom />,
      //   label: 'Comm',
      // },
      // {
      //   route: APP_ROUTES.requisition.path,
      //   icon: <IconRequisition />,
      //   label: 'Formulaires',
      // },
    ];

    // TODO handles dynamic localStorage update automatically ? (to test)
    setNavItems(
      defaultNavItems.concat(
        Array.isArray(externalApps)
          ? externalApps.reduce((acc: NavBarItem[], curr: ExternalApp) => {
              if (curr.url && curr.active) {
                const route = EXTERNAL_APP_ROUTE.replace(":url", curr.url);
                acc.push({
                  label: curr.label,
                  route,
                  icon: <IconExternalApps />,
                  isAlwaysVisible: !curr.requireCase,
                  className: stylesGlobal.NavItem,
                  onDragEnter: () => navigateTo(route),
                });
              }
              return acc;
            }, [])
          : []
      )
    );
  }, [ont]);

  return (
    <div className={stylesGlobal.itemsContainer}>
      {navItems.map(
        (item) =>
          (caseState.currentCase || item.isAlwaysVisible) && (
            <NavigationItem
              key={item.route}
              className={cx(stylesGlobal.NavItem, item.className)}
              clickable
              active={activeMenu === item.route}
              onDragStart={(e) => openInNewWindow(e, item.route)}
              onClick={() => navigateTo(item.route)}
              // @ts-ignore
              onDragEnter={item.onDragEnter}
              // @ts-ignore
              onDrop={item.onDrop}
              icon={item.icon}
              label={item.label}
            />
          )
      )}
    </div>
  );
};

export default LeftNavigation;
