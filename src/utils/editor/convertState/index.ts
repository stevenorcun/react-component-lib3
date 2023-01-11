import { toast } from "react-toastify";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

/**
 * Convert a document state to JSON format
 * @param editorStates Array of document pages
 * @param zoom Current zoom value of the document
 * @returns Document state with raw content states
 */
export const editorStatesToJson = (
  editorStates: {
    state: EditorState;
    ref: any;
  }[],
  zoom?: number
) => {
  const documentState: {
    editorContents: any[];
    zoom: number;
  } = {
    editorContents: [],
    zoom: zoom || 1,
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const editorState of editorStates) {
    const { state } = editorState;
    const newContent = convertToRaw(state.getCurrentContent());
    documentState.editorContents.push(newContent);
  }
  return documentState;
};

/**
 * Convert a string representation of the document into document state
 * @param jsonString String representation of a document
 * @param caseId Case id to which the document belongs
 * @returns Document state
 */
export const editorStatesFromJson = (jsonString: string, caseId?: string) => {
  if (!jsonString) {
    return undefined;
  }
  try {
    let documentState = JSON.parse(jsonString);
    let editorContents: any[] = [];
    if (caseId && documentState[caseId]) {
      documentState = documentState[caseId];
    }
    const parsedContents = documentState?.editorContents;
    if (parsedContents) {
      editorContents = parsedContents.map((_parsedContent) =>
        convertFromRaw(_parsedContent)
      );
    }
    return editorContents;
  } catch (error: any) {
    toast.error(error);
    return undefined;
  }
};
