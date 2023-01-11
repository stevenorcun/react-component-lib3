import React from 'react';
import cx from 'classnames';

import styles from './general.scss';

interface SearchProps {
  className?: string;
  placeholder?: string;
  value?: string | Array<string> | undefined;
  readOnly?: boolean;
  icon?: React.ReactElement;
  iconArrow?:React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  label?: string;
}

const General = (
  {
    value,
    className,
    placeholder,
    icon,
    onChange,
    onKeyPress,
    onClick,
    iconArrow,
    readOnly,
    label,
  }: SearchProps,
) => (
  <div
    className={cx(styles.inputContainer, styles.inputElement, className)}
    onClick={onClick}
  >
    {icon && (
    <div className={styles.icon}>
      {icon}
    </div>
    )}
    {label && <label className={styles.label} htmlFor={label}>{label}</label>}
    <input
      className={cx({
        [styles.inputWithIcon]: icon,
        [styles.inputReadonly]: readOnly,
      })}
      id={label}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      onKeyPress={onKeyPress}
      readOnly={readOnly}
    />

    {iconArrow && (
      <div
        className={styles.iconArrow}
      >
        {iconArrow}
      </div>
    )}
  </div>
);

export default General;
