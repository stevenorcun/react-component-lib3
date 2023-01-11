declare namespace StylesScssNamespace {
  export interface IStylesScss {
    blockContainer: string;
    flex_100: string;
    flex_33: string;
    flex_50: string;
    flex_66: string;
    mainContent: string;
    principalColumnContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
