declare namespace CircularCharsExplorerScssNamespace {
  export interface ICircularCharsExplorerScss {
    circularChartExplorer: string;
    filterCircle: string;
    icon: string;
    label: string;
    modelEvent: string;
    modelLabelEvent: string;
    name: string;
    rechartsCircular: string;
    title: string;
    titleLabel: string;
  }
}

declare const CircularCharsExplorerScssModule: CircularCharsExplorerScssNamespace.ICircularCharsExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CircularCharsExplorerScssNamespace.ICircularCharsExplorerScss;
};

export = CircularCharsExplorerScssModule;
