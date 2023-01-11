declare namespace GroupedCheckboxScssNamespace {
  export interface IGroupedCheckboxScss {
    GroupedCheckbox: string;
  }
}

declare const GroupedCheckboxScssModule: GroupedCheckboxScssNamespace.IGroupedCheckboxScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedCheckboxScssNamespace.IGroupedCheckboxScss;
};

export = GroupedCheckboxScssModule;
