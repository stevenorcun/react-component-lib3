import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import cx from "classnames";

import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";

import Modal from "../../../../components/Modal/Modal";
import ContextMenu from "../../../../components/ContextMenu/DefaultContextMenu/ContextMenu";
import Autocomplete from "../../../../components/Inputs/Autocomplete/Autocomplete";
import Button from "../../../../components/Buttons/Button/Button";

import IconPens from "../../../../assets/images/icons/IconPencilEdit";
import IconTrash from "../../../../assets/images/icons/IconTrash";
import IconPlus from "../../../../assets/images/icons/IconPlus";

import { getTagColor, getTagLabel } from "../../../../constants/tags";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectTags, editTags } from "../../../../store/tags";

import { isDark } from "../../../../utils/colors";

import ApiFactory from "../../../../API/controllers/api-factory";
import MarkingsApi from "../../../../API/controllers/markings-api";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface ModalTagsProps {
  className?: string;
  mode?: "property" | "entity";
  value?: string;
  tags?: any[];
  objectId?: string;
}

const ModalTags = () => {
  const {
    modalProps,
    hideModal,
  }: { modalProps: ModalTagsProps; hideModal: () => void } =
    useGlobalModalContext();

  const { className, mode, value, tags, objectId } = modalProps;

  const dispatch = useAppDispatch();
  const tagsState = useAppSelector(selectTags);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [currentTags, setCurrentTags] = useState(tags || []);
  const [removedTags, setRemovedTags] = useState<any[]>([]);
  const [addedTags, setAddedTags] = useState<any[]>([]);
  const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false);
  const [isOpenedForm, setIsOpenedForm] = useState(false);
  const [tagSelected, setTagSelected] = useState<string | undefined>(undefined);
  const [menuPosition, setMenuPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const init = async () => {
    const apiClient = ApiFactory.create<MarkingsApi>("MarkingsApi");
    const res = await apiClient.listMarkings();
    return res;
  };

  useEffect(() => {
    init()
      .then((res) => {
        const data = res
          .filter((item) => !tags?.includes(item.id))
          .map((item) => ({
            ...item,
            label: item.label || item.id,
          }));
        setAllTags(data);
      })
      .catch((err) => {
        const baseMsg = "Erreur de chargement des données";
        const msg = err ? `${baseMsg}\r\n${err}` : baseMsg;
        toast.error(msg);
      });
  }, []);

  useEffect(() => {
    setCurrentTags(tags || []);
  }, [tags]);

  const close = () => {
    hideModal();
  };

  const handleToggleModal = (opened: boolean) => {
    if (!opened) {
      close();
    }
  };

  const onContextMenu = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setTagSelected(tag);
    setIsOpenedContextMenu(true);
  };

  const handleRemoveTag = () => {
    removedTags.push(tagSelected);
    setRemovedTags(removedTags);
    const tagIndex = currentTags.findIndex((t) => t.label === tagSelected);
    if (tagIndex !== undefined && tagIndex !== -1) {
      const currentTagsCopy = [...currentTags];
      currentTagsCopy.splice(tagIndex, 1);
      setCurrentTags(currentTagsCopy);
    }

    setIsOpenedContextMenu(false);
    setTagSelected(undefined);
  };
  const handleAddTag = ({
    setInputValue,
    selectedOptions,
    setSelectedOptions,
  }) => {
    const addedTag = selectedOptions.length ? selectedOptions[0] : undefined;
    if (!addedTag) {
      return;
    }
    addedTags.push(addedTag);
    setAddedTags([...addedTags]);
    const tag = currentTags.find((t) => t.label === addedTag.label);
    if (!tag) {
      const currentTagsCopy = [...currentTags];
      currentTagsCopy.push(addedTag.id);
      setCurrentTags(currentTagsCopy);
    }
    // Reset autocomplete input
    setInputValue("");
    setSelectedOptions([]);
  };

  const handleSubmit = () => {
    const payload = {
      objectId,
      property:
        mode === "property"
          ? {
              title: tagsState.selectedProperty?.title,
              value: value || "",
            }
          : undefined,
      tags: currentTags,
    };
    dispatch(editTags(payload));
    close();
  };

  const renderAutocompleteOption = (option, onSelect) => (
    <button
      type="button"
      className={styles.optionElementInteractive}
      onClick={onSelect}
    >
      <span
        className={cx(commons.tag, {
          // @ts-ignore
          [commons.tagLight]: isDark(getTagColor(option, null)),
        })}
        // @ts-ignore
        style={{ backgroundColor: getTagColor(option, null) }}
      >
        {option.label || option.id}
      </span>
    </button>
  );
  const renderAutocompleteButton = (state) => (
    <div
      className={cx(commons.clickable, styles.addIcon)}
      onClick={() => handleAddTag(state)}
    >
      <IconPlus fill="#FFFFFF" />
    </div>
  );
  return (
    <Modal
      className={className}
      icon={<IconPens fill="#FFFFFF" />}
      title="Modifier les marquants"
      isOpen
      setIsOpen={handleToggleModal}
      hasOverlay={false}
      footer={
        <>
          <Button onClick={close} type="secondary">
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Valider le marquant</Button>
        </>
      }
    >
      <div className={styles.modalContent}>
        <div>
          <div className={styles.selectedValue}>
            {mode === "property" ? "Valeur sélectionnée" : "Objet sélectionné"}{" "}
            : <span>{value}</span>
          </div>
          <div className={styles.tagsContainer}>
            <p>
              Marquants associés à{" "}
              {mode === "property" ? "cette valeur" : "cet objet"}
            </p>
            <div>
              {currentTags &&
                currentTags.map((tag, index) => (
                  <span
                    key={index}
                    className={cx(commons.tag, {
                      // @ts-ignore
                      [commons.tagLight]: isDark(getTagColor(tag, null)),
                    })}
                    // @ts-ignore
                    style={{ backgroundColor: getTagColor(tag, null) }}
                    onContextMenu={(e) =>
                      // @ts-ignore
                      onContextMenu(e, getTagLabel(tag, null))
                    }
                  >
                    {getTagLabel(
                      tag,
                      // @ts-ignore
                      null
                    )}
                  </span>
                ))}
            </div>
          </div>
        </div>
        {isOpenedForm && (
          <div className={styles.tagsContainer}>
            <p>
              Ajouter un marquant à{" "}
              {mode === "property" ? "la propriété" : "l'objet"}
            </p>
            <Autocomplete
              className={{
                element: styles.inputElement,
              }}
              options={allTags}
              renderOption={renderAutocompleteOption}
              renderButton={renderAutocompleteButton}
            />
          </div>
        )}
        <div className={styles.addButtonContainer}>
          {!isOpenedForm && (
            <button
              type="button"
              className={cx(styles.addButton)}
              onClick={() => setIsOpenedForm(true)}
            >
              + Ajouter un marquant
            </button>
          )}
        </div>
      </div>
      <ContextMenu
        isOpen={isOpenedContextMenu}
        setIsOpen={setIsOpenedContextMenu}
        position={menuPosition}
      >
        <span
          className={cx(commons.clickable, styles.contextMenuOption)}
          onClick={handleRemoveTag}
        >
          <IconTrash fill="#3083F7" width={10} height={12} />
          Supprimer
        </span>
      </ContextMenu>
    </Modal>
  );
};

export default ModalTags;
