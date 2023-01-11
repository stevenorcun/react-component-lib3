declare namespace StylesScssNamespace {
  export interface IStylesScss {
    buttonCancel: string;
    buttonFooter: string;
    buttonValidate: string;
    customOption: string;
    input: string;
    inputContainer: string;
    inputRow: string;
    inputText: string;
    modalContent: string;
    selectedValue: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
