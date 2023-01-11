declare namespace FieldScssNamespace {
  export interface IFieldScss {
    Field: string;
    Label: string;
  }
}

declare const FieldScssModule: FieldScssNamespace.IFieldScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FieldScssNamespace.IFieldScss;
};

export = FieldScssModule;
