declare namespace RelatedScssNamespace {
  export interface IRelatedScss {
    card: string;
    flexAlignCenter: string;
    generalPropertyMain: string;
    generalPropertyMainCheckbox: string;
    generalPropertyMainContent: string;
    generalPropertyMainContentConfidenceValue: string;
    generalPropertyMainContentDivider: string;
    generalPropertyMainContentEmail: string;
    generalPropertyMainContentEmail__text: string;
    generalPropertyMainContentEndDate: string;
    generalPropertyMainContentFirst: string;
    generalPropertyMainContentFirst__subtitle: string;
    generalPropertyMainContentLigne: string;
    generalPropertyMainContentLinkText: string;
    generalPropertyMainContentLinkTextNumber: string;
    generalPropertyMainContentLinkTextNumber__colorDatabase: string;
    generalPropertyMainContentLinkTextNumber__colorPerson: string;
    generalPropertyMainContentLinkTextNumber__colorTag: string;
    generalPropertyMainContentLinkTextTag: string;
    generalPropertyMainContentLinkText__text: string;
    generalPropertyMainContentQuotation: string;
    generalPropertyMainContentStartDate: string;
    generalPropertyMainContentTitle: string;
    generalPropertyMainContentTitleColomn: string;
    generalPropertyMainContentType: string;
    generalPropertyMainContentType__label: string;
    generalPropertyMain__open: string;
    headerTitle: string;
    related: string;
  }
}

declare const RelatedScssModule: RelatedScssNamespace.IRelatedScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RelatedScssNamespace.IRelatedScss;
};

export = RelatedScssModule;
