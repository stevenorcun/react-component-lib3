import React from "react";
import cx from "classnames";

import IconSearch from "@/assets/images/icons/IconSearch";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface SearchProps {
  className?: string;
  placeholder?: string;
  iconColor?: string;
  icon?: React.ReactElement;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

const defaultProps: SearchProps = {
  className: undefined,
  placeholder: undefined,
  iconColor: "#D2D3D4",
  icon: undefined,
  onChange: undefined,
  onKeyPress: undefined,
  onClick: undefined,
};

const Search = React.forwardRef(
  (
    {
      className,
      placeholder,
      iconColor,
      icon,
      onChange,
      onKeyPress,
      onClick,
    }: SearchProps,
    ref
  ) => (
    <div className={cx(styles.inputContainer, className)}>
      <div className={styles.inputElement}>
        <input
          // @ts-ignore
          ref={ref}
          className={cx(commons.fontSmall, styles.searchInput)}
          placeholder={placeholder}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onClick={onClick}
        />
        {icon}
        {!icon && <IconSearch fill={iconColor} />}
      </div>
    </div>
  )
);

Search.displayName = "Search";
Search.defaultProps = defaultProps;

export default Search;
