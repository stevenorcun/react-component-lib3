import React, { useEffect, useRef, useState } from "react";
import {
  getEntityPropLabel,
  getEntityTypeGroup,
  getEntityTypeId,
  getEntityTypeLabel,
  getIdProperty,
  getObjectTypeStrIcon,
  ONTOLOGY_TYPES_GROUPS,
} from "../../../../constants/entity-related";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import IconClean from "../../../../assets/images/icons/IconClean";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import HistogramGroups, {
  IHistogramElementData,
  IHistogramGroupData,
} from "../../../../components/Histogram/HistogramGroups/HistogramGroups";
import cx from "classnames";
import HistogramGroup from "../../../../components/Histogram/HistogramGroup/HistogramGroup";
import { unhandle } from "../../../../utils/DOM";
import {
  HistogramNovaEntityProperty,
  HistogramNovaEntityType,
} from "../../../../components/Histogram/HistogramElement/HistogramElement";
import {
  EntityDto,
  EntityPropertyDetails,
  HomeAddressSummary,
} from "../../../../API/DataModels/Database/NovaObject";
import noContentStyles from "../../../../components/Drawer/Tabs/Selection/styles.scss";
import { isGraphEntityHighlightedSlightlyLighter } from "../../../../utils/graph";
import { CanImplementTimelineState } from "../../../../store/shared/timeline";
import { CanImplementHistogramState } from "../../../../store/shared/histogram";
import { useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";
import styles from "./styles.scss";

interface HistogramProps {
  className?: string;
  entities: any[];
  selectedEntityIds: Array<EntityDto["id"]>;
  timelineHighlightedIds: CanImplementTimelineState["timelineHighlightedIds"];
  histogramHighlights: CanImplementHistogramState["histogramHighlights"];
  clearAuxiliaryHistogramHighlightedTypes: () => void;
  clearAuxiliaryHistogramHighlightedProperties: () => void;
  clearTimelineHighlight: () => void;
  setSelectedEntityIds: (ids: Array<EntityDto["id"]>) => void;
  toggleAuxiliaryHistogramHighlightedTypes: (novaType: NovaEntityType) => void;
  toggleAuxiliaryHistogramHighlightedProperty: ({
    histogramElementId,
    entities,
  }: {
    histogramElementId: string;
    entities: Partial<EntityDto>[];
  }) => void;
}

// const typeGroupLabels = {
//   [NovaEntityTypeGroup.Entities]: {
//     label: "Types d'objet",
//     totalLabel: 'Tous les objets',
//   },
//   [NovaEntityTypeGroup.Events]: {
//     label: "Types d'événement",
//     totalLabel: 'Tous les événements',
//   },
//   [NovaEntityTypeGroup.Artefacts]: {
//     label: 'Artefacts',
//     totalLabel: 'Tous les artefacts',
//   },
//   [NovaEntityTypeGroup.Documents]: {
//     label: 'Types de document',
//     totalLabel: 'Tous les documents',
//   },
//   [NovaEntityTypeGroup.MultimediaFiles]: {
//     label: 'Type de fichier multimédia',
//     totalLabel: 'Tous les fichiers multimédias',
//   },
// };

const HistogramElementContextMenu = ({
  x,
  y,
  entities,
  selectedEntityIds,
  histogramHighlights,
  timelineHighlightedIds,
  setSelectedEntityIds,
  onClose,
}: {
  x: number;
  y: number;
  entities: EntityDto[];
  selectedEntityIds: EntityDto["id"][];
  histogramHighlights: CanImplementHistogramState["histogramHighlights"];
  timelineHighlightedIds: CanImplementTimelineState["timelineHighlightedIds"];
  setSelectedEntityIds;
  onClose: () => void;
}) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const confirmSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const uniqueEntityIds: string[] = Object.keys(timelineHighlightedIds);
    // TODO intersection !!!! Reset timeline highlights too ?

    const selectedEntitiesIdMap = selectedEntityIds.reduce((acc, eId) => {
      acc[eId] = true;
      return acc;
    }, {});

    const isHighlightingTypes = !!Object.keys(histogramHighlights.types).length;
    const isHighlightingProperties = !!Object.keys(
      histogramHighlights.properties.entityIds
    ).length;

    entities.forEach((entity) => {
      const entityTypeId = getEntityTypeId(entity, ont);
      if (
        isGraphEntityHighlightedSlightlyLighter(
          {
            histogramHighlights,
            timelineHighlightedIds,
            isSelected: selectedEntitiesIdMap[entity.id],
            isHighlightingTypes,
            isHighlightingProperties,
          },
          entity,
          +entityTypeId!
        )
      )
        uniqueEntityIds.push(entity.id);
    });

    setSelectedEntityIds(Array.from(new Set(uniqueEntityIds)));
    onClose();
  };

  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexDirectionColumn,
        styles.ContextMenu
      )}
      style={{
        top: y,
        left: x,
      }}
    >
      <div className={styles.ContextMenu__Item} onClick={confirmSelection}>
        Filtrer
      </div>
    </div>
  );
};

const Histogram = ({
  className,
  entities,
  selectedEntityIds,
  histogramHighlights,
  timelineHighlightedIds,
  clearAuxiliaryHistogramHighlightedTypes,
  clearAuxiliaryHistogramHighlightedProperties,
  clearTimelineHighlight,
  setSelectedEntityIds,
  toggleAuxiliaryHistogramHighlightedTypes,
  toggleAuxiliaryHistogramHighlightedProperty,
}: HistogramProps) => {
  const histoRef = useRef<HTMLDivElement>(null);
  const { ont } = useAppSelector(selectOntologyConfig);

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [typeGroupsArray, setTypeGroupsArray] = useState<IHistogramGroupData[]>(
    []
  );

  const [propertiesArray, setPropertiesArray] = useState<IHistogramGroupData[]>(
    []
  );

  const clearHighlightedTypes = (e: React.MouseEvent) => {
    unhandle(e);
    clearAuxiliaryHistogramHighlightedTypes();
  };
  const clearHighlightedProperties = (e: React.MouseEvent) => {
    unhandle(e);
    clearAuxiliaryHistogramHighlightedProperties();
  };

  /**
   * Double clicking (the gauge) is a shortcut for filtering by that type/property
   * Only allowed if 1 (or less) row is selected
   */
  const handleDoubleClickOnRowComponent = (
    _: React.MouseEvent,
    d: IHistogramElementData["entities"]
  ) => {
    // allowed only if 1 or less lines are selected
    if (
      Object.keys(histogramHighlights.types).length +
        Object.keys(histogramHighlights.properties.rowIds).length >
      1
    )
      return;

    // set selection
    const _selectedEntityIds = d.reduce((acc: string[], e) => {
      if (e.id) acc.push(e.id);
      return acc;
    }, []);
    setSelectedEntityIds(_selectedEntityIds);
  };

  const handleContextMenuOnRowComponent = (
    e: React.MouseEvent,
    d: IHistogramElementData["entities"]
  ) => {
    e.preventDefault();
    if (histoRef.current) {
      const client = histoRef.current.getBoundingClientRect();
      setContextMenuPos({
        x: Math.abs(e.clientX - client.left),
        y: e.clientY - 120,
        // 120 is the offset (top) because of the toolbars
        // => get by doing `histoRef.current.parentNode.getBoundingClientRect().top`,
        // but moving the divs hierarchy would ruin that...
      });
    }
  };

  const hideContextMenu = () => setContextMenuPos(null);

  const handleClickOnTypeGroupTotal = (datas: IHistogramElementData[]) => {
    const typesToToggle = {};
    datas.forEach((data) => {
      data.entities.forEach((e) => {
        if (e.type) typesToToggle[e.type] = true;
      });
    });
    Object.keys(typesToToggle).forEach((type) => {
      if (!histogramHighlights.types[type]) {
        // @ts-ignore
        toggleAuxiliaryHistogramHighlightedTypes(type);
      }
    });
  };

  const handleDoubleClickOnTypeGroupTotal = (
    elements: IHistogramElementData[]
  ) => {
    handleDoubleClickOnRowComponent(
      // @ts-ignore
      null,
      elements?.reduce((acc: Partial<EntityDto>[], curr) => {
        acc = [...acc, ...curr.entities];
        return acc;
      }, []) || []
    );
  };

  const handleContextMenuOnTypeGroupTotal = (
    event: React.MouseEvent,
    elements: IHistogramElementData[]
  ) => {
    handleContextMenuOnRowComponent(
      event,
      elements?.reduce((acc: Partial<EntityDto>[], curr) => {
        acc = [...acc, curr.entities];
        return acc;
      }, []) || []
    );
  };

  const handleClickOnTypeRow = (data) => {
    toggleAuxiliaryHistogramHighlightedTypes(data.value);
  };

  const handleClickOnPropertyRow = (data) => {
    toggleAuxiliaryHistogramHighlightedProperty({
      histogramElementId: data.id,
      entities: data.entities,
    });
  };

  // reset highlights on selection change
  useEffect(() => {
    clearAuxiliaryHistogramHighlightedTypes();
    clearAuxiliaryHistogramHighlightedProperties();
    clearTimelineHighlight();
  }, [selectedEntityIds]);

  useEffect(() => {
    if (contextMenuPos) window.addEventListener("click", hideContextMenu);
    return () => window.removeEventListener("click", hideContextMenu);
  }, [contextMenuPos]);

  // Je ne comprends pas, moi-même, ce que j'ai écrit...
  // C'est censé grouper par NovaTypeGroup, par NovaType
  // et essentiellement initialiser tout l'objet histogramHighlights
  // en plus de calculer les totaux, les labels, l'état expanded/collapsed des groupes etc.
  useEffect(() => {
    // blacklist some properties (hide them OR special treatment)
    const blacklistedProperties = {
      names: true, // is a mix of gender + name
      // addresses: true,
    };

    const histogramData = entities.reduce(
      (acc, curr) => {
        const entityType = getEntityTypeId(curr, ont);
        const entityTypeGroup = getEntityTypeGroup(curr, ont);

        // group by type (and typeGroup)
        if (entityType && entityTypeGroup) {
          acc.typeGroups[entityTypeGroup].values[entityType] = acc.typeGroups[
            entityTypeGroup
          ]?.values[entityType] ?? {
            label: getEntityTypeLabel(curr, ont),
            icon: null,
            isToggled: !!histogramHighlights.types[entityType],
            entities: [],
          };
          const idProp = getIdProperty(curr, ont);
          const entityId = curr[idProp];
          acc.typeGroups[entityTypeGroup].values[entityType].entities.push({
            id: entityId,
            type: entityType, // we toggle a `type` selection, not just the ID
          });
          acc.typeGroups[entityTypeGroup].total += 1;
        }
        curr.__properties.values.forEach(({ key: propKey, value }) => {
          // ignore properties with special treatment
          // TODO have a "propertyLineRenderer" in entityRelated ?
          if (blacklistedProperties[propKey]) return;

          acc.properties[propKey] = acc.properties[propKey] ?? {
            isExpanded: true,
            // @ts-ignore
            label: getEntityPropLabel(entityType, propKey, ont),
            values: {},
            total: 0,
          };

          const propertyValueToHistogramStore = ({
            properties,
            key,
            val,
          }: {
            properties: {};
            key: string;
            val:
              | string
              | number
              | NovaEntityType
              | EntityPropertyDetails<unknown>
              | HomeAddressSummary; // TODO replace with EntityPropertyDetails
          }) => {
            if (Array.isArray(val)) {
              val.forEach((subValue) =>
                propertyValueToHistogramStore({
                  properties,
                  key,
                  val: subValue,
                })
              );
            } else {
              // @ts-ignore
              const kvKey = val.label;
              properties[key].values[kvKey] = properties[key].values[kvKey] ?? {
                label: kvKey,
                icon: null,
                isToggled: !!histogramHighlights.properties.entityIds[curr.id],
                entities: [],
              };
              properties[key].values[kvKey]?.entities.push({
                id: curr.id,
              });
              properties[key].total += 1;
              return properties;
            }
          };

          propertyValueToHistogramStore({
            properties: acc.properties,
            key: propKey,
            val: value,
          });
        });

        return acc;
      },
      {
        typeGroups: {
          DEFAULT: {
            isExpanded: true,
            label: ONTOLOGY_TYPES_GROUPS.DEFAULT,
            totalLabel: "Tous les objets",
            values: {},
            total: 0,
          },
          // ["LINK"]: {
          //   isExpanded: true,
          //   label: ONTOLOGY_TYPES_GROUPS.LINK,
          //   totalLabel: "Tous les liens",
          //   values: {},
          //   total: 0,
          // },
          OTHER: {
            isExpanded: true,
            label: ONTOLOGY_TYPES_GROUPS.OTHER,
            totalLabel: "Tous les autres types",
            values: {},
            total: 0,
          },
        },
        properties: {},
      }
    );

    const groupsArray: IHistogramGroupData[] = [];
    Object.keys(histogramData.typeGroups).forEach((typeGroup) => {
      const types: IHistogramGroupData[] = [];

      const novaEntityTypeKeys = Object.keys(
        histogramData.typeGroups[typeGroup].values
      );
      // TODO Hide empty groups ?
      if (!novaEntityTypeKeys.length) return;

      novaEntityTypeKeys.forEach((type) => {
        const typeStrIcon = getObjectTypeStrIcon(+type, ont);
        types.push({
          ...histogramData.typeGroups[typeGroup].values[type],
          value: type,
          id: `typeGroup-${typeGroup}-type-${type}`,
          icon: typeStrIcon,
        });
      });

      const group: IHistogramGroupData = {
        ...histogramData.typeGroups[typeGroup],
        values: types,
      };

      groupsArray.push(group);
    });
    setTypeGroupsArray(groupsArray);

    setPropertiesArray(
      Object.keys(histogramData.properties).map((property) => {
        const propertyValues: IHistogramGroupData[] = [];
        Object.keys(histogramData.properties[property].values).forEach(
          (propertyValue) => {
            propertyValues.push({
              ...histogramData.properties[property].values[propertyValue],
              value: propertyValue,
              id: `${property}-${propertyValue}`,
            });
          }
        );

        return {
          ...histogramData.properties[property],
          propKey: property,
          value: property,
          label: property,
          values: propertyValues,
        };
      })
    );
  }, [entities]);

  return (
    <>
      {contextMenuPos && (
        <HistogramElementContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          entities={entities}
          selectedEntityIds={selectedEntityIds}
          timelineHighlightedIds={timelineHighlightedIds}
          histogramHighlights={histogramHighlights}
          setSelectedEntityIds={setSelectedEntityIds}
          onClose={hideContextMenu}
        />
      )}
      <div ref={histoRef} className={cx(styles.histogram, className)}>
        <div className={styles.histogramContainer}>
          {!entities.length ? (
            <div className={noContentStyles.emptySelection}>
              Pour utiliser cette palette, veuillez d&apos;abord sélectionner
              une ou plusieurs entités.
            </div>
          ) : (
            <>
              <div className={styles.filters}>
                <div className={cx(commons.clickable, styles.filter)}>
                  Trier par nombre
                </div>
                <div className={cx(commons.clickable, styles.filter)}>
                  Afficher 6 par défaut
                </div>
                <IconClean
                  className={cx(commons.clickable)}
                  style={{ fill: "#94969A" }}
                />
              </div>
              <div className={cx(commons.PrettyScroll, styles.group)}>
                <HistogramGroups
                  label={"Type d'objet"}
                  onClear={clearHighlightedTypes}
                >
                  {typeGroupsArray.map(
                    ({ label, isExpanded, totalLabel, total, values }) => (
                      <HistogramGroup
                        key={label}
                        propKey="type"
                        label={label}
                        isExpanded={isExpanded}
                        elements={values}
                        total={total}
                        totalLabel={totalLabel}
                        histogramHighlights={histogramHighlights}
                        // @ts-ignore
                        RowComponent={HistogramNovaEntityType}
                        onRowClick={handleClickOnTypeRow}
                        onDoubleClick={handleDoubleClickOnRowComponent}
                        onContextMenu={handleContextMenuOnRowComponent}
                        onTotalClick={handleClickOnTypeGroupTotal}
                        onTotalDoubleClick={handleDoubleClickOnTypeGroupTotal}
                        onTotalContextMenu={handleContextMenuOnTypeGroupTotal}
                      />
                    )
                  )}
                </HistogramGroups>

                <HistogramGroups
                  label="Propriétés des objets"
                  onClear={clearHighlightedProperties}
                >
                  {propertiesArray.map(
                    ({ propKey, label, isExpanded, total, values }) =>
                      !!total && (
                        <HistogramGroup
                          key={propKey}
                          propKey={propKey}
                          label={label}
                          isExpanded={isExpanded}
                          elements={values}
                          total={total}
                          histogramHighlights={histogramHighlights}
                          // @ts-ignore
                          RowComponent={HistogramNovaEntityProperty}
                          onRowClick={handleClickOnPropertyRow}
                          onDoubleClick={handleDoubleClickOnRowComponent}
                          onContextMenu={handleContextMenuOnRowComponent}
                        />
                      )
                  )}
                </HistogramGroups>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Histogram;
