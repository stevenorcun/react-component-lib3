declare namespace StylesScssNamespace {
  export interface IStylesScss {
    Accordion: string;
    AccordionTitle: string;
    Active: string;
    AnotherOverlayYay: string;
    Assistance: string;
    Blue: string;
    DropdownList: string;
    Footer: string;
    Footer__Button: string;
    Footer__Cancel: string;
    Footer__Submit: string;
    FusionTargetSelection: string;
    Half: string;
    Label: string;
    Modal: string;
    Modal__Body: string;
    Modal__Body__propertyFusion: string;
    Modal__Footer: string;
    Modal__Header: string;
    NoBackground: string;
    PickOneModal: string;
    PropsToPick: string;
    Row: string;
    SearchInput: string;
    SecondaryModal: string;
    SecondaryModal__UndoFusion: string;
    Section: string;
    SelectedEntity: string;
    SelectedEntityLabel: string;
    SelectedEntityLabel__Label: string;
    SelectedEntityLabel__Prefix: string;
    SubmitButton: string;
    Summary: string;
    Summary_Selected: string;
    Summary__Icon: string;
    Summary__Label: string;
    Summary__Left: string;
    Summary__Properties: string;
    TabSelector: string;
    TabSelectors: string;
    TargetSummary: string;
    TargetSummary__Left: string;
    TargetSummary__Right: string;
    TileSvg: string;
    Value: string;
    alignItemCenter: string;
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss;
};

export = StylesScssModule;
