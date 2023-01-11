declare namespace FullScreenMultimediaFileScssNamespace {
  export interface IFullScreenMultimediaFileScss {
    fullScreen: string;
    fullScreen__feature: string;
  }
}

declare const FullScreenMultimediaFileScssModule: FullScreenMultimediaFileScssNamespace.IFullScreenMultimediaFileScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FullScreenMultimediaFileScssNamespace.IFullScreenMultimediaFileScss;
};

export = FullScreenMultimediaFileScssModule;
