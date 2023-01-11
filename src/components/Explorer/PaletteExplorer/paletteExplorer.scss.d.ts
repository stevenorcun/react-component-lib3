declare namespace PaletteExplorerScssNamespace {
  export interface IPaletteExplorerScss {
    paletteExplorer: string;
  }
}

declare const PaletteExplorerScssModule: PaletteExplorerScssNamespace.IPaletteExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PaletteExplorerScssNamespace.IPaletteExplorerScss;
};

export = PaletteExplorerScssModule;
