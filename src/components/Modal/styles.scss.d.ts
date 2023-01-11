declare namespace StylesScssNamespace {
  export interface IStylesScss {
    modal: string;
    modalContainer: string;
    modalContent: string;
    modalFooter: string;
    modalHeader: string;
    modalHeaderTitle: string;
    modalShadow: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
