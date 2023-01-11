import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { Key } from "@/constants/DOM";
import styles from "./GroupedValuesInput.scss";

interface GroupedValuesInputProps {
  values: Array<string | number | [number, number]>; // string[]|number[]|[number, number][]; // never mixed but... TS warning when doing this
  className?: string;
  placeholder?: string;
  type?: "text" | "phone-number" | "datetime";
  onClick?: (event: React.MouseEvent) => void;
  onChange: (values: Array<string | number | [number, number]>) => void;
  customValueFormatter?: (
    value: string | number | [number, number]
  ) => React.ReactNode;
}

const GroupedValuesInput = ({
  values = [],
  placeholder = "",
  className = "",
  type = "text",
  onClick,
  onChange,
  customValueFormatter,
}: GroupedValuesInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGroupDelete = (index: number, _: React.MouseEvent) => {
    const _values = [...values];
    _values.splice(index, 1);
    onChange(_values);
  };

  const focusInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.focus();
    if (onClick) onClick(e);
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const v =
      type === "phone-number"
        ? e.currentTarget.value.replace(/[^\d|+\n]*/g, "")
        : e.currentTarget.value;
    setInputValue(v);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === Key.Enter && inputValue) {
      // remove duplicated white-spaces
      const trimmedValue = inputValue.trim().replace(/\s+/g, " ");
      if (!trimmedValue) return;
      onChange([...values, trimmedValue]);
      setInputValue("");
    } else if (e.key === Key.Backspace && !inputValue)
      onChange(values.slice(0, -1));
    // Date input are readonly, except for Enter and Backspace
    // TODO? later, maybe allow typing dates in DD/MM/YYYY format
    if (type === "datetime") e.preventDefault();
  };

  // grow input with content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${
        inputValue ? inputRef.current.scrollWidth : 2
      }px`;
    }
  }, [inputValue]);

  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexAlignItemsCenter,
        styles.FakeInput__Container,
        className
      )}
      onClick={focusInput}
    >
      {Array.isArray(values) &&
        values.map((v, i) => (
          <GroupedValue
            key={i}
            value={v}
            index={i}
            className={i === values.length - 1 ? styles.Last : ""}
            onDelete={handleGroupDelete}
            customValueFormatter={customValueFormatter}
          />
        ))}
      <input
        ref={inputRef}
        className={styles.OnlyHereForTheBlinkingCursor}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      {!inputValue && !values.length && (
        <div className={styles.FakeInput__Area}>{placeholder}</div>
      )}
    </div>
  );
};

export interface GroupedValueProps {
  value: string | number | [number, number];
  index: number;
  onDelete: (id: number, event: React.MouseEvent) => void;
  className?: string;
  customValueFormatter?: (
    value: string | number | [number, number]
  ) => React.ReactNode;
}

export const GroupedValue = ({
  value,
  index,
  onDelete,
  className = "",
  customValueFormatter,
}: GroupedValueProps) => {
  const handleGroupDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(index, e);
  };

  return (
    <div
      key={index}
      className={cx(
        commons.Flex,
        commons.FlexAlignItemsCenter,
        styles.GroupedValue,
        className
      )}
    >
      {customValueFormatter ? customValueFormatter(value) : value}
      <span
        className={styles.GroupedValue__CloseIcon}
        data-group-index={index}
        onClick={handleGroupDelete}
      >
        &#10006;
      </span>
    </div>
  );
};

export default GroupedValuesInput;
