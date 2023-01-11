declare namespace StylesScssNamespace {
  export interface IStylesScss {
    alignCenter: string;
    alignLeft: string;
    alignRight: string;
    collaboratorIcon: string;
    customWidth: string;
    directoryDocTitle: string;
    docContainer: string;
    documentContainer: string;
    documentControls: string;
    documentPreview: string;
    editor: string;
    editorContainer: string;
    editorDocument: string;
    editorOptionsContainer: string;
    editorToolbar: string;
    focused: string;
    rightSideControls: string;
    singleEditorContainer: string;
    styleButton: string;
    unfocused: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
