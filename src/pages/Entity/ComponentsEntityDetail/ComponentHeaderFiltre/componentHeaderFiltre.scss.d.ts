declare namespace ComponentHeaderFiltreScssNamespace {
  export interface IComponentHeaderFiltreScss {
    buttonSearch: string;
    headerProperty: string;
    headerPropertyLeft: string;
    headerPropertyLeftDivider: string;
    headerPropertyLeftFilter: string;
    headerPropertyLeftIconFilter: string;
    headerPropertyLeftLabel: string;
    headerPropertyLeftSearch: string;
    headerPropertyRight: string;
    headerPropertyRightButton: string;
    headerPropertyRightButtonIcon: string;
  }
}

declare const ComponentHeaderFiltreScssModule: ComponentHeaderFiltreScssNamespace.IComponentHeaderFiltreScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ComponentHeaderFiltreScssNamespace.IComponentHeaderFiltreScss;
};

export = ComponentHeaderFiltreScssModule;
