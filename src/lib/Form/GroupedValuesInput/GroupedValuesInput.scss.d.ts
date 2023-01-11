declare namespace GroupedValuesInputScssNamespace {
  export interface IGroupedValuesInputScss {
    FakeInput__Area: string;
    FakeInput__Container: string;
    GroupedValue: string;
    GroupedValue__CloseIcon: string;
    Last: string;
    OnlyHereForTheBlinkingCursor: string;
  }
}

declare const GroupedValuesInputScssModule: GroupedValuesInputScssNamespace.IGroupedValuesInputScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedValuesInputScssNamespace.IGroupedValuesInputScss;
};

export = GroupedValuesInputScssModule;
