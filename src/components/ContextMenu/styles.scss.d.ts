declare namespace StylesScssNamespace {
  export interface IStylesScss {
    activeMenu: string;
    circleMenu: string;
    contextMenu: string;
    leftSubMenu: string;
    menuItem: string;
    menuItemBackground: string;
    menuItemTitle: string;
    rightSubMenu: string;
    subMenu: string;
    subMenuItem: string;
    subMenuTitle: string;
    topSubMenu: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
