import React, { useEffect, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";

import {
  selectLists,
  setOriginalLists,
  setSelectOneList,
  setValueFilter,
} from "@/store/lists";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { iconArrow } from "@/utils/general";
import Search from "@/components/Search/Search";
import ModalTypes from "@/constants/modal";

import IconCase from "@/assets/images/icons/IconCase";
import IconFavorite from "@/assets/images/icons/IconStar";
import IconPlus from "@/assets/images/icons/IconPlus";
import IconDelete from "@/assets/images/icons/IconRemove";

import styles from "./layoutList.scss";
import { filterSortLists } from "../utils";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import { selectCase } from "@/store/case";

interface ListProps {
  id: string;
  createdAt: number;
  updatedAt: number;
  value: {
    label: string;
    favorite: boolean;
    case: string;
    status: boolean;
  };
}

const Header = ({
  title,
  categoryArrow,
  isOpenCategory,
  onChangeArrow,
  isCurrentCase,
  currentCase,
}: {
  title: string;
  categoryArrow: string;
  isOpenCategory: {
    currentCase: boolean;
    caseClosed: boolean;
  };
  onChangeArrow: (category: string) => void;
  isCurrentCase: boolean;
  currentCase: string;
}) => (
  <div className={styles.headerComponent}>
    <div className={styles.headerComponent__left}>
      <IconCase className={styles.iconCase} />
      <div>
        <p className={styles.title}>{title}</p>
        {isCurrentCase && <p className={styles.currentCase}>{currentCase}</p>}
      </div>
    </div>

    <button type="button" onClick={() => onChangeArrow(categoryArrow)}>
      {iconArrow(isOpenCategory[categoryArrow])}
    </button>
  </div>
);

const Card = ({
  id,
  label,
  date,
  selectedList,
  nova_case,
  handleSelectedList,
  list,
  handleFavorite,
  handleRemoveList,
}: {
  id: string;
  label: string;
  date: number;
  nova_case: string;
  selectedList: ListProps;
  list: ListProps;
  handleSelectedList: (element: ListProps) => void;
  handleFavorite: (e: React.MouseEvent, id: number | string) => void;
  handleRemoveList: (
    e: React.MouseEvent,
    id: number | string,
    label: string
  ) => void;
}) => {
  const handleSelect = () => {
    handleSelectedList(list);
  };
  return (
    <div
      key={id}
      className={cx(styles.card, {
        [styles.card__selected]: id === selectedList?.id,
      })}
      onClick={handleSelect}
    >
      <button type="button" onClick={(e) => handleFavorite(e, id)}>
        <IconFavorite
          fill={list.value.favorite ? "#3083F7" : "#fff"}
          stroke="#3083F7"
        />
      </button>
      <div className={styles.contentRight}>
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.time}>{nova_case}</div>
          <div className={styles.time}>
            <Moment format="DD/MM/YYYY à hh:mm">{date}</Moment>
          </div>
        </div>
        <button type="button" onClick={(e) => handleRemoveList(e, id, label)}>
          <IconDelete width={16} height={18} fill="#D2D3D4" />
        </button>
      </div>
    </div>
  );
};

const LayoutList = () => {
  const listsState = useAppSelector(selectLists);
  const caseCurrentState = useAppSelector(selectCase);
  const dispatch = useAppDispatch();
  const { showModal } = useGlobalModalContext();

  const [isOpenCategory, setIsOpenCategory] = useState({
    currentCase: true,
    otherCase: true,
  });
  const [filterListSort, setFilterListSort] = useState({});
  const titles = ["Affaire en cours :", "Autres affaires"];

  const filterSearch = (e: React.BaseSyntheticEvent) => {
    dispatch(setValueFilter(e.target.value));
  };

  const onChangeArrow = (category: string) => {
    setIsOpenCategory({
      ...isOpenCategory,
      [category]: !isOpenCategory[category],
    });
  };

  const handleSelectedList = (element: ListProps) => {
    dispatch(setSelectOneList(element));
  };

  const handleFavorite = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const result = listsState.originalListsFilter.reduce((acc, curr) => {
      if (curr.id === id) {
        acc.push({
          ...curr,
          value: {
            ...curr.value,
            favorite: !curr.value.favorite,
          },
        });
      } else {
        acc.push({
          ...curr,
        });
      }
      return acc;
    }, []);
    dispatch(setOriginalLists(result));
  };

  const handleCreateList = () => {
    showModal(ModalTypes.LISTS_CREATE_LIST);
  };

  const handleRemoveList = (e: React.MouseEvent, id: number, label: string) => {
    e.stopPropagation();
    showModal(ModalTypes.LISTS_REMOVE_LIST, { id, label });
  };

  useEffect(() => {
    setFilterListSort(
      filterSortLists(
        listsState.originalListsFilter,
        caseCurrentState.currentCase?.label
      )
    );
  }, [listsState.originalListsFilter]);

  return (
    <div className={styles.layoutList}>
      <div>
        <div className={styles.header}>
          <div className={styles.headerListTitle}>Mes Listes</div>
          <div className={styles.contentSearch}>
            <Search
              placeholder="Rechercher une liste..."
              // @ts-ignore
              colorIcon="#D2D3D4"
              value={listsState.valueFilter}
              onChange={filterSearch}
            />
          </div>
          <div>
            <p className={styles.result}>
              <span>{listsState.originalListsFilter.length}</span>
              résultat(s)
            </p>
          </div>
        </div>
        {Object.entries(filterListSort).map((element, index) => (
          <div key={element[0]}>
            <Header
              title={titles[index]}
              categoryArrow={element[0]}
              // @ts-ignore
              isOpenCategory={isOpenCategory}
              onChangeArrow={onChangeArrow}
              isCurrentCase={element[0] === "currentCase"}
              currentCase={caseCurrentState.currentCase?.label}
            />
            {isOpenCategory[element[0]] &&
              // @ts-ignore
              element[1].map((el) => (
                <Card
                  id={el.id}
                  key={el.id}
                  label={el.value.label}
                  date={el.updatedAt}
                  nova_case={el.value.case}
                  selectedList={listsState.selectOneList}
                  handleSelectedList={handleSelectedList}
                  list={el}
                  handleFavorite={handleFavorite}
                  handleRemoveList={handleRemoveList}
                />
              ))}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.buttonCreateList}
          onClick={() => handleCreateList()}
        >
          <IconPlus width={14} height={14} fill="white" />
          <p className={styles.textButton}>Créer une liste</p>
        </button>
      </div>
    </div>
  );
};

export default LayoutList;
