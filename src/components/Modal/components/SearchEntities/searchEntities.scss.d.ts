declare namespace SearchEntitiesScssNamespace {
  export interface ISearchEntitiesScss {
    Accordion: string;
    AccordionTitle: string;
    Assistance: string;
    Blue: string;
    DropdownList: string;
    FusionTargetSelection: string;
    Label: string;
    SearchInput: string;
    SubmitButton: string;
    Summary: string;
    Summary_Selected: string;
    Summary__Icon: string;
    Summary__Label: string;
    Summary__Left: string;
    Summary__Properties: string;
  }
}

declare const SearchEntitiesScssModule: SearchEntitiesScssNamespace.ISearchEntitiesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchEntitiesScssNamespace.ISearchEntitiesScss;
};

export = SearchEntitiesScssModule;
