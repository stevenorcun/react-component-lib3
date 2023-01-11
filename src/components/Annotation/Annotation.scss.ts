declare namespace AnnotationScssNamespace {
  export interface IAnnotationScss {
    HiddenInput: string;
    ResizeTriangle: string;
    AnnotationContent: string;
    AnnotationContainer: string;
    focused: string;
    GhostInput: string;
  }
}

declare const AnnotationScssModule: AnnotationScssNamespace.IAnnotationScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnnotationScssNamespace.IAnnotationScss;
};

export default AnnotationScssModule;
