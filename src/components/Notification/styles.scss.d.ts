declare namespace StylesScssNamespace {
  export interface IStylesScss {
    badge: string;
    description: string;
    link: string;
    notification: string;
    time: string;
    title: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
