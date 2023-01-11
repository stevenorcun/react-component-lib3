declare namespace FilterExplorerScssNamespace {
  export interface IFilterExplorerScss {
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
    addCritere: string;
    badge: string;
    buttonFilter: string;
    clickable: string;
    colorPrimary: string;
    colorPrimaryLight: string;
    containerFilter: string;
    containerFilter__head: string;
    contentInput: string;
    dropDownInput: string;
    dropDownInput__element: string;
    filterExplorer: string;
    fontBold: string;
    fontSmall: string;
    head: string;
    head__left: string;
    head__title: string;
    input: string;
    relative: string;
    tag: string;
    tagLight: string;
    tagSelected: string;
    textOverflowTwoLines: string;
    title: string;
    underline: string;
  }
}

declare const FilterExplorerScssModule: FilterExplorerScssNamespace.IFilterExplorerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FilterExplorerScssNamespace.IFilterExplorerScss;
};

export = FilterExplorerScssModule;
