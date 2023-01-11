declare namespace ResultFilterScssNamespace {
  export interface IResultFilterScss {
    ResultTypeFilters_Wrapper: string;
    ResultTypeFilters__Filter_Group: string;
    ResultTypeFilters__Filter_Group_Label: string;
    ResultTypeFilters__Filters_Checkbox: string;
    ResultTypeFilters__Filters_FilterCount: string;
    ResultTypeFilters__Header: string;
    ResultTypeFilters__Filters: string;
    ResultTypeFilters__Filter: string;
  }
}

declare const ResultFilterScssModule: ResultFilterScssNamespace.IResultFilterScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ResultFilterScssNamespace.IResultFilterScss;
};

export = ResultFilterScssModule;
