import React, { useEffect, useState } from "react";
import cx from "classnames";

import {
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeId,
  getObjectTypeLabel,
} from "../../../../../constants/entity-related";
import HeaderSubtitleIcon from "../../../../../pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import { RelatedSummariesProps } from "../../../../../components/Sheet/Tabs/TabEntitySummary/Related/Related";
import DraggableEntityOrSummary from "../../../../../components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import { useAppSelector } from "../../../../../store/hooks";
import { selectOntologyConfig } from "../../../../../store/ontology";

import IconLink from "../../../../../assets/images/icons/IconLink";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import RelatedFooter from "../Components/Footer/RelatedFooterComponent";
import styles from "./styles.scss";

const RelatedObject = ({
  isExpanded,
  setIsExpanded,
  entitySummaries = [],
}: RelatedSummariesProps) => {
  const [relatedEntitiesGroupedByType, setRelatedEntitiesGroupedByType] =
    useState({});
  const { ont } = useAppSelector(selectOntologyConfig);

  useEffect(() => {
    if (entitySummaries) {
      const summaries = Array.isArray(entitySummaries) ? entitySummaries : [];
      const groupeByType =
        summaries?.reduce((acc, curr) => {
          const type = getEntityTypeId(curr, ont);
          // @ts-ignore
          acc[type] = acc[type] ?? [];
          // @ts-ignore
          acc[type].push({ ...curr });
          return acc;
        }, {}) || {};
      setRelatedEntitiesGroupedByType(groupeByType);
    }
  }, [entitySummaries]);

  return (
    <div>
      <DraggableEntityOrSummary
        className={cx(styles.EntitySummary)}
        data={entitySummaries}
      >
        <HeaderSubtitleIcon title="Objets liés" icon={<IconLink />} />
      </DraggableEntityOrSummary>

      {relatedEntitiesGroupedByType && !!entitySummaries?.length && (
        <div
          className={cx(commons.PrettyScroll, styles.relatedMain, {
            [styles.relatedMain__minusRelatedObject]: !isExpanded,
          })}
        >
          {Object.keys(relatedEntitiesGroupedByType).map((entityType) => (
            <DraggableEntityOrSummary
              className={styles.DraggableOffset}
              data={relatedEntitiesGroupedByType[entityType] || []}
            >
              <div className={styles.RelatedTypeGroup}>
                <p className={styles.relatedListTitle}>
                  {getObjectTypeLabel(+entityType, ont)}
                  <span className={styles.relatedListNumberTitle}>
                    ({relatedEntitiesGroupedByType[entityType].length})
                  </span>
                </p>
                <div className={styles.relatedObjectList}>
                  <div className={styles.relatedObjectListWrapper}>
                    {relatedEntitiesGroupedByType[entityType].map((entity) => {
                      const Icon = getEntityStrIcon(entity, ont);
                      return (
                        <>
                          <div className={styles.relatedObjectListContent}>
                            <DraggableEntityOrSummary
                              className={cx(
                                commons.Flex,
                                commons.FlexAlignItemsCenter,
                                styles.EntitySummary
                              )}
                              data={entity}
                              key={entity.id}
                            >
                              <div
                                className={styles.relatedObjectListContentIcon}
                              >
                                {Icon && <Icon />}
                              </div>
                              <p className={styles.relatedObjectText}>
                                {getEntityTitleProperty(entity, ont)}
                              </p>
                            </DraggableEntityOrSummary>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DraggableEntityOrSummary>
          ))}
        </div>
      )}
      <RelatedFooter
        numberData={entitySummaries.length}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default RelatedObject;
