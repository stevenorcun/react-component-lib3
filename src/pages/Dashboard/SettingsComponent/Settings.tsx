import React from "react";
import GridLayout from "react-grid-layout";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import { unhandle } from "../../../utils/DOM";
import IconDisplay from "../../../assets/images/icons/IconEyes";
import IconHidden from "../../../assets/images/icons/IconHiddent";

import styles from "./settings.scss";

interface SettingsProps {
  list: any;
  isVisible: any;
  top: string;
  right: string;
  layout?: any;
  handleDrop?: (e: { key: string; y: number }[]) => void;
}

const Settings = ({
  list,
  isVisible,
  top,
  right,
  handleDrop,
  layout,
}: SettingsProps) => (
  <div
    onClick={unhandle}
    className={cx(styles.settings, commons.PrettyScroll)}
    style={{ top: `${top}`, right: `${right}` }}
  >
    <GridLayout
      isDraggable={false}
      cols={12}
      rowHeight={40}
      width={360}
      style={{ top: `${top}`, right: `${right}` }}
      className={cx("layout")}
      margin={[5, 10]}
      onDragStop={handleDrop}
      layout={layout}
    >
      {list?.map((el, index: number) => (
        <div
          key={el.key}
          className={styles.card}
          style={{ opacity: `${el.hidden ? 0.5 : ""}` }}
          data-grid={{
            x: 0,
            y: index,
            w: 12,
            h: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <div className={styles.icon}>
              <IconDrag />
            </div> */}
            <div className={styles.label}>{el.label}</div>
          </div>
          <button
            type="button"
            onClick={() => isVisible(el.key, !el.hidden)}
            className={styles.icon}
            onMouseDown={unhandle}
          >
            {el.hidden ? <IconHidden /> : <IconDisplay />}
          </button>
        </div>
      ))}
    </GridLayout>
  </div>
);

export default Settings;
