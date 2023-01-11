declare namespace StylesScssNamespace {
  export interface IStylesScss {
    editorOptionsContainer: string;
    editorToolsBar: string;
    fileInput: string;
    lastUpdate: string;
    toolButton: string;
    userCircle: string;
    usersBar: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
