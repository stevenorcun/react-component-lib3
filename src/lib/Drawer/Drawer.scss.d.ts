declare namespace DrawerScssNamespace {
  export interface IDrawerScss {
    Drawer__Body: string;
    Drawer__Tab: string;
    drawer: string;
    drawerBorder: string;
    floatBtn: string;
    floating: string;
    leftDrawer: string;
    opened: string;
    resizable: string;
    resizing: string;
    toggleVisibilityBtn: string;
  }
}

declare const DrawerScssModule: DrawerScssNamespace.IDrawerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DrawerScssNamespace.IDrawerScss;
};

export = DrawerScssModule;
