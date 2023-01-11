declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string;
    headbar: string;
    headbar_icon_container_draw: string;
    headbar_icon_container_drawSelected: string;
    headbar_icon_container_select: string;
    headbar_icon_text: string;
    sideItem: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
