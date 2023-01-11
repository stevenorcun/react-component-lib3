declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string;
    active2: string;
    clearFilter: string;
    filter: string;
    filters: string;
    header: string;
    navigation: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
