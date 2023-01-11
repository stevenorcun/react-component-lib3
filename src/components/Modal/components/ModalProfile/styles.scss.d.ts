declare namespace StylesScssNamespace {
  export interface IStylesScss {
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
    boutonAllLists: string;
    card: string;
    cards: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    fontBold: string;
    fontSmall: string;
    footerModal: string;
    iconList: string;
    label: string;
    modalContent: string;
    modalteste: string;
    noContentList: string;
    noList: string;
    relative: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    time: string;
    underline: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
