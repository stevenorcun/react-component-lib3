/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from "react";
import { EditorState, RichUtils } from "draft-js";
import {
  FONT_STYLES,
  zoomOptions,
  BLOCK_TYPES,
  fontSizeOptions,
  DEFAULT_FONT_SIZE,
} from "../../../../constants/editor";
// Components
import BaseButton from "../../../../components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import StyleButton from "../../../../components/CustomEditor/Toolbar/Buttons/StyleButton/StyleButton";
import ColorButton from "../../../../components/CustomEditor/Toolbar/Buttons/ColorButton/ColorButton";
import SelectButton from "../../../../components/CustomEditor/Toolbar/Buttons/SelectButton/SelectButton";
import AlignmentButton from "../../../../components/CustomEditor/Toolbar/Buttons/AlignmentButton/AlignmentButton";
import ListButton from "../../../../components/CustomEditor/Toolbar/Buttons/ListButton/ListButton";
import FileButton from "../../../../components/CustomEditor/Toolbar/Buttons/FileButton/FileButtons";
import DownloadButton from "../../../../components/CustomEditor/Toolbar/Buttons/DownloadButton/DownloadButton";
// Icons
import IconToolColorText from "../../../../assets/images/icons/IconToolColorText";
import IconToolTextLeft from "../../../../assets/images/icons/IconToolTextLeft";
import IconNumList from "../../../../assets/images/icons/IconNumList";
import IconArrowUndo from "../../../../assets/images/icons/IconArrowUndo";
import IconArrowRedo from "../../../../assets/images/icons/IconArrowRedo";
import IconSpellCheck from "../../../../assets/images/icons/IconSpellCheck";
import IconHighlight from "../../../../assets/images/icons/IconHighlight";
import IconToolMediaPlus from "../../../../assets/images/icons/IconToolMediaPlus";
import IconDownload from "../../../../assets/images/icons/IconToolDownload";
import IconIndentMore from "../../../../assets/images/icons/IconIndentMore";
import IconIndentLess from "../../../../assets/images/icons/IconIndentLess";
import IconUnstyle from "../../../../assets/images/icons/IconUnstyle";
import styles from "./styles.scss";

interface ToolsToolbarProps {
  editorState: EditorState;
  readonly spellCheck: boolean;
  readonly zoom: number;
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
  onZoom: any;
  onExportPdf: any;
  onExportHtml: any;
  onExportJson: any;
}

const ToolsToolbar = ({
  editorState,
  spellCheck,
  zoom,
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
  onZoom,
  onExportPdf,
  onExportHtml,
  onExportJson,
}: ToolsToolbarProps) => {
  const [currentStyle, setCurrentStyle] = useState(
    editorState.getCurrentInlineStyle()
  );
  const [currentBlockType, setCurrentBlockType] = useState(
    RichUtils.getCurrentBlockType(editorState)
  );
  const [currentFontSize, setCurrentFontSize] = useState(
    parseInt(DEFAULT_FONT_SIZE.slice(0, DEFAULT_FONT_SIZE.indexOf("p")), 10)
  );
  const [currentFontColor, setCurrentFontColor] = useState<string | undefined>(
    undefined
  );
  const [currentHighlightColor, setCurrentHighlightColor] = useState<
    string | undefined
  >(undefined);

  const changeFontSize = () => {
    const previousFontSizeKey = currentStyle.findLast((v, key) => {
      const regex = /FONT-SIZE-\d*/g;
      return regex.test(key);
    });
    if (previousFontSizeKey) {
      setCurrentFontSize(
        parseInt(previousFontSizeKey.replace("FONT-SIZE-", ""), 10)
      );
    } else {
      setCurrentFontSize(
        parseInt(DEFAULT_FONT_SIZE.slice(0, DEFAULT_FONT_SIZE.indexOf("p")), 10)
      );
    }
  };

  const changeFontColor = () => {
    const previousFontColorKey = currentStyle.findLast((v, key) => {
      const regex = /FONT-COLOR-.*/g;
      return regex.test(key);
    });
    setCurrentFontColor(
      previousFontColorKey
        ? previousFontColorKey.replace("FONT-COLOR-", "")
        : undefined
    );
  };

  const changeHighlightColor = () => {
    const previousColorKey = currentStyle.findLast((v, key) => {
      const regex = /HIGHLIGHT-COLOR-.*/g;
      return regex.test(key);
    });
    setCurrentHighlightColor(
      previousColorKey
        ? previousColorKey.replace("HIGHLIGHT-COLOR-", "")
        : undefined
    );
  };

  useEffect(() => {
    setCurrentStyle(editorState.getCurrentInlineStyle());
    setCurrentBlockType(RichUtils.getCurrentBlockType(editorState));
  }, [editorState]);
  useEffect(() => {
    changeFontSize();
    changeFontColor();
    changeHighlightColor();
  }, [currentStyle]);
  return (
    <div className={styles.editorToolbar}>
      <BaseButton
        onClick={onUndo}
        icon={<IconArrowUndo />}
        disabled={!editorState.getUndoStack().size}
        tooltip="Annuler"
      />
      <BaseButton
        onClick={onRedo}
        icon={<IconArrowRedo />}
        disabled={!editorState.getRedoStack().size}
        tooltip="Rétablir"
      />
      <BaseButton
        active={spellCheck}
        onClick={onToggleSpellCheck}
        icon={<IconSpellCheck />}
        tooltip="Vérification orthographique"
      />
      <SelectButton
        onChange={onZoom}
        options={zoomOptions}
        defaultValue={
          zoomOptions.find((z) => z.value === zoom) || {
            value: 1,
            label: "100%",
          }
        }
        value={
          zoomOptions.find((z) => z.value === zoom) || {
            value: 1,
            label: "100%",
          }
        }
        width="65px"
      />
      <SelectButton
        onChange={onChangeBlockType}
        options={BLOCK_TYPES}
        defaultValue={
          BLOCK_TYPES.find((t) => t.value === currentBlockType) ||
          BLOCK_TYPES[0]
        }
        value={
          BLOCK_TYPES.find((t) => t.value === currentBlockType) ||
          BLOCK_TYPES[0]
        }
        width="130px"
      />
      {/* <SelectButton
        onChange={undefined}
        options={fontFamilyOptions}
        defaultValue={fontFamilyOptions[0]}
        value={fontFamilyOptions[0]}
        width="130px"
      /> */}
      <SelectButton
        onChange={onFontSizeChange}
        options={fontSizeOptions}
        defaultValue={{ value: currentFontSize, label: currentFontSize }}
        value={{ value: currentFontSize, label: currentFontSize }}
        width="50px"
      />
      {FONT_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          onToggle={onToggle}
          style={type.style}
          icon={type.icon}
          tooltip={type.tooltip}
        />
      ))}
      <ColorButton
        onClick={onFontColorClick}
        icon={<IconToolColorText />}
        color={currentFontColor}
        tooltip="Couleur de police"
      />
      <ColorButton
        onClick={onHighlightColorChange}
        icon={<IconHighlight />}
        color={currentHighlightColor}
        tooltip="Surlignage"
      />
      {/* <BaseButton
        onClick={() => {}}
        icon={<IconAddComment />}
        tooltip="Ajouter un commentaire"
      /> */}
      <FileButton
        onClick={onAddImage}
        icon={<IconToolMediaPlus />}
        tooltip="Ajouter une image"
      />
      <DownloadButton
        options={[
          /* {
            key: 'pdf', onClick: onExportPdf, label: 'Exporter en pdf', icon: <IconDownload />,
          }, */
          {
            key: "html",
            onClick: onExportHtml,
            label: "Exporter en html",
            icon: <IconDownload />,
          },
          {
            key: "json",
            onClick: onExportJson,
            label: "Exporter en json",
            icon: <IconDownload />,
          },
        ]}
        icon={<IconDownload />}
        tooltip="Télécharger"
      />
      <AlignmentButton
        onClick={onChangeBlockType}
        icon={<IconToolTextLeft />}
        tooltip="Alignement du texte"
      />
      <ListButton
        onClick={onChangeBlockType}
        icon={<IconNumList />}
        tooltip="Afficher une liste"
        activeStyle={currentBlockType}
      />
      <BaseButton
        onClick={(e) => {
          // Method RichUtils.onTab use shiftKey to determine if the depth has to be decremented
          e.shiftKey = true;
          onChangeDepth(e);
        }}
        icon={<IconIndentLess />}
        tooltip="Diminuer le retrait"
      />
      <BaseButton
        onClick={(e) => {
          // Method RichUtils.onTab use shiftKey to determine if the depth has to be incremented
          e.shiftKey = false;
          onChangeDepth(e);
        }}
        icon={<IconIndentMore />}
        tooltip="Augmenter le retrait"
      />
      <BaseButton
        onClick={onUnstyle}
        icon={<IconUnstyle />}
        tooltip="Effacer la mise en forme"
      />
    </div>
  );
};

export default ToolsToolbar;
