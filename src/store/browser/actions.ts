import { BrowserState } from "../../store/browser/index";
import {
  BrowserTabType,
  BrowserTemplateVisibility,
  IBrowserAdvancedSearchForm,
  IBrowserPhoneSearchForm,
  IBrowserPhysicalPersonSearchForm,
  IBrowserSearchForm,
  IBrowserSearchFormField,
  IBrowserSimpleSearchForm,
} from "../../constants/browser-related";
import { DB_STRICTNESS } from "../../constants/strictness-select-values";

export const emptyStoreSearchQueries = {
  [BrowserTabType.Simple]: {
    [BrowserTemplateVisibility.Private]: [],
    [BrowserTemplateVisibility.AdminPreset]: [],
    [BrowserTemplateVisibility.Shared]: [],
  },
  [BrowserTabType.Advanced]: {
    [BrowserTemplateVisibility.Private]: [],
    [BrowserTemplateVisibility.AdminPreset]: [],
    [BrowserTemplateVisibility.Shared]: [],
  },
  [BrowserTabType.Person]: {
    [BrowserTemplateVisibility.Private]: [],
    [BrowserTemplateVisibility.AdminPreset]: [],
    [BrowserTemplateVisibility.Shared]: [],
  },
  [BrowserTabType.Phone]: {
    [BrowserTemplateVisibility.Private]: [],
    [BrowserTemplateVisibility.AdminPreset]: [],
    [BrowserTemplateVisibility.Shared]: [],
  },
};

export function _setActiveTabSearchForm(
  state: BrowserState,
  {
    form = {},
    isForced = false,
  }: {
    form: Partial<
      | IBrowserSimpleSearchForm
      | IBrowserAdvancedSearchForm
      | IBrowserPhysicalPersonSearchForm
      | IBrowserPhoneSearchForm
    >;
    isForced: boolean;
  }
) {
  if (state.activeBrowserTabIndex !== null) {
    const tab = state.tabs[state.activeBrowserTabIndex];
    // @ts-ignore
    tab.form = {
      ...(isForced ? {} : tab.form),
      ...form,
    };
  }
}

export function _addCustomFieldToForm(form: IBrowserSearchForm) {
  return [
    ...form.__customFields,
    {
      // to not select an initial value, and prevent duplications when firing onChange
      attributeKey: null,
      values: [],
      type: null,
      strictness: DB_STRICTNESS.ONE_OF,
    },
  ];
}

export function _editCustomFormFieldByIndex(
  form: IBrowserSearchForm,
  index: number,
  newValue: IBrowserSearchFormField<any>
) {
  return form.__customFields.map((field, i) =>
    i === index ? newValue : field
  );
}

export function _deleteCustomFieldByKey(
  form: IBrowserSearchForm,
  index: number
) {
  return form.__customFields.filter((_, i) => i !== index);
}
