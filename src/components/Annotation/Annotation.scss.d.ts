declare namespace AnnotationScssNamespace {
  export interface IAnnotationScss {
    AnnotationContainer: string;
    AnnotationContent: string;
    GhostInput: string;
    HiddenInput: string;
    ResizeTriangle: string;
    focused: string;
  }
}

declare const AnnotationScssModule: AnnotationScssNamespace.IAnnotationScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnnotationScssNamespace.IAnnotationScss;
};

export = AnnotationScssModule;
