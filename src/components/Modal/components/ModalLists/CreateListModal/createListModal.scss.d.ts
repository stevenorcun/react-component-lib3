declare namespace CreateListModalScssNamespace {
  export interface ICreateListModalScss {
    boutonAllLists: string;
    createList: string;
    footerModal: string;
    boutonFooter: string;
  }
}

declare const CreateListModalScssModule: CreateListModalScssNamespace.ICreateListModalScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateListModalScssNamespace.ICreateListModalScss;
};

export = CreateListModalScssModule;
