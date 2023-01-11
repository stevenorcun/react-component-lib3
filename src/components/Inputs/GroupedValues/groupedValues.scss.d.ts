declare namespace GroupedValuesScssNamespace {
  export interface IGroupedValuesScss {
    FakeInput__Area: string;
    FakeInput__Container: string;
    Last: string;
    OnlyHereForTheBlinkingCursor: string;
    globalGroupedValues: string;
    groupedValue: string;
    groupedValue__closeIcon: string;
    iconArrow: string;
    inputContainer: string;
    inputReadonly: string;
    last: string;
  }
}

declare const GroupedValuesScssModule: GroupedValuesScssNamespace.IGroupedValuesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedValuesScssNamespace.IGroupedValuesScss;
};

export = GroupedValuesScssModule;
