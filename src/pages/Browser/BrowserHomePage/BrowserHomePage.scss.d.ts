declare namespace BrowserHomePageScssNamespace {
  export interface IBrowserHomePageScss {
    AdvancedSearchByModel: string;
    AdvancedSearchByModelContainer: string;
    AdvancedSearchByModelContainer__Content: string;
    AdvancedSearchByModelContainer__Hint: string;
    AdvancedSearchByModel__Button: string;
    AdvancedSearchByModel__Description: string;
    AdvancedSearchByModel__Icon: string;
    AdvancedSearchByModel__Title: string;
    Hack: string;
    NewSearchContainer: string;
    SearchBarContainer: string;
    SearchBtn: string;
    SearchInput: string;
    SearchTitle: string;
  }
}

declare const BrowserHomePageScssModule: BrowserHomePageScssNamespace.IBrowserHomePageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BrowserHomePageScssNamespace.IBrowserHomePageScss;
};

export = BrowserHomePageScssModule;
