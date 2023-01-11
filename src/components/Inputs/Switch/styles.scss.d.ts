declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string;
    disabled: string;
    reactSwitch: string;
    reactSwitchButton: string;
    reactSwitchCheckbox: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
