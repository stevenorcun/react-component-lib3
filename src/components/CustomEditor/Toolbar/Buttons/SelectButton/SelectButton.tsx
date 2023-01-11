import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./styles.scss";

interface SelectButtonProps {
  onChange: any;
  options: {
    value: any;
    label: string;
  }[];
  defaultValue?: any;
  value?: any;
  width?: string;
}

const SelectButton = ({
  onChange,
  options,
  defaultValue,
  value,
  width,
}: SelectButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<any>(defaultValue);
  // Select style
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: width || "auto",
    }),
    control: (provided) => ({
      ...provided,
      border: "1px solid #EDEDEE",
      borderRadius: "8px",
      minHeight: "40px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "2px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "unset",
      width: 12,
      height: 12,
      alignItems: "center",
    }),
    valueContainer: (provided) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: 600,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4D5056",
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      zIndex: "2",
    }),
    menuList: (provided) => ({
      ...provided,
      "::-webkit-scrollbar": {
        width: "4px",
        height: "4px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(77,80,86,.4)",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-track": {
        borderRadius: "10px",
        backgroundColor: "transparent",
      },
      scrollbarColor: "rgba(77, 80, 86, 0.4) #fff",
      scrollbarWidth: "thin",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: 12,
    }),
  };
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option.value);
    }
  };

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  return (
    <div className={styles.selectButton}>
      <Select
        options={options}
        defaultValue={defaultValue}
        value={selectedOption}
        onChange={handleSelectOption}
        styles={customStyles}
        isSearchable={false}
      />
    </div>
  );
};

export default SelectButton;
