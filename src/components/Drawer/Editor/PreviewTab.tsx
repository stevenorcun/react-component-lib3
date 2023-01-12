import React, { useState, useEffect } from "react";
import { EditorState } from "draft-js";
import Button from "../../../components/Buttons/Button/Button";
import EditorSinglePage from "../../../components/CustomEditor/EditorSinglePage";
import styles from "./styles.scss";

interface PreviewTabProps {
  editorStates: EditorState[];
  handleAddPage: () => void;
}

const PreviewTab = ({ editorStates, handleAddPage }: PreviewTabProps) => {
  const [states, setStates] = useState(
    editorStates.map((es) =>
      EditorState.createWithContent(es.getCurrentContent(), es.getDecorator())
    )
  );

  useEffect(() => {
    const nexEditorStates = editorStates.map((es) =>
      EditorState.createWithContent(es.getCurrentContent(), es.getDecorator())
    );
    setStates([...nexEditorStates]);
  }, [editorStates]);

  return (
    <div className={styles.drawerPreviewContainer}>
      <div className={styles.previewContainer}>
        {states.map((state, index) => (
          <div key={index} className={styles.previewPage}>
            <span className={styles.numPage}>{index + 1}</span>
            <div className={styles.previewEditorContainer}>
              <EditorSinglePage editorState={state} readOnly />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleAddPage}>Ajouter une page</Button>
      </div>
    </div>
  );
};

export default PreviewTab;
