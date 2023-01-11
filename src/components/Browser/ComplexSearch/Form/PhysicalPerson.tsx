import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import DropDownSelect from "@/lib/Form/DropDownSelect/DropDownSelect";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserTabType,
  IBrowserPhysicalPersonSearchForm,
} from "@/constants/browser-related";
import Checkbox, { ICheckbox } from "@/lib/Form/Checkbox/Checkbox";
import IconSearch from "@/assets/images/icons/IconSearch";
import FormField from "@/lib/Form/Field/Field";
import { setActiveTabSearchForm } from "@/store/browser";
import { COUNTRIES_AS_ARRAY } from "@/assets/images/icons/flags";
import GroupedValuesInput from "@/lib/Form/GroupedValuesInput/GroupedValuesInput";
import GroupedValuesCalendar from "@/lib/Form/GroupedValuesInput/MultiValuesCalendar/MultiValuesCalendar";
import { preventDefault } from "@/utils/DOM";
import { ENTITY_PROPERTY_DETAILS } from "@/constants/entity-related";
import {
  DB_STRICTNESS,
  defaultStrictnessSelectValues,
} from "@/constants/strictness-select-values";
import { NovaEntityGender } from "@/API/DataModels/Database/NovaEntityEnum";
import FormTemplateLoaderWithInput from "@/components/Browser/FormTemplateLoader/FormTemplateLoader";
import { CanLoadBrowserTemplates } from "@/components/Browser/ComplexSearch/Form/AdvancedSearch";
import styles from "./Form.scss";

interface BrowserPhysicalPersonSearchFormProps extends CanLoadBrowserTemplates {
  form: IBrowserPhysicalPersonSearchForm;
  onSubmit: (
    form: IBrowserPhysicalPersonSearchForm,
    keyToApiMap: { [key: string]: string }
  ) => void;
}

export const EnumValueSelectRenderer = (value, defaultLabel) => (
  <span
    key={value}
    className={cx(
      commons.Flex,
      commons.FlexAlignItemsCenter,
      styles.NationalitySelect,
      styles.Nationalities__SelectedValues
    )}
  >
    {defaultLabel}
  </span>
);

const BrowserPhysicalPersonSearchForm = ({
  form,
  templateSearchValue = "",
  searchTemplates,
  onTemplateLoaded,
  onTemplateUpdated,
  onTemplateSearchInputValueChange,
  onSubmit,
}: BrowserPhysicalPersonSearchFormProps) => {
  const dispatch = useDispatch();

  const handleNameStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        value: {
          ...form.value,
          strictness,
        },
      })
    );
  const handleNameChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        value: {
          ...form.value,
          values,
        },
      })
    );

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const handleBirthdayStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        birthDate: {
          ...form.birthDate,
          strictness,
        },
      })
    );
  const handleBirthdayChange = (values: Array<[number, number]>) =>
    dispatch(
      setActiveTabSearchForm({
        birthDate: {
          ...form.birthDate,
          values,
        },
      })
    );
  const toggleCalendar = (e: MouseEvent | React.MouseEvent) => {
    e.stopPropagation();
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleAddressStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        addresses: {
          ...form.addresses,
          strictness,
        },
      })
    );
  const handleAddressChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        addresses: {
          ...form.addresses,
          values,
        },
      })
    );

  const handleNationalityStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        nationalities: {
          ...form.nationalities,
          strictness,
        },
      })
    );
  const handleNationalityChange = (_: React.MouseEvent, values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        nationalities: {
          ...form.nationalities,
          values,
        },
      })
    );

  const handleGenderStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        sex: {
          ...form.sex,
          strictness,
        },
      })
    );
  const handleGenderChange = ({ value, checked }: Partial<ICheckbox>) => {
    const index = form.sex.values.indexOf(value as NovaEntityGender);
    const genders = [...form.sex.values];
    if (!checked && index !== -1) genders.splice(index, 1);
    else if (checked && index === -1) genders.push(value as NovaEntityGender);
    dispatch(
      setActiveTabSearchForm({
        sex: {
          ...form.sex,
          values: genders,
        },
      })
    );
  };

  const handleSourceStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) =>
    dispatch(
      setActiveTabSearchForm({
        source: {
          ...form.source,
          strictness,
        },
      })
    );
  const handleSourceChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        source: {
          ...form.source,
          values,
        },
      })
    );

  const handleFormSubmit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSubmit(form, BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[BrowserTabType.Person]);
  };

  /* Close calendar by clicking anywhere */
  useEffect(() => {
    if (isCalendarVisible) document.addEventListener("click", toggleCalendar);
    return () => {
      document.removeEventListener("click", toggleCalendar);
    };
  }, [isCalendarVisible]);

  return (
    <>
      <form
        className={cx(styles.Form, styles.Form__Body)}
        onSubmit={preventDefault}
      >
        <FormField>
          <FormTemplateLoaderWithInput
            templateSearchValue={templateSearchValue}
            tabType={BrowserTabType.Person}
            searchTemplates={searchTemplates}
            onTemplateSearchInputValueChange={onTemplateSearchInputValueChange}
            onTemplateLoaded={onTemplateLoaded}
            onTemplateUpdated={onTemplateUpdated}
          />
        </FormField>

        <FormField label={"Nom de l'individu"}>
          <DropDownSelect
            className={styles.SearchFormSelect}
            // @ts-ignore
            values={ENTITY_PROPERTY_DETAILS.names.strictness}
            selectedValues={[form.value.strictness]}
            onChange={handleNameStrictnessChange}
          />
          <GroupedValuesInput
            className={styles.Input}
            placeholder="Saisir un nom"
            values={form.value.values}
            onChange={handleNameChange}
          />
        </FormField>

        <FormField label="Date de naissance">
          <DropDownSelect
            className={styles.SearchFormSelect}
            // @ts-ignore
            values={ENTITY_PROPERTY_DETAILS.birthDate.strictness}
            selectedValues={[form.birthDate.strictness]}
            onChange={handleBirthdayStrictnessChange}
          />
          <GroupedValuesCalendar
            values={form.birthDate.values}
            placeholder="Sélectionner une date"
            onChange={handleBirthdayChange}
          />
        </FormField>

        <FormField label="Adresse">
          <DropDownSelect
            className={styles.SearchFormSelect}
            // @ts-ignore
            values={ENTITY_PROPERTY_DETAILS.addresses.strictness}
            selectedValues={[form.addresses.strictness]}
            onChange={handleAddressStrictnessChange}
          />
          <GroupedValuesInput
            className={styles.Input}
            placeholder="Saisir une adresse"
            values={form.addresses.values}
            onChange={handleAddressChange}
          />
        </FormField>

        <FormField label="Nationalité">
          <DropDownSelect
            className={styles.SearchFormSelect}
            // @ts-ignore
            values={ENTITY_PROPERTY_DETAILS.nationalities.strictness}
            selectedValues={[form.nationalities.strictness]}
            onChange={handleNationalityStrictnessChange}
          />

          <DropDownSelect
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.NationalitySelect,
              styles.SearchFormSelect
            )}
            values={COUNTRIES_AS_ARRAY}
            selectedValues={form.nationalities.values}
            placeholder="Choisir une nationalité"
            isMulti
            isFilterable
            onChange={handleNationalityChange}
            customInputValueRenderer={EnumValueSelectRenderer}
          />
        </FormField>

        <FormField label="Sexe">
          <DropDownSelect
            className={styles.SearchFormSelect}
            // @ts-ignore
            values={ENTITY_PROPERTY_DETAILS.sex.strictness}
            selectedValues={[form.sex.strictness]}
            onChange={handleGenderStrictnessChange}
          />
          <Checkbox
            value={NovaEntityGender.Male}
            label="Masculin"
            checked={form.sex.values.indexOf(NovaEntityGender.Male) !== -1}
            onChange={handleGenderChange}
          />
          <Checkbox
            value={NovaEntityGender.Female}
            label="Féminin"
            checked={form.sex.values.indexOf(NovaEntityGender.Female) !== -1}
            onChange={handleGenderChange}
          />
        </FormField>

        <FormField label="Source">
          <DropDownSelect
            className={styles.SearchFormSelect}
            values={defaultStrictnessSelectValues}
            selectedValues={[form.source.strictness]}
            onChange={handleSourceStrictnessChange}
          />
          <GroupedValuesInput
            className={styles.Input}
            placeholder="Saisir une source"
            values={form.source.values}
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

export default BrowserPhysicalPersonSearchForm;
