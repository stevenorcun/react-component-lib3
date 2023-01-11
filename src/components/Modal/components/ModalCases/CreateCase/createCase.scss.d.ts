declare namespace CreateCaseScssNamespace {
  export interface ICreateCaseScss {
    asterix: string;
    buttonFooter: string;
    cancel: string;
    caseFooter: string;
    content: string;
    createCase: string;
    element: string;
    input: string;
    lists: string;
    setInputs: string;
    title: string;
  }
}

declare const CreateCaseScssModule: CreateCaseScssNamespace.ICreateCaseScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateCaseScssNamespace.ICreateCaseScss;
};

export = CreateCaseScssModule;
