declare namespace OptionsScssNamespace {
  export interface IOptionsScss {
    button: string;
    divider: string;
    icon: string;
    label: string;
    options: string;
    options__Body: string;
    title: string;
  }
}

declare const OptionsScssModule: OptionsScssNamespace.IOptionsScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OptionsScssNamespace.IOptionsScss;
};

export = OptionsScssModule;
