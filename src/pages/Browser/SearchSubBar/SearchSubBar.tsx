/**
 * OLD Browser, TODO delete
 */
import React, { useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconFilter from "@/assets/images/icons/IconFilter";
import IconCross from "@/assets/images/icons/IconCross";
import IconBell from "@/assets/images/icons/IconBell";
import IconSave from "@/assets/images/icons/IconSave";
import Select from "@/components/Form/Select/Select";
import styles from "./styles.scss";

const SearchSubBar = () => {
  const [filtersOpened, setFiltersOpened] = useState(false);

  return (
    <div className={styles.subBar}>
      {!filtersOpened ? (
        <>
          <button
            type="button"
            className={cx(commons.clickable, styles.buttonFilters)}
            onClick={() => setFiltersOpened(!filtersOpened)}
          >
            <IconFilter style={{ fill: "#0081FF" }} />
            Filtres
          </button>
          <div className={styles.tagsContainer}>
            <div className={cx(styles.tag, commons.clickable)}>
              Balney <IconCross />
            </div>
            <div className={cx(styles.tag, commons.clickable)}>
              Entreprises <IconCross />
            </div>
            <div className={cx(styles.tag, commons.clickable)}>
              Panama <IconCross />
            </div>
          </div>
          <div className={styles.searchSettings}>
            <div className={cx(styles.setting, commons.clickable)}>
              <IconBell fill="#3083F7" /> Sauvegarder la recherche
            </div>
            <div className={cx(styles.setting, commons.clickable)}>
              Voir les recherches enregistrées
            </div>
          </div>
        </>
      ) : (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersHeader}>
            <IconFilter style={{ fill: "#0081FF" }} />
            Filtres
            <div className={styles.tagsHeader}>
              <div className={cx(styles.tag, commons.clickable)}>
                Balney <IconCross />
              </div>
              <div className={cx(styles.tag, commons.clickable)}>
                Entreprises <IconCross />
              </div>
              <div className={cx(styles.tag, commons.clickable)}>
                Panama <IconCross />
              </div>
            </div>
            <div className={styles.rightHeader}>
              <button
                type="button"
                className={cx(commons.clickable)}
                // onClick={() => setFiltersOpened(!filtersOpened)}
              >
                <IconSave style={{ fill: "white" }} /> Enregistrer le filtre
              </button>
              <div
                onClick={() => setFiltersOpened(!filtersOpened)}
                className={commons.clickable}
              >
                <IconCross style={{ fill: "#94969A" }} />
              </div>
            </div>
          </div>
          <div className={styles.filtersFields}>
            <div className={styles.field}>
              <label htmlFor="field">Field</label>
              {
                // @ts-ignore
                <Select
                  options={[
                    { value: "country", label: "Pays" },
                    { value: "city", label: "Ville" },
                    { value: "lastname", label: "Nom" },
                    { value: "firstname", label: "Prénom" },
                  ]}
                />
              }
            </div>
            <div className={styles.field}>
              <label htmlFor="field">Operator</label>
              {
                // @ts-ignore
                <Select
                  options={[
                    { value: "is", label: "is" },
                    { value: "is_not", label: "is not" },
                    { value: "is_one_of", label: "is one of" },
                    { value: "is_not_one_of", label: "is not one of" },
                    { value: "exists", label: "exists" },
                    { value: "does_not_exist", label: "does not exist" },
                  ]}
                />
              }
            </div>
            <div className={styles.field}>
              <label htmlFor="field">Value</label>
              <input type="text" name="value" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSubBar;
