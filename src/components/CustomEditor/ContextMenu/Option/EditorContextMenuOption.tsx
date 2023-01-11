/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface EditorContextMenuOptionProps {
  label: string;
  icon?: React.ReactElement;
  shortcut?: string;
  disabled?: boolean;
  onClick?: any;
}

const EditorContextMenuOption = ({
  label,
  icon,
  shortcut,
  disabled = false,
  onClick,
}: EditorContextMenuOptionProps) => (
  <div
    className={cx(commons.clickable, styles.contextMenuOption, {
      [styles.disabled]: disabled,
    })}
    onClick={onClick}
  >
    <span className={styles.optionLabel}>
      {icon}
      <span
        className={cx(styles.label, {
          [styles.noIcon]: !icon,
        })}
      >
        {label}
      </span>
    </span>
    <span>{shortcut}</span>
  </div>
);

export default EditorContextMenuOption;
