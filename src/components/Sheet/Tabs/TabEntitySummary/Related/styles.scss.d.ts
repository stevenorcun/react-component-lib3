declare namespace StylesScssNamespace {
  export interface IStylesScss {
    DraggableOffset: string;
    DraggableSummary: string;
    EntitySummary: string;
    RelatedTypeGroup: string;
    Relative: string;
    backgroundIcon: string;
    button__disable: string;
    linkDocument: string;
    related: string;
    relatedEventMain: string;
    relatedEventMainContent: string;
    relatedEventMainContentIcon: string;
    relatedEventMainContentLeft: string;
    relatedEventMainContentRight: string;
    relatedEventMainContentSubtitle: string;
    relatedEventMainContentVol: string;
    relatedEventMainIcon: string;
    relatedEventMainPipeCircle: string;
    relatedFooter: string;
    relatedFooterRound: string;
    relatedIcon: string;
    relatedIconFile: string;
    relatedList: string;
    relatedListLeft: string;
    relatedListLeftRound: string;
    relatedListNumberTitle: string;
    relatedListRightDate: string;
    relatedListTitle: string;
    relatedMain: string;
    relatedMain__minusRelatedDocument: string;
    relatedMain__minusRelatedEvent: string;
    relatedMain__minusRelatedObject: string;
    relatedObjectList: string;
    relatedObjectListContent: string;
    relatedObjectListContentIcon: string;
    relatedObjectListWrapper: string;
    relatedObjectText: string;
    textglobal: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
