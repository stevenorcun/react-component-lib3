declare namespace StylesScssNamespace {
  export interface IStylesScss {
    divider: string;
    header: string;
    headerButtons: string;
    headerCaseComplementaryInfos: string;
    headerCaseFavorite: string;
    headerCaseMainInfos: string;
    horizontalDivider: string;
    infoContent: string;
    infoTitle: string;
    mainInfos: string;
    optionMenu: string;
    optionMenuTitle: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
