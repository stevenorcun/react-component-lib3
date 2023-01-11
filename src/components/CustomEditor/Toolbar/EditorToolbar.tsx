import React from "react";
import { EditorState } from "draft-js";
import OptionsToolbar from "@/components/CustomEditor/Toolbar/OptionsToolbar/OptionsToolbar";
import ToolsToolbar from "@/components/CustomEditor/Toolbar/ToolsToolbar/ToolsToolbar";

interface EditorToolbarProps {
  editorState: EditorState;
  readonly spellCheck: boolean;
  readonly zoom: number;
  readonly onlineUsers: any[];
  readonly saved: boolean;
  readonly saveDate?: Date;
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
  onImportJson: any;
  onSave: any;
  cutText: any;
  copyText: any;
  pasteText: any;
}

const EditorToolbar = ({
  editorState,
  spellCheck,
  zoom,
  onlineUsers,
  saved,
  saveDate,
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
  onImportJson,
  onSave,
  cutText,
  copyText,
  pasteText,
}: EditorToolbarProps) => (
  <div>
    <OptionsToolbar
      onToggle={onToggle}
      onFontColorClick={onFontColorClick}
      onHighlightColorChange={onHighlightColorChange}
      onFontSizeChange={onFontSizeChange}
      onChangeBlockType={onChangeBlockType}
      onUndo={onUndo}
      onRedo={onRedo}
      onToggleSpellCheck={onToggleSpellCheck}
      onUnstyle={onUnstyle}
      onChangeDepth={onChangeDepth}
      onAddImage={onAddImage}
      onExportPdf={onExportPdf}
      onExportHtml={onExportHtml}
      onExportJson={onExportJson}
      onImportJson={onImportJson}
      onSave={onSave}
      cutText={cutText}
      copyText={copyText}
      pasteText={pasteText}
      onlineUsers={onlineUsers}
      saved={saved}
      saveDate={saveDate}
    />
    <ToolsToolbar
      editorState={editorState}
      spellCheck={spellCheck}
      zoom={zoom}
      onToggle={onToggle}
      onFontColorClick={onFontColorClick}
      onHighlightColorChange={onHighlightColorChange}
      onFontSizeChange={onFontSizeChange}
      onChangeBlockType={onChangeBlockType}
      onUndo={onUndo}
      onRedo={onRedo}
      onToggleSpellCheck={onToggleSpellCheck}
      onUnstyle={onUnstyle}
      onChangeDepth={onChangeDepth}
      onAddImage={onAddImage}
      onZoom={onZoom}
      onExportPdf={onExportPdf}
      onExportHtml={onExportHtml}
      onExportJson={onExportJson}
    />
  </div>
);

export default EditorToolbar;
