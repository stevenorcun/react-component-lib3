declare namespace StylesScssNamespace {
  export interface IStylesScss {
    BarContainer: string;
    attribute: string;
    attributeValue: string;
    bar: string;
    isToggled: string;
    loadBar: string;
    totalLabel: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
