declare namespace SelectionExplorerScssNamespace {
  export interface ISelectionExplorerScss {
    category: string;
    content: string;
    label: string;
    noData: string;
    property: string;
    relatedEntities: string;
    relatedEntities__icon: string;
    selectionExplorer: string;
    selectionLine: string;
    value: string;
    valueNumber: string;
    valueString: string;
  }
}

declare const SelectionExplorerScssModule: SelectionExplorerScssNamespace.ISelectionExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectionExplorerScssNamespace.ISelectionExplorerScss;
};

export = SelectionExplorerScssModule;
