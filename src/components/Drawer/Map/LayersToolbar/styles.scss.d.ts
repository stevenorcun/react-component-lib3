declare namespace StylesScssNamespace {
  export interface IStylesScss {
    IconOpenFile: string;
    btnStyle: string;
    containers: string;
    dragover: string;
    layers_icon_container_select: string;
    layers_icon_text: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
