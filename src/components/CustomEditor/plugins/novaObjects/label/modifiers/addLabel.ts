import { EditorState, ContentState, Modifier } from 'draft-js';

export default (
  data: any,
  cState: ContentState,
  editorState: EditorState,
): ContentState => {
  const contentState = cState || editorState.getCurrentContent();
  if (!data || !data.label) {
    return contentState;
  }
  const selectionState = editorState.getSelection();
  const inlineStyle = editorState.getCurrentInlineStyle();
  // Create the Draft entity
  const contentStateWithEntity = contentState.createEntity(
    'LABEL',
    'MUTABLE',
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const contentStateWithLink = Modifier.applyEntity(
    contentStateWithEntity,
    selectionState,
    entityKey,
  );
  // Insert entity's label in editor
  const newContentState = Modifier.insertText(
    contentStateWithLink,
    selectionState,
    data.label,
    inlineStyle,
    entityKey,
  );
  return newContentState;
};
