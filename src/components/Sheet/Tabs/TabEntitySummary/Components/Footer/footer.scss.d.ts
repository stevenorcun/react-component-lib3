declare namespace FooterScssNamespace {
  export interface IFooterScss {
    button__disable: string;
    divider: string;
    relatedFooter: string;
    relatedFooterRound: string;
  }
}

declare const FooterScssModule: FooterScssNamespace.IFooterScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FooterScssNamespace.IFooterScss;
};

export = FooterScssModule;
