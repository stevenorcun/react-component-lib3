declare namespace RechartsTimelineScssNamespace {
  export interface IRechartsTimelineScss {
    AxisLabel: string;
    YAxis: string;
    XAxis: string;
    CustomTooltip: string;
    CustomTooltip_Label: string;
  }
}

declare const RechartsTimelineScssModule: RechartsTimelineScssNamespace.IRechartsTimelineScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RechartsTimelineScssNamespace.IRechartsTimelineScss;
};

export = RechartsTimelineScssModule;
