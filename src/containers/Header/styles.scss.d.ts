declare namespace StylesScssNamespace {
  export interface IStylesScss {
    header: string;
    headerLogin: string;
    headerUser: string;
    menuIcon: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
