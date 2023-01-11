declare namespace StylesScssNamespace {
  export interface IStylesScss {
    CreateSearchAlert: string;
    DateWrapper: string;
    DateWrapperArrowsEnd: string;
    DateWrapperArrowsStart: string;
    DateWrapperContentBottom: string;
    DateWrapperContentBottomButton: string;
    DateWrapperContentBottomButtonCancel: string;
    DateWrapperContentBottomButtonUpdate: string;
    DateWrapperContentBottomDates: string;
    DateWrapperContentLeft: string;
    DateWrapperContentLeftLiActive: string;
    DateWrapperContentRight: string;
    DateWrapperContentRightTop: string;
    DateWrapperContentRightTopCalendar: string;
    DateWrapperContentRightTopHour: string;
    DateWrapperContentRightTopHourSelect: string;
    EntityDetailsContainer: string;
    EntityDetailsLayout: string;
    OpenAllInNewTabs: string;
    backgroundModal: string;
    dateFirst: string;
    dateFirstValue: string;
    dateFirstValueColor: string;
    datesFilters: string;
    divider: string;
    inputStartDate: string;
    leftContainer: string;
    main: string;
    searchBtn: string;
    searchInput: string;
    searchOptions: string;
    searchResultsContainer: string;
    searchbarContainer: string;
    sqlFilter: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
