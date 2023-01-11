declare namespace graphExplorerScssNamespace {
  export interface IgraphExplorerScss {
    test: string;
    graphExplorer: string;
  }
}

declare const graphExplorerScssModule: graphExplorerScssNamespace.IgraphExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: graphExplorerScssNamespace.IgraphExplorerScss;
};

export = graphExplorerScssModule;
