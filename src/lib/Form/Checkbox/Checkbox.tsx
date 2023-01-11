import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./Checkbox.scss";

export interface ICheckbox {
  id?: string;
  value?: number | string;
  label: string;
  checked: boolean;
  icon?: React.ReactNode;
}

export interface CheckboxProps extends ICheckbox {
  className?: string;
  children?: React.ReactNode;
  onChange: ({ value, label, checked }: ICheckbox) => void;
}

const Checkbox = ({
  value,
  checked,
  label,
  children,
  className,
  icon,
  onChange,
}: CheckboxProps) => {
  const handleInputChecked = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange({ value, label, checked: e.currentTarget.checked });
  };

  const handleLabelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ value, label, checked: !checked });
  };

  return (
    <div className={cx(commons.clickable, styles.Checkbox, className)}>
      <input
        type="checkbox"
        className={styles.Input}
        value={value}
        checked={checked}
        onChange={handleInputChecked}
      />
      {icon && <span className={styles.Icon}>{icon}</span>}
      <span className={cx(styles.Label)} onClick={handleLabelClicked}>
        {label}
      </span>
      {children}
    </div>
  );
};

export default Checkbox;
