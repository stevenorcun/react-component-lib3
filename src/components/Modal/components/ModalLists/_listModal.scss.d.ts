declare namespace ListModalScssNamespace {
  export interface IListModalScss {
    boutonAllLists: string;
    globalModal: string;
    globalModal__footer: string;
    intro: string;
  }
}

declare const ListModalScssModule: ListModalScssNamespace.IListModalScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ListModalScssNamespace.IListModalScss;
};

export = ListModalScssModule;
