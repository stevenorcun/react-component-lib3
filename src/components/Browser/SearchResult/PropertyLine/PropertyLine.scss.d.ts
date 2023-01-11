declare namespace PropertyLineScssNamespace {
  export interface IPropertyLineScss {
    AddressesPropertyValues: string;
    ArtifactIcons_Container: string;
    DOTDOTDOT: string;
    SearchResult__Body__PropertyLine: string;
    SearchResult__Body__PropertyLine__PropertyLabel: string;
    SearchResult__Body__PropertyLine__PropertyValue: string;
    SearchResult__Body__PropertyLine__PropertyValue_Collapsed: string;
    SearchResult__Body__PropertyLine__PropertyValue_Overflowing: string;
  }
}

declare const PropertyLineScssModule: PropertyLineScssNamespace.IPropertyLineScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PropertyLineScssNamespace.IPropertyLineScss;
};

export = PropertyLineScssModule;
