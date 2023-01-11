declare namespace ComponentSubtitleScssNamespace {
  export interface IComponentSubtitleScss {
    buttonOpen: string;
    generalProperty: string;
    generalPropertyHeader: string;
    generalPropertyHeaderLeft: string;
    icon: string;
    numberLink: string;
    title: string;
  }
}

declare const ComponentSubtitleScssModule: ComponentSubtitleScssNamespace.IComponentSubtitleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ComponentSubtitleScssNamespace.IComponentSubtitleScss;
};

export = ComponentSubtitleScssModule;
