declare namespace LayoutSelectedListHeaderScssNamespace {
  export interface ILayoutSelectedListHeaderScss {
    buttonIcon: string;
    headerRight: string;
    listsButton: string;
    selectedHeader: string;
    time: string;
    title: string;
  }
}

declare const LayoutSelectedListHeaderScssModule: LayoutSelectedListHeaderScssNamespace.ILayoutSelectedListHeaderScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayoutSelectedListHeaderScssNamespace.ILayoutSelectedListHeaderScss;
};

export = LayoutSelectedListHeaderScssModule;
