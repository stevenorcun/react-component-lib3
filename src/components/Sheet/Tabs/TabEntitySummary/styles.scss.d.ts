declare namespace StylesScssNamespace {
  export interface IStylesScss {
    component: string;
    component__multimediaAll: string;
    component__multimediaMinus: string;
    divider: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
