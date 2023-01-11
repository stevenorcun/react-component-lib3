declare namespace DropDownSelectScssNamespace {
  export interface IDropDownSelectScss {
    Active: string;
    Default: string;
    DropDown: string;
    DropDownSelect: string;
    DropDown__Icon: string;
    Filter__Container: string;
    Filter__Input: string;
    Item: string;
    Item__Icon: string;
    Item__Label: string;
    Item__Selected: string;
    Item__Unselect: string;
    Menu: string;
    SelectedValues: string;
    Text: string;
  }
}

declare const DropDownSelectScssModule: DropDownSelectScssNamespace.IDropDownSelectScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropDownSelectScssNamespace.IDropDownSelectScss;
};

export = DropDownSelectScssModule;
