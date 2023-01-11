declare namespace HeaderArrayScssNamespace {
  export interface IHeaderArrayScss {
    flexAlignCenter: string;
    generalPropertyMain: string;
    generalPropertyMainCheckbox: string;
    generalPropertyMainContent: string;
    generalPropertyMainContentDivider: string;
    generalPropertyMainContentEmail: string;
    generalPropertyMainContentEmail__text: string;
    generalPropertyMainContentEndDate: string;
    generalPropertyMainContentFirst: string;
    generalPropertyMainContentFirst__subtitle: string;
    generalPropertyMainContentIconArrowFull: string;
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
    iconArrowFull: string;
  }
}

declare const HeaderArrayScssModule: HeaderArrayScssNamespace.IHeaderArrayScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HeaderArrayScssNamespace.IHeaderArrayScss;
};

export = HeaderArrayScssModule;
