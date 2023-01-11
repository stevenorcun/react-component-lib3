declare namespace SearchScssNamespace {
  export interface ISearchScss {
    icon: string;
    input: string;
    search: string;
  }
}

declare const SearchScssModule: SearchScssNamespace.ISearchScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchScssNamespace.ISearchScss;
};

export = SearchScssModule;
