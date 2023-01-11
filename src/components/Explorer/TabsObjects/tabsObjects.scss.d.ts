declare namespace TabsObjectsScssNamespace {
  export interface ITabsObjectsScss {
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
    buttonAction: string;
    buttonAction__icon: string;
    card: string;
    card__active: string;
    card__icon: string;
    card__iconActive: string;
    card__left: string;
    card__subtitle: string;
    card__title: string;
    cards: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    fontBold: string;
    fontSmall: string;
    header: string;
    iconCross: string;
    iconCross__active: string;
    relative: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    underline: string;
  }
}

declare const TabsObjectsScssModule: TabsObjectsScssNamespace.ITabsObjectsScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabsObjectsScssNamespace.ITabsObjectsScss;
};

export = TabsObjectsScssModule;
