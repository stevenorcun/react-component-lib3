declare namespace MultimediaFileComponentScssNamespace {
  export interface IMultimediaFileComponentScss {
    Thumbnail: string;
    component: string;
    component__multimediaAll: string;
    component__multimediaMinus: string;
    multimediaFile: string;
    multimediaFilePicture: string;
  }
}

declare const MultimediaFileComponentScssModule: MultimediaFileComponentScssNamespace.IMultimediaFileComponentScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MultimediaFileComponentScssNamespace.IMultimediaFileComponentScss;
};

export = MultimediaFileComponentScssModule;
