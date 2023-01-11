declare namespace StylesScssNamespace {
  export interface IStylesScss {
    input: string;
    inputContainer: string;
    inputElement: string;
    inputTagElement: string;
    inputTagElementLabel: string;
    inputWithButton: string;
    optionContainer: string;
    optionElement: string;
    optionElementInteractive: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
