import React from "react";
import ModalMap from "../../../../pages/Entity/ComponentsEntityDetail/ComponentModalMap/ModalMap";

import MapService from "../../../../components/Map/MapServices/MapServices";
import { useAppDispatch } from "../../../../store/hooks";
import { setIsLessMapComponent } from "../../../../store/map";
import styles from "./map.scss";

const TabMap = () => {
  const dispatch = useAppDispatch();
  dispatch(setIsLessMapComponent(true));
  return (
    <div className={styles.mapEntityDetail}>
      <MapService />
      <ModalMap />
    </div>
  );
};

export default TabMap;
