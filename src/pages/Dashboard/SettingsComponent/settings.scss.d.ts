declare namespace SettingsScssNamespace {
  export interface ISettingsScss {
    card: string;
    icon: string;
    label: string;
    settings: string;
  }
}

declare const SettingsScssModule: SettingsScssNamespace.ISettingsScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SettingsScssNamespace.ISettingsScss;
};

export = SettingsScssModule;
