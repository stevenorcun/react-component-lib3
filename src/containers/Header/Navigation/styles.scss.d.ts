declare namespace StylesScssNamespace {
  export interface IStylesScss {
    NavItem: string;
    active: string;
    arrow: string;
    caseName: string;
    caseNameContainer: string;
    counter: string;
    divider: string;
    item: string;
    itemRow: string;
    itemsContainer: string;
    navigation: string;
    searchControls: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
