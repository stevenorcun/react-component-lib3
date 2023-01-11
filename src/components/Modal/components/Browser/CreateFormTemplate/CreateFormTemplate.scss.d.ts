declare namespace CreateFormTemplateScssNamespace {
  export interface ICreateFormTemplateScss {
    Body: string;
    Cancel: string;
    CloseButton: string;
    Confirm: string;
    Container: string;
    Footer: string;
    Header: string;
    Input: string;
    Label: string;
    Title: string;
    Wrapper: string;
  }
}

declare const CreateFormTemplateScssModule: CreateFormTemplateScssNamespace.ICreateFormTemplateScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateFormTemplateScssNamespace.ICreateFormTemplateScss;
};

export = CreateFormTemplateScssModule;
