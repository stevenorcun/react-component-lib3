declare namespace StylesScssNamespace {
  export interface IStylesScss {
    leftSubMenu: string;
    rightSubMenu: string;
    subMenu: string;
    subMenuItem: string;
    subMenuTitle: string;
    topSubMenu: string;
    bottomSubMenu: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
