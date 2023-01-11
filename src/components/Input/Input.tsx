import React from "react";

/**
 * Imported from Material-component
 * URL : https://github.com/material-components/material-components-web-react/blob/master/packages/text-field/Input.tsx
 */
export interface InputProps<T extends HTMLElement = HTMLInputElement> {
  className?: string;
  inputType?: "input" | "textarea";
  isValid?: boolean;
  syncInput?: (inputInstance: Input<T>) => void;
  onBlur?: Pick<React.HTMLProps<T>, "onBlur">;
  onChange?: Pick<React.HTMLProps<T>, "onChange">;
  onFocus?: Pick<React.HTMLProps<T>, "onFocus">;
  onMouseDown?: Pick<React.HTMLProps<T>, "onMouseDown">;
  onTouchStart?: Pick<React.HTMLProps<T>, "onTouchStart">;
  setDisabled?: (disabled: boolean) => void;
  setInputId?: (id: string | number) => void;
  handleFocusChange?: (isFocused: boolean) => void;
}

type InputElementProps = Exclude<React.HTMLProps<HTMLInputElement>, "ref">;
type TextareaElementProps = Exclude<
  React.HTMLProps<HTMLTextAreaElement>,
  "ref"
>;
type Props<T extends HTMLElement = HTMLInputElement> = InputProps<T> &
  (T extends HTMLInputElement ? InputElementProps : TextareaElementProps);

interface InputState {
  wasUserTriggeredChange: boolean;
  isMounted: boolean;
}

declare type ValidationAttrWhiteList =
  | "pattern"
  | "min"
  | "max"
  | "required"
  | "step"
  | "minlength"
  | "maxlength";
declare type ValidationAttrWhiteListReact =
  | Exclude<ValidationAttrWhiteList, "minlength" | "maxlength">
  | "minLength"
  | "maxLength";

const VALIDATION_ATTR_WHITELIST: ValidationAttrWhiteList[] = [
  "pattern",
  "min",
  "max",
  "required",
  "step",
  "minlength",
  "maxlength",
];

export default class Input<
  T extends HTMLElement = HTMLInputElement
> extends React.Component<Props<T>, InputState> {
  inputElement_: React.RefObject<
    T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
  > = React.createRef();

  static defaultProps = {
    className: "",
    inputType: "input",
    disabled: false,
    id: "",
    setDisabled: () => {},
    setInputId: () => {},
    handleFocusChange: () => {},
    value: "",
  };

  state = {
    wasUserTriggeredChange: false,
    isMounted: false,
  };

  componentDidMount() {
    const { id, syncInput, disabled, setInputId, setDisabled } = this.props;
    if (syncInput) {
      syncInput(this);
    }
    if (setInputId && id) {
      setInputId(id!);
    }
    if (setDisabled && disabled) {
      setDisabled(true);
    }
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps: Props<T>, prevState: InputState) {
    const { id, value, disabled, setInputId, setDisabled } = this.props;

    this.handleValidationAttributeUpdate(prevProps);

    if (disabled !== prevProps.disabled) {
      setDisabled && setDisabled(disabled!);
    }

    if (id !== prevProps.id) {
      setInputId && setInputId(id!);
    }

    if (value !== prevProps.value) {
      this.setState({ wasUserTriggeredChange: false });
    }
  }

  valueToString(value?: string | string[] | number) {
    let str;
    if (typeof value === "object") {
      str = value.join("");
    } else if (typeof value === "number") {
      str = value.toString();
    } else {
      str = value || "";
    }
    return str;
  }

  get classes() {
    return this.props.className;
  }

  get inputElement() {
    return this.inputElement_.current;
  }

  handleFocus = (
    evt: React.FocusEvent<
      T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
    >
  ) => {
    const { handleFocusChange, onFocus = () => {} } = this.props;
    handleFocusChange && handleFocusChange(true);
    onFocus(evt);
  };

  handleBlur = (
    evt: React.FocusEvent<
      T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
    >
  ) => {
    const { handleFocusChange, onBlur = () => {} } = this.props;
    handleFocusChange && handleFocusChange(false);
    onBlur(evt);
  };

  handleMouseDown = (
    evt: React.MouseEvent<
      T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
    >
  ) => {
    const { onMouseDown = () => {} } = this.props;
    onMouseDown(evt);
  };

  handleTouchStart = (
    evt: React.TouchEvent<
      T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
    >
  ) => {
    const { onTouchStart = () => {} } = this.props;
    onTouchStart(evt);
  };

  // That state variable is used to let other subcomponents and
  // the foundation know what the current value of the input is.
  handleChange = (
    evt: React.FormEvent<
      T extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement
    >
  ) => {
    const { onChange = () => {} } = this.props;
    // autoCompleteFocus runs on `input` event in MDC Web. In React, onChange and
    // onInput are the same event
    // https://stackoverflow.com/questions/38256332/in-react-whats-the-difference-between-onchange-and-oninput
    this.setState({ wasUserTriggeredChange: true });
    onChange(evt);
  };

  handleValidationAttributeUpdate = (nextProps: Props<T>) => {
    VALIDATION_ATTR_WHITELIST.some((attributeName: ValidationAttrWhiteList) => {
      let attr: ValidationAttrWhiteListReact;
      if (attributeName === "minlength") {
        attr = "minLength";
      } else if (attributeName === "maxlength") {
        attr = "maxLength";
      } else {
        attr = attributeName;
      }
      if (this.props[attr] !== nextProps[attr]) {
        return true;
      }
      return false;
    });
  };

  isBadInput = () => {
    const input = this.inputElement;
    return input && input.validity.badInput;
  };

  isValid = () => {
    if (!this.inputElement || this.props.isValid !== undefined) {
      return this.props.isValid;
    }
    return this.inputElement.validity.valid;
  };

  isDisabled = () => !!this.props.disabled;

  getMaxLength = () =>
    typeof this.props.maxLength === "number" ? this.props.maxLength : -1;

  getInputType = () => String(this.props.inputType);

  // @ts-ignore
  getValue = () => this.valueToString(this.props.value);

  render() {
    const {
      inputType,
      disabled,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      className,
      syncInput,
      isValid,
      value,
      handleFocusChange,
      setDisabled,
      setInputId,
      onFocus,
      onBlur,
      onMouseDown,
      onTouchStart,
      onChange,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...otherProps
    } = this.props;

    const props = {
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleTouchStart,
      onChange: this.handleChange,
      disabled,
      value,
      ref: this.inputElement_,
      className: this.classes,
      ...otherProps,
    };

    if (inputType === "input") {
      // https://github.com/Microsoft/TypeScript/issues/28892
      // @ts-ignore
      return <input {...props} />;
    }
    // @ts-ignore
    return <textarea {...props} />;
  }
}
