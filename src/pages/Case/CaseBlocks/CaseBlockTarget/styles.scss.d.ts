declare namespace StylesScssNamespace {
  export interface IStylesScss {
    labelBlue: string;
    labelColor: string;
    labelGreen: string;
    labelRed: string;
    target: string;
    targetContent: string;
    targetName: string;
    targetType: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
