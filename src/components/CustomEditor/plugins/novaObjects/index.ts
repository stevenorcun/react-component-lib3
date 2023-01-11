import { ComponentType } from 'react';
import { DraftDecorator } from 'draft-js';
import { EditorPlugin } from '@draft-js-plugins/editor';
import createLabelPlugin, { EntityLabelEditorPlugin } from './label';
import createCardPlugin, { EntityCardEditorPlugin } from './card';
import createExplorerTablePlugin, { EntityExplorerTableEditorPlugin } from './explorerTable';
import transformEntity from './modifiers/transformEntity';

export type NovaObjectsEditorPlugin = EditorPlugin
& EntityLabelEditorPlugin
& EntityCardEditorPlugin
& EntityExplorerTableEditorPlugin
& {
  transformEntity: typeof transformEntity;
  draftDecorators: DraftDecorator[];
};

interface NovaObjectsEditorPluginConfig {
  setContextMenuEntityProps?: React.Dispatch<any>;
  decorator?: {
    [key: string]: (component: ComponentType<any>) => ComponentType<any>;
  }
}

export default (config: NovaObjectsEditorPluginConfig): NovaObjectsEditorPlugin => {
  const labelPlugin = createLabelPlugin();
  const cardPlugin = createCardPlugin({
    setContextMenuEntityProps: config?.setContextMenuEntityProps,
    decorator: config?.decorator?.card,
  });
  const explorerTablePlugin = createExplorerTablePlugin({
    decorator: config?.decorator?.explorerTable,
  });
  const plugins = [
    labelPlugin,
    cardPlugin,
    explorerTablePlugin,
  ];
  const draftDecorators: DraftDecorator[] = plugins.map((p: any) => p.draftDecorator).filter((p) => !!p);

  const blockRendererFn = (contentBlock, pluginFunctions) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const p of plugins) {
      const result = p.blockRendererFn?.(contentBlock, pluginFunctions);
      if (result) {
        return result;
      }
    }
    return null;
  };
  return {
    blockRendererFn,
    draftDecorators,
    addLabel: labelPlugin.addLabel,
    addCard: cardPlugin.addCard,
    addExplorerTable: explorerTablePlugin.addExplorerTable,
    transformEntity,
  };
};
