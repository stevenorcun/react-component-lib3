import React, { useState, useRef, useEffect, Fragment } from "react";

import IconCross from "../../../assets/images/icons/IconCross";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface AutocompleteOption {
  label: string;
  [key: string]: any;
}

interface AutocompleteProps {
  inputId?: string;
  className?: {
    container?: string;
    element?: string;
    input?: string;
    tag?: string;
  };
  options: Array<string | AutocompleteOption>;
  selectedOptions?: any[];
  setSelectedOptions?: any;
  defaultOptions?: Array<string | AutocompleteOption>;
  placeholder?: string;
  noOptionsText?: string;
  multiple?: boolean;
  renderOption?: (option, onSelect) => React.ReactNode;
  renderButton?: (state) => React.ReactNode;
  renderTag?: (option, onClose) => React.ReactNode;
}

const defaultProps = {
  inputId: undefined,
  className: undefined,
  placeholder: undefined,
  selectedOptions: undefined,
  setSelectedOptions: undefined,
  defaultOptions: undefined,
  noOptionsText: "Aucune donnée",
  multiple: false,
  renderOption: undefined,
  renderButton: undefined,
  renderTag: undefined,
};

const Autocomplete = ({
  inputId,
  className,
  options,
  placeholder,
  defaultOptions,
  selectedOptions,
  setSelectedOptions,
  noOptionsText,
  multiple,
  renderOption,
  renderButton,
  renderTag,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOpt, setSelectedOpt] = useState<any[]>(
    selectedOptions || defaultOptions || []
  );
  const [filteredOptions, setFilteredOptions] =
    useState<Array<string | AutocompleteOption>>(options);
  const [showOptions, setShowOptions] = useState(false);
  const inputContainer = useRef<HTMLDivElement>(null);

  const select = (o) => {
    if (setSelectedOptions) {
      setSelectedOptions(o);
    }
    setSelectedOpt(o);
  };

  const getOptionId = (option: AutocompleteOption | string) => {
    if (typeof option === "string") {
      return option;
    }
    return option.id ? option.id : option.label;
  };

  const getOptionValue = (option: AutocompleteOption | string) => {
    if (typeof option === "string") {
      return option;
    }
    return option?.label;
  };

  const filterOptions = (value = inputValue) => {
    let filteredSuggestions = options.filter(
      (option) =>
        getOptionValue(option)?.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    if (multiple) {
      filteredSuggestions = filteredSuggestions?.filter(
        (option) =>
          selectedOpt.findIndex(
            (o) =>
              getOptionValue(o) === getOptionValue(option) &&
              getOptionId(o) === getOptionId(option)
          ) === -1
      );
    }
    setFilteredOptions(filteredSuggestions || []);
  };

  const openOptions = () => {
    setShowOptions(true);
  };
  const closeOptions = () => {
    setShowOptions(false);
  };

  const handleOnChange = (e) => {
    const userInput = e.currentTarget.value;
    setInputValue(e.currentTarget.value);
    if (!multiple) {
      select([]);
    }
    filterOptions(userInput);
  };
  const selectOption = (option) => {
    if (!multiple) {
      select([option]);
      setInputValue(getOptionValue(option));
      setShowOptions(false);
    } else {
      const selOptions = [...selectedOpt];
      selOptions.push(option);
      select(selOptions);
      setInputValue("");
    }
  };
  const removeOption = (option) => {
    const selOptions = [...selectedOpt];
    const index = selOptions.findIndex((o) => o === option);
    selOptions.splice(index, 1);
    select(selOptions);
  };

  const handleClickOut = (e) => {
    if (!inputContainer.current?.contains(e.target)) {
      closeOptions();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);
    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  useEffect(() => {
    filterOptions();
  }, [inputValue, options, selectedOpt]);
  return (
    <div
      ref={inputContainer}
      className={cx(styles.inputContainer, className?.container)}
    >
      <div className={cx(styles.inputElement, className?.element)}>
        {multiple &&
          selectedOpt.map((option) => (
            <>
              {renderTag ? (
                <Fragment key={getOptionId(option)}>
                  {renderTag(option, () => removeOption(option))}
                </Fragment>
              ) : (
                <div
                  key={getOptionId(option)}
                  className={cx(
                    commons.tag,
                    styles.inputTagElement,
                    className?.tag
                  )}
                >
                  <span className={styles.inputTagElementLabel}>
                    {getOptionValue(option)}
                  </span>
                  <IconCross onClick={() => removeOption(option)} />
                </div>
              )}
            </>
          ))}
        <input
          id={inputId}
          type="text"
          className={cx(className?.input, styles.input, {
            [styles.inputWithButton]: renderButton,
          })}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleOnChange}
          onFocus={openOptions}
        />
        {renderButton && (
          <>
            {renderButton({
              inputValue,
              setInputValue,
              selectedOptions: selectedOpt,
              setSelectedOptions: select,
              filteredOptions,
              setFilteredOptions,
              showOptions,
              setShowOptions,
            })}
          </>
        )}
      </div>
      {showOptions && (
        <ul className={cx(commons.PrettyScroll, styles.optionContainer)}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li key={getOptionId(option)} className={styles.optionElement}>
                {renderOption ? (
                  <>{renderOption(option, () => selectOption(option))}</>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.optionElementInteractive}
                      onClick={() => selectOption(option)}
                    >
                      {getOptionValue(option)}
                    </button>
                  </>
                )}
              </li>
            ))
          ) : (
            <li style={{ padding: "10px" }}>{noOptionsText}</li>
          )}
        </ul>
      )}
    </div>
  );
};

Autocomplete.defaultProps = defaultProps;

export default Autocomplete;
