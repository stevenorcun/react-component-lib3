import React, { useState } from "react";

import SearchExplorer from "../SearchExplorer/SearchExplorer";
import FilterExplorer from "../FilterExplorer/FilterExplorer";
import ArrayExplorerContent from "./ArrayExplorerContent";

import styles from "./arrayExplorer.scss";

const ArrayExplorer = ({ explorer }) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const handleIsOpenFilter = () => {
    setIsOpenFilter(!isOpenFilter);
  };

  return (
    <div className={styles.arrayExplorer}>
      <div style={{ position: "relative" }}>
        <SearchExplorer handleIsOpenFilter={handleIsOpenFilter} />
        {isOpenFilter && (
          <FilterExplorer
            handleIsOpenFilter={handleIsOpenFilter}
            explorer={explorer}
          />
        )}
      </div>
      {/* To be confirmed NF-164 only for fadet */}
      {/* <InfoExplorer /> */}
      <ArrayExplorerContent explorer={explorer} />
    </div>
  );
};

export default ArrayExplorer;
