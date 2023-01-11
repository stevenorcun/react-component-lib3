import React, { useState, useEffect } from "react";

import cx from "classnames";
import styles from "./styles.scss";

interface SwitchProps {
  inputId?: string;
  inputName?: string;
  className?: string;
  defaultActive?: boolean;
  disabled?: boolean;
  checked?: boolean;
  setChecked?: any;
}

const defaultProps = {
  inputId: undefined,
  inputName: undefined,
  className: undefined,
  defaultActive: false,
  disabled: false,
  checked: undefined,
  setChecked: undefined,
};

const Switch = ({
  inputId,
  inputName,
  className,
  defaultActive,
  disabled,
  checked,
  setChecked,
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(
    checked !== undefined ? checked : defaultActive
  );

  const toggleCheck = () => {
    if (disabled) {
      return;
    }
    if (setChecked) {
      setChecked(!isChecked);
    }
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setIsChecked(checked !== undefined ? checked : defaultActive);
  }, [defaultActive, checked]);
  return (
    <>
      <input
        className={styles.reactSwitchCheckbox}
        id={inputId}
        type="checkbox"
        name={inputName}
        checked={isChecked}
        onChange={toggleCheck}
        disabled={disabled}
      />
      <div
        className={cx(className, styles.reactSwitch, {
          [styles.active]: isChecked,
          [styles.disabled]: disabled,
        })}
        onClick={toggleCheck}
      >
        <span className={styles.reactSwitchButton} />
      </div>
    </>
  );
};

Switch.defaultProps = defaultProps;

export default Switch;
