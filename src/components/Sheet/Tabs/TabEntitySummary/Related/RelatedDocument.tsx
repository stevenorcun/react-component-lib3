import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { ENTITY_TYPE_DETAILS } from "@/constants/entity-related";
import IconDocument from "@/assets/images/icons/IconDocument";
import IconInformationNote from "@/assets/images/icons/IconInformationNote";
import HeaderSubtitleIcon from "@/pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import cx from "classnames";
import { RelatedSummariesProps } from "@/components/Sheet/Tabs/TabEntitySummary/Related/Related";
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import { RelatedSummary } from "@/API/DataModels/Database/NovaObject";
import DraggableEntityOrSummary from "@/components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import RelatedFooter from "../Components/Footer/RelatedFooterComponent";
import styles from "./styles.scss";

const RelatedDocument = ({
  isExpanded,
  setIsExpanded,
  entitySummaries = [],
}: RelatedSummariesProps) => {
  const [docsGroupedByType, setDocsGroupedByType] = useState<{
    [key in NovaEntityType]?: RelatedSummary[];
  }>({});

  useEffect(() => {
    if (entitySummaries.length) {
      const docsByType = entitySummaries?.reduce((acc, curr) => {
        const { type } = curr.value;
        acc[type] = acc[type] ?? [];
        acc[type].push({ ...curr });
        return acc;
      }, {});
      setDocsGroupedByType(docsByType);
    }
  }, [entitySummaries]);

  return (
    <div>
      <DraggableEntityOrSummary
        className={cx(styles.EntitySummary)}
        data={entitySummaries}
      >
        <HeaderSubtitleIcon
          title="Documents liés"
          icon={<IconDocument className={styles.relatedIcon} />}
        />
      </DraggableEntityOrSummary>
      <div
        className={cx(commons.PrettyScroll, styles.relatedMain, {
          [styles.relatedMain__minusRelatedDocument]: !isExpanded,
        })}
      >
        {Object.entries(docsGroupedByType).map((element) => (
          <DraggableEntityOrSummary
            className={styles.DraggableOffset}
            data={element[1] || []}
          >
            <div className={styles.RelatedTypeGroup} key={element[0]}>
              <p className={styles.relatedListTitle}>
                {ENTITY_TYPE_DETAILS[element[0]].label}
                <span className={styles.relatedListNumberTitle}>
                  ({element[1].length})
                </span>
              </p>
              <div>
                {element[1].map((note) => (
                  <DraggableEntityOrSummary
                    data={note}
                    key={note.id}
                    className={styles.relatedList}
                  >
                    <div className={styles.relatedListLeft}>
                      <IconInformationNote className={styles.relatedIconFile} />
                      <span className={styles.relatedListLeftRound} />
                      <p className={styles.textglobal}>{note.value.label}</p>
                    </div>
                    <p className={styles.relatedListRightDate}>
                      <Moment format="DD/MM/YYYY">{note.createdAt}</Moment>
                    </p>
                  </DraggableEntityOrSummary>
                ))}
              </div>
            </div>
          </DraggableEntityOrSummary>
        ))}
      </div>

      <RelatedFooter
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
        numberData={entitySummaries.length}
      />
    </div>
  );
};

export default RelatedDocument;
