import { EditorState, ContentState } from 'draft-js';
import addAtomicEntity from '../../utils/addAtomicEntity';

export default (
  data: any,
  cState: ContentState,
  editorState: EditorState,
): ContentState => {
  const contentState = cState || editorState.getCurrentContent();
  if (!data?.label) {
    return contentState;
  }
  return addAtomicEntity('CARD', 'IMMUTABLE', data, cState, editorState);
};
