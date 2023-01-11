declare namespace HeaderArrayPropertyScssNamespace {
  export interface IHeaderArrayPropertyScss {
    checkbox: string;
    description: string;
    divider: string;
    entitled: string;
    entitled__content: string;
    flexAlignCenter: string;
    geocoding: string;
    headerMain: string;
    tags: string;
    timestamp: string;
  }
}

declare const HeaderArrayPropertyScssModule: HeaderArrayPropertyScssNamespace.IHeaderArrayPropertyScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HeaderArrayPropertyScssNamespace.IHeaderArrayPropertyScss;
};

export = HeaderArrayPropertyScssModule;
