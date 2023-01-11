declare namespace StylesScssNamespace {
  export interface IStylesScss {
    addButton: string;
    addButtonContainer: string;
    addIcon: string;
    contextMenuOption: string;
    inputElement: string;
    modalContent: string;
    optionElementInteractive: string;
    selectedValue: string;
    tagsContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
