declare namespace DropdownMenuScssNamespace {
  export interface IDropdownMenuScss {
    dropdown: string;
    "dropdown-content": string;
    show: string;
  }
}

declare const DropdownMenuScssModule: DropdownMenuScssNamespace.IDropdownMenuScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuScssNamespace.IDropdownMenuScss;
};

export = DropdownMenuScssModule;
