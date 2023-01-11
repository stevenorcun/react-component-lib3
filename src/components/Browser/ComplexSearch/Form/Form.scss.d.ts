declare namespace FormScssNamespace {
  export interface IFormScss {
    Date: string;
    DateInput: string;
    DateTimePicker: string;
    DateTimePicker_Container: string;
    DateTimePicker__DisplayLeft: string;
    DeleteField: string;
    DeleteField__Icon: string;
    EntityType: string;
    EntityType__InputValue_Container: string;
    EntityType__InputValue_DeleteButton: string;
    Form: string;
    Form__Body: string;
    Form__Editor: string;
    Form__SubmitButton: string;
    Input: string;
    Input_Date__Calendar: string;
    Input_Date__DeleteIcon: string;
    Input_Date__Placeholder: string;
    Label: string;
    Nationalities__SelectedValues: string;
    NationalitySelect: string;
    SearchFormSelect: string;
    SearchFrom__CustomPropertyField: string;
    Separator: string;
    Time: string;
    Value: string;
  }
}

declare const FormScssModule: FormScssNamespace.IFormScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FormScssNamespace.IFormScss;
};

export = FormScssModule;
