/* eslint-disable react/button-has-type */
import React from "react";
import SvgIconSearch from "@/assets/images/icons/IconSearch";
import cx from "classnames";
import { selectMap } from "@/store/map";
import { useAppSelector } from "@/store/hooks";
import styles from "./styles.scss";

const SearchBar = ({
  containerMapGeocoder,
}: {
  containerMapGeocoder: HTMLDivElement;
}) => {
  const mapState = useAppSelector(selectMap);
  return (
    <>
      <div
        className={cx(styles.searchContainer, {
          [styles.opened]: !mapState.isCollapsedLeftDrawer,
        })}
      >
        <SvgIconSearch fill="#3083F7" className={styles.iconSearch} />
        <div
          // @ts-ignore
          ref={containerMapGeocoder}
          className={styles.containerMapGeocoder}
        />

        <button className={styles.btnSearchDiv}>
          <SvgIconSearch fill="#FFFFFF" className={styles.btnSearch} />
        </button>
      </div>
    </>
  );
};

export default SearchBar;
