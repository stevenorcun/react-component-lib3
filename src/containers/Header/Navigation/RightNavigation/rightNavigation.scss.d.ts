declare namespace RightNavigationScssNamespace {
  export interface IRightNavigationScss {
    item: string;
    itemRow: string;
    rightNavigation: string;
    searchBtn: string;
    searchControls: string;
    searchInput: string;
    secondary: string;
    tertiary: string;
    userDetails: string;
  }
}

declare const RightNavigationScssModule: RightNavigationScssNamespace.IRightNavigationScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RightNavigationScssNamespace.IRightNavigationScss;
};

export = RightNavigationScssModule;
