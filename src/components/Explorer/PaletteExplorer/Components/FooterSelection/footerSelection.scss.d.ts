declare namespace FooterSelectionScssNamespace {
  export interface IFooterSelectionScss {
    icon: string;
    label: string;
    openIn: string;
    selectionFooter: string;
    selectionFooterSet: string;
  }
}

declare const FooterSelectionScssModule: FooterSelectionScssNamespace.IFooterSelectionScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FooterSelectionScssNamespace.IFooterSelectionScss;
};

export = FooterSelectionScssModule;
