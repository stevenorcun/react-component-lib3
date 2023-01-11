declare namespace infoExplorerScssNamespace {
  export interface IinfoExplorerScss {
    value: string;
    label: string;
    infoExplorer: string;
  }
}

declare const infoExplorerScssModule: infoExplorerScssNamespace.IinfoExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: infoExplorerScssNamespace.IinfoExplorerScss;
};

export = infoExplorerScssModule;
