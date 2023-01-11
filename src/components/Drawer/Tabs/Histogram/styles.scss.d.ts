declare namespace StylesScssNamespace {
  export interface IStylesScss {
    ContextMenu: string;
    ContextMenu__Item: string;
    attribute: string;
    attributeName: string;
    attributeValue: string;
    attributes: string;
    bar: string;
    filter: string;
    filters: string;
    group: string;
    groupName: string;
    histogram: string;
    histogramContainer: string;
    loadBar: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
