import React, { useEffect, useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconSortDown from "../../../assets/images/icons/IconSortDown";
import IconCross from "../../../assets/images/icons/IconCross";
import { unhandle } from "@/utils/DOM";
import styles from "./DropDownSelect.scss";

export interface DropDownSelectProps {
  placeholder?: string;
  selectedValues?: string[];
  values: Array<{
    value: string | number;
    label: string;
    icon?: string | React.ReactNode;
  }>;
  onChange: (e: React.MouseEvent, data: string | string[]) => void;
  className?: string;
  isMulti?: boolean;
  isFilterable?: boolean;
  customInputValueRenderer?: (
    value: string,
    displayedLabel: string
  ) => React.ReactNode;
}

const DropDownSelect = ({
  placeholder = "",
  selectedValues = [],
  values,
  onChange,
  className = "",
  isMulti = false,
  isFilterable = false,
  customInputValueRenderer,
}: DropDownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [valuesMap, setValuesMap] = useState<{ [key: string]: string }>({});
  const [filteredValues, setFilteredValues] = useState(values);
  const [filterInputValue, setFilterInputValue] = useState("");

  const defaultInputValueRenderer = (v) => <span key={v}>{valuesMap[v]}</span>;
  const inputValueRenderer = (value: string) =>
    customInputValueRenderer
      ? customInputValueRenderer(value, valuesMap[value])
      : defaultInputValueRenderer(value);

  const toggleVisibility = () => setIsOpen(!isOpen);

  const onOptionClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    const _value = (e.currentTarget as HTMLInputElement).dataset.value;
    let newValue;
    if (isMulti) {
      const index = selectedValues.indexOf(_value!);
      if (index !== -1) {
        const cloneV = [...selectedValues];
        cloneV.splice(index, 1);
        newValue = cloneV;
      } else newValue = [...selectedValues, _value];
    } else newValue = _value;

    if (!isMulti) toggleVisibility();
    onChange(e, newValue);
  };

  const filterLabels = (
    filter: string,
    valuesToFilter: { value: string | number; label: string }[]
  ) => {
    const regex = new RegExp(filter, "i");
    return valuesToFilter.filter((curr) =>
      filter ? curr.label.match(regex) : true
    );
  };

  const handleFilterInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newFilter = e.currentTarget.value;
    setFilterInputValue(newFilter);
  };

  useEffect(() => {
    // Keep updated and filtered
    setFilteredValues(filterLabels(filterInputValue, values));
    //
    setValuesMap(
      values.reduce((acc: { [key: string]: string }, curr) => {
        acc[curr.value] = curr.label;
        return acc;
      }, {})
    );
  }, [filterInputValue, values]);

  // reset filter value when collapsing the select
  useEffect(() => {
    if (!isOpen) setFilterInputValue("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.addEventListener("click", toggleVisibility);
    return () => {
      document.removeEventListener("click", toggleVisibility);
    };
  }, [isOpen]);

  return (
    <div
      className={cx(
        styles.DropDown,
        styles.DropDownSelect,
        { [styles.Active]: isOpen },
        className
      )}
      onClick={toggleVisibility}
    >
      <IconSortDown className={styles.DropDown__Icon} width={9} height={5} />
      <div className={cx(styles.Default, styles.Text)}>
        <div className={styles.SelectedValues}>
          {selectedValues.length
            ? selectedValues.map(inputValueRenderer)
            : placeholder}
        </div>
      </div>
      <div
        className={cx(styles.Menu, commons.PrettyScroll, {
          [commons.Hidden]: !isOpen,
        })}
        tabIndex={-1}
      >
        {isFilterable && (
          <div className={styles.Filter__Container} onClick={unhandle}>
            <input
              className={styles.Filter__Input}
              type="text"
              value={filterInputValue}
              onChange={handleFilterInputChange}
            />
          </div>
        )}
        {filteredValues.map((option, index) => (
          <div
            className={cx(styles.Item, {
              [styles.Item__Selected]:
                selectedValues.indexOf(option.value as string) !== -1,
            })}
            data-value={option.value}
            key={`${option.label}-${index}`}
            onClick={onOptionClicked}
          >
            {option.icon && typeof option.icon === "string" && (
              <img
                className={styles.Item__Icon}
                alt={option.label}
                src={option.icon}
              />
            )}
            {option.icon && typeof option.icon === "object" && (
              <span className={styles.Item__Icon} title={option.label}>
                {option.icon}
              </span>
            )}
            <span
              className={cx(
                commons.Flex,
                commons.FlexAlignItemsCenter,
                styles.Item__Label
              )}
            >
              {option.label}
            </span>
            {isMulti && (
              <span className={styles.Item__Unselect}>
                <IconCross />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropDownSelect;
