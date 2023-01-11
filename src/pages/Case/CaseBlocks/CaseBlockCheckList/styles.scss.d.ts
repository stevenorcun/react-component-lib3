declare namespace StylesScssNamespace {
  export interface IStylesScss {
    accordionMargin: string;
    actionChecked: string;
    boxContent: string;
    checkListAccordionTitle: string;
    checkListBox: string;
    checkListBoxTitle: string;
    messageBox: string;
    messageText: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
