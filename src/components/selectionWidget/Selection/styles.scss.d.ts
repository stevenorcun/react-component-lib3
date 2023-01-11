declare namespace StylesScssNamespace {
  export interface IStylesScss {
    selectionList: string;
    selectionType: string;
    title: string;
    wrapper: string;
    wrapperSelectedEntities: string;
    wrapperSelectedEntitiesContent: string;
    wrapperSelectedEntitiesContentSelect: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
