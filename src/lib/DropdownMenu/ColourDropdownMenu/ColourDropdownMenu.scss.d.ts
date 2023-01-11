declare namespace ColourDropdownMenuScssNamespace {
  export interface IColourDropdownMenuScss {
    buttonColor: string;
    buttonColor__active: string;
    'color-picker': string;
    'colored-disc': string;
    'colored-disc-area': string;
    contentColor: string;
    dividerTransparent: string;
    title: string;
  }
}

declare const ColourDropdownMenuScssModule: ColourDropdownMenuScssNamespace.IColourDropdownMenuScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColourDropdownMenuScssNamespace.IColourDropdownMenuScss;
};

export = ColourDropdownMenuScssModule;
