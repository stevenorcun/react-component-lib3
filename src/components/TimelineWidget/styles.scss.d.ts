declare namespace StylesScssNamespace {
  export interface IStylesScss {
    alignRight: string;
    filter: string;
    filterCircle: string;
    filterCircleBlue: string;
    filterCircleBluePurple: string;
    filterCircleGreen: string;
    filterCirclePurple: string;
    filterCircleRed: string;
    filterGroupName: string;
    filterName: string;
    filters: string;
    filtersContainer: string;
    filtersFolder: string;
    leftNavigation: string;
    opened: string;
    panelContainer: string;
    panelTitle: string;
    rightNavigation: string;
    timeline: string;
    floating: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
