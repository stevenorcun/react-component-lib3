declare namespace SimpleSearchLayoutScssNamespace {
  export interface ISimpleSearchLayoutScss {
    AdvancedSearchResult: string;
    MainContainer: string;
    ResultFilters__Container: string;
    ResultFilters__Filters: string;
    ResultFilters__Total: string;
    ResultFilters__Total_Count: string;
    ResultFilters__Total_Label: string;
    Results__Container: string;
    Results__DisplayModeButton: string;
    Results__DisplayModeButton_Grid: string;
    Results__DisplayModeButtons_Container: string;
    Results__List: string;
    Results__List_GridMode: string;
    Results__List_Group: string;
    Results__List_Group_Label: string;
    Results__allSelected: string;
    Results__allSelectedInput: string;
    Results__allSelected__button: string;
    Results__allSelected__buttons: string;
    Results__allSelected__checkbox: string;
    Results__allSelected__container: string;
    Results__allSelected__title: string;
    Results__display: string;
    SearchAndResults__Container: string;
    SearchWidget__Container: string;
    SearchWidget__Filter__Button: string;
    SearchWidget__Filter__Container: string;
    SearchWidget__Form: string;
    SearchWidget__Form_CalendarTime: string;
    SearchWidget__Form_DatePicker: string;
    SearchWidget__Form_DatePicker_DateInput: string;
    SearchWidget__Form_DatePicker_DateInput_Label: string;
    SearchWidget__Form_DatePicker_DateInput_Value: string;
    SearchWidget__Form_DatePicker_Icons: string;
    SearchWidget__Form_DatePicker_Separator: string;
    SearchWidget__Form_DateTimePicker: string;
    SearchWidget__Form_DateTimePicker_Time: string;
    SearchWidget__Form_Input: string;
    SearchWidget__Form_QueryLanguage: string;
    SearchWidget__SubmitButton: string;
    Selected: string;
  }
}

declare const SimpleSearchLayoutScssModule: SimpleSearchLayoutScssNamespace.ISimpleSearchLayoutScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SimpleSearchLayoutScssNamespace.ISimpleSearchLayoutScss;
};

export = SimpleSearchLayoutScssModule;
