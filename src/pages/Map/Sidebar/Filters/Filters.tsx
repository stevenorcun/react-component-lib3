import React from "react";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconSatellite from "@/assets/images/icons/IconSatellite";
import IconPlan from "@/assets/images/icons/IconPlan";
import IconFile from "@/assets/images/icons/IconFile";
import styles from "./styles.scss";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectMap,
  setActiveMenu,
  setFilterActiveMenu,
  setStyleView,
} from "@/store/map";

const Filters = () => {
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const onSatelliteView = () => {
    dispatch(setStyleView("mapbox://styles/mapbox/satellite-v9"));
  };
  const onLightView = () => {
    dispatch(setStyleView("mapbox://styles/mapbox/light-v10"));
  };
  const onStreetView = () => {
    dispatch(setStyleView("mapbox://styles/mapbox/outdoors-v11"));
  };

  const onActiveLightView = () => {
    mapState.filterActiveMenu !== "Light"
      ? dispatch(setFilterActiveMenu("Light"))
      : dispatch(setFilterActiveMenu(""));
  };
  const onActiveSatelliteView = () => {
    mapState.filterActiveMenu !== "Satellite"
      ? dispatch(setFilterActiveMenu("Satellite"))
      : dispatch(setFilterActiveMenu(""));
  };
  const onActiveStreetView = () => {
    mapState.filterActiveMenu !== "Street"
      ? dispatch(setFilterActiveMenu("Street"))
      : dispatch(setFilterActiveMenu(""));
  };

  const onCloseFilters = () => {
    dispatch(setActiveMenu(""));
  };

  return (
    <>
      <div className={cx(styles.navigation)}>
        <div className={cx(styles.filters)}>
          <button
            className={cx(styles.filter, commons.clickable, {
              [styles.active2]: mapState.filterActiveMenu === "Satellite",
            })}
            onClick={() => {
              onSatelliteView();
              onActiveSatelliteView();
              onCloseFilters();
            }}
          >
            <IconSatellite width={41} height={41} style={{ fill: "#3083F7" }} />
            <p>Vue satellite</p>
          </button>

          <button
            className={cx(styles.filter, commons.clickable, {
              [styles.active2]: mapState.filterActiveMenu === "Light",
            })}
            onClick={() => {
              onLightView();
              onActiveLightView();
              onCloseFilters();
            }}
          >
            <IconPlan style={{ fill: "#3083F7" }} />
            <p>Vue light</p>
          </button>

          <button
            className={cx(styles.filter, commons.clickable, {
              [styles.active2]: mapState.filterActiveMenu === "Street",
            })}
            onClick={() => {
              onStreetView();
              onActiveStreetView();
              onCloseFilters();
            }}
          >
            <IconFile style={{ fill: "#3083F7" }} />
            <p>Vue route</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Filters;
