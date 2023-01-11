import { toast } from 'react-toastify';
import {
  EditorState,
  Modifier,
} from 'draft-js';

const getSelectedText = (editorState: EditorState) => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);
  return selectedText;
};

/**
 * Add selected text to clipboard and remove it from editor
 */
export const cut = (
  editorState: EditorState,
  setEditorState: (state: EditorState) => void,
  callback?: () => void,
) => {
  const selectionState = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const selectedText = getSelectedText(editorState);
  if (!navigator.clipboard?.writeText) {
    toast.error('Impossible de couper le texte');
    callback?.();
    return;
  }
  navigator.clipboard.writeText(selectedText).then(() => {
    const newContentState = Modifier.replaceText(
      currentContent,
      selectionState,
      '',
    );
    // FIXME: throws error when used from context menu
    setEditorState(EditorState.push(
      editorState,
      newContentState,
      'insert-characters',
    ));
  }).catch(() => {
    toast.error('Impossible de couper le texte');
  }).finally(() => {
    callback?.();
  });
};

/**
 * Add selected text to clipboard
 */
export const copy = (
  editorState: EditorState,
  callback?: () => void,
) => {
  const selectedText = getSelectedText(editorState);
  if (!navigator.clipboard?.writeText) {
    toast.error('Impossible de copier le texte');
    callback?.();
    return;
  }
  navigator.clipboard.writeText(selectedText).finally(() => {
    callback?.();
  });
};

/**
 * Replace selected text with text saved in clipboard
 */
export const paste = (
  editorState: EditorState,
  setEditorState: (state: EditorState) => void,
  callback?: () => void,
) => {
  if (!navigator.clipboard?.readText) {
    toast.error('Impossible de coller le texte');
    callback?.();
    return;
  }
  navigator.clipboard.readText().then((text) => {
    const selectionState = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const newContentState = Modifier.replaceText(
      currentContent,
      selectionState,
      text,
    );
    setEditorState(EditorState.push(
      editorState,
      newContentState,
      'insert-characters',
    ));
  }).catch(() => {
    toast.error('Impossible de coller le texte');
  }).finally(() => {
    callback?.();
  });
};
