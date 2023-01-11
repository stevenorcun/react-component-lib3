import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import {
  getEditOptions,
  getFileOptions,
  getDisplayOptions,
  getInsertOptions,
  getFormatOptions,
  getToolsOptions,
  getHelpOptions,
} from "@/constants/editor";
import MenuDropdown from "@/components/MenuDropdown/MenuDropdown";
import styles from "./styles.scss";

interface OptionsToolbarProps {
  onToggle: any;
  onFontColorClick: any;
  onHighlightColorChange: any;
  onFontSizeChange: any;
  onChangeBlockType: any;
  onUndo: any;
  onRedo: any;
  onToggleSpellCheck: any;
  onUnstyle: any;
  onChangeDepth: any;
  onAddImage: any;
  onExportPdf: any;
  onExportHtml: any;
  onExportJson: any;
  onImportJson: any;
  onSave: any;
  cutText: any;
  copyText: any;
  pasteText: any;
  onlineUsers: any[];
  saved: boolean;
  saveDate?: Date;
}

const OptionsToolbar = ({
  onToggle,
  onFontColorClick,
  onHighlightColorChange,
  onFontSizeChange,
  onChangeBlockType,
  onUndo,
  onRedo,
  onToggleSpellCheck,
  onUnstyle,
  onChangeDepth,
  onAddImage,
  onExportPdf,
  onExportHtml,
  onExportJson,
  onImportJson,
  onSave,
  cutText,
  copyText,
  pasteText,
  onlineUsers,
  saved,
  saveDate,
}: OptionsToolbarProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const jsonFileInput = useRef<HTMLInputElement>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState(
    moment().diff(moment(saveDate), "minutes")
  );

  // File input methods
  const clickFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref?.current) {
      ref.current.click();
    }
  };
  const resetValue = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref?.current) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = "";
    }
  };
  const changeImage = (e) => {
    const { files } = e.target;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    onAddImage(file);
  };
  const changeJSON = (e) => {
    const { files } = e.target;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const jsonString = event?.target?.result;
      if (jsonString) {
        onImportJson(jsonString);
      }
    };
    // @ts-ignore
    fileReader.onerror = (error) => toast.error(error);
    fileReader.readAsText(file);
  };

  const fileOptions = getFileOptions({
    save: onSave,
    open: () => clickFileInput(jsonFileInput),
    exportHtml: onExportHtml,
    exportJson: onExportJson,
    importJson: () => clickFileInput(jsonFileInput),
  });
  const editOptions = getEditOptions({
    undo: onUndo,
    redo: onRedo,
    cut: cutText,
    copy: copyText,
    paste: pasteText,
  });
  const displayOptions = getDisplayOptions();
  const insertOptions = getInsertOptions({
    addImage: () => clickFileInput(fileInput),
  });
  const formatOptions = getFormatOptions({
    bold: () => {
      onToggle("BOLD");
    },
    italic: () => {
      onToggle("ITALIC");
    },
    underline: () => {
      onToggle("UNDERLINE");
    },
    removeStyle: onUnstyle,
  });
  const toolsOptions = getToolsOptions();
  const helpOptions = getHelpOptions();

  useEffect(() => {
    let minutes = timeSinceLastSave;
    const intervalId = setInterval(() => {
      minutes += 1;
      setTimeSinceLastSave(minutes);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setTimeSinceLastSave(moment().diff(moment(saveDate), "minutes"));
  }, [saveDate]);

  return (
    <div className={styles.editorOptionsContainer}>
      <div className={styles.editorToolsBar}>
        <MenuDropdown
          className={styles.toolButton}
          label="Fichier"
          options={fileOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Édition"
          options={editOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Affichage"
          options={displayOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Insertion"
          options={insertOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Format"
          options={formatOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Outils"
          options={toolsOptions}
        />
        <MenuDropdown
          className={styles.toolButton}
          label="Aide"
          options={helpOptions}
        />
        <span className={styles.lastUpdate}>
          {saved ? (
            <>Document à jour</>
          ) : (
            <>Dernière sauvegarde il y a {timeSinceLastSave} minute(s)</>
          )}
        </span>
      </div>
      <div className={styles.usersBar}>
        {onlineUsers.map((user) => (
          <span
            key={user.id}
            className={styles.userCircle}
            style={{ backgroundColor: user.color }}
            title={user.username || ""}
          >
            {user.username?.toUpperCase().slice(0, 2)}
          </span>
        ))}
      </div>
      <input
        ref={fileInput}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        onClick={() => resetValue(fileInput)}
        onChange={changeImage}
      />
      <input
        ref={jsonFileInput}
        className={styles.fileInput}
        type="file"
        accept="application/JSON"
        onClick={() => resetValue(jsonFileInput)}
        onChange={changeJSON}
      />
    </div>
  );
};

export default OptionsToolbar;
