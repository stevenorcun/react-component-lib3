import { ComponentType } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import ExplorerTable from './component/ExplorerTable';
import addExplorerTable from './modifiers/addExplorerTable';

export type EntityExplorerTableEditorPlugin = EditorPlugin & {
  addExplorerTable: typeof addExplorerTable;
};

interface EntityExplorerTableEditorPluginConfig {
  decorator?: (component: ComponentType<any>) => ComponentType<any>;
}

export default (config?: EntityExplorerTableEditorPluginConfig): EntityExplorerTableEditorPlugin => {
  const component = config?.decorator ? config.decorator(ExplorerTable) : ExplorerTable;
  const blockRendererFn = (contentBlock, { getEditorState }) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      const contentState = getEditorState().getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      if (!entityKey) {
        return null;
      }
      const entityType = contentState.getEntity(entityKey).getType();
      if (entityType === 'EXPLORER_TABLE' || entityType === 'explorer_table') {
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
    addExplorerTable,
  };
};
