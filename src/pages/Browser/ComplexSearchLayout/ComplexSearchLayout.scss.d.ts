declare namespace ComplexSearchLayoutScssNamespace {
  export interface IComplexSearchLayoutScss {
    AdvancedSearchResult: string;
    BothCollapsed: string;
    Collapsed: string;
    EntityDetailsWidget: string;
    Filter: string;
    Filters: string;
    MainContainer: string;
    ResultsWidget: string;
    ResultsWidget__Body: string;
    ResultsWidget__FiltersContainer: string;
    ResultsWidget__Header: string;
    ResultsWidget__Header_Button: string;
    ResultsWidget__Header__ButtonsContainer: string;
    SearchWidget: string;
    SearchWidget__Body: string;
    SearchWidget__FormContainer: string;
    SearchWidget__ResultTypeFilters: string;
    Widget: string;
    WidgetBody: string;
    input: string;
    label: string;
    selectInput: string;
  }
}

declare const ComplexSearchLayoutScssModule: ComplexSearchLayoutScssNamespace.IComplexSearchLayoutScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ComplexSearchLayoutScssNamespace.IComplexSearchLayoutScss;
};

export = ComplexSearchLayoutScssModule;
