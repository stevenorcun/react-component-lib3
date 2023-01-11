declare namespace TabsExplorerScssNamespace {
  export interface ITabsExplorerScss {
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
    contained: string;
    dropdownTab: string;
    element: string;
    fontBold: string;
    fontSmall: string;
    icon: string;
    iconSelected: string;
    label: string;
    relative: string;
    tab: string;
    tab__selected: string;
    tabs: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    underline: string;
  }
}

declare const TabsExplorerScssModule: TabsExplorerScssNamespace.ITabsExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabsExplorerScssNamespace.ITabsExplorerScss;
};

export = TabsExplorerScssModule;
