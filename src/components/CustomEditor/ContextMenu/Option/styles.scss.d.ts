declare namespace StylesScssNamespace {
  export interface IStylesScss {
    contextMenuOption: string;
    disabled: string;
    label: string;
    noIcon: string;
    optionLabel: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
