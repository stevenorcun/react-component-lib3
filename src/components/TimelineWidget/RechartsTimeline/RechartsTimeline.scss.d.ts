declare namespace RechartsTimelineScssNamespace {
  export interface IRechartsTimelineScss {
    AxisLabel: string;
    CustomTooltip: string;
    XAxis: string;
    YAxis: string;
    bottomNavigation: string;
    bottomNavigationLeft: string;
    bottomNavigationLeftContent: string;
    bottomNavigationLeftContentBackground: string;
    bottomNavigationLeftDate: string;
    bottomNavigationLeftDateCalendar: string;
    bottomNavigationRight: string;
    bottomNavigationRightButtonEllipsis: string;
    bottomNavigationRightZoomNumber: string;
    dividerVertical: string;
    toolbar: string;
  }
}

declare const RechartsTimelineScssModule: RechartsTimelineScssNamespace.IRechartsTimelineScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RechartsTimelineScssNamespace.IRechartsTimelineScss;
};

export = RechartsTimelineScssModule;
