declare namespace StylesScssNamespace {
  export interface IStylesScss {
    EntityDetail: string;
    EntityDetailContent: string;
    EntityDetailContentMain: string;
    EntityDetailContentMainLeft: string;
    EntityDetailContentMainRight: string;
    headerNavigation: string;
    headerNavigationDivider__active: string;
    headerNavigation__active: string;
    headerNavigation__title: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
