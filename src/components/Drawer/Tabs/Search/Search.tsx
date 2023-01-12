import React from "react";

import IconSearch from "../../../../assets/images/icons/IconSearch";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import cx from "classnames";
import styles from "./styles.scss";

interface SearchProps {
  className?: string;
}

const defaultProps: SearchProps = {
  className: "",
};

const Search = ({ className }: SearchProps) => {
  return (
    <>
      <div className={cx(styles.search, className)}>
        <div className={styles.searchContainer}>
          <div className={styles.searchControls}>
            <input className={styles.searchInput} placeholder="Mots-clés..." />
            <div className={cx(styles.searchBtn, commons.clickable)}>
              <IconSearch style={{ fill: "white" }} />
            </div>
          </div>
        </div>
        <div className={styles.result}>
          <p className={styles.date}>24/04/2021</p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac dictum
            cursus massa integer. Nisl malesuada amet, donec in egestas euismod
            aliquam. Id suspendisse integer et ipsum.
          </p>
          <p className={cx(styles.link, commons.clickable)}>
            (24 éléments liés)
          </p>
        </div>
        <div className={styles.result}>
          <p className={styles.date}>04/04/2021</p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac dictum
            cursus massa integer. Nisl malesuada amet, donec in egestas euismod
            aliquam. Id suspendisse integer et ipsum.
          </p>
          <p className={cx(styles.link, commons.clickable)}>
            (14 éléments liés)
          </p>
        </div>
        <div className={styles.result}>
          <p className={styles.date}>16/03/2021</p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac dictum
            cursus massa integer. Nisl malesuada amet, donec in egestas euismod
            aliquam. Id suspendisse integer et ipsum.
          </p>
          <p className={cx(styles.link, commons.clickable)}>
            (3 éléments liés)
          </p>
        </div>
      </div>
    </>
  );
};

Search.defaultProps = defaultProps;

export default Search;
