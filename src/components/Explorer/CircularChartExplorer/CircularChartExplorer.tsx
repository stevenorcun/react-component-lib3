import React from "react";

import SearchExplorer from "../SearchExplorer/SearchExplorer";
import RechartsCircular from "./RechartsCircular";
import IconSmallDots from "../../../assets/images/icons/IconSmallDots";

import IconArrow from "../../../assets/images/icons/IconArrowDown";

import styles from "./circularCharsExplorer.scss";

const data = [
  {
    key: 0,
    name: "Fréquence de communication",
    value: 400,
    phone: "06 10 02 03 05",
    isVisible: true,
    color: "#0088FE",
  },
  {
    key: 1,
    name: "Fréquence de communication",
    value: 300,
    phone: "06 10 02 03 05",
    isVisible: true,
    color: "#00C49F",
  },
  {
    key: 2,
    name: "Fréquence de communication",
    value: 300,
    phone: "06 10 03 07 22",
    isVisible: true,
    color: "#FFBB28",
  },
  {
    key: 3,
    name: "Fréquence de communication",
    value: 300,
    phone: "06 10 54 73 58",
    isVisible: true,
    color: "#FF8042",
  },
];

const ModelEvent = ({ name, idName, onChecked, isChecked, iconColor }) => {
  return (
    <div className={styles.modelEvent}>
      <div className={styles.icon}>
        <IconSmallDots fill="#D2D3D4" />
      </div>
      <input
        type="checkbox"
        checked={isChecked}
        id={idName}
        onChange={onChecked}
      />
      <label htmlFor={idName} aria-describedby="label" className={styles.label}>
        <span
          style={{ backgroundColor: iconColor }}
          className={styles.filterCircle}
        />
        <p className={styles.name}>{name}</p>
      </label>
    </div>
  );
};

const CircularChartExplorer = () => {
  const toggleLegendCheckByKey = (key: number) => {
    // TODO: Gestion des checkbox.
  };

  const title = "Numéro de téléphone";

  return (
    <>
      <SearchExplorer />
      <div className={styles.circularChartExplorer}>
        <div className={styles.modelLabelEvent}>
          <div className={styles.titleLabel}>
            <div className={styles.icon}>
              <IconArrow fill="#3083F7" />
            </div>
            <p className={styles.title}>{title.toUpperCase()}</p>
          </div>
          {data.map((element) => (
            <ModelEvent
              key={element.key}
              name={element.phone}
              idName={element.key}
              isChecked={element.isVisible}
              iconColor={element.color}
              onChecked={() => toggleLegendCheckByKey(element.key)}
            />
          ))}
        </div>
        <div className={styles.rechartsCircular}>
          <RechartsCircular />
        </div>
      </div>
    </>
  );
};

export default CircularChartExplorer;
