declare namespace DateTimePickerScssNamespace {
  export interface IDateTimePickerScss {
    CalendarContainer: string;
    Column: string;
    Container: string;
    First: string;
    Footer: string;
    Footer_SubmitButtons: string;
    Footer_SubmitButtons_Cancel: string;
    Footer_SubmitButtons_Confirm: string;
    Footer_TimePickers: string;
    Footer_TimePickers__EndDate: string;
    Footer_TimePickers__EndTime: string;
    Footer_TimePickers__Icon: string;
    Footer_TimePickers__Separator: string;
    Footer_TimePickers__StartDate: string;
    Footer_TimePickers__StartTime: string;
    HhMmSsSss_Container: string;
    HhMmSsSss__TimeInput: string;
    HhMmSsSss__TimeInput_Input: string;
    HhMmSsSss__TimeSeparator: string;
    Last: string;
    NumberSelect: string;
    QuickPeriodWidget: string;
    QuickPeriodWidget_Period: string;
    Selected: string;
    SigmaCalendar: string;
    SigmaContainer: string;
    Sigma_Left: string;
    Sigma_Right: string;
    Time: string;
  }
}

declare const DateTimePickerScssModule: DateTimePickerScssNamespace.IDateTimePickerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DateTimePickerScssNamespace.IDateTimePickerScss;
};

export = DateTimePickerScssModule;
