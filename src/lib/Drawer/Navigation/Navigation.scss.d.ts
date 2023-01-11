declare namespace NavigationScssNamespace {
  export interface INavigationScss {
    active: string;
    navigation: string;
    showMore: string;
  }
}

declare const NavigationScssModule: NavigationScssNamespace.INavigationScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavigationScssNamespace.INavigationScss;
};

export = NavigationScssModule;
