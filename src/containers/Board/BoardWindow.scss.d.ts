declare namespace BoardWindowScssNamespace {
  export interface IBoardWindowScss {
    boardWindow: string;
    boardBackground: string;
    "linear-gradient": string;
  }
}

declare const BoardWindowScssModule: BoardWindowScssNamespace.IBoardWindowScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BoardWindowScssNamespace.IBoardWindowScss;
};

export = BoardWindowScssModule;
