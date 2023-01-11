declare namespace ArrayExplorerScssNamespace {
  export interface IArrayExplorerScss {
    Disabled: string;
    Divider: string;
    Flex: string;
    FlexAlignItemsCenter: string;
    FlexDirectionColumn: string;
    FlexJustifyContentCenter: string;
    FlexJustifyContentSpaceAround: string;
    FlexJustifyContentSpaceEvenly: string;
    FlexJustifyFlexEnd: string;
    FlexJustifyFlexStart: string;
    FlexNoWrap: string;
    FlexWrap: string;
    Hidden: string;
    Hoverable: string;
    InvisibleScroll: string;
    MarginAuto: string;
    NoDataMessage: string;
    PointerEventsNone: string;
    PrettyScroll: string;
    Rotate180: string;
    Rotate90: string;
    RotateMinus90: string;
    UserSelectNone: string;
    arrayExplorer: string;
    badge: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    content: string;
    fontBold: string;
    fontSmall: string;
    relative: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowLines: string;
    textOverflowTwoLines: string;
    thHeader: string;
    thead: string;
    trBody: string;
    trBodySelected: string;
    trBodySelectedOver: string;
    underline: string;
  }
}

declare const ArrayExplorerScssModule: ArrayExplorerScssNamespace.IArrayExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ArrayExplorerScssNamespace.IArrayExplorerScss;
};

export = ArrayExplorerScssModule;
