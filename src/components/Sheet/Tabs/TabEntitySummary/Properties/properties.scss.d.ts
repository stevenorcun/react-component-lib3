declare namespace PropertiesScssNamespace {
  export interface IPropertiesScss {
    backgroundIcon: string;
    component: string;
    component__multimediaAll: string;
    component__multimediaMinus: string;
    contentDetail: string;
    divider: string;
    flag: string;
    hidden: string;
    inline: string;
    property: string;
    propertyHeaderTitle: string;
    propertyID: string;
    propertyMain: string;
    propertyMainContent: string;
    propertyMainContentIconDeath: string;
    propertyMainGlobal: string;
    propertyMain_minus: string;
    text: string;
    title: string;
  }
}

declare const PropertiesScssModule: PropertiesScssNamespace.IPropertiesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PropertiesScssNamespace.IPropertiesScss;
};

export = PropertiesScssModule;
