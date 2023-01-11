declare namespace StylesScssNamespace {
  export interface IStylesScss {
    subBar: string;
    buttonFilters: string;
    tagsContainer: string;
    tag: string;
    searchSettings: string;

    setting: string;
    filtersPanel: string;
    filtersHeader: string;
    tagsHeader: string;
    rightHeader: string;
    filtersFields: string;
    field: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
