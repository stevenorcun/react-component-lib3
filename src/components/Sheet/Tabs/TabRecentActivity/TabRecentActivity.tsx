import React, { useEffect, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";

import { ENTITY_TYPE_DETAILS } from "@/constants/entity-related";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";

import DraggableEntityOrSummary from "@/components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";

import IconInfo from "@/assets/images/icons/IconInfo";
import IconSort from "@/assets/images/icons/IconSort";
import IconFilter from "@/assets/images/icons/IconFilter";
import IconExportFile from "@/assets/images/icons/IconExportFile";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./recentActivity.scss";

const TabRecentActivity = ({ entity }: EntityDto) => {
  const [sortRecentActivities, setSortRecentActivities] = useState(
    entity?.related?.recentActivities
  );
  const [dataCard, setDataCard] = useState(
    entity?.related?.recentActivities?.values?.length
      ? entity?.related?.recentActivities.values[0]
      : null
  );

  const searchPdfRegex = /.pdf/;

  if (entity?.related?.recentActivities?.length) {
    useEffect(() => {
      const sortAsc = () => (a, b) => b.value.timestamp - a.value.timestamp;
      const result = entity?.related?.recentActivities.values
        .slice()
        .sort(sortAsc());
      setSortRecentActivities({
        ...entity?.related?.recentActivities,
        values: result,
      });
      setDataCard(sortRecentActivities.values[0]);
    }, [entity?.related?.recentActivities]);
  }
  return (
    <div className={styles.recentActivity}>
      {entity?.related?.recentActivities &&
      entity?.related?.recentActivities.values?.length ? (
        <>
          <div className={styles.recentActivityLeft}>
            <div className={styles.recentActivityLeftHeader}>
              <span className={styles.recentActivityLeftHeaderIcon}>
                <IconInfo transform="scale(1.9)" />
              </span>
              <p>
                Cet onglet contient la liste des documents et évènements liés à
                cet objet, affichés par ordre chronologique.
              </p>
            </div>
            <div className={styles.recentActivityLeftFiltre}>
              <div className={styles.recentActivityLeftFiltreContent}>
                <IconSort
                  className={styles.recentActivityLeftFiltreContentIcon}
                  transform="scale(0.8)"
                />
                <select name="pets" id="filtre">
                  <option value="">Trier</option>
                  <option value="dog">Etiquette (A-Z)</option>
                </select>
              </div>
              <div className={styles.recentActivityLeftFiltreContent}>
                <IconFilter
                  className={styles.recentActivityLeftFiltreContentIcon}
                  fill="#3083F7"
                  transform="scale(0.8)"
                />
                <select name="pets" id="filtre">
                  <option value="">Filtrer</option>
                  <option value="dog">Etiquette (A-Z)</option>
                </select>
              </div>
            </div>
            <div
              className={cx(
                commons.PrettyScroll,
                styles.recentActivityLeftListCards
              )}
            >
              {dataCard &&
                sortRecentActivities.values.map((card) => (
                  <DraggableEntityOrSummary data={card}>
                    <div
                      className={cx(styles.recentActivityLeftListCardsCard, {
                        [styles.recentActivityLeftListCardsCardHover]:
                          card.id === dataCard.id,
                      })}
                      key={card.id}
                      onClick={() => setDataCard({ ...card })}
                    >
                      <div
                        className={styles.recentActivityLeftListCardsCardLeft}
                      >
                        <span className={styles.iconType}>
                          {ENTITY_TYPE_DETAILS[card.value.type].icon}
                        </span>
                        <div>
                          <p
                            className={cx(
                              styles.recentActivityLeftListCardsCardLeftTitle,
                              {
                                [styles.recentActivityLeftListCardsCardHoverColor]:
                                  card.id === dataCard.id,
                              }
                            )}
                          >
                            {card.value.label}
                          </p>
                          <p
                            className={cx(
                              styles.recentActivityLeftListCardsCardLeftSubtitle,
                              {
                                [styles.recentActivityLeftListCardsCardHoverColor]:
                                  card.id === dataCard.id,
                              }
                            )}
                          >
                            {ENTITY_TYPE_DETAILS[card.value.type].label}
                          </p>
                        </div>
                      </div>
                      <div
                        className={styles.recentActivityLeftListCardsCardRight}
                      >
                        <p
                          className={cx({
                            [styles.recentActivityLeftListCardsCardHoverColor]:
                              card.id === dataCard.id,
                          })}
                        >
                          {" "}
                          <Moment format="DD/MM/YYYY">
                            {card.value.timestamp}
                          </Moment>
                        </p>
                        <p
                          className={cx({
                            [styles.recentActivityLeftListCardsCardHoverColor]:
                              card.id === dataCard.id,
                          })}
                        >
                          à{" "}
                          <Moment format="hh:mm">{card.value.timestamp}</Moment>
                        </p>
                      </div>
                    </div>
                  </DraggableEntityOrSummary>
                ))}
            </div>
          </div>
          <div className={styles.recentActivityRight}>
            <div className={styles.recentActivityRightListCards}>
              {dataCard && (
                <div className={styles.recentActivityRightListCardsCard}>
                  <div
                    className={styles.recentActivityRightListCardsCardHeader}
                  >
                    <div
                      className={
                        styles.recentActivityRightListCardsCardHeaderLeft
                      }
                    >
                      <span className={styles.iconType}>
                        {ENTITY_TYPE_DETAILS[dataCard.value.type].icon}
                      </span>
                      <div
                        className={
                          styles.recentActivityRightListCardsCardHeaderLeftContent
                        }
                      >
                        <p
                          className={
                            styles.recentActivityRightListCardsCardHeaderLeftContentTitle
                          }
                        >
                          {dataCard.value.label}
                        </p>
                        <p
                          className={
                            styles.recentActivityRightListCardsCardHeaderLeftContentSubtitle
                          }
                        >
                          {ENTITY_TYPE_DETAILS[dataCard.value.type].label} -
                          Ajouté le{" "}
                          <Moment format="DD/MM/YYYY">
                            {dataCard.value.timestamp}
                          </Moment>
                        </p>
                      </div>
                    </div>
                    <button type="button" className={styles.openTab}>
                      <IconExportFile className={styles.icon} />
                      Ouvrir dans un nouvel onglet
                    </button>
                  </div>
                  <div className={styles.recentActivityRightListCardsCardMain}>
                    {dataCard.value.url.search(searchPdfRegex) !== -1 && (
                      <>
                        <iframe
                          src={`${dataCard.value.url}#toolbar=0&fitW`}
                          width="100%"
                          height="100%"
                          // @ts-ignore
                          type="application/pdf"
                          // @ts-ignore
                          className={styles.embed}
                          scrolling="no"
                          title="document"
                        />
                      </>
                    )}
                    {dataCard.value &&
                      dataCard.value.url.search(searchPdfRegex) === -1 && (
                        <>
                          <img
                            src={dataCard.value.url}
                            alt=""
                            className={styles.images}
                          />
                        </>
                      )}
                    {!dataCard.value.url && (
                      <p className={styles.noData}>Aucune donnée à afficher</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "center",
          }}
        >
          Pas de donnée à afficher
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line jest/no-export
export default TabRecentActivity;
