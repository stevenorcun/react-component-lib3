declare namespace StylesScssNamespace {
  export interface IStylesScss {
    descriptionKeyWord: string;
    entitled: string;
    flexAlignCenter: string;
    generalPropertyMain: string;
    generalPropertyMainCheckbox: string;
    generalPropertyMainContent: string;
    generalPropertyMainContentDescription: string;
    generalPropertyMainContentDivider: string;
    generalPropertyMainContentEntitled: string;
    generalPropertyMainContentFirst: string;
    generalPropertyMainContentFirst__subtitle: string;
    generalPropertyMainContentGeocoding: string;
    generalPropertyMainContentIconArrowFull: string;
    generalPropertyMainContentLast: string;
    generalPropertyMainContentLastNumber: string;
    generalPropertyMainContentLastTag: string;
    generalPropertyMainContentLigne: string;
    generalPropertyMainContentTags: string;
    generalPropertyMainContentTimestamp: string;
    generalPropertyMainContentTitle: string;
    generalPropertyMainContentTitleColomn: string;
    generalPropertyMain__open: string;
    iconArrowFull: string;
    property: string;
    tag: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
