declare namespace RecentActivityScssNamespace {
  export interface IRecentActivityScss {
    icon: string;
    iconType: string;
    images: string;
    noData: string;
    openTab: string;
    recentActivity: string;
    recentActivityLeft: string;
    recentActivityLeftFiltre: string;
    recentActivityLeftFiltreContent: string;
    recentActivityLeftFiltreContentIcon: string;
    recentActivityLeftHeader: string;
    recentActivityLeftHeaderIcon: string;
    recentActivityLeftListCards: string;
    recentActivityLeftListCardsCard: string;
    recentActivityLeftListCardsCardHover: string;
    recentActivityLeftListCardsCardHoverColor: string;
    recentActivityLeftListCardsCardLeft: string;
    recentActivityLeftListCardsCardLeftSubtitle: string;
    recentActivityLeftListCardsCardLeftTitle: string;
    recentActivityLeftListCardsCardRight: string;
    recentActivityRight: string;
    recentActivityRightListCards: string;
    recentActivityRightListCardsCard: string;
    recentActivityRightListCardsCardHeader: string;
    recentActivityRightListCardsCardHeaderLeft: string;
    recentActivityRightListCardsCardHeaderLeftContent: string;
    recentActivityRightListCardsCardHeaderLeftContentSubtitle: string;
    recentActivityRightListCardsCardHeaderLeftContentTitle: string;
    recentActivityRightListCardsCardMain: string;
  }
}

declare const RecentActivityScssModule: RecentActivityScssNamespace.IRecentActivityScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RecentActivityScssNamespace.IRecentActivityScss;
};

export = RecentActivityScssModule;
