import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import cx from "classnames";

import { APP_ROUTES } from "../../../../../constants/routes";
import ApiFactory from "../../../../../API/controllers/api-factory";
import ListsApi from "../../../../../API/controllers/lists-api";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";

import {
  selectLists,
  setAllOriginalLists,
  setOriginalListsFilter,
  setSelectOneList,
  setValueFilter,
} from "../../../../../store/lists";

import Modal from "../../../../../components/Modal/Modal";
import Button from "../../../../../components/Buttons/Button/Button";
import InputSearch from "../../../../../components/Search/Search";

import IconList from "../../../../../assets/images/icons/IconList2";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./modalList.scss";

const ModalLists = ({
  openModalList,
  onClose,
}: {
  openModalList: () => void;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const listState = useAppSelector(selectLists);

  const init = async () => {
    const apiClient = ApiFactory.create<ListsApi>("ListsApi");
    const res = await apiClient.allLists();
    return res;
  };
  useEffect(() => {
    if (!listState.originalLists.length) {
      init()
        .then((res) => {
          dispatch(setAllOriginalLists(res));
          dispatch(setOriginalListsFilter(res));
        })
        .catch((err) => {
          console.error(err);
        });
    }
    dispatch(setOriginalListsFilter(listState.originalLists));
  }, []);

  const navigate = useNavigate();
  const navigateTo = (screen: string) => {
    navigate(screen);
  };

  const handleClickLists = () => {
    navigateTo(APP_ROUTES.list.path);
    openModalList();
  };

  const filterText = (e) => {
    dispatch(setValueFilter(e.target.value));
  };

  const handleSelectedList = (element) => {
    dispatch(setSelectOneList(element));
    navigateTo(APP_ROUTES.list.path);
    openModalList();
  };

  return (
    <Modal
      isOpen
      icon={<IconList fill="#fff" width={18} heigth={18} />}
      title="Mes listes"
      hasOverlay={false}
      className={styles.modalteste}
      footerClassName={styles.footerModal}
      footer={
        <>
          <Button
            onClick={handleClickLists}
            type="tertiary"
            className={styles.boutonAllLists}
          >
            Voir toutes les listes
          </Button>
        </>
      }
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        <InputSearch
          value={listState.valueFilter}
          placeholder="Rechercher une liste"
          onChange={filterText}
        />
        <div
          className={cx(styles.cards, commons.PrettyScroll, {
            [styles.noContentList]: listState.originalLists.length === 0,
          })}
        >
          {listState.originalListsFilter &&
          listState.originalListsFilter.length > 0 ? (
            listState.originalListsFilter.map((element) => (
              <div
                className={styles.card}
                key={element.id}
                onClick={() => handleSelectedList(element)}
              >
                <div className={styles.iconList}>
                  <IconList />
                </div>
                <div>
                  <div className={styles.label}>{element.value.label}</div>
                  <Moment format="DD/MM/YYYY à hh:mm" className={styles.time}>
                    {element.value.time}
                  </Moment>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noList}>Pas de listes à afficher</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalLists;
