import React, { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../../../components/Modal/Modal";
import Button from "../../../../../components/Buttons/Button/Button";
import CreateListComponent from "../Components/CreateList/CreateList";
import { useGlobalModalContext } from "../../../../../hooks/useGlobalModal";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { createList } from "../../../../../store/lists";

import IconList from "../../../../../assets/images/icons/IconList";

import styles from "./createListModal.scss";
import { selectCase } from "../../../../../store/case";

const CreateList = () => {
  const { hideModal } = useGlobalModalContext();
  const [newListName, setNewListName] = useState("");
  const caseState = useAppSelector(selectCase);
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    if (!newListName) {
      toast.error("Veuillez rentrer un nom pour la liste.");
    } else {
      dispatch(
        createList({
          label: newListName,
          case: caseState.currentCase.label,
        })
      );
      toast.success("Votre liste à bien été créé");
      hideModal();
    }
  };

  const handleChangeValue = (e) => {
    setNewListName(e);
  };
  return (
    <Modal
      isOpen
      icon={<IconList fill="#fff" width={18} heigth={18} />}
      title="Créer une listeii"
      hasOverlay={false}
      className={styles.createList}
      onClose={hideModal}
      footerClassName={styles.footerModal}
      footer={
        <>
          <Button
            onClick={handleSubmit}
            type="secondary"
            className={styles.boutonFooter}
          >
            Créer la liste
          </Button>
        </>
      }
    >
      <CreateListComponent
        inputValue={newListName}
        setInputValue={handleChangeValue}
      />
    </Modal>
  );
};

export default CreateList;
