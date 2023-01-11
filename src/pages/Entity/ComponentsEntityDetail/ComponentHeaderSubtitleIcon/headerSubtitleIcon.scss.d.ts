declare namespace HeaderSubtitleIconScssNamespace {
  export interface IHeaderSubtitleIconScss {
    icon: string;
    relatedHeader: string;
    relatedHeaderTitle: string;
  }
}

declare const HeaderSubtitleIconScssModule: HeaderSubtitleIconScssNamespace.IHeaderSubtitleIconScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HeaderSubtitleIconScssNamespace.IHeaderSubtitleIconScss;
};

export = HeaderSubtitleIconScssModule;
