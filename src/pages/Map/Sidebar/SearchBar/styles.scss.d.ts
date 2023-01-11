declare namespace StylesScssNamespace {
  export interface IStylesScss {
    btnSearch: string;
    btnSearchDiv: string;
    containerMapGeocoder: string;
    iconSearch: string;
    opened: string;
    searchContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
