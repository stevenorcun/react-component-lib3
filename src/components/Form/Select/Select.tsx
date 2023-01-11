import React from "react";
import Select from "react-select";

interface BasicProps {
  readonly className: string;
  readonly classNamePrefix: string;
  readonly onChange: () => void;
  readonly onInputChange: () => void;
  readonly onMenuClose: () => void;
  readonly onMenuOpen: () => void;
  readonly name: string;
  readonly options: readonly any[];
  readonly inputValue: string;
  readonly value: null;
}

const SelectComponent = (props: BasicProps) => <Select {...props} />;

export default SelectComponent;
