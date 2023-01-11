import React from "react";

import IconSmallDots from "@/assets/images/icons/IconSmallDots";
import IconOpenArrow from "@/assets/images/icons/IconOpenArrow";
import IconCircleMinus from "@/assets/images/icons/IconCircleMinus";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface ToggleProps {
  toggleOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  togglePin: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setActiveMenu: (menuKey: string) => void;
  isPinned: boolean;
  isOpened: boolean;
  activeMenu: string;
}

const ControlsBar = (props: ToggleProps) => (
  <div className={styles.controlsBar}>
    {props.isOpened && (
      <>
        <IconSmallDots className={styles.smallDots} />
        <div className={styles.tabs}>
          <div
            className={cx(commons.clickable, styles.tab, {
              [styles.active]: props.activeMenu === "Chronologie",
            })}
            onClick={() => props.setActiveMenu("Chronologie")}
          >
            Chronologie
          </div>
          <div
            className={cx(commons.clickable, styles.tab, {
              [styles.active]: props.activeMenu === "Historique",
            })}
            onClick={() => props.setActiveMenu("Historique")}
          >
            Historique
          </div>
          <div
            className={cx(commons.clickable, styles.tab, {
              [styles.active]: props.activeMenu === "Table",
            })}
            onClick={() => props.setActiveMenu("Table")}
          >
            Table
          </div>
        </div>
        <div className={styles.controls}>
          <IconOpenArrow
            fill={props.isPinned ? "#94969A" : "#3083F7"}
            onClick={props.togglePin}
            className={commons.clickable}
          />
          <IconCircleMinus
            height={16}
            width={16}
            fill="#94969A"
            onClick={props.toggleOpen}
            className={commons.clickable}
          />
        </div>
      </>
    )}
  </div>
);

export default ControlsBar;
