/* eslint-disable max-len */
import React from "react";
import cx from "classnames";

import HeaderSubtitleIcon from "@/pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import SelectionFooter from "@/components/Explorer/PaletteExplorer/Components/FooterSelection/FooterSelection";
import NoData from "@/lib/NoData/NoData";

import IconList from "@/assets/images/icons/IconList2";
import IconEvent from "@/assets/images/icons/IconCalendar";
import IconLink from "@/assets/images/icons/IconLink";
import IconArrowBottom from "@/assets/images/icons/IconArrowDown";
import IconPerson from "@/assets/images/icons/IconWoman";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import { selectExplorer } from "@/store/explorer";
import { useAppSelector } from "@/store/hooks";
import styles from "./selectionExplorer.scss";

const SelectionLine = ({
  property,
  value,
}: {
  property: string;
  value: string | number;
}) => (
  <div className={styles.selectionLine}>
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      <p className={styles.property}>{property}</p>
    </div>
    <div className={styles.value}>
      <p
        className={cx({
          [styles.valueString]: typeof value === "string",
          [styles.valueNumber]: typeof value === "number",
        })}
      >
        {value}
      </p>
    </div>
  </div>
);

const SelectionExplorer = () => {
  const explorerState = useAppSelector(selectExplorer);

  const listEvents = [
    {
      property: "Appel",
      value: 28,
    },
    {
      property: "SMS",
      value: 13,
    },
  ];

  return (
    <div className={cx(styles.selectionExplorer, commons.PrettyScroll)}>
      {/* Properties object */}
      <HeaderSubtitleIcon title="Proprété de l'objet" icon={<IconList />} />
      <div className={styles.content}>
        {explorerState.tabs[explorerState.activeExlorerTabIndex]
          ?.currentSelected &&
          Object.entries(
            explorerState.tabs[explorerState.activeExlorerTabIndex]
              ?.currentSelected.properties
          ).map((element) => (
            // @ts-ignore
            <SelectionLine property={element[0]} value={element[1]} />
          ))}
      </div>
      <SelectionFooter />

      {/* Event */}
      <HeaderSubtitleIcon title="Évènement liés" icon={<IconEvent />} />
      {explorerState.tabs[explorerState.activeExlorerTabIndex]?.currentSelected
        ?.events ? (
        <>
          <div className={styles.content}>
            {listEvents.map(
              (element: { property: string; value: string | number }) => (
                <SelectionLine
                  property={element.property}
                  value={element.value}
                />
              )
            )}
          </div>
          <SelectionFooter />
        </>
      ) : (
        <NoData className={styles.noData}>Aucun évenement liés</NoData>
      )}

      {/* Entities */}
      <HeaderSubtitleIcon title="Entités liés" icon={<IconLink />} />
      <div className={styles.relatedEntities}>
        {explorerState.tabs[explorerState.activeExlorerTabIndex]
          ?.currentSelected?.related?.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className={styles.relatedEntities__icon}>
                <IconArrowBottom />
              </p>
              <p className={styles.category}>Titulaire de</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <p className={styles.label}>Personne physique</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconPerson />
                <p className={styles.valueString}>Getrud Clayborn</p>
              </div>
            </div>
          </>
        ) : (
          <NoData>Aucune entité liés</NoData>
        )}
      </div>
    </div>
  );
};

export default SelectionExplorer;
