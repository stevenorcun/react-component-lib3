import React, { Fragment, useEffect, useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconBox from "../../../../assets/images/icons/IconBox";
import IconLink from "../../../../assets/images/icons/IconLink";
import IconArrowWindow from "../../../../assets/images/icons/IconArrowWindow";
import IconMap from "../../../../assets/images/icons/IconMap";
import IconGraph from "../../../../assets/images/icons/IconGraph";
import IconToolPencil from "../../../../assets/images/icons/IconFolderLinkNav";
import IconPens from "../../../../assets/images/icons/IconPencilEdit";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectGraph,
  updateEntityRelatedSummaryById,
} from "../../../../store/graph";
import {
  DocumentSummary,
  EntityDto,
  EntitySummary,
  EventSummary,
  FileSummary,
  RelatedSummary,
} from "../../../../API/DataModels/Database/NovaObject";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import { convertToEntityDto } from "../../../../API/DataModels/DTO/entityDto";
import {
  getEntityPropLabel,
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeId,
  getEntityTypeLabel,
  getObjectTypeLabel,
} from "../../../../constants/entity-related";
import { APP_ROUTES } from "../../../../constants/routes";
import AdvancedSearchResultPropertyLine from "../../../../components/Browser/SearchResult/PropertyLine/PropertyLine";
import { createTabByType } from "../../../../store/browser";
import { BrowserTabType } from "../../../../constants/browser-related";
import IconArrow from "../../../../assets/images/icons/IconArrow";
import IconLoader from "../../../../assets/images/icons/IconLoader";

import ApiFactory from "../../../../API/controllers/api-factory";
import ObjectsApi from "../../../../API/controllers/object-api";
import SelectionWidget from "../../../../components/selectionWidget/Selection/SelectionWidget";
import NoData from "../../../../lib/NoData/NoData";
import styles from "./styles.scss";
import { selectOntologyConfig } from "../../../../store/ontology";
import { selectMap } from "../../../../store/map";

const CommonActions = () => (
  <div className={styles.actions}>
    <p>Ouvrir dans :</p>
    <div>
      <IconArrowWindow />
      &nbsp;Navigateur
    </div>
    <div>
      <IconGraph height={14} fill="#ACCDFC" />
      &nbsp;Graph
    </div>
    <div>
      <IconMap height={14} fill="#ACCDFC" />
      &nbsp;Map
    </div>
  </div>
);

/**
 * Miniature representation of an Entity.
 * Requires:
 *  - `type`: used to find the appropriate Icon
 *  - `label`: displayed, technically doesn't cause a crash but... empty label
 *  Optional:
 *  - `timestamp`: only useful for Events. As the date of occurrence
 *      TODO: create a mini for each groups (Entity/Event/Document/File) ?
 *        Since "timestamp" might not always exist
 */
const RelatedMini = (
  props: EntitySummary | EventSummary | DocumentSummary | FileSummary
) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const Icon = getEntityStrIcon(props, ont);
  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexAlignItemsCenter,
        styles.EventMini
      )}
    >
      <div
        className={cx(
          commons.Flex,
          commons.FlexAlignItemsCenter,
          styles.EventMini__Icon
        )}
      >
        {Icon && <Icon />}
      </div>

      <div
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.EventMini__Details
        )}
      >
        <div className={styles.EventMini__Details_Label}>
          {getEntityTitleProperty(props, ont)}
        </div>
      </div>
    </div>
  );
};

interface RelatedGroupedByTypeProps {
  label: string;
  type: string | NovaEntityType; // string because
  relatedGroup: IRelatedElementsGroup<
    EntitySummary | EventSummary | DocumentSummary | FileSummary
  >;
  onExpand: (type, relatedSummariesToQuery: RelatedSummary[]) => void;
}

// on expand in case of Arrays ?
const RelatedGroupedByType = ({
  label,
  type,
  relatedGroup,
  onExpand,
}: RelatedGroupedByTypeProps) => {
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(type, relatedGroup.values);
  };

  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexDirectionColumn,
        styles.RelatedEvents__Container
      )}
    >
      <div className={cx(commons.Flex, styles.GroupedEventLine)}>
        <div
          className={cx(commons.clickable, styles.GroupedEventLine__Left)}
          onClick={toggleExpand}
        >
          <IconArrow
            className={cx({ [commons.Rotate90]: relatedGroup.isExpanded })}
          />
          <span>{label}</span>
        </div>

        <div className={cx(styles.GroupedEventLine__Right)}>
          <span>{relatedGroup.values.length}</span>
        </div>
      </div>

      {relatedGroup.isExpanded && (
        <div
          className={cx(
            commons.Flex,
            commons.FlexDirectionColumn,
            styles.GroupedEventList
          )}
        >
          {relatedGroup.isLoading && (
            <div className={styles.Loader}>
              <IconLoader />
            </div>
          )}
          {relatedGroup.values.map((summary, i) =>
            // @ts-ignore
            summary.label ? <RelatedMini key={summary.id} {...summary} /> : null
          )}
        </div>
      )}
    </div>
  );
};

interface SelectionProps {
  className?: string;
  entity: EntityDto;
  displayCurrentSelectionWidget?: boolean;
  currentTabSelectionWidget: string;
}

interface IRelatedElementsGroup<T> {
  isLoading: boolean;
  isExpanded: boolean;
  values: T[];
}

const Selection = ({
  className = "",
  entity,
  displayCurrentSelectionWidget = true,
  currentTabSelectionWidget,
}: SelectionProps) => {
  const graphState = useAppSelector(selectGraph);
  const mapState = useAppSelector(selectMap);
  const { ont } = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [focusedEntity, setFocusedEntity] = useState<EntityDto | null>(entity);
  const [relatedEntitiesGroupedByType, setRelatedEntitiesGroupedByType] =
    useState<{
      [key in NovaEntityType]?: IRelatedElementsGroup<EntitySummary>;
    }>({});
  // const [relatedEventsGroupedByType, setRelatedEventsGroupedByType] = useState<{
  //   [key in NovaEntityType]?: IRelatedElementsGroup<EventSummary>;
  // }>({});
  // const [relatedDocumentsGroupedByType, setRelatedDocumentsGroupedByType] =
  //   useState<{
  //     [key in NovaEntityType]?: IRelatedElementsGroup<DocumentSummary>;
  //   }>({});
  const [previousFocusId, setPreviousFocusId] = useState<string | null>(null);

  const openEntity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (focusedEntity) {
      dispatch(
        createTabByType({
          type: BrowserTabType.EntityDetails,
          value: focusedEntity.label,
          isActive: true,
          activeEntity: focusedEntity,
        })
      );
    }
    navigate(APP_ROUTES.browser.path);
  };
  /**
   * TODO not true anymore (we get full snapshots)
   * A summary is deemed "incomplete" if it doesn't have the `label` attribute.
   * So far, "incomplete" summaries only have the `type` attribute.
   *
   * This is obviously not ideal but we can either
   *  - use another method to "flag" the data (meaning "this data is up to date and we have all the details)
   *  - create a separate sub-object where the "fully detailed" related elements are store.
   *    For instance, rename `related` to `summary` (backend)
   *    and have the `related` key strictly be a local variable for storing the "fully detailed" related elements
   */
  const computeIncompleteSummaries = (summaries: any[]) =>
    summaries.reduce((acc: any[], curr) => {
      if (!curr.label) acc.push(curr);
      return acc;
    }, []);

  const toggleRelatedGroupExpansion = (
    type: NovaEntityType,
    isLoading: boolean,
    groupGetter,
    groupSetter
  ) => {
    groupSetter({
      ...groupGetter,
      [type]: {
        ...groupGetter[type],
        isLoading,
        isExpanded: !groupGetter[type]?.isExpanded,
      },
    });
  };

  const queryRelatedIdsAndDispatch = async (
    incompleteSummaries: RelatedSummary[],
    relatedKey: "entities" | "events" | "documents"
  ) => {
    const failures: string[] = [];
    const apiClient = ApiFactory.create<ObjectsApi>("ObjectsApi");
    // GET full data by ID > Promise.allSettled() > dispatch result
    try {
      if (!focusedEntity) {
        throw new Error(`focusedEntity is null:\n${focusedEntity}`);
      }

      const responses = await Promise.allSettled(
        incompleteSummaries.map((e) => apiClient.getObject(e.id))
      );

      responses.forEach((response) => {
        if (response.status === "rejected") {
          failures.push(response.reason);
          return;
        }
        const data = response.value;
        const { id, createdAt, createdBy, updatedAt, ...rest } =
          convertToEntityDto(data._source);

        dispatch(
          updateEntityRelatedSummaryById({
            entityId: focusedEntity.id,
            // TODO Change from Summary to full Dto (snapshot) ?
            summary: {
              id,
              createdAt,
              createdBy,
              updatedAt,
              value: rest,
            },
            relatedKey,
          })
        );
      });
    } catch (err: any) {
      const errString = err.toString();
      console.error(errString);
      toast.error(errString);
    } finally {
      // TODO hide loader if there are failures ?
      //  (I leave it to "show" something went wrong, but that's not ideal)
      if (failures.length) {
        failures.forEach((f) => console.error(f.toString()));
        const msg = failures.join(", ");
        toast.error(msg);
      }
    }
  };

  /**
   * - Visually expand the group
   * - GET request for all "incomplete" summaries
   * - Dispatch update to store
   */
  const handleRelatedGroupExpansion = async (
    type: NovaEntityType,
    summaries: RelatedSummary[],
    relatedKey: "entities" | "events" | "documents",
    groupGetter,
    groupSetter
  ) => {
    if (!focusedEntity) return;

    // "incomplete summaries" to GET
    const incompleteSummaries = computeIncompleteSummaries(summaries);

    // Visual expansion
    toggleRelatedGroupExpansion(
      type,
      !!incompleteSummaries?.length,
      groupGetter,
      groupSetter
    );

    // only query on expansion, not when collapsing
    if (incompleteSummaries.length && !groupGetter[type]?.isExpanded) {
      await queryRelatedIdsAndDispatch(incompleteSummaries, relatedKey);
    }
  };

  const handleEntityGroupExpansion = async (
    type: NovaEntityType,
    entitiesToGet: EntitySummary[]
  ) => {
    await handleRelatedGroupExpansion(
      type,
      entitiesToGet,
      "entities",
      relatedEntitiesGroupedByType,
      setRelatedEntitiesGroupedByType
    );
  };

  useEffect(() => {
    setFocusedEntity(entity || null);

    // compute related groups
    if (entity) {
      const groupRelatedElementsByType = (
        relatedElements: any[],
        prevState
      ) => {
        if (relatedElements && Array.isArray(relatedElements)) {
          return relatedElements.reduce(
            (acc, summary) => {
              const typeId = getEntityTypeId(summary, ont);
              // @ts-ignore
              if (acc[typeId]) {
                // @ts-ignore
                acc[typeId].values.push(summary);
              } else {
                // @ts-ignore
                acc[typeId] = {
                  isLoading: false,
                  // maintain group expanded when same entity as previous iteration
                  // (because of useEffect's dependency on entities
                  isExpanded:
                    previousFocusId === entity.id
                      ? // @ts-ignore
                        !!prevState[typeId]?.isExpanded
                      : false,
                  values: [summary],
                };
              }
              return acc;
            },
            {} as {
              [key in NovaEntityType]: IRelatedElementsGroup<
                EventSummary | EntitySummary | DocumentSummary
              >;
            }
          );
        }
      };

      setRelatedEntitiesGroupedByType(
        groupRelatedElementsByType(
          // @ts-ignore
          entity.related.entities || [],
          relatedEntitiesGroupedByType
        )
      );
    }

    if (currentTabSelectionWidget === "graph") {
      setPreviousFocusId(graphState.focusedEntityId);
    }
    if (currentTabSelectionWidget === "map") {
      setPreviousFocusId(mapState.focusedEntityId);
    }
  }, [entity]);

  if (!focusedEntity) {
    return (
      <div className={styles.emptySelection}>
        Pour utiliser la palette de sélection, veuillez d&apos;abord
        sélectionner une entité.
      </div>
    );
  }

  const Icon = getEntityStrIcon(focusedEntity, ont);

  return (
    <>
      <div
        className={cx(commons.PrettyScroll, styles.selectionWrapper, {
          [styles.CurrentSelectionWidgetOffset]: displayCurrentSelectionWidget,
        })}
      >
        <div className={styles.entity}>
          <div className={styles.entityContent}>
            <div>{Icon && <Icon />}</div>
          </div>
          <div className={styles.entityDetails}>
            <div className={styles.EntityLabel}>
              {getEntityTitleProperty(focusedEntity, ont)}
            </div>
            <div className={styles.entityType}>
              {getEntityTypeLabel(focusedEntity, ont)}
            </div>
          </div>
        </div>
        <div className={styles.entityLinksContainer}>
          <div
            className={cx(
              commons.clickable,
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Link
            )}
            onClick={openEntity}
          >
            <IconToolPencil width={12} height={12} />
            <span>Ouvrir dans le navigateur</span>
          </div>
          <span className={styles.DotSeparator}>&middot;</span>
          <div
            className={cx(
              commons.clickable,
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Link
            )}
          >
            <IconPens width={12} height={12} />
            <span>Modifier</span>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupName}>
            <IconBox fill="#3083F7" />
            &nbsp;
            <span>Propriétés de l&apos;objet</span>
          </div>

          <div
            className={cx(
              commons.Flex,
              commons.FlexDirectionColumn,
              commons.FlexWrap,
              styles.GroupValuesContainer
            )}
          >
            {focusedEntity.__properties.values.map((property, i) => (
              <Fragment key={property.key}>
                {!!property.value || property.value === 0 ? (
                  !Array.isArray(property.value) || property.value.length ? (
                    <AdvancedSearchResultPropertyLine
                      key={property.key}
                      propertyKey={property.key}
                      // @ts-ignore
                      label={getEntityPropLabel(
                        entity?._DATATYPE,
                        property.key,
                        ont
                      )}
                      value={property.value}
                      className={styles.Property}
                      labelClassName={styles.PropertyLabel}
                      valueClassName={styles.PropertyValue}
                    />
                  ) : null
                ) : null}
              </Fragment>
            ))}
            {!focusedEntity?.__properties?.values?.length && (
              <NoData>Aucune propriété</NoData>
            )}
          </div>

          <CommonActions />
        </div>

        <div className={styles.group}>
          <div className={styles.groupName}>
            <IconLink />
            &nbsp;
            <span>Objets liés</span>
          </div>
          <div
            className={cx(
              commons.Flex,
              commons.FlexDirectionColumn,
              commons.FlexWrap,
              styles.GroupValuesContainer
            )}
          >
            {
              // @ts-ignore
              focusedEntity?.related?.entities?.length ? (
                Object.keys(relatedEntitiesGroupedByType).map((type) => (
                  <RelatedGroupedByType
                    key={type}
                    type={type}
                    relatedGroup={relatedEntitiesGroupedByType[type]}
                    label={getObjectTypeLabel(+type, ont)}
                    onExpand={handleEntityGroupExpansion}
                  />
                ))
              ) : (
                <NoData>Aucun objet lié</NoData>
              )
            }
          </div>
        </div>

        {displayCurrentSelectionWidget && (
          <SelectionWidget
            isOpened
            currentTabSelectionWidget={currentTabSelectionWidget}
          />
        )}
      </div>
    </>
  );
};

export default Selection;
