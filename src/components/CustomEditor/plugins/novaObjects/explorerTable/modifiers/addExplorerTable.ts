import { EditorState, ContentState } from 'draft-js';
import addAtomicEntity from '../../utils/addAtomicEntity';

export default (
  data: any,
  cState: ContentState,
  editorState: EditorState,
): ContentState => addAtomicEntity('EXPLORER_TABLE', 'IMMUTABLE', data, cState, editorState);
