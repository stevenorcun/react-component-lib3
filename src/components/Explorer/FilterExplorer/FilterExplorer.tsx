/* eslint-disable max-len */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import cx from "classnames";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sortFilterEntities, selectExplorer } from "@/store/explorer";

import Input from "@/components/Inputs/General/General";

import IconFilter from "@/assets/images/icons/IconFilter";
import IconClose from "@/assets/images/icons/IconCross";
import IconArrow from "@/assets/images/icons/IconArrowDown";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./filterExplorer.scss";

const DropdownInput = ({
  lists,
  handleSelectElement,
  category,
}: {
  lists: Array<string>;
  handleSelectElement: (label: string, value: string) => void;
  category: string;
}) => (
  <div className={cx(styles.dropDownInput, commons.PrettyScroll)}>
    {lists.map((element) => (
      <button
        key={element}
        type="button"
        className={styles.dropDownInput__element}
        onClick={() => handleSelectElement(category, element)}
      >
        {element}
      </button>
    ))}
  </div>
);

interface ListLabelProps {
  label: string;
  isOpen: boolean;
  value: string;
  list: Array<string>;
}

const ContainerFilter = ({
  listLabel,
  handleClickProperty,
  handleSelectElement,
}: {
  listLabel: Array<ListLabelProps>;
  handleClickProperty: (label: string) => void;
  handleSelectElement: (label: string, value: string) => void;
}) => (
  <div className={styles.containerFilter}>
    <div className={styles.containerFilter__head}>
      <p className={styles.title}>Filtrer par</p>
      <button type="button">
        <IconClose />
      </button>
    </div>
    <div className={styles.contentInput}>
      {listLabel.map((element) => (
        <div key={element.label} style={{ position: "relative" }}>
          <Input
            onClick={() => handleClickProperty(element.label)}
            iconArrow={<IconArrow />}
            readOnly={element.label !== "Valeur"}
            value={element.value}
            label={element.label}
            placeholder={element.label}
            className={styles.input}
          />
          {element.isOpen && (
            <DropdownInput
              lists={element.list}
              handleSelectElement={handleSelectElement}
              category={element.label}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const FilterExplorer = ({
  handleIsOpenFilter,
  explorer,
}: {
  handleIsOpenFilter: () => void;
  explorer: any;
}) => {
  const explorerState = useAppSelector(selectExplorer);
  const dispatch = useAppDispatch();
  const [listLabel, setListLabel] = useState<Array<ListLabelProps>>([
    {
      label: "Propriété",
      isOpen: false,
      value: "",
      list: [],
    },
    {
      label: "Opérateur",
      isOpen: false,
      value: "",
      list: ["égal à"],
    },
    {
      label: "Valeur",
      isOpen: false,
      value: "",
      list: [],
    },
  ]);

  const handleClickProperty = (label: string) => {
    const result = listLabel.map((el: ListLabelProps) => {
      if (el.label === label) {
        return {
          ...el,
          isOpen: !el.isOpen,
        };
      }
      return el;
    });
    setListLabel(result);
  };

  const handleSelectElement = (label: string, value: string) => {
    const result = listLabel.map((element) => {
      if (label === element.label) {
        return {
          ...element,
          value,
          isOpen: false,
        };
      }
      return element;
    });
    setListLabel(result);
  };

  const handleFilter = () => {
    const verifyValues = listLabel.find((el) => el.value === "");
    if (verifyValues) {
      toast.error("Veuillez remplir tous les champs");
    }

    const copyData = [...explorer.data];
    const result = copyData.filter(
      (element) =>
        element?.[listLabel[0].value]?.toString() ===
        listLabel[2]?.value?.toString()
    );

    dispatch(
      sortFilterEntities({
        id: explorerState.activeExlorerTabIndex + 1,
        // properties: explorerState.tabs[0].properties,
        properties: listLabel[0].list,
        data: result,
        tab: "Tableau",
        type: `Filtre par ${listLabel[0].value}`,
        icon: <IconFilter />,
      })
    );
    handleIsOpenFilter();
  };

  useEffect(() => {
    const listHeadProperties = [...explorer.properties];
    const result = listLabel.map((el) => {
      if (el.label === "Propriété") {
        return {
          ...el,
          list: listHeadProperties,
        };
      }
      return el;
    });
    setListLabel(result);
  }, []);

  // useEffect(() => {
  //   if (listLabel[0].value) {
  //     const indexProperty = explorer.properties.findIndex(
  //       (el: string) => el === listLabel[0].value,
  //     );
  //     const result = explorer.data.reduce((acc, curr) => {
  //       if (curr[indexProperty]) {
  //         acc[curr[indexProperty]] = true;
  //       }
  //       return acc;
  //     }, {});
  //     dispatch(setlistDataByProperty({
  //       key: explorer.properties[indexProperty],
  //       data: Object.keys(result).map((el: string) => el),
  //     }));
  //   }
  // }, [listLabel[0].value]);

  useEffect(() => {
    if (listLabel[0].value) {
      const result = listLabel.map((el) => {
        if (el.label === "Valeur") {
          return {
            ...el,
            list: [
              ...new Set(
                explorerState.tabs[
                  explorerState.activeExlorerTabIndex
                ].data.reduce((acc: Array<string>, el) => {
                  if (el[listLabel[0].value]) {
                    acc.push(el[listLabel[0].value]);
                  }
                  return acc;
                }, [])
              ),
            ].flat(),
            value: "",
          };
        }
        return el;
      });
      // @ts-ignore
      setListLabel(result);
    }
  }, [listLabel[0].value]);

  return (
    <div className={styles.filterExplorer}>
      <div className={styles.head}>
        <div className={styles.head__left}>
          <IconFilter width={18} height={18} />
          <p className={styles.head__title}>Filtres</p>
        </div>
        <button type="button" onClick={handleIsOpenFilter}>
          <IconClose />
        </button>
      </div>
      <div>
        <ContainerFilter
          // @ts-ignore
          setListLabel={setListLabel}
          listLabel={listLabel}
          handleClickProperty={handleClickProperty}
          handleSelectElement={handleSelectElement}
        />
      </div>
      {/* <div>
        <p className={styles.addCritere}>+ Ajouter un critère</p>
      </div> */}
      <button
        type="button"
        onClick={handleFilter}
        className={styles.buttonFilter}
      >
        Appliquer
      </button>
    </div>
  );
};

export default FilterExplorer;
