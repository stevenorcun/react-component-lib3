declare namespace RemoveListModalScssNamespace {
  export interface IRemoveListModalScss {
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
    button: string;
    buttonFooter: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    content: string;
    fontBold: string;
    fontSmall: string;
    footer: string;
    nameList: string;
    relative: string;
    removeModal: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    text: string;
    textOverflowTwoLines: string;
    underline: string;
  }
}

declare const RemoveListModalScssModule: RemoveListModalScssNamespace.IRemoveListModalScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RemoveListModalScssNamespace.IRemoveListModalScss;
};

export = RemoveListModalScssModule;
