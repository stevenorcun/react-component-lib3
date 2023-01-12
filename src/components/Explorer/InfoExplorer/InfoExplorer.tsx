import React from "react";
import { selectExplorer } from "../../../store/explorer";
import { useAppSelector } from "../../../store/hooks";

import styles from "./infoExplorer.scss";

const InfoExplorer = () => {
  const explorerState = useAppSelector(selectExplorer);
  const data = [
    {
      label: "Numéro bénéficiaire",
      value: explorerState.beneficiaryPhone,
    },
    {
      label: "Période",
      value: "Mars 2022",
    },
    {
      label: "Abonné",
      value: "André Merlaux",
    },
  ];
  return (
    <div className={styles.infoExplorer}>
      {data.map((element: { label: string; value: string }) => (
        <p key={element.value} className={styles.value}>
          <span className={styles.label}>{element.label} :</span>
          {element.value}
        </p>
      ))}
    </div>
  );
};

export default InfoExplorer;
