import { EditorState, ContentState, AtomicBlockUtils } from 'draft-js';

const addAtomicEntity = (
  entityType: string,
  mutability: string,
  data: any,
  cState: ContentState,
  editorState: EditorState,
): ContentState => {
  const contentState = cState || editorState.getCurrentContent();
  if (!data) {
    return contentState;
  }
  const selectionState = editorState.getSelection();
  // Create the Draft entity
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    mutability,
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const eState = EditorState.createWithContent(
    contentStateWithEntity,
    editorState.getDecorator(),
  );
  const eStateWithSelection = EditorState.forceSelection(
    eState,
    selectionState,
  );
  const editorStateAtomicBlock = AtomicBlockUtils.insertAtomicBlock(
    eStateWithSelection,
    entityKey,
    ' ',
  );
  const newEditorState = EditorState.forceSelection(
    editorStateAtomicBlock,
    editorStateAtomicBlock.getCurrentContent().getSelectionAfter(),
  );
  return newEditorState.getCurrentContent();
};

export default addAtomicEntity;
