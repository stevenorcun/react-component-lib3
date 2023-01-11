declare namespace MultiValuesCalendarScssNamespace {
  export interface IMultiValuesCalendarScss {
    Calendar__Input: string;
    Calendar__InputAndIcon: string;
    Calendar__Input__Value: string;
    Container: string;
    Input_Date__Calendar_Container: string;
    Input_Date__Icon: string;
  }
}

declare const MultiValuesCalendarScssModule: MultiValuesCalendarScssNamespace.IMultiValuesCalendarScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MultiValuesCalendarScssNamespace.IMultiValuesCalendarScss;
};

export = MultiValuesCalendarScssModule;
