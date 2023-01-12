import React, { useState } from "react";
import Moment from "react-moment";

import IconSearch from "../../../assets/images/icons/IconSearch";
import IconCalendar from "../../../assets/images/icons/IconCalendar";
import IconFilter from "../../../assets/images/icons/IconFilter";

import styles from "./searchExplorer.scss";

const SearchExplorer = ({
  handleIsOpenFilter,
}: {
  handleIsOpenFilter?: () => void;
}) => {
  const [value, setValue] = useState("");
  const [startDate] = useState<Date | null>(null);
  const [endDate] = useState<Date | null>(null);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <div className={styles.searchExplorer}>
      <div className={styles.search}>
        <div className={styles.iconSearch}>
          <IconSearch />
        </div>
        <input
          placeholder="Rechercher"
          value={value}
          onChange={handleValueChange}
          className={styles.inputSearch}
        />
        <div className={styles.dateTimePicker}>
          <div className={styles.flexAlign}>
            <div className={styles.iconCalendar}>
              <IconCalendar fill="#D2D3D4" width={20} height={20} />
            </div>
            <div className={styles.contentDate}>
              <p className={styles.titleDate}>Date de début</p>
              <p>
                {startDate ? (
                  <Moment format="DD/MM/YYYY">{startDate}</Moment>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>
          <div className={styles.flexAlign}>
            <div className={styles.iconCalendar}>
              <IconCalendar fill="#D2D3D4" width={20} height={20} />
            </div>
            <div className={styles.contentDate}>
              <p className={styles.titleDate}>Date de fin</p>
              <p className={styles.date}>
                {endDate ? <Moment format="DD/MM/YYYY">{endDate}</Moment> : "-"}
              </p>
            </div>
          </div>
        </div>
        <button type="button" className={styles.buttonSearch}>
          <IconSearch width={15} height={15} fill="#FFF" />
        </button>
      </div>
      <div className={styles.filterExplorer}>
        <IconFilter width={24} height={24} fill="#0081FF" />
        <button
          className={styles.filter}
          type="button"
          onClick={handleIsOpenFilter}
        >
          Filtres
        </button>
      </div>
    </div>
  );
};

export default SearchExplorer;
