declare namespace WidgetHeaderScssNamespace {
  export interface IWidgetHeaderScss {
    IsFullWidth: string;
    ToggleVisibilityButton: string;
    Widget__Header: string;
    Widget__Header__Main: string;
    Widget__Header__light: string;
  }
}

declare const WidgetHeaderScssModule: WidgetHeaderScssNamespace.IWidgetHeaderScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WidgetHeaderScssNamespace.IWidgetHeaderScss;
};

export = WidgetHeaderScssModule;
