import React from "react";

import IconBrowser from "../../../../../assets/images/icons/IconBrowser";
import IconGraph from "../../../../../assets/images/icons/IconGraph";
import IconMap from "../../../../../assets/images/icons/IconMap";

import styles from "./footerSelection.scss";

const SelectionFooter = () => {
  const ListOpenFooter = {
    browser: {
      label: "Navigateur",
      icon: <IconBrowser />,
    },
    graph: {
      label: "Graph",
      icon: <IconGraph />,
    },
    map: {
      label: "Carte",
      icon: <IconMap />,
    },
  };

  return (
    <div className={styles.selectionFooter}>
      <p className={styles.openIn}>Ouvrir dans :</p>
      <div
        style={{
          display: "flex",
          flexGrow: 2,
          justifyContent: "space-between",
        }}
      >
        {Object.entries(ListOpenFooter).map((element) => (
          <button type="button" className={styles.selectionFooterSet}>
            <p className={styles.icon}>{element[1].icon}</p>
            <p className={styles.label}>{element[1].label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectionFooter;
