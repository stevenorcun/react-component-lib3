declare namespace GeneralScssNamespace {
  export interface IGeneralScss {
    icon: string;
    iconArrow: string;
    inputContainer: string;
    inputElement: string;
    inputReadonly: string;
    inputWithIcon: string;
    label: string;
  }
}

declare const GeneralScssModule: GeneralScssNamespace.IGeneralScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GeneralScssNamespace.IGeneralScss;
};

export = GeneralScssModule;
