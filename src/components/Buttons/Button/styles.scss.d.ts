declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button: string;
    primary: string;
    secondary: string;
    tertiary: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
