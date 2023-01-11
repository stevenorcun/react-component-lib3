declare namespace StylesScssNamespace {
  export interface IStylesScss {
    accordion: string;
    accordionTitle: string;
    autocompleteObjectOption: string;
    buttonCancel: string;
    buttonFooter: string;
    buttonValidate: string;
    inputContainer: string;
    inputTagElement: string;
    inputTagElementLabel: string;
    inputText: string;
    optionElementInteractive: string;
    optionElementProperties: string;
    switchChecked: string;
    switchCheckedText: string;
    switchContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
