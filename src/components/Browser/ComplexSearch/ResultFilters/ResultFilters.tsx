import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { setActiveTabSearchFilters } from "@/store/browser";
import { useAppDispatch } from "@/store/hooks";

import { ONTOLOGY_TYPES_GROUPS } from "@/constants/entity-related";
import { SearchResultTypeFiler } from "@/constants/browser-related";
import Checkbox from "@/lib/Form/Checkbox/Checkbox";
import styles from "./ResultFilter.scss";

const ResultFilters = ({ filters }: { filters: SearchResultTypeFiler[] }) => {
  const dispatch = useAppDispatch();
  const handleCheckboxChange = (groupKey, key, checked) => {
    const newFilters = {
      ...filters,
      [groupKey]: {
        ...filters[groupKey],
        [key]: {
          ...filters[groupKey][key],
          checked,
        },
      },
    };

    dispatch(setActiveTabSearchFilters(newFilters));
  };

  const handleGroupCheckboxChange = (groupKey, checked) => {
    const groupTypes = filters[groupKey];

    const newGroupTypes = Object.keys(groupTypes)
      .filter((k) => typeof groupTypes[k] === "object")
      .reduce((acc, curr) => {
        acc[curr] = {
          ...groupTypes[curr],
          checked,
        };
        return acc;
      }, {});

    const newFilters = {
      ...filters,
      [groupKey]: {
        ...newGroupTypes,
        checked,
      },
    };

    dispatch(setActiveTabSearchFilters(newFilters));
  };

  return (
    <>
      <div className={styles.ResultTypeFilters__Header}>Tous les résultats</div>

      <div className={styles.ResultTypeFilters_Wrapper}>
        {Object.keys(filters).map((gKey, gIndex) => {
          const group = filters[gKey];
          return (
            <>
              <div
                key={gIndex}
                className={cx(
                  commons.Flex,
                  styles.ResultTypeFilters__Filter_Group_Label
                )}
              >
                <div
                  className={cx(commons.Flex, styles.ResultTypeFilters__Filter)}
                >
                  <Checkbox
                    className={styles.ResultTypeFilters__Filters_Checkbox}
                    key={group}
                    value={group}
                    label={ONTOLOGY_TYPES_GROUPS[gKey]}
                    checked={group.checked}
                    onChange={() =>
                      handleGroupCheckboxChange(gKey, !group.checked)
                    }
                  />
                  <span
                    className={styles.ResultTypeFilters__Filters_FilterCount}
                  >
                    {group.total}
                  </span>
                </div>
              </div>

              {Object.keys(group)
                .filter((k) => typeof group[k] === "object")
                .map((typeKey, itemIndex) => {
                  const item = group[typeKey];
                  return (
                    <>
                      <div className={styles.ResultTypeFilters__Filter_Group}>
                        <div
                          key={`${gIndex}_${itemIndex}`}
                          className={commons.Flex}
                        >
                          <Checkbox
                            className={
                              styles.ResultTypeFilters__Filters_Checkbox
                            }
                            value={typeKey}
                            label={item.label}
                            icon={item.icon}
                            checked={item.checked}
                            onChange={() =>
                              handleCheckboxChange(gKey, typeKey, !item.checked)
                            }
                          />
                          <span
                            className={
                              styles.ResultTypeFilters__Filters_FilterCount
                            }
                          >
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
            </>
          );
        })}
      </div>
    </>
  );
};

export default ResultFilters;
