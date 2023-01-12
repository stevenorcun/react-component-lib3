import React from "react";
import { EditorState } from "draft-js";
import Drawer from "../../lib/Drawer/Drawer";
import PreviewTab from "../../components/Drawer/Editor/PreviewTab";

interface PreviewDocumentDrawerProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle: React.MouseEventHandler;
  editorStates: EditorState[];
  addPage: () => void;
}

const PreviewDocumentDrawer = ({
  className,
  isCollapsed = false,
  onToggle,
  editorStates,
  addPage,
}: PreviewDocumentDrawerProps) => {
  const menus = [
    {
      key: "documentPages",
      label: `${editorStates.length} pages`,
      component: (
        <PreviewTab editorStates={editorStates} handleAddPage={addPage} />
      ),
    },
  ];

  return (
    <Drawer
      className={className}
      isCollapsed={isCollapsed}
      menus={menus}
      onToggle={onToggle}
      isResizable={false}
      position="left"
    />
  );
};

export default PreviewDocumentDrawer;
