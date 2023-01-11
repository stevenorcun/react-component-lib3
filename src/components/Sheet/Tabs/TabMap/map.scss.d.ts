declare namespace MapScssNamespace {
  export interface IMapScss {
    mapEntityDetail: string;
  }
}

declare const MapScssModule: MapScssNamespace.IMapScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MapScssNamespace.IMapScss;
};

export = MapScssModule;
