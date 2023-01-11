declare namespace SearchExplorerScssNamespace {
  export interface ISearchExplorerScss {
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
    buttonSearch: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    contentDate: string;
    date: string;
    dateTimePicker: string;
    filter: string;
    filterExplorer: string;
    flex: string;
    flexAlign: string;
    flexColumn: string;
    fontBold: string;
    fontSmall: string;
    iconCalendar: string;
    iconSearch: string;
    inputSearch: string;
    relative: string;
    search: string;
    searchExplorer: string;
    sql: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    titleDate: string;
    underline: string;
  }
}

declare const SearchExplorerScssModule: SearchExplorerScssNamespace.ISearchExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchExplorerScssNamespace.ISearchExplorerScss;
};

export = SearchExplorerScssModule;
