import { ComponentType } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import Image from './component/Image';
import addImage from './modifiers/addImage';

export interface ImagePluginTheme {
  image?: string;
}

export type ImageEditorPlugin = EditorPlugin & {
  addImage: typeof addImage;
};

interface ImageEditorPluginConfig {
  decorator?: (component: ComponentType<any>) => ComponentType<any>;
}

export default (config?: ImageEditorPluginConfig): ImageEditorPlugin => {
  const component = config?.decorator ? config.decorator(Image) : Image;
  const blockRendererFn = (contentBlock, { getEditorState }) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      const contentState = getEditorState().getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      if (!entityKey) {
        return null;
      }
      const entityType = contentState.getEntity(entityKey).getType();
      if (entityType === 'IMAGE' || entityType === 'image') {
        return {
          component,
          editable: false,
          props: {
            entityKey,
          },
        };
      }
      return null;
    }
    return null;
  };
  return {
    blockRendererFn,
    addImage,
  };
};
