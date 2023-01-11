declare namespace ModalMapScssNamespace {
  export interface IModalMapScss {
    attributeValue: string;
    attributes: string;
    attributes__name: string;
    attributes__totalName: string;
    bar: string;
    flex: string;
    flexArround: string;
    header: string;
    headerComponent: string;
    headerComponent__left: string;
    header__left: string;
    listAdressComponent: string;
    listAdressComponent__address: string;
    listAdressComponent__address__paragraph: string;
    listAdressComponent__address__title: string;
    listTypes: string;
    listTypes__header: string;
    listTypes__header__title: string;
    loadBar: string;
    modalMap: string;
    textTitle: string;
  }
}

declare const ModalMapScssModule: ModalMapScssNamespace.IModalMapScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ModalMapScssNamespace.IModalMapScss;
};

export = ModalMapScssModule;
