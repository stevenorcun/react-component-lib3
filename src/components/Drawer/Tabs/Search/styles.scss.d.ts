declare namespace StylesScssNamespace {
  export interface IStylesScss {
    search: string;
    searchContainer: string;
    searchControls: string;
    searchInput: string;
    searchBtn: string;
    results: string;
    date: string;
    description: string;
    result: string;
    link: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
