import React from "react";
import cx from "classnames";

import IconSearch from "@/assets/images/icons/IconSearch";

import styles from "./search.scss";

interface SearchProps {
  classNames?: string;
  value: string;
  placeholder?: string;
  inputClassName?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const Search = ({
  placeholder,
  value,
  classNames,
  inputClassName,
  onChange,
}: SearchProps) => (
  <div className={styles.search}>
    <IconSearch className={styles.icon} />
    <input
      type="text"
      placeholder={placeholder ?? "Rechercher"}
      value={value}
      onChange={onChange}
      className={cx(styles.input, inputClassName)}
    />
  </div>
);

export default Search;
