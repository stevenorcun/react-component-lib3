import { toast } from 'react-toastify';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { getBase64 } from '@/utils/general';

export default async (
  image: any,
  editorState: EditorState,
): EditorState => {
  if (!image) {
    return editorState;
  }
  let data: any = {};
  data = image;
  try {
    data.path = await getBase64(image);
  } catch (error: any) {
    toast.error(error);
  }
  if (!data.path) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  // Create the Draft entity
  const contentStateWithEntity = contentState.createEntity(
    'IMAGE',
    'IMMUTABLE',
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const EditorStateAtomicBlock = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' ',
  );
  const newEditorState = EditorState.forceSelection(
    EditorStateAtomicBlock,
    EditorStateAtomicBlock.getCurrentContent().getSelectionAfter(),
  );
  return EditorState.push(
    newEditorState,
    newEditorState.getCurrentContent(),
    'apply-entity',
  );
};
