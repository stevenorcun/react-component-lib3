declare namespace SearchResultScssNamespace {
  export interface ISearchResultScss {
    EntityTypeTag: string;
    SearchResult: string;
    SearchResult__Body: string;
    SearchResult__Footer: string;
    SearchResult__Footer__Link: string;
    SearchResult__Footer__Link_Disabled: string;
    SearchResult__Footer__Separator: string;
    SearchResult__Header: string;
    SearchResult__Header__CheckboxContainer: string;
    SearchResult__Header__Icon: string;
    SearchResult__Header__IconContainer: string;
    SearchResult__Header__NewTabButton: string;
    SearchResult__Header__TitleContainer: string;
    SearchResult__Header__TitleContainer__Name: string;
    SearchResult__Header__TitleContainer__Tags: string;
    SearchResult__Selected: string;
  }
}

declare const SearchResultScssModule: SearchResultScssNamespace.ISearchResultScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchResultScssNamespace.ISearchResultScss;
};

export = SearchResultScssModule;
