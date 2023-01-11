declare namespace FormTemplateLoaderScssNamespace {
  export interface IFormTemplateLoaderScss {
    DropDown: string;
    DropDownMenu: string;
    IsFav: string;
    SearchInput: string;
    SearchInput__IconContainer: string;
    StatusHeader: string;
    TemplateLabel: string;
    TemplateList: string;
    TemplateStatusGroup: string;
  }
}

declare const FormTemplateLoaderScssModule: FormTemplateLoaderScssNamespace.IFormTemplateLoaderScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FormTemplateLoaderScssNamespace.IFormTemplateLoaderScss;
};

export = FormTemplateLoaderScssModule;
