declare namespace LayoutSelectedListScssNamespace {
  export interface ILayoutSelectedListScss {
    OverflowMeDaddy: string;
    cardList: string;
    selectedListCards: string;
  }
}

declare const LayoutSelectedListScssModule: LayoutSelectedListScssNamespace.ILayoutSelectedListScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayoutSelectedListScssNamespace.ILayoutSelectedListScss;
};

export = LayoutSelectedListScssModule;
