/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import SvgIconPencilEdit from "../../../assets/images/icons/IconPencilEdit";
import SvgIconSearch from "../../../assets/images/icons/IconSearch";
import SvgIconSettings from "../../../assets/images/icons/IconSettings";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectMap, setActiveMenu } from "../../../store/map";
import React from "react";
import cx from "classnames";
import SvgIconCross from "../../../assets/images/icons/IconCross";
import styles from "./styles.scss";

const Sidebar = () => {
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();
  const onActiveMenuSelect = () => {
    dispatch(setActiveMenu("SimpleSelect"));
  };

  return (
    <>
      <div
        className={cx(styles.sidebar, {
          [styles.opened]: !mapState.isCollapsedLeftDrawer,
        })}
      >
        <div className={styles.sidebar_head_container}>
          <SvgIconSearch fill="white" className={styles.worldSearchIcon} />
          <label className={styles.sidebar_head_label}>
            Rayon de recherche
          </label>
          <button
            className={styles.crossDivIcon}
            onClick={(e) => {
              onActiveMenuSelect();
            }}
          >
            <SvgIconCross fill="#fff" className={styles.crossIcon} />
          </button>
        </div>
        <div className={styles.sidebar_settings_container}>
          <SvgIconSettings fill="#3083F7" className={styles.settingsIcon} />
          <label className={styles.sidebar_settings_label}>
            Paramètre de recherche
          </label>
          <button className={styles.pencilEditDiv}>
            <SvgIconPencilEdit
              fill="#94969A"
              className={styles.pencilEditIcon}
            />
          </button>
        </div>
        <div>
          <div className={styles.sidebar_drawing_edit_container}>
            <div className={styles.sidebar_draw_label}>
              <label>Centre</label>
            </div>
            <div className={styles.sidebar_draw_input}>
              <label className={styles.sidebar_input}>
                {mapState.circleCenterCoord.toString()}
              </label>
            </div>
          </div>
          <br />
          <div className={styles.sidebar_drawing_edit_container}>
            <div className={styles.sidebar_draw_label}>
              <label>Rayon</label>
            </div>
            <div className={styles.sidebar_draw_input}>
              <label
                className={styles.sidebar_input}
              >{`${mapState.circleRadiusInKm.toString()} kms`}</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
