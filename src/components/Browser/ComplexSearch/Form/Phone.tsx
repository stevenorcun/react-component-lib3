import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserTabType,
  IBrowserPhoneSearchForm,
} from "@/constants/browser-related";
import FormField from "@/lib/Form/Field/Field";
import DropDownSelect from "@/lib/Form/DropDownSelect/DropDownSelect";
import IconSearch from "@/assets/images/icons/IconSearch";
import { useDispatch } from "react-redux";
import {
  BrowserState,
  selectBrowser,
  setActiveTabSearchForm,
} from "@/store/browser";
import GroupedValuesInput from "@/lib/Form/GroupedValuesInput/GroupedValuesInput";
import { preventDefault } from "@/utils/DOM";
import {
  DB_STRICTNESS,
  defaultStrictnessSelectValues,
} from "@/constants/strictness-select-values";
import FormTemplateLoaderWithInput from "@/components/Browser/FormTemplateLoader/FormTemplateLoader";
import { useAppSelector } from "@/store/hooks";
import { CanLoadBrowserTemplates } from "@/components/Browser/ComplexSearch/Form/AdvancedSearch";
import styles from "./Form.scss";

interface BrowserPhoneFormProps extends CanLoadBrowserTemplates {
  form: IBrowserPhoneSearchForm;
  onSubmit: (
    form: IBrowserPhoneSearchForm,
    keyToApiMap: { [key: string]: string }
  ) => void;
}

const BrowserPhoneSearchForm = ({
  form,
  templateSearchValue,
  onSubmit,
  onTemplateSearchInputValueChange,
  onTemplateUpdated,
  onTemplateLoaded,
}: BrowserPhoneFormProps) => {
  const browserState = useAppSelector<BrowserState>(selectBrowser);
  const dispatch = useDispatch();

  const handleValueChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        value: {
          ...form.value,
          values: values.map((v) => v.replace(/[^\d|+\n]*/g, "")),
        },
      })
    );
  const handleValueStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(setActiveTabSearchForm({ value: { ...form.value, strictness } }));

  const handleSourceChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        sources: {
          ...form.sources,
          // @ts-ignore
          values,
        },
      })
    );
  const handleSourceStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      // @ts-ignore
      setActiveTabSearchForm({ source: { ...form.source, strictness } })
    );

  const handleFormSubmit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSubmit(
      {
        ...form,
      },
      BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[BrowserTabType.Phone]
    );
  };

  return (
    <>
      <form
        className={cx(styles.Form, styles.Form__Body)}
        onSubmit={preventDefault}
      >
        <FormField>
          <FormTemplateLoaderWithInput
            tabType={BrowserTabType.Phone}
            templateSearchValue={templateSearchValue}
            searchTemplates={browserState.searchTemplates}
            onTemplateUpdated={onTemplateUpdated}
            onTemplateLoaded={onTemplateLoaded}
            onTemplateSearchInputValueChange={onTemplateSearchInputValueChange}
          />
        </FormField>

        <FormField label="Numéro de téléphone">
          <DropDownSelect
            className={styles.SearchFormSelect}
            values={defaultStrictnessSelectValues}
            selectedValues={[form.value.strictness]}
            onChange={handleValueStrictnessChange}
          />
          <GroupedValuesInput
            className={styles.Input}
            placeholder="Saisir un numéro de téléphone"
            values={form.value.values}
            type="phone-number"
            onChange={handleValueChange}
          />
        </FormField>

        <FormField label="Source">
          <DropDownSelect
            className={styles.SearchFormSelect}
            values={defaultStrictnessSelectValues}
            selectedValues={[form.source!.strictness]}
            onChange={handleSourceStrictnessChange}
          />
          <GroupedValuesInput
            className={styles.Input}
            type="text"
            placeholder="Saisir une source"
            values={form.source!.values}
            onChange={handleSourceChange}
          />
        </FormField>

        <div
          className={cx(commons.clickable, styles.Form__SubmitButton)}
          onClick={handleFormSubmit}
        >
          <IconSearch fill="#3083F7" />
          <span>Rechercher</span>
        </div>
      </form>
    </>
  );
};

export default BrowserPhoneSearchForm;
