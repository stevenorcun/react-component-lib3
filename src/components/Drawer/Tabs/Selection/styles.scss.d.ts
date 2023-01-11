declare namespace StylesScssNamespace {
  export interface IStylesScss {
    CurrentSelectionWidgetOffset: string;
    DotSeparator: string;
    EntityLabel: string;
    EventMini: string;
    EventMini__Details: string;
    EventMini__Details_Date: string;
    EventMini__Details_Label: string;
    EventMini__Icon: string;
    GroupValuesContainer: string;
    GroupedEventLine: string;
    GroupedEventLine__Left: string;
    GroupedEventLine__Right: string;
    GroupedEventList: string;
    Link: string;
    Loader: string;
    Property: string;
    PropertyLabel: string;
    PropertyValue: string;
    RelatedEvents__Container: string;
    RelatedEvents__Values: string;
    actions: string;
    emptySelection: string;
    entity: string;
    entityContent: string;
    entityContentImage: string;
    entityDetails: string;
    entityLinksContainer: string;
    entityNumber: string;
    entityProperty: string;
    entityType: string;
    group: string;
    groupName: string;
    selectionWrapper: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
