declare namespace CreateListScssNamespace {
  export interface ICreateListScss {
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
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    createList: string;
    fontBold: string;
    fontSmall: string;
    input: string;
    intro: string;
    relative: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    underline: string;
  }
}

declare const CreateListScssModule: CreateListScssNamespace.ICreateListScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateListScssNamespace.ICreateListScss;
};

export = CreateListScssModule;
