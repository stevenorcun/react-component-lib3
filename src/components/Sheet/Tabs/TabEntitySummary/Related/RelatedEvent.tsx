import React, { useEffect, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";
import { ENTITY_TYPE_DETAILS } from "@/constants/entity-related";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconDate from "@/assets/images/icons/IconCalendar";
import IconCompany from "@/assets/images/icons/IconCompanyAirIberia";
import HeaderSubtitleIcon from "@/pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import { RelatedSummariesProps } from "@/components/Sheet/Tabs/TabEntitySummary/Related/Related";
import DraggableEntityOrSummary from "@/components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import { EventSummary } from "@/API/DataModels/Database/NovaObject";
import RelatedFooter from "../Components/Footer/RelatedFooterComponent";
import styles from "./styles.scss";

const RelatedEvent = ({
  setIsExpanded,
  isExpanded,
  entitySummaries = [],
}: RelatedSummariesProps) => {
  const [eventsByType, setEventsByType] = useState<{
    [key in NovaEntityType]?: EventSummary[];
  }>({});

  useEffect(() => {
    const resultEventsByType = entitySummaries?.reduce((acc, curr) => {
      const { type } = curr.value;
      acc[type] = acc[type] ?? [];
      acc[type].push({ ...curr });
      return acc;
    }, {});
    setEventsByType(resultEventsByType);
  }, [entitySummaries]);
  return (
    <div>
      <DraggableEntityOrSummary
        className={cx(styles.EntitySummary)}
        data={entitySummaries}
      >
        <HeaderSubtitleIcon
          title="Evènements liés"
          icon={<IconDate className={styles.relatedIcon} />}
        />
      </DraggableEntityOrSummary>
      <div
        className={cx(commons.PrettyScroll, styles.relatedMain, {
          [styles.relatedMain__minusRelatedEvent]: !isExpanded,
        })}
      >
        {Object.entries(eventsByType).map((element) => (
          <DraggableEntityOrSummary
            className={styles.DraggableOffset}
            data={element[1] || []}
          >
            <div className={styles.RelatedTypeGroup} key={element[0]}>
              <p className={styles.relatedListTitle}>
                {ENTITY_TYPE_DETAILS[element[0]].label}
                <span className={styles.relatedListNumberTitle}>
                  {`(${element[1].length})`}
                </span>
              </p>
              <div
                style={{
                  borderLeft: "0.5px solid #d2d3d4",
                }}
              >
                {element[1].map((el) => (
                  <DraggableEntityOrSummary
                    data={el}
                    className={styles.Relative}
                    key={el.id}
                  >
                    <div className={styles.relatedEventMain}>
                      <span className={styles.relatedEventMainPipeCircle} />
                      <div className={styles.backgroundIcon}>
                        {ENTITY_TYPE_DETAILS[el.value.type].icon}
                      </div>
                      <div className={styles.relatedEventMainContent}>
                        <p className={styles.relatedEventMainContentVol}>
                          {/* fixme !!! */}
                          {el.value.label ??
                            `${el.value.from} - ${el.value.to}`}
                        </p>
                        <div className={styles.relatedEventMainContentSubtitle}>
                          <div className={styles.relatedEventMainContentLeft}>
                            <IconDate
                              className={styles.relatedEventMainContentIcon}
                              width={12}
                              height={12}
                            />
                            <p className={styles.textglobal}>
                              {!!el.value.startsAt && (
                                <Moment
                                  format={
                                    el.value.type === 19
                                      ? "DD/MM/YYYY, hh:mm"
                                      : "DD/MM/YYYY"
                                  }
                                >
                                  {el.value.startsAt}
                                </Moment>
                              )}
                            </p>
                          </div>
                          {el.value.airline && (
                            <div
                              className={styles.relatedEventMainContentRight}
                            >
                              <IconCompany
                                className={styles.relatedEventMainContentIcon}
                                width={12}
                                height={12}
                              />
                              <p className={styles.textglobal}>
                                {`${el.value.airline} - Siège ${el.value.seat}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DraggableEntityOrSummary>
                ))}
              </div>
            </div>
          </DraggableEntityOrSummary>
        ))}
      </div>
      <RelatedFooter
        numberData={entitySummaries?.length}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default RelatedEvent;
