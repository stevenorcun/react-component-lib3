declare namespace StylesScssNamespace {
  export interface IStylesScss {
    accordion: string;
    accordionTitle: string;
    buttonCancel: string;
    buttonFooter: string;
    buttonValidate: string;
    calendar: string;
    connexionContainer: string;
    containerHeader: string;
    filterCalendar: string;
    headerRowSearch: string;
    iconRemove: string;
    input: string;
    inputCalendar: string;
    inputContainer: string;
    inputLinkContainer: string;
    inputRow: string;
    inputText: string;
    linkPreviewContainer: string;
    margin: string;
    modalLink: string;
    placeholder: string;
    selected: string;
    selectedValue: string;
    switchContainer: string;
    tile: string;
    tileContainer: string;
    tileTarget: string;
    tilesContainer: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
