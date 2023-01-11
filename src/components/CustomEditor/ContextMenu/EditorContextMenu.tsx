/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState, useEffect } from "react";
import { EditorState, ContentBlock } from "draft-js";
import ContextMenu from "@/components/ContextMenu/DefaultContextMenu/ContextMenu";
import EditorContextMenuOption from "@/components/CustomEditor/ContextMenu/Option/EditorContextMenuOption";
import transformEntity from "@/components/CustomEditor/plugins/novaObjects/modifiers/transformEntity";
import IconToolAddSelection from "@/assets/images/icons/IconToolAddSelection";
import IconCopy from "@/assets/images/icons/IconCopy";
import styles from "./styles.scss";

interface EditorContextMenuProps {
  editorState: EditorState;
  editorChange: (state: EditorState) => void;
  isOpen: boolean;
  setIsOpen: any;
  menuPosition?: {
    x: number;
    y: number;
  };
  entityProps?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  };
  cutText: any;
  copyText: any;
  pasteText: any;
}

const EditorContextMenu = ({
  editorState,
  editorChange,
  isOpen,
  setIsOpen,
  menuPosition,
  entityProps,
  cutText,
  copyText,
  pasteText,
}: EditorContextMenuProps) => {
  const [someTextSelected, setSomeTextSelected] = useState(false);
  const [entityData, setEntityData] = useState<any>(undefined);
  const [entityType, setEntityType] = useState<any>(undefined);
  const [draftEntity, setDraftEntity] = useState(entityProps);

  const closeContextMenu = () => {
    setIsOpen(false);
    setDraftEntity(undefined);
  };

  const getEntityKey = () => {
    if (draftEntity?.entityKey) {
      return draftEntity?.entityKey;
    }
    const selectionState = editorState.getSelection();
    const start = selectionState.getStartOffset();
    const blockKey = selectionState.getFocusKey();
    const contentState = editorState.getCurrentContent();
    const contentBlock = blockKey
      ? contentState.getBlockForKey(blockKey)
      : undefined;
    const key = start ? contentBlock?.getEntityAt(start) : undefined;
    return key;
  };

  const getEntity = () => {
    const contentState = editorState.getCurrentContent();
    const key = getEntityKey();
    let entity;
    if (key) {
      entity = contentState.getEntity(key);
    }
    return entity;
  };

  /**
   * Toggle a draft entity type between 'LINK' and 'CARD'
   */
  const toggleEntityFormType = () => {
    if (entityType !== "CARD" && entityType !== "LABEL") {
      return;
    }
    const toEntityFormType = entityType === "CARD" ? "LABEL" : "CARD";
    transformEntity(
      entityType,
      toEntityFormType,
      editorState,
      entityData,
      draftEntity,
      (newEditorState) => {
        editorChange(newEditorState);
        closeContextMenu();
      }
    );
  };

  useEffect(() => {
    // Is text currently selected
    const selectionState = editorState.getSelection();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    setSomeTextSelected(end - start !== 0);
    // Get draft entity type if exist
    const eType = getEntity()?.getType();
    setEntityType(eType);
    // Get draft entity data if exist
    const entity = getEntity()?.data;
    setEntityData(entity);
  }, [editorState]);

  useEffect(() => {
    setDraftEntity(entityProps);
  }, [entityProps]);

  useEffect(() => {
    // Get draft entity type if exist
    const eType = getEntity()?.getType();
    setEntityType(eType);
    // Get draft entity data if exist
    const entity = getEntity()?.data;
    setEntityData(entity);
  }, [draftEntity]);

  return (
    <ContextMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={menuPosition}
      className={styles.editorContextMenu}
    >
      <div className={styles.contextMenuOptions}>
        {(entityType === "LABEL" || entityType === "CARD") && entityData && (
          <>
            <EditorContextMenuOption
              label="Modifier la forme"
              onClick={toggleEntityFormType}
            />
            <div className={styles.divider} />
          </>
        )}
        <EditorContextMenuOption
          label="Définir les droits de lecture/écriture"
          shortcut="T"
          disabled
        />
        <EditorContextMenuOption
          label="Étiquetter comme objet"
          shortcut="L"
          icon={<IconToolAddSelection />}
          disabled
        />
        <div className={styles.divider} />
        <EditorContextMenuOption
          label="Couper"
          shortcut="Ctrl+X"
          icon={<IconCopy />}
          disabled={!someTextSelected}
          onClick={cutText}
        />
        <EditorContextMenuOption
          label="Copier"
          shortcut="Ctrl+C"
          icon={<IconCopy />}
          disabled={!someTextSelected}
          onClick={copyText}
        />
        <EditorContextMenuOption
          label="Coller"
          shortcut="Ctrl+V"
          icon={<IconCopy />}
          onClick={pasteText}
        />
      </div>
    </ContextMenu>
  );
};

export default EditorContextMenu;
