declare namespace NumberInputScssNamespace {
  export interface INumberInputScss {
    MaleContainer: string;
    MaleIncrDecrArrow: string;
    MaleNumberInput: string;
  }
}

declare const NumberInputScssModule: NumberInputScssNamespace.INumberInputScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NumberInputScssNamespace.INumberInputScss;
};

export = NumberInputScssModule;
