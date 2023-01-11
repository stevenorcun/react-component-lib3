declare namespace StylesScssNamespace {
  export interface IStylesScss {
    MenuOptions: string;
    headerEntity: string;
    headerEntityAction: string;
    headerEntityDivider: string;
    headerEntityIcon: string;
    headerEntityIdentity: string;
    headerEntityIdentityName: string;
    headerEntityIdentityType: string;
    headerEntityLabel: string;
    headerEntityLabelBlue: string;
    headerEntityLabelGreen: string;
    headerEntityLabelRed: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
