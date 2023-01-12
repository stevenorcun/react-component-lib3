import React from "react";
import IconPlus from "../../../../assets/images/icons/IconPlus";
import IconFilter from "../../../../assets/images/icons/IconFilter";
import styles from "./componentHeaderFiltre.scss";

interface PropsHeaderFiltre {
  nameButton: string;
  tab: string;
  placeholderFiltre: string;
  valueFilter: string;
  activeFilterText: any;
}

const ComponentHeaderFiltre = ({
  nameButton,
  tab,
  placeholderFiltre,
  valueFilter,
  activeFilterText,
}: PropsHeaderFiltre) => (
  <div className={styles.headerProperty}>
    <form>
      <div className={styles.headerPropertyLeft}>
        <div className={styles.headerPropertyLeftSearch}>
          <IconFilter
            fill="#94969A"
            className={styles.headerPropertyLeftIconFilter}
          />
          <input
            type="text"
            name="name"
            id="KeywordsFilters"
            placeholder={placeholderFiltre}
            value={valueFilter}
            onChange={(e) => {
              activeFilterText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.headerPropertyRight}>
        <button className={styles.headerPropertyRightButton} type="button">
          <IconPlus
            className={styles.headerPropertyRightButtonIcon}
            width={12}
            height={12}
            fill="white"
          />
          {nameButton}
        </button>
        {tab === "related" && (
          <select name="actions" id="filtre">
            <option value="action">Action</option>
            <option value="">Etiquette (A-Z)</option>
          </select>
        )}
      </div>
    </form>
  </div>
);

export default ComponentHeaderFiltre;
