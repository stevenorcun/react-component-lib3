declare namespace CurrentSelectionScssNamespace {
  export interface ICurrentSelectionScss {
    checkboxExplorer: string;
    currentSelection: string;
    currentSelectionLines: string;
    headerCurrentSelection: string;
    headerCurrentSelection__label: string;
    headerCurrentSelection__number: string;
    lineCurrentSelection: string;
    lineCurrentSelection__label: string;
    lineCurrentSelection__selected: string;
    value: string;
  }
}

declare const CurrentSelectionScssModule: CurrentSelectionScssNamespace.ICurrentSelectionScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CurrentSelectionScssNamespace.ICurrentSelectionScss;
};

export = CurrentSelectionScssModule;
