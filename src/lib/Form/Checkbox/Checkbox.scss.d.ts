declare namespace CheckboxScssNamespace {
  export interface ICheckboxScss {
    Checkbox: string;
    Icon: string;
    Input: string;
    Label: string;
  }
}

declare const CheckboxScssModule: CheckboxScssNamespace.ICheckboxScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckboxScssNamespace.ICheckboxScss;
};

export = CheckboxScssModule;
