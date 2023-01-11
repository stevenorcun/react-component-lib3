declare namespace StylesScssNamespace {
  export interface IStylesScss {
    Active: string;
    CloseIcon: string;
    NewTabButton: string;
    SearchIcon: string;
    SearchNavigation: string;
    SearchTab: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
