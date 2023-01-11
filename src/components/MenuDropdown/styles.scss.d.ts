declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string;
    divider: string;
    label: string;
    menuDropdownContainer: string;
    option: string;
    optionContent: string;
    optionLabel: string;
    optionsContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
