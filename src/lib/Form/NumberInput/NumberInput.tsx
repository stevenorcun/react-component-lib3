import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconChevron from "../../../assets/images/icons/IconChevron";
import styles from "./NumberInput.scss";

interface BetaMaleNumberInputProps {
  className?: string | string[];
  arrowClassname?: string | string[];
  inputClassname?: string | string[];
  value?: number;
  min: number;
  max: number;
  isInteger?: boolean;
  onChange: (newValue: number) => void;
}
const NumberInput = ({
  className,
  arrowClassname,
  inputClassname,
  value,
  min = -Infinity,
  max = Infinity,
  isInteger = true,
  onChange,
}: BetaMaleNumberInputProps) => {
  // prevent render if invalid extremes
  if (min > max) {
    console.error("Invalid extremes [min, max]", [min, max]);
    return null;
  }

  const increment = () => {
    if (value !== undefined && !Number.isNaN(value)) {
      const newValue = value + 1;
      onChange(!Number.isNaN(max) && newValue > max ? min : newValue);
    } // else onChange(max);
  };

  const decrement = () => {
    if (value !== undefined && !Number.isNaN(value)) {
      const newValue = value - 1;
      onChange(!Number.isNaN(min) && newValue < min ? max : newValue);
    } // else onChange(min);
  };

  // TODO prevent typing if no initial value ?
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const v = +e.currentTarget.value;
    if (!Number.isNaN(v)) {
      onChange(isInteger ? Math.floor(v) : v);
    }
  };

  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexJustifyContentCenter,
        commons.FlexDirectionColumn,
        styles.MaleContainer,
        className
      )}
    >
      <div
        className={cx(
          commons.Flex,
          commons.FlexAlignItemsCenter,
          commons.FlexJustifyContentCenter,
          commons.clickable,
          commons.Hoverable,
          styles.MaleIncrDecrArrow,
          arrowClassname
        )}
        onClick={increment}
      >
        <IconChevron
          width={8}
          className={cx(commons.Hoverable, commons.Rotate180)}
        />
      </div>

      <input
        className={cx(styles.MaleNumberInput, inputClassname)}
        type="number"
        value={value}
        onChange={handleChange}
      />

      <div
        className={cx(
          commons.Flex,
          commons.FlexAlignItemsCenter,
          commons.FlexJustifyContentCenter,
          commons.clickable,
          commons.Hoverable,
          styles.MaleIncrDecrArrow,
          arrowClassname
        )}
        onClick={decrement}
      >
        <IconChevron width={8} className={cx(commons.Hoverable)} />
      </div>
    </div>
  );
};

export default NumberInput;
