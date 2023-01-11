declare namespace StylesScssNamespace {
  export interface IStylesScss {
    div_layers: string;
    down_arrow: string;
    form_layers: string;
    head_icon2_layers: string;
    head_icon_layers: string;
    head_icon_metro_layers: string;
    head_label: string;
    input_layers: string;
    input_reset_layers: string;
    label_layers: string;
    layers_title: string;
    p_layers: string;
    'rct-title': string;
    right_arrow: string;
    sub: string;
    sub_title: string;
    tree: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
