declare namespace MultimediaFileScssNamespace {
  export interface IMultimediaFileScss {
    activePicture: string;
    addMultimediaFile: string;
    component: string;
    customActionsMenu: string;
    customActionsMenuContainer: string;
    divider: string;
    icon: string;
    iconMedia: string;
    multimediaFile: string;
    multimediaFileFooter: string;
    multimediaFileFooterLeft: string;
    multimediaFileFooterLeftButtonDownload: string;
    multimediaFileFooterLeftButtonMedia: string;
    multimediaFileFooterRight: string;
    multimediaFileFooterRightDivider: string;
    multimediaFileLeft: string;
    multimediaFileLeftListPicture: string;
    multimediaFileLeftListPictureSet: string;
    multimediaFileLeftPicture: string;
    multimediaFileLeftSearch: string;
    multimediaFileLeftSearchContent: string;
    multimediaFileRight: string;
    multimediaFileRightContent: string;
    multimediaFileRightContentDescription: string;
    multimediaFileRightContentDescriptionCreation: string;
    multimediaFileRightContentDescriptionTitle: string;
    multimediaFileRightPicture: string;
    openIn: string;
  }
}

declare const MultimediaFileScssModule: MultimediaFileScssNamespace.IMultimediaFileScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MultimediaFileScssNamespace.IMultimediaFileScss;
};

export = MultimediaFileScssModule;
