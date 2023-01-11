import React, { useState } from "react";
import cx from "classnames";
import _ from "lodash";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createConnectionFromTo,
  createEntities,
  createLinksEntities,
  deleteEntity,
  GraphState,
  selectGraph,
  setSelectedConnections,
} from "@/store/graph";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
// import {
//   NovaEntityType,
//   NovaEntityTypeGroup,
// } from "@/API/DataModels/Database/NovaEntityEnum";
import {
  getEntityTitleProperty,
  getEntityTypeGroup,
  getIdProperty,
  ONTOLOGY_TYPES_GROUPS,
} from "@/constants/entity-related";
import ApiFactory from "@/API/controllers/api-factory";
import ObjectsApi from "@/API/controllers/object-api";
import { convertToEntityDto2 } from "@/API/DataModels/DTO/entityDto";
import { toast } from "react-toastify";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import ModalTypes from "@/constants/modal";
import { selectOntologyConfig } from "@/store/ontology";
import {
  castEntitiesToConnections,
  relatedWithIds,
  sortLinksByIdObjet,
} from "@/utils/graph";

import { ConnectionProps } from "@/components/Connection/Connection";
import ContextSubMenu from "@/components/ContextMenu/ContextSubMenu/ContextSubMenu";

import IconGroup from "@/assets/images/icons/wheelMenu/IconGroup";
import IconRelations from "@/assets/images/icons/wheelMenu/IconRelations";
import IconFusion from "@/assets/images/icons/wheelMenu/IconFusion";
import IconSplit from "@/assets/images/icons/wheelMenu/IconSplit";
import IconPublish from "@/assets/images/icons/wheelMenu/IconPublish";
import IconSelect from "@/assets/images/icons/wheelMenu/IconSelect";
import IconSearch from "@/assets/images/icons/IconSearch";
import IconTrash from "@/assets/images/icons/IconTrash";
import IconDotCircle from "@/assets/images/icons/wheelMenu/IconDotCircle";
import IconSquares from "@/assets/images/icons/wheelMenu/IconSquares";

import SearchApi from "@/API/controllers/search-api";
import styles from "./styles.scss";

interface ContextMenuProps {
  x: number;
  y: number;
  targetEntitiesIds: string[];
  setShowContextMenu: (visible: boolean) => void;
  handleWheel: React.WheelEventHandler;
}

export interface IContextMenu {
  name: string | string[];
  icon?: React.ReactNode;
  offset?: number;
  position?: string;
  disabled?: boolean;
  hoverBackgroundStyles?: {
    padding: string;
    top: string;
    left: string;
  };
  submenu?: IContextMenu[];
  onClick?: (e: React.MouseEvent) => void;
}

const ContextMenu = (props: ContextMenuProps) => {
  const graphState = useAppSelector<GraphState>(selectGraph);
  const dispatch = useAppDispatch();
  const [showActiveMenu, setShowActiveMenu] = useState<{
    menuIndex: number;
    menu: IContextMenu;
  } | null>(null);
  const { showModal, hideModal } = useGlobalModalContext();
  const { ont } = useAppSelector(selectOntologyConfig);

  /**
   * Filter the connections to select and dispatch all the selected connections
   * @param filterArray An array used to filter the connections.
   *  A connection is selected if the current entity is linked to an entity in this array.
   */
  const selectConnections = (filterArray?: EntityDto[]) => {
    const searchedEntityIds = filterArray?.reduce((acc, curr) => {
      acc[curr.id] = true;
      return acc;
    }, {});

    const selectedConnectionsById: { [key: string]: ConnectionProps } = {};
    props.targetEntitiesIds.forEach((targetId) => {
      // Get all connections from or to this entity
      // TODO /!\ avoid duplications /!\ if a link with the same label and ids exists
      //  (ideally, we want Connections to have an ID)
      graphState.connections.forEach((curr: ConnectionProps) => {
        if (
          // is linked to selected entities
          (curr.from === targetId || curr.to === targetId) &&
          // is also filtered
          (!searchedEntityIds ||
            (curr.from !== targetId && searchedEntityIds[curr.from]) ||
            (curr.to !== targetId && searchedEntityIds[curr.to]))
        )
          selectedConnectionsById[`${curr.from}-${curr.to}-${curr.label}`] =
            curr;
      });
    });
    const selectedConnections = Object.values(selectedConnectionsById);

    dispatch(setSelectedConnections(selectedConnections));
  };

  /**
   * Requests and adds objects related to targets
   * Optionally, we can ask to only GET objects belonging to certain types
   * @param targetIds Objects whose related elements we are interested in
   * @param types (optional) Type restrictions
   */
  const getRelatedByTypes = async (targetIds: string[], types: string[]) => {
    const apiClient = ApiFactory.create<ObjectsApi>("ObjectsApi");
    const failures: string[] = [];
    const results: { [id: string]: any } = {};
    const connections = [];

    const responses = await Promise.allSettled(
      targetIds.map((id) => apiClient.getObjectRelations(id, types))
    );

    responses.forEach((response) => {
      if (response.status === "rejected") {
        failures.push(response.reason);
        return;
      }

      const { relations, links } = response.value;
      relations?.forEach((novaObj) => {
        const e = convertToEntityDto2(novaObj, ont);
        const idProp = getIdProperty(novaObj, ont);
        if (!idProp) {
          toast.error("Cannot find id property for object");
          return;
        }
        const objectId = novaObj[idProp];
        results[objectId] = {
          id: objectId,
          label: getEntityTitleProperty(novaObj, ont),
          ...e,
        };
      });

      if (Array.isArray(links)) {
        // @ts-ignore
        connections.push(...castEntitiesToConnections(links || [], ont));
      }
    });

    dispatch(createEntities(Object.values(results)));

    Object.values(connections).forEach((c) =>
      dispatch(createConnectionFromTo(c))
    );

    if (failures.length) {
      failures.forEach((f) => console.error(f.toString()));
      const msg = failures.join(", ");
      toast.error(msg);
    }
  };
  const apiClient = ApiFactory.create<SearchApi>("SearchApi");

  /**
   * Shorthand of getRelatedByTypes for getting a whole typeGroup
   */
  // const getAllRelatedByTypeGroup = (
  //   targetIds: string[],
  //   typeGroup?: NovaEntityTypeGroup
  // ) => {
  //   const types = typeGroup
  //     ? Object.keys(NovaEntityType).filter(
  //         (type) => ENTITY_TYPE_DETAILS[type]?.typeGroup === typeGroup
  //       )
  //     : undefined;

  //     // @ts-ignore
  //   getRelatedByTypes(props.targetEntitiesIds, types);
  // };

  const contextMenus: IContextMenu[] = [
    {
      name: ["Afficher", "les liens"],
      icon: <IconRelations fill="white" />,
      offset: 4,
      position: "br",
      hoverBackgroundStyles: {
        padding: "20px 20px 20px 60px",
        top: "0px",
        left: "-40px",
      },
      submenu: [
        /*     {
          name: 'Avec les entités',
          icon: <IconDotCircle fill="#F53E6A" />,
          onClick: () => {
            const entities = graphState.entities.filter(
              (entity) => ENTITY_TYPE_DETAILS[entity.type]
                && ENTITY_TYPE_DETAILS[entity.type].typeGroup
                === NovaEntityTypeGroup.Entities,
            );
            selectConnections(entities);
          },
        },
      {
          name: 'Avec les évènements',
          icon: <IconDotCircle fill="#F53E6A" />,
          onClick: () => {
            const events = graphState.entities.filter(
              (entity) => ENTITY_TYPE_DETAILS[entity.type]
                && ENTITY_TYPE_DETAILS[entity.type].typeGroup
                === NovaEntityTypeGroup.Events,
            );
            selectConnections(events);
          },
        },
        {
          name: 'Avec les documents',
          icon: <IconLinkedDocument />,
          onClick: () => {
            const documents = graphState.entities.filter(
              (entity) => ENTITY_TYPE_DETAILS[entity.type]
                && ENTITY_TYPE_DETAILS[entity.type].typeGroup
                === NovaEntityTypeGroup.Documents,
            );
            selectConnections(documents);
          },
        },
        {
          name: 'Avec les propriétés de l\'entité',
          icon: <IconProperty />,
        }, */
        {
          name: "Tout",
          icon: <IconSquares />,
          onClick: () => {
            selectConnections();
          },
        },
      ],
    },
    {
      name: "Fusionner",
      icon: <IconSplit fill="white" />,
      offset: -2,
      position: "br",
      hoverBackgroundStyles: {
        padding: "20px 20px 20px 60px",
        top: "0px",
        left: "-40px",
      },
      submenu: [
        {
          name: "Les entités",
          icon: <IconDotCircle fill="#F53E6A" />,
          onClick: () => {
            props.setShowContextMenu(false);
            const found = graphState.entities.find(
              ({ id }) => id === graphState.focusedEntityId
            );
            if (found) {
              showModal(ModalTypes.GRAPH_OBJECT_FUSION, {
                entity: found,
                selectedIds: graphState.selection,
                entities: graphState.entities,
                onClose: hideModal,
              });
            }
          },
          disabled: graphState.entities.length <= 1,
        },
        {
          name: "Les liens",
          icon: <IconDotCircle fill="#F53E6A" />,
          disabled: true,
          onClick: () => {
            props.setShowContextMenu(false);
          },
        },
        {
          name: "Défusionner",
          icon: <IconDotCircle fill="#F53E6A" />,
          disabled: !(
            graphState.focusedEntityId &&
            graphState.entities.find(
              ({ id }) => id === graphState.focusedEntityId
            )?.__fusedEntities?.length
          ), // disabled if no __fusedEntities?.length
          onClick: () => {
            const found = graphState.entities.find(
              ({ id }) => id === graphState.focusedEntityId
            );
            if (!found) {
              toast.error("Entity doesn't exist (wtf)");
              return;
            }

            showModal(ModalTypes.GRAPH_OBJECT_FISSION, {
              entity: found,
              onConfirm: async () => {
                // TODO Promise.all: found.__fuseEntities.map(GET).then(createEntity) .finally(delete found)
                // should never happen since the button would be disabled
                if (!found || !found?.__fusedEntities?.length) {
                  toast.error(
                    "Impossible de défusionner cet objet (il ne résulte pas d'une fusion)"
                  );
                  return;
                }

                // const apiClient = ApiFactory.create<ObjectsApi>('ObjectsApi');
                // Promise.all (et pas allSettled) car toutes les requêtes doivent marcher
                let addEntities = [];
                await Promise.all(
                  found.__fusedEntities?.map((entity) => {
                    const idProp = getIdProperty(entity, ont);
                    return apiClient.search_objById(entity.id, idProp);
                  })
                )
                  .then((response) => {
                    // @ts-ignore
                    const { queryId } = response;
                    if (queryId) {
                      apiClient.search_v2_close(queryId);
                    }
                    const test = response.reduce((acc, curr) => {
                      const copyCurr = _.cloneDeep(curr.events[0]);
                      const idProp = getIdProperty(copyCurr, ont);
                      copyCurr.label = getEntityTitleProperty(copyCurr, ont);
                      copyCurr.id = copyCurr[idProp];
                      const result = convertToEntityDto2(copyCurr, ont);
                      // @ts-ignore
                      acc.push(result);
                      return acc;
                    }, []);
                    addEntities = test;
                    dispatch(deleteEntity(found.id));
                    dispatch(createEntities(addEntities));
                  })
                  .catch((e) => {
                    toast.error("La défusion a échouée");
                    console.error("La défusion a échouée", e);
                  });

                const SearchLinksEntities = async () => {
                  // @ts-ignore
                  const objectIds = addEntities.map((entity) => entity.id);
                  const linksResult = await apiClient.search_links(objectIds);
                  const resultSortLinksByIdObjet = await sortLinksByIdObjet(
                    linksResult.events
                  );
                  const drops = addEntities.reduce(
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

                SearchLinksEntities();
              },
              onClose: hideModal,
            });
          },
        },
      ],
    },
    {
      name: "Supprimer",
      icon: <IconTrash fill="white" />,
      offset: 0,
      position: "br",
      hoverBackgroundStyles: {
        padding: "20px 20px 40px 40px",
        top: "0px",
        left: "-20px",
      },
      submenu: [],
      onClick: () => {
        if (props.targetEntitiesIds) {
          props.targetEntitiesIds.forEach((id) => dispatch(deleteEntity(id)));
        }
        props.setShowContextMenu(false);
      },
    },
    {
      name: ["Former", "un groupe"],
      icon: <IconGroup fill="white" />,
      offset: 4,
      position: "bl",
      hoverBackgroundStyles: {
        padding: "20px 40px 40px 20px",
        top: "0px",
        left: "0px",
      },
      submenu: [],
    },
    {
      name: "Publier",
      icon: <IconPublish fill="white" />,
      offset: 4,
      position: "bl",
      hoverBackgroundStyles: {
        padding: "20px 60px 20px 20px",
        top: "0px",
        left: "0px",
      },
      submenu: [],
    },
    {
      name: "Sélectionner",
      icon: <IconSelect fill="white" />,
      offset: -2,
      position: "bl",
      hoverBackgroundStyles: {
        padding: "20px 60px 20px 20px",
        top: "0px",
        left: "0px",
      },
      submenu: [],
    },
    {
      name: ["Fusion", "des liens"],
      icon: <IconFusion fill="white" />,
      offset: -6,
      position: "tl",
      hoverBackgroundStyles: {
        padding: "40px 40px 20px 20px",
        top: "-20px",
        left: "0px",
      },
      submenu: [
        {
          name: "Fusionner",
          icon: <IconSplit fill="#3083F7" />,
        },
      ],
    },
    {
      name: ["Recherche", "relationnelle"],
      icon: <IconSearch fill="white" />,
      offset: 10,
      position: "tr",
      hoverBackgroundStyles: {
        padding: "40px 20px 20px 40px",
        top: "-20px",
        left: "-20px",
      },
      submenu: [
        /*   {
          name: 'Entités liées',
          icon: <IconDotCircle fill="#F53E6A" />,
          onClick: () => {
            getAllRelatedByTypeGroup(props.targetEntitiesIds, NovaEntityTypeGroup.Entities);
          },
        },
        {
          name: 'Evènements liés',
          icon: <IconDotCircle fill="#F53E6A" />,
          onClick: () => {
            getAllRelatedByTypeGroup(props.targetEntitiesIds, NovaEntityTypeGroup.Events);
          },
        },
        {
          name: 'Documents liés',
          icon: <IconLinkedDocument />,
          onClick: () => {
            getAllRelatedByTypeGroup(props.targetEntitiesIds, NovaEntityTypeGroup.Documents);
          },
        },
        {
          name: 'Propriétés de l\'entité',
          icon: <IconProperty />,
        }, */
        {
          name: "Tout",
          icon: <IconSquares />,
          onClick: () => {
            // @ts-ignore
            getRelatedByTypes(props.targetEntitiesIds);
          },
        },
      ],
    },
  ];

  return (
    <nav
      className={styles.contextMenu}
      style={{
        left: props.x * graphState.graphScale - graphState.graphOrigin.x - 150,
        top: props.y * graphState.graphScale - graphState.graphOrigin.y - 150,
      }}
      onWheel={props.handleWheel}
    >
      <div className={styles.circleMenu}>
        {contextMenus.map((it, idx) => (
          <div
            key={idx}
            style={{
              left: "150px",
              top: "150px",
              transformOrigin: "center center",
              transform: `translate(-50%, -50%)rotate(${
                -180 / contextMenus.length + (idx * 360) / contextMenus.length
              }deg)translate(122px, 0)rotate(${
                180 / contextMenus.length - (idx * 360) / contextMenus.length
              }deg)`,
            }}
          >
            <div
              className={cx({
                [styles.menuItem]: true,
                [styles.activeMenu]: showActiveMenu?.menuIndex === idx,
              })}
              onMouseEnter={() =>
                setShowActiveMenu({ menu: it, menuIndex: idx })
              }
              onClick={it.onClick}
            >
              {it.icon}
              <div
                style={{
                  transform: `translate(${it.offset}px, 0)`,
                }}
                className={styles.menuItemTitle}
              >
                {typeof it.name === "string" ? (
                  <small>{it.name}</small>
                ) : (
                  <small>
                    {it.name[0]}
                    <br />
                    {it.name[1]}
                  </small>
                )}
              </div>
              <div
                className={styles.menuItemBackground}
                style={showActiveMenu?.menu.hoverBackgroundStyles}
              />
            </div>
          </div>
        ))}
      </div>
      {
        // @ts-ignore
        <ContextSubMenu
          showActiveMenu={showActiveMenu}
          setShowActiveMenu={setShowActiveMenu}
          setShowContextMenu={props.setShowContextMenu}
          menuLength={contextMenus.length}
        />
      }
    </nav>
  );
};

export default ContextMenu;
