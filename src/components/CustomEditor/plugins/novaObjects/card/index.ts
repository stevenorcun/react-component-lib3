import { ComponentType } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import CardEntity from './component/CardEntity';
import addCard from './modifiers/addCard';

export type EntityCardEditorPlugin = EditorPlugin & {
  addCard: typeof addCard;
};

interface EntityCardEditorPluginConfig {
  setContextMenuEntityProps?: React.Dispatch<any>;
  decorator?: (component: ComponentType<any>) => ComponentType<any>;
}

export default (config?: EntityCardEditorPluginConfig): EntityCardEditorPlugin => {
  const component = config?.decorator ? config.decorator(CardEntity) : CardEntity;
  const blockRendererFn = (contentBlock, { getEditorState }) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      const contentState = getEditorState().getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      if (!entityKey) {
        return null;
      }
      const entityType = contentState.getEntity(entityKey).getType();
      if (entityType === 'CARD' || entityType === 'card') {
        return {
          component,
          editable: false,
          props: {
            entityKey,
            setContextMenuEntityProps: config?.setContextMenuEntityProps,
          },
        };
      }
      return null;
    }
    return null;
  };
  return {
    blockRendererFn,
    addCard,
  };
};
