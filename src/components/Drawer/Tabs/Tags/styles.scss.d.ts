declare namespace StylesScssNamespace {
  export interface IStylesScss {
    DotSeparator: string;
    EntityLabel: string;
    Link: string;
    accordion: string;
    accordion2: string;
    accordionItemContainer: string;
    accordionTitle: string;
    actionColumn: string;
    addButton: string;
    arrow: string;
    emptySelection: string;
    entity: string;
    entityContent: string;
    entityContentImage: string;
    entityDetails: string;
    entityLinksContainer: string;
    entityType: string;
    multipleTags: string;
    propertiesTags: string;
    ruleContent: string;
    ruleLine: string;
    ruleTitleContainer: string;
    selectionWrapper: string;
    tagLabel: string;
    tagLabelContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
