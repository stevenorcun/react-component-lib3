declare namespace LayoutListScssNamespace {
  export interface ILayoutListScss {
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
    badge: string;
    buttonCreateList: string;
    buttonIcon: string;
    card: string;
    card__selected: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    contentRight: string;
    contentSearch: string;
    currentCase: string;
    fontBold: string;
    fontSmall: string;
    footer: string;
    header: string;
    headerComponent: string;
    headerComponent__left: string;
    headerListTitle: string;
    iconCase: string;
    label: string;
    layoutList: string;
    relative: string;
    result: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textButton: string;
    textOverflowTwoLines: string;
    time: string;
    title: string;
    underline: string;
  }
}

declare const LayoutListScssModule: LayoutListScssNamespace.ILayoutListScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayoutListScssNamespace.ILayoutListScss;
};

export = LayoutListScssModule;
