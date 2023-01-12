import React, { useEffect, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";
import { toast } from "react-toastify";

import {
  EntityDto,
  RelatedSummary,
} from "../../../../../API/DataModels/Database/NovaObject";
import ApiFactory from "../../../../../API/controllers/api-factory";
import ListsApi from "../../../../../API/controllers/lists-api";

import Button from "../../../../../components/Buttons/Button/Button";
import Modal from "../../../../../components/Modal/Modal";
import InputSearch from "../../../../../components/Search/Search";
import filterOriginList from "../../../../../components/Lists/utils";
import CreateNewListModalBody from "../../../../../components/Modal/components/ModalLists/Components/CreateList/CreateList";

import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  addIdsToListById,
  createList,
  selectLists,
  setOriginalLists,
} from "../../../../../store/lists";
import { useGlobalModalContext } from "../../../../../hooks/useGlobalModal";

import IconList from "../../../../../assets/images/icons/IconList2";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./addToListModal.scss";
import { getIdProperty } from "../../../../../constants/entity-related";
import { selectOntologyConfig } from "../../../../../store/ontology";

const Tabs = ({
  handleSelectTab,
  tabState,
}: {
  handleSelectTab: (id: number) => void;
  tabState: number;
}) => {
  const listTabs = [
    "Ajouter à une liste existante",
    "Créer une nouvelle liste",
  ];
  return (
    <div className={styles.tabs}>
      {listTabs.map((tab, index) => (
        <div
          onClick={() => handleSelectTab(index + 1)}
          className={cx(styles.tab, {
            [styles.tab__active]: index + 1 === tabState,
          })}
          key={tab}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

const AvailableLists = ({
  handleSelectListbyId,
  selectList,
}: {
  handleSelectListbyId: (id: number) => void;
  selectList: string | null;
}) => {
  const dispatch = useAppDispatch();
  const listState = useAppSelector(selectLists);
  const [valueFilter, setValueFilter] = useState("");
  const [filterLists, setFilterLists] = useState<Array<any>>([]);

  const handleValueFilter = (value: string) => {
    setValueFilter(value);
    setFilterLists(filterOriginList(listState.originalLists, value));
  };

  const init = async () => {
    const apiClient = ApiFactory.create<ListsApi>("ListsApi");
    const res = await apiClient.allLists();
    return res;
  };

  useEffect(() => {
    if (!listState.originalLists.length) {
      init()
        .then((res) => {
          setFilterLists(res);
          dispatch(setOriginalLists(res));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setFilterLists(listState.originalLists);
    }
  }, []);

  return (
    <div>
      <div className={styles.intro}>
        Choisir une liste pour ajouter le ou les objets sélectionné(s):
      </div>
      <InputSearch
        value={valueFilter}
        placeholder="Rechercher une liste"
        // @ts-ignore
        onChange={(e) => handleValueFilter(e.target.value)}
      />
      <div
        className={cx(styles.cards, commons.PrettyScroll, {
          [styles.noContentList]: listState.originalLists.length === 0,
        })}
      >
        {filterLists && filterLists.length > 0 ? (
          filterLists.map((element) => (
            <div
              className={cx(styles.card, {
                [styles.card__active]: selectList === element.id,
              })}
              key={element.id}
              onClick={() => handleSelectListbyId(element.id)}
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
  );
};

const AddToListModal = ({
  entities,
}: {
  entities: EntityDto[] | RelatedSummary[];
}) => {
  const dispatch = useAppDispatch();
  const { hideModal } = useGlobalModalContext();
  const [tab, setTab] = useState(1);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const { ont } = useAppSelector(selectOntologyConfig);

  const handleSelectTab = (id: number) => {
    setTab(id);
  };

  const handleSubmit = () => {
    if (!entities.length) toast.error("Auncuns objets sélectionnés.");
    // @ts-ignore
    const newEntityIds = entities.reduce((acc, e) => {
      const idProp = getIdProperty(e, ont);

      if (e[idProp]) acc.push({ id: e.id, idProp });
      return acc;
    }, []);

    if (tab === 1 && selectedListId) {
      dispatch(
        addIdsToListById({
          listId: selectedListId,
          newEntityIds,
        })
      );
      hideModal();
    } else if (tab === 2 && newListName) {
      dispatch(
        createList({
          label: newListName,
          listsId: newEntityIds,
          case: "Vallée de la peur",
        })
      );
      toast.success("Votre liste à bien été créé");
      hideModal();
    }
  };

  const handleSelectListbyId = (idList: string) => {
    setSelectedListId(idList);
  };

  return (
    <Modal
      isOpen
      icon={<IconList fill="#fff" width={18} heigth={18} />}
      title="Mes listes"
      hasOverlay={false}
      className={styles.modalteste}
      onClose={hideModal}
      footerClassName={styles.footerModal}
      footer={
        <>
          <Button
            onClick={hideModal}
            type="secondary"
            className={styles.boutonFooter}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            type="tertiary"
            className={styles.boutonFooter}
          >
            {tab === 1 ? "Enregistrer" : "Créer la liste et enregistrer"}
          </Button>
        </>
      }
    >
      <div className={styles.modalContent}>
        <Tabs handleSelectTab={handleSelectTab} tabState={tab} />
        {tab === 1 ? (
          <AvailableLists
            selectList={selectedListId}
            // @ts-ignore
            handleSelectListbyId={handleSelectListbyId}
          />
        ) : (
          <CreateNewListModalBody
            inputValue={newListName}
            setInputValue={setNewListName}
          />
        )}
      </div>
    </Modal>
  );
};

export default AddToListModal;
// function ont(e: any, ont: any) {
//   throw new Error("Function not implemented.");
// }
