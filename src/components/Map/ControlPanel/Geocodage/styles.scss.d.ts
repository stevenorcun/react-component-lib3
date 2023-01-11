declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button_container: string;
    cancel_button: string;
    container: string;
    head_container: string;
    head_label: string;
    horizontalBar: string;
    iconEditDiv: string;
    iconEditIcon: string;
    input2_section: string;
    input3_section: string;
    input_geometry: string;
    input_geometry_altitude: string;
    input_section: string;
    inputs_container: string;
    label_input_geometry: string;
    label_preview: string;
    label_preview_value: string;
    mapPreview: string;
    markerBlue: string;
    markerGray: string;
    reference: string;
    scrollbar: string;
    sub_label: string;
    submit_button: string;
    value_preview: string;
    worldSearchIcon: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
