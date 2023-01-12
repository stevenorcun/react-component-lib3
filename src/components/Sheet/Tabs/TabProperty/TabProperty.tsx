/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import cx from "classnames";

import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import {
  ENTITY_GENDER_DETAILS,
  getEntityPropLabel,
} from "../../../../constants/entity-related";
import {
  sortAlphabeticallyAsc,
  sortAlphabeticallyDesc,
  sortAsc,
  sortDesc,
} from "../../../../utils/general";
import FiltreProperty from "../../../../pages/Entity/ComponentsEntityDetail/ComponentHeaderFiltre/ComponentHeaderFiltre";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";
import GeneralProperty from "./ComponentBodyProperty";

import styles from "./styles.scss";

import HeaderArray from "./ComponentHeaderArray/HeaderArrayProperty";

const TabProperty = ({ entity }: EntityDto) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const [properties, setProperties] = useState({});
  const [initialProperties, setInitialProperties] = useState({});
  const [isSort, setIsSort] = useState({});
  const [isOpen] = useState(true);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [valueFilter, setValueFilter] = useState("");

  const listHeaderArray = [
    "label",
    // 'description',
    "confidenceValue",
    "timestamp",
    "geocoding",
    "tags",
  ];
  useEffect(() => {
    if (entity.__properties) {
      const dataProperty = entity.__properties.values.reduce((acc, curr) => {
        acc[curr.key] =
          curr.key === "addresses"
            ? curr.value.map((el) => ({
                ...el.value,
                // description: '',
                timestamp: Date.now(),
                geocoding: "",
                checked: false,
              }))
            : typeof curr.value !== "object"
            ? [
                {
                  label: curr.value,
                  confidenceValue: "",
                  timestamp: Date.now(),
                  geocoding: "",
                  checked: false,
                },
              ]
            : Array.isArray(curr.value)
            ? curr.value?.map((element) => {
                if (typeof element === "object") {
                  return {
                    ...element,
                    checked: false,
                  };
                }
                return {
                  label: element,
                  confidenceValue: null,
                  timestamp: null,
                  geocoding: null,
                  checked: false,
                };
              })
            : [{ ...curr.value, checked: false }];
        return acc;
      }, {});
      setProperties(dataProperty);
      setInitialProperties(dataProperty);
      const createIsSort = listHeaderArray.reduce((acc, curr) => {
        acc[curr] = false;
        return acc;
      }, {});
      setIsSort(createIsSort);
    }
  }, [entity]);

  const sortGlobal = (field: string, isAsc: boolean) => {
    const sortCallbackAsc =
      // @ts-ignore
      typeof initialProperties.AUTEUR[0][field] === "number"
        ? sortAsc(field)
        : sortAlphabeticallyAsc(field);

    const sortCallbackDesc =
      // @ts-ignore
      typeof initialProperties.AUTEUR[0][field] === "number"
        ? sortDesc(field)
        : sortAlphabeticallyDesc(field);

    const newDataProperty = Object.keys(properties).reduce((acc, curr) => {
      acc[curr] = properties[curr]
        .slice()
        .sort(isAsc ? sortCallbackAsc : sortCallbackDesc);
      return acc;
    }, {});

    setProperties(newDataProperty);
  };

  const sortFn = (field: string) => {
    const newIsSort = Object.keys(isSort).reduce((acc, curr) => {
      acc[curr] = field === curr ? !isSort[field] : false;
      return acc;
    }, {});

    if (isSort.hasOwnProperty(field)) {
      setIsSort(newIsSort);
      return sortGlobal(field, isSort[field]);
    }
  };

  const filterText = (arr, request: string) => {
    setValueFilter(request);
    let newObj = properties;
    if (!request) {
      return setProperties(initialProperties);
    }
    Object.entries(initialProperties).forEach((element: any) => {
      const category = element[0];
      const filteredElements = element[1].filter((el) => {
        const label =
          element[0] === "sex"
            ? ENTITY_GENDER_DETAILS[el.label].label
            : el.label;
        return (
          label.toString().toLowerCase().indexOf(request.toLowerCase()) !== -1
        );
      });
      newObj = {
        ...newObj,
        [category]: filteredElements,
      };
      setProperties(newObj);
    });
  };

  const checkedByCategory = () => {
    setIsAllChecked(!isAllChecked);
    const isChecked = !isAllChecked;
    const allChecked = Object.entries(properties).reduce((acc, curr) => {
      if (curr[1]) {
        // @ts-ignore
        acc[curr[0]] = curr[1].map((el) => ({
          ...el,
          checked: isChecked,
        }));
      }
      return acc;
    }, {});
    setProperties(allChecked);
  };

  const oneChecked = (category: string, index: number, isChecked: boolean) => {
    const checkedChange = properties[category].map((element, indexMap) => {
      if (Number(index) === Number(indexMap)) {
        return { ...element, checked: !isChecked };
      }
      return element;
    });
    setProperties({
      ...properties,
      [category]: checkedChange,
    });
  };

  const activeFilterText = (v: string) => {
    filterText(properties, v);
  };

  return (
    <div className={cx(styles.property, commons.PrettyScroll)}>
      {entity && (
        <>
          <FiltreProperty
            nameButton="Ajouter une propriété"
            tab="property"
            placeholderFiltre="Mots-clés Filtres"
            valueFilter={valueFilter}
            activeFilterText={activeFilterText}
          />
          <div>
            {/* <HeaderProperty
              title="Général"
              iconName={<iconMail />}
              isOpen={isOpen}
              setIsOpen={openCategory}
            /> */}
            <div
              className={cx({ [styles.generalPropertyMain__open]: !isOpen })}
            >
              <HeaderArray
                setIsAllChecked={setIsAllChecked}
                checkedByCategory={checkedByCategory}
                isAllChecked={isAllChecked}
                sortFn={sortFn}
                isSort={isSort}
              />
              <div className={cx(styles.generalPropertyMain)}>
                <div className={styles.generalPropertyMainContent}>
                  {Object.entries(properties).map(
                    (element: any, index: number) =>
                      element[0] &&
                      element[1].length > 0 && (
                        <div
                          key={index}
                          className={
                            styles.generalPropertyMainContentTitleColomn
                          }
                        >
                          <div style={{ width: "20%" }}>
                            <span
                              className={cx(
                                styles.generalPropertyMainContentFirst,
                                styles.generalPropertyMainContentFirst__subtitle
                              )}
                            >
                              <span>
                                {getEntityPropLabel(
                                  entity._DATATYPE || entity.type,
                                  element[0],
                                  ont
                                )}
                              </span>
                            </span>
                          </div>
                          <div style={{ width: "78%" }}>
                            {element[1].map(
                              (elContent: any, indexou: number) => (
                                <GeneralProperty
                                  key={indexou}
                                  data={elContent}
                                  category={element[0]}
                                  index={indexou}
                                  oneChecked={oneChecked}
                                  isChecked={elContent.checked}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabProperty;
