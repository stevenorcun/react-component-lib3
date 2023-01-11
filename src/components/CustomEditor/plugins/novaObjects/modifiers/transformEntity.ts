import {
  EditorState, ContentState, ContentBlock, AtomicBlockUtils, Modifier,
} from 'draft-js';
import { ENTITY_TRANSFORMABLE_MODE } from '../constants';

const removeEntity = (
  start: number,
  end: number,
  editorState: EditorState,
): ContentState => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  // Recreate selectionState to get whole entity character
  const newSelection = selectionState.merge({
    anchorOffset: start,
    focusOffset: end,
  });
  // Remove the entity
  const contentStateRemoved = Modifier.applyEntity(
    contentState,
    newSelection,
    null,
  );
  const contentStateRemovedText = Modifier.replaceText(
    contentStateRemoved,
    newSelection,
    '',
  );
  return contentStateRemovedText;
};

const selectAtomicEntity = (
  start: number,
  end: number,
  editorState: EditorState,
  draftEntity?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  },
) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  // Recreate selectionState to get whole entity character
  const startKey = draftEntity?.contentBlock?.getKey() || selectionState.getAnchorKey();
  const endKey = draftEntity?.contentBlock?.getKey() || selectionState.getFocusKey();
  const previousBlock = contentState.getBlockBefore(startKey);
  const afterBlock = contentState.getBlockAfter(endKey);
  const newSelection = selectionState.merge({
    anchorKey: previousBlock?.getKey() || startKey,
    focusKey: afterBlock?.getKey() || endKey,
    anchorOffset: previousBlock ? previousBlock?.getLength() : start,
    focusOffset: afterBlock ? 0 : end,
  });
  return newSelection;
};

const removeAtomicEntity = (
  start: number,
  end: number,
  editorState: EditorState,
  draftEntity?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  },
): ContentState => {
  const contentState = editorState.getCurrentContent();
  // Recreate selectionState to get whole entity character
  const newSelection = selectAtomicEntity(start, end, editorState, draftEntity);
  const contentStateBlockType = Modifier.setBlockType(
    contentState,
    newSelection,
    'unstyled',
  );
  // Remove the entity
  const contentStateRemoved = Modifier.applyEntity(
    contentStateBlockType,
    newSelection,
    null,
  );
  return contentStateRemoved;
};

const changeToCard = (
  start: number,
  end: number,
  editorState: EditorState,
  data: any,
  draftEntity?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  },
): EditorState => {
  const selectionState = editorState.getSelection();
  // Remove the entity
  const contentStateRemovedText = removeEntity(start, end, editorState);
  // Create a new entity with new type
  const contentStateWithEntity = contentStateRemovedText.createEntity(
    'CARD',
    'IMMUTABLE',
    data,
  );
  // Apply the new created entity
  const key = contentStateWithEntity.getLastCreatedEntityKey();
  const eState = EditorState.createWithContent(
    contentStateWithEntity,
    editorState.getDecorator(),
  );
  // Set the right selection
  const selection = selectionState.merge({
    anchorKey: draftEntity?.contentBlock?.getKey() || selectionState.getAnchorKey(),
    focusKey: draftEntity?.contentBlock?.getKey() || selectionState.getFocusKey(),
    anchorOffset: start,
    focusOffset: start,
  });
  const eStateWithSelection = EditorState.forceSelection(
    eState,
    selection,
  );
  // Insert entity as an atomic block
  const editorStateAtomicBlock = AtomicBlockUtils.insertAtomicBlock(
    eStateWithSelection,
    key,
    ' ',
  );
  const newEditorState = EditorState.forceSelection(
    editorStateAtomicBlock,
    editorStateAtomicBlock.getCurrentContent().getSelectionAfter(),
  );
  return EditorState.push(
    newEditorState,
    newEditorState.getCurrentContent(),
    'apply-entity',
  );
};

const changeToLabel = (
  start: number,
  end: number,
  editorState: EditorState,
  data: any,
  draftEntity?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  },
): EditorState => {
  // Recreate selectionState to get whole entity character
  const newSelection = selectAtomicEntity(start, end, editorState, draftEntity);
  // Remove the entity
  const contentStateRemoved = removeAtomicEntity(start, end, editorState, draftEntity);
  // Create a new entity with new type
  const contentStateWithEntity = contentStateRemoved.createEntity(
    'LABEL',
    'MUTABLE',
    data,
  );
  // Apply the new created entity
  const key = contentStateWithEntity.getLastCreatedEntityKey();
  const contentStateAppliedEntity = Modifier.applyEntity(
    contentStateWithEntity,
    newSelection,
    key,
  );
  // Insert entity's label in editor
  const newContentState = Modifier.replaceText(
    contentStateAppliedEntity,
    newSelection,
    data?.label || '',
    undefined,
    key,
  );
  // Save the changes in editor
  return EditorState.push(
    editorState,
    newContentState,
    'apply-entity',
  );
};

const transformEntity = (
  entityType: string,
  targetType: string,
  editorState: EditorState,
  data: any,
  draftEntity?: {
    [key: string]: any;
    entityKey?: string;
    contentBlock?: ContentBlock;
  },
  callback?: (editorState?: EditorState) => void,
): EditorState => {
  if (
    entityType === targetType
    && !ENTITY_TRANSFORMABLE_MODE.includes(entityType)
    && !ENTITY_TRANSFORMABLE_MODE.includes(targetType)
  ) {
    return;
  }
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockKey = selectionState.getFocusKey();
  const contentBlock = draftEntity?.contentBlock || contentState.getBlockForKey(blockKey);
  contentBlock.findEntityRanges(
    (character) => {
      const key = character.getEntity();
      return (
        key !== null
        && contentState.getEntity(key).getType() === entityType
      );
    },
    (start, end) => {
      let newEditorState = editorState;
      switch (targetType) {
        case 'CARD':
          newEditorState = changeToCard(start, end, editorState, data, draftEntity);
          break;
        case 'LABEL':
          newEditorState = changeToLabel(start, end, editorState, data, draftEntity);
          break;
        default:
          break;
      }
      callback?.(newEditorState);
    },
  );
};

export default transformEntity;
