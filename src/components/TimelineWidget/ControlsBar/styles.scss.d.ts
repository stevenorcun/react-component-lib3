declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string;
    controls: string;
    controlsBar: string;
    floating: string;
    smallDots: string;
    tab: string;
    tabs: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
