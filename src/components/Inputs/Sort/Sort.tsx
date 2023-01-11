/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import Select, { ActionMeta } from "react-select";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface SortProps {
  className?: string;
  options: {
    value: number | string;
    label: string;
  }[];
  value?: any;
  onChange?: (value: number | string, actionMeta: ActionMeta<any>) => void;
  defaultValue?: any;
}

const defaultProps = {
  className: undefined,
  value: undefined,
  onChange: undefined,
  defaultValue: undefined,
};

const Sort = ({
  className,
  options,
  value,
  onChange,
  defaultValue,
}: SortProps) => {
  // Select sort style
  const customStyles = {
    container: (provided) => ({
      ...provided,
      display: "inline-block",
      borderRadius: 50,
      padding: "7px 10px",
      background: "#EDEDEE",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: 16,
      borderRadius: 50,
      border: "none",
      boxShadow: "none",
      backgroundColor: "#EDEDEE",
      "&:hover": {
        border: "none",
        boxShadow: "none",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "unset",
      width: 16,
      height: 16,
      alignItems: "center",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "unset",
      fontWeight: 600,
    }),
    singleValue: (provided) => ({
      ...provided,
      marginLeft: "0",
      marginRight: "0",
      position: "static",
      transform: "initial",
    }),
    input: (provided) => ({
      ...provided,
      margin: "unset",
      paddingTop: "unset",
      paddingBottom: "unset",
    }),
    menu: (provided) => ({
      ...provided,
      width: "auto",
    }),
  };

  return (
    <div className={cx(commons.fontSmall, styles.sort, className)}>
      <label htmlFor="sort">Trier par :</label>
      <Select
        styles={customStyles}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={null}
        defaultValue={defaultValue}
      />
    </div>
  );
};

Sort.defaultProps = defaultProps;

export default Sort;
