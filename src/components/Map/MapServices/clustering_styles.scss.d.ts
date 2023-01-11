declare namespace ClusteringStylesScssNamespace {
  export interface IClusteringStylesScss {
    'control-panel': string;
    'control-panel-kml': string;
    'control-panel-polygone': string;
    div_container: string;
    head_container: string;
  }
}

declare const ClusteringStylesScssModule: ClusteringStylesScssNamespace.IClusteringStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ClusteringStylesScssNamespace.IClusteringStylesScss;
};

export = ClusteringStylesScssModule;
