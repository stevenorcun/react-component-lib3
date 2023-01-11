import React from "react";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface NavigationItemProps {
  className: string;
  style?: undefined;
  clickable: boolean | undefined;
  active: boolean | undefined;
  onDragStart: (e?: any) => void;
  onClick: () => void;
  onDragEnter?: () => void | undefined;
  onDrop?: () => void | undefined;
  icon?: React.ReactNode;
  label: string;
}

const NavigationItem = ({
  className,
  style,
  clickable,
  active,
  onDragStart,
  onClick,
  onDragEnter,
  onDrop,
  icon,
  label,
}: NavigationItemProps) => (
  <div
    style={style}
    className={cx(styles.item, className, {
      [commons.clickable]: clickable,
      [styles.active]: active,
    })}
    role="button"
    tabIndex={0}
    draggable={!!onDragStart}
    onDragStart={onDragStart}
    onKeyDown={onClick}
    onClick={onClick}
    onDragEnter={onDragEnter}
    onDragOver={onDragEnter}
    onDrop={onDrop}
  >
    {icon}
    {label && <p>{label}</p>}
  </div>
);

export default NavigationItem;
