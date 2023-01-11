declare namespace StylesScssNamespace {
  export interface IStylesScss {
    Avatar: string;
    HitBox: string;
    Pin: string;
    tile: string;
    tileTransition: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
