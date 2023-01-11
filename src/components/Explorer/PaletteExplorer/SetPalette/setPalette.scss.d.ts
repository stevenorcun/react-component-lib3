declare namespace SetPaletteScssNamespace {
  export interface ISetPaletteScss {
    buttonTab: string;
    buttonTabActive: string;
    headerPalette: string;
    setPalette: string;
    setPaletteSelection: string;
  }
}

declare const SetPaletteScssModule: SetPaletteScssNamespace.ISetPaletteScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SetPaletteScssNamespace.ISetPaletteScss;
};

export = SetPaletteScssModule;
