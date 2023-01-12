/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import cx from "classnames";
import _ from "lodash";

import {
  getEntityTypeLabel,
  getEntityPropLabelForExplorer,
} from "../../../../../constants/entity-related";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { changeSelection, selectExplorer } from "../../../../../store/explorer";
import { selectOntologyConfig } from "../../../../../store/ontology";
import { isOpenCategory } from "../../../../../utils/general";

import HeaderSubtitleIcon from "../../../../../pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import FooterSelection from "../../../../../components/Explorer/PaletteExplorer/Components/FooterSelection/FooterSelection";

import IconArrow from "../../../../../assets/images/icons/IconArrowDown";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./histogramExplorer.scss";

const HeaderCards = ({
  handleIsOpenCategory,
  title,
  isOpen,
}: {
  handleIsOpenCategory: () => void;
  title: string;
  isOpen: boolean;
}) => (
  <div className={styles.componentTypesHeader}>
    {title}
    <button
      className={styles.iconArrow}
      type="button"
      onClick={handleIsOpenCategory}
    >
      {isOpenCategory(isOpen)}
    </button>
  </div>
);

const FilterHistogram = () => (
  <div className={styles.FilterHistogram}>
    <button type="button" className={styles.buttonFilter}>
      Trier par A-Z
      <span className={styles.iconButton}>
        <IconArrow />
      </span>
    </button>
    <button type="button" className={styles.buttonFilter}>
      Afficher 3 par défaut
      <span className={styles.iconButton}>
        <IconArrow />
      </span>
    </button>
  </div>
);
const Card = ({
  label,
  count,
  totalTypes,
  handleOverSelection,
  isSelected,
}: {
  label: string | undefined;
  count: number;
  totalTypes?: number;
  handleOverSelection: () => void;
  isSelected?: boolean;
}) => {
  const percent = totalTypes ? (count * 100) / totalTypes : 100;
  return (
    <div
      onClick={handleOverSelection}
      className={cx(styles.card, {
        [styles.cardSelected]: isSelected,
      })}
    >
      <p className={styles.cardLabel}>{label}</p>
      <div className={styles.attributeValue}>
        {count}
        <div className={styles.BarContainer}>
          <div className={styles.bar}>
            <div className={styles.loadBar} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const HistogramExplorer = () => {
  const explorerState = useAppSelector(selectExplorer);
  const dispatch = useAppDispatch();
  const { ont } = useAppSelector(selectOntologyConfig);
  const [groupedByTypesProperties, setGroupedByTypesProperties] = useState({
    types: {
      isOpen: true,
      values: {},
    },
    properties: {},
  });
  const [counterTypes, setCounterTypes] = useState(0);

  const handleUpdateCategory = () => {
    const entitiesSelected = [
      ...explorerState.tabs[explorerState.activeExlorerTabIndex]
        .entitiesSelected,
    ];
    let counter = 0;
    let allProperties = {};
    const result = entitiesSelected.reduce(
      (acc, curr) => {
        const type = curr._DATATYPE;
        const copyAcc = { ...acc };

        if (type) {
          copyAcc.types = {
            ...copyAcc.types,
            values: {
              ...copyAcc.types.values,
              [type]: {
                isSelected: false,
                count: copyAcc.types.values?.[type]?.count
                  ? Number(copyAcc.types.values[type].count) + 1
                  : 1,
              },
            },
          };
          const resultProperties = Object.entries(curr.properties).reduce(
            (accu, [key, value]: [key: string, value: string]) => {
              const copyAccu = { ...accu };
              const property = copyAccu[key];
              copyAccu[key] = {
                ...property,
                totalCount: property?.totalCount ? property.totalCount + 1 : 1,
                values: {
                  ...property?.values,
                  [value]: {
                    ...property?.values?.[value],
                    count: property?.values?.[value]?.count
                      ? property.values[value].count + 1
                      : 1,
                  },
                },
              };
              if (!property) {
                // @ts-ignore
                [property].isOpen = true;
                [property].values = {
                  ...property?.values,
                  [value]: {
                    isSelected: false,
                  },
                };
              }
              return copyAccu;
            },
            { ...allProperties }
          );

          allProperties = resultProperties;
          copyAcc.properties = {
            ...resultProperties,
          };
        }
        counter += 1;
        return copyAcc;
      },
      { types: { isOpen: true, values: {} }, properties: {} }
    );

    setGroupedByTypesProperties(result);
    setCounterTypes(counter);
  };

  useEffect(() => {
    handleUpdateCategory();
  }, [
    explorerState.tabs[explorerState.activeExlorerTabIndex].entitiesSelected,
  ]);

  const handleIsOpenCategory = (type: string, property?: string) => {
    const copyData = { ...groupedByTypesProperties };
    if (type === "types") {
      copyData.types.isOpen = !copyData.types.isOpen;
    }

    if (type === "properties" && property) {
      copyData.properties[property].isOpen =
        !copyData.properties[property].isOpen;
    }
    setGroupedByTypesProperties({ ...copyData });
  };

  const handleOverSelection = (
    category: string,
    key: string,
    title?: string
  ) => {
    const copyAllSelected = _.cloneDeep(
      explorerState.tabs[explorerState.activeExlorerTabIndex].entitiesSelected
    );
    const copyGroupedByTypesProperties = _.cloneDeep(groupedByTypesProperties);
    let overSelection = [];
    const copyAllObject = _.cloneDeep(
      explorerState.tabs[explorerState.activeExlorerTabIndex].data
    );

    if (category === "types") {
      copyGroupedByTypesProperties[category].values[key].isSelected =
        !copyGroupedByTypesProperties[category].values[key].isSelected;
      setGroupedByTypesProperties({ ...copyGroupedByTypesProperties });
      overSelection = copyAllSelected.filter(
        (element) => element._DATATYPE === key
      );
    }

    if (category === "properties") {
      copyGroupedByTypesProperties[category][title].values[key].isSelected =
        !copyGroupedByTypesProperties[category][title].values[key].isSelected;
      setGroupedByTypesProperties({ ...copyGroupedByTypesProperties });

      overSelection = copyAllSelected.filter(
        // @ts-ignore
        (element) => element.properties[title] === key
      );
    }

    overSelection.forEach((element) =>
      explorerState.tabs[explorerState.activeExlorerTabIndex].data.forEach(
        (el, index: number) => {
          // @ts-ignore
          if (element.id === el.id) {
            copyAllObject[index].isOverSelected =
              !copyAllObject[index].isOverSelected;
          }
        }
      )
    );
    dispatch(changeSelection(copyAllObject));
  };

  return (
    <div className={cx(styles.histogramExplorer, commons.PrettyScroll)}>
      <FilterHistogram />
      <HeaderSubtitleIcon title="Type d'objet" />
      <div className={styles.componentTypes}>
        <HeaderCards
          isOpen={groupedByTypesProperties.types.isOpen}
          handleIsOpenCategory={() => handleIsOpenCategory("types")}
          title="Types d'entités"
        />
        {groupedByTypesProperties.types.isOpen &&
          Object.keys(groupedByTypesProperties).length > 0 &&
          Object.entries(groupedByTypesProperties.types.values).map(
            ([key, value]: [
              key: string,
              value: { count: number; isSelected: boolean }
            ]) => (
              <Card
                label={getEntityTypeLabel(key, ont)}
                count={value.count}
                totalTypes={counterTypes}
                handleOverSelection={() => handleOverSelection("types", key)}
                isSelected={value.isSelected}
              />
            )
          )}
        {
          // @ts-ignore
          <Card label="Tous les objets" count={counterTypes} />
        }
      </div>
      <FooterSelection />
      <HeaderSubtitleIcon title="Propriétés des objets" />
      {Object.entries(groupedByTypesProperties.properties).map(
        ([title, listElement]: [
          title: string,
          listElement: { isOpen: boolean; totalCount: number; values: {} }
        ]) => (
          <>
            <div className={styles.componentTypes}>
              <HeaderCards
                isOpen={listElement.isOpen}
                handleIsOpenCategory={() =>
                  handleIsOpenCategory("properties", title)
                }
                // @ts-ignore
                title={getEntityPropLabelForExplorer(title, ont)}
              />
              {listElement.isOpen &&
                Object.entries(listElement.values).map(
                  ([label, element]: [
                    label: string,
                    element: { count: number; isSelected: boolean }
                  ]) => (
                    <Card
                      label={label}
                      count={element.count}
                      totalTypes={listElement.totalCount}
                      handleOverSelection={() =>
                        handleOverSelection("properties", label, title)
                      }
                      isSelected={element.isSelected}
                    />
                  )
                )}
            </div>
            <div className={commons.Divider} />
          </>
        )
      )}
    </div>
  );
};

export default HistogramExplorer;
