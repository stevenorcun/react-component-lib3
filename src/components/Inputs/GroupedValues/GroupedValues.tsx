import React from "react";
import cx from "classnames";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./groupedValues.scss";

const ValueData = ({
  value,
  handleGroupDelete,
  index,
  className,
}: {
  value: string;
  handleGroupDelete: (e: React.MouseEvent, index: number) => void;
  index: number;
  className?: string;
}) => {
  const handleClick = (e: React.MouseEvent) => handleGroupDelete(e, index);
  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexAlignItemsCenter,
        styles.groupedValue,
        className
      )}
    >
      {value}
      <span
        className={styles.groupedValue__closeIcon}
        data-group-index={index}
        onClick={handleClick}
      >
        &#10006;
      </span>
    </div>
  );
};

interface GroupedValuesProps {
  handleGroupedDelete: (e: React.MouseEvent, index: number) => void;
  values: Array<string>;
  readOnly?: boolean;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  iconArrow?: React.ReactNode;
}

const GroupedValues = ({
  values,
  readOnly,
  icon,
  onClick,
  iconArrow,
  handleGroupedDelete,
}: GroupedValuesProps) => (
  <div
    onClick={onClick}
    className={cx(
      styles.globalGroupedValues,
      commons.Flex,
      commons.FlexAlignItemsCenter,
      styles.FakeInput__Container
    )}
  >
    <div className={styles.inputContainer}>
      {Array.isArray(values) &&
        values.map((el: string, index: number) => (
          <ValueData
            value={el}
            key={el}
            index={index}
            handleGroupDelete={handleGroupedDelete}
            className={index === values.length - 1 ? styles.Last : ""}
          />
        ))}
    </div>
    {iconArrow && <div className={styles.iconArrow}>{iconArrow}</div>}
  </div>
);

export default GroupedValues;
