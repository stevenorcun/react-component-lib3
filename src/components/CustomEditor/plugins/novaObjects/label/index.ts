import { ContentState, ContentBlock, DraftDecorator } from 'draft-js';
import { EditorPlugin } from '@draft-js-plugins/editor';
import Label from './component/Label';
import addLabel from './modifiers/addLabel';

export type EntityLabelEditorPlugin = EditorPlugin & {
  draftDecorator?: DraftDecorator;
  addLabel: typeof addLabel;
};

export default (): EntityLabelEditorPlugin => {
  /**
   * Decorator function to decorate entity using its type
   * @param type
   * @param contentBlock
   * @param callback
   * @param contentState
   * @see https://draftjs.org/docs/advanced-topics-decorators/
   */
  function findEntities(
    type: string,
    contentBlock: ContentBlock,
    callback,
    contentState: ContentState,
  ) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null
          && contentState.getEntity(entityKey).getType() === type
        );
      },
      callback,
    );
  }

  /**
   * Decorator function to decorate entity label
   * @param contentBlock
   * @param callback
   * @param contentState
   * @see https://draftjs.org/docs/advanced-topics-decorators/
   */
  function findLabelEntities(contentBlock: ContentBlock, callback, contentState: ContentState) {
    findEntities('LABEL', contentBlock, callback, contentState);
  }

  const draftDecorator = {
    strategy: findLabelEntities,
    component: Label,
  };
  return {
    draftDecorator,
    addLabel,
  };
};
