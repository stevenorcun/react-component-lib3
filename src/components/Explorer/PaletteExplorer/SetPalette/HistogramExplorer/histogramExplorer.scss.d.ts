declare namespace HistogramExplorerScssNamespace {
  export interface IHistogramExplorerScss {
    BarContainer: string;
    FilterHistogram: string;
    attributeValue: string;
    bar: string;
    buttonFilter: string;
    card: string;
    cardLabel: string;
    cardSelected: string;
    componentTypes: string;
    componentTypesHeader: string;
    histogramExplorer: string;
    iconArrow: string;
    iconButton: string;
    loadBar: string;
  }
}

declare const HistogramExplorerScssModule: HistogramExplorerScssNamespace.IHistogramExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HistogramExplorerScssNamespace.IHistogramExplorerScss;
};

export = HistogramExplorerScssModule;
