declare namespace StylesScssNamespace {
  export interface IStylesScss {
    Container: string;
    Dropdown: string;
    Filter: string;
    Form: string;
    Label: string;
    MiniResult: string;
    Results: string;
    ResultsHeader: string;
    ResultsHeader__Count: string;
    Results__Container: string;
    SaveAsTemplateWidget: string;
    SortAndFilters: string;
    Sorting: string;
    TypeGroup: string;
    TypeGroup__Entities: string;
    TypeHeader: string;
    TypeHeader__Count: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
