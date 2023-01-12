import React, { useEffect, useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserSearchFormField,
} from "../../../../constants/browser-related";
import FormField from "../../../../lib/Form/Field/Field";
import DropDownSelect from "../../../../lib/Form/DropDownSelect/DropDownSelect";
import IconSearch from "../../../../assets/images/icons/IconSearch";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import {
  ENTITY_PROPERTY_DETAILS,
  ENTITY_TYPE_DETAILS,
} from "../../../../constants/entity-related";
import { EntityTypeTag } from "../../../../components/Browser/SearchResult/SearchResult";
import IconPlusOutline from "../../../../assets/images/icons/IconPlusOutline";
import GroupedValuesInput from "../../../../lib/Form/GroupedValuesInput/GroupedValuesInput";
import { preventDefault } from "../../../../utils/DOM";
import GroupedValuesCalendar from "../../../../lib/Form/GroupedValuesInput/MultiValuesCalendar/MultiValuesCalendar";
import { toast } from "react-toastify";
import DateTimePicker from "../../../../lib/DateTimePicker/DateTimePicker";
import Moment from "react-moment";
import { createBrowserSearchFormField } from "../../../../utils/browser";
import {
  DB_STRICTNESS,
  defaultStrictnessSelectValues,
} from "../../../../constants/strictness-select-values";
import IconCross from "../../../../assets/images/icons/IconCross";
import FormTemplateLoaderWithInput from "../../../../components/Browser/FormTemplateLoader/FormTemplateLoader";
import { BrowserSearchTemplateStorage } from "../../../../hooks/usePreferences";
import styles from "./Form.scss";
import { useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";
import ObjectDefault from "../../../../assets/images/icons/entityTypes/DEFAULT";
import PropDefault from "../../../../assets/images/icons/entityProperties/DEFAULT";
import { ICON_STORE } from "../../../../assets/images/icons/icon-store";

export interface CanLoadBrowserTemplates {
  templateSearchValue: string;
  searchTemplates: BrowserSearchTemplateStorage;
  onTemplateSearchInputValueChange: (inputValue: string) => void;
  onTemplateLoaded: (template: BrowserSearchTemplate) => void;
  onTemplateUpdated: (template: BrowserSearchTemplate) => void;
}

interface BrowserAdvancedSearchFormProps extends CanLoadBrowserTemplates {
  className?: string;
  form: IBrowserAdvancedSearchForm;
  isOverflowLeft?: boolean;
  setFormValue: (
    formValue: Partial<IBrowserAdvancedSearchForm["value"]>
  ) => void;
  setFormType: (formValue: Partial<IBrowserAdvancedSearchForm["type"]>) => void;
  setFormCreatedAt: (
    formCreatedAt: IBrowserAdvancedSearchForm["createdAt"] | null
  ) => void;
  setFormCustomFieldByIndex: (
    index: number,
    field: IBrowserSearchFormField<any>
  ) => void;
  createFormCustomField: () => void;
  deleteFormCustomFieldByIndex: (index: number) => void;
  // display DateTimePick popups on the right or on the left
  onSubmit: (
    form: IBrowserAdvancedSearchForm,
    keyToApiMap: { [key: string]: string }
  ) => void;
}

const BrowserAdvancedSearchForm = ({
  className,
  templateSearchValue = "",
  searchTemplates,
  form,
  isOverflowLeft = false,
  setFormValue,
  setFormType,
  setFormCreatedAt,
  setFormCustomFieldByIndex,
  createFormCustomField,
  deleteFormCustomFieldByIndex,
  onTemplateSearchInputValueChange,
  onTemplateLoaded,
  onTemplateUpdated,
  onSubmit,
}: BrowserAdvancedSearchFormProps) => {
  // const dispatch = useDispatch();
  const { ont } = useAppSelector(selectOntologyConfig);

  // Labels, in alphabetical order
  const objectTypesSelectValues = ont
    .map((o) => {
      const Icon = ICON_STORE[o.icon];
      return {
        label: o.label || o.name,
        value: o.name,
        icon: Icon ? <Icon /> : <ObjectDefault />,
      };
    })
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  // Values of the "custom property fields" dropdown select
  const entityPropertiesDetailsAsArray = ont
    .reduce((acc, o) => {
      const props = o.properties
        .filter((item) => {
          const propLabel = item.label || item.name;
          const itemIndex = acc.findIndex((p) => p.label === propLabel);
          return itemIndex === -1;
        })
        .map((p) => {
          const Icon = ICON_STORE[p.icon];
          return {
            label: p.label || p.name,
            value: p.name,
            icon: Icon ? <Icon /> : <PropDefault />,
          };
        });
      acc.push(...props);
      return acc;
    }, [])
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  // an entity can only have one type, so there is no use for Exact
  // TODO move to entity-related PROPERTY_DETAILS
  const typeStrictnessValues = [
    {
      value: DB_STRICTNESS.ONE_OF,
      label: DB_STRICTNESS.ONE_OF,
    },
  ];

  const [startInterval, setStartInterval] = useState<Date | null>(null);
  const [endInterval, setEndInterval] = useState<Date | null>(null);
  const [isHorodatageVisible, setIsHorodatageVisible] = useState(false);

  const toggleHorodatageCalendarVisibility = (
    e: React.MouseEvent | MouseEvent
  ) => {
    e.stopPropagation();
    setIsHorodatageVisible(!isHorodatageVisible);
  };

  // useEffect(() => {
  //   if (isHorodatageVisible)
  //     document.addEventListener('click', toggleHorodatageCalendarVisibility);
  //   return () => {
  //     document.removeEventListener('click', toggleHorodatageCalendarVisibility);
  //   };
  // }, [isHorodatageVisible]);

  useEffect(() => {
    if (form.createdAt && form.createdAt[0]) {
      setStartInterval(
        typeof form.createdAt[0][0] === "number"
          ? new Date(form.createdAt[0])
          : null
      );
      setEndInterval(
        typeof form.createdAt[0][1] === "number"
          ? new Date(form.createdAt[1])
          : null
      );
    }
  }, [form.createdAt]);

  // TODO set form by key instead
  const handleValueChange = (values: string[]) => setFormValue({ values });
  const handleValueStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) => setFormValue({ strictness });

  const handleTypeChange = (e: React.MouseEvent, values: NovaEntityType[]) => {
    setFormType({ values });
  };

  const handleTypeStrictnessChange = (
    _: React.MouseEvent,
    strictness: DB_STRICTNESS
  ) => setFormType({ strictness });

  const handleFormSubmit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSubmit(
      form,
      BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[BrowserTabType.Advanced]
    );
  };

  const deleteTypeValue = (type: NovaEntityType, e: React.MouseEvent) => {
    e.stopPropagation();
    const types = [...form.type.values];
    const index = types.indexOf(type);
    if (index !== -1) types.splice(index, 1);
    setFormType({ values: types });
    // dispatch(setActiveTabSearchForm({ type: { ...form.type, values: types } }));
  };
  const typeValuesRenderer = (type: NovaEntityType, defaultLabel: string) => {
    const handleDeleteClick = (e: React.MouseEvent) => deleteTypeValue(type, e);

    return (
      <EntityTypeTag
        key={type}
        label={ENTITY_TYPE_DETAILS[type]?.label || defaultLabel}
        color={ENTITY_TYPE_DETAILS[type]?.color}
        className={styles.EntityType__InputValue_Container}
      >
        <span
          className={styles.EntityType__InputValue_DeleteButton}
          onClick={handleDeleteClick}
        >
          &#10006;
        </span>
      </EntityTypeTag>
    );
  };

  /**
   * Changes a field property
   * and resets its values (to account for possible type changes)
   */
  const handleCustomFieldPropertyKeyChange = (index, newKey) => {
    const isKeyAlreadyInForm =
      newKey === "label" ||
      form.__customFields.find(({ attributeKey }) => attributeKey === newKey);
    if (isKeyAlreadyInForm) toast.error("Ce champ existe déjà");
    else {
      setFormCustomFieldByIndex(
        index,
        createBrowserSearchFormField({
          attributeKey: newKey,
        })
      );
    }
  };
  const handleCustomStrictnessChange = (index, strictness) => {
    setFormCustomFieldByIndex(index, {
      ...form.__customFields[index],
      strictness,
    });
  };
  const handleCustomFieldValuesChange = (index, values) => {
    setFormCustomFieldByIndex(index, {
      ...form.__customFields[index],
      values,
    });
    /*
    dispatch(
      editCustomFormFieldByIndex({
        index,
        newValue: {
          ...form.__customFields[index],
          values,
        },
      }),
    );
    // */
  };
  const addCustomPropertyField = () => {
    createFormCustomField();
    // dispatch(addCustomFieldToForm());
  };

  const addHorodatage = () => {
    setFormCreatedAt(
      createBrowserSearchFormField({
        values: new Array<[number, number]>(),
        strictness: DB_STRICTNESS.RANGE,
        type: "datetime",
        attributeKey: "createdAt",
      })
    );
    /*
    dispatch(
      setActiveTabSearchForm({
        createdAt: createBrowserSearchFormField({
          values: new Array<[number, number]>(),
          strictness: DB_STRICTNESS.RANGE,
          type: 'datetime',
          attributeKey: 'createdAt',
        }),
      }),
    );
    // */
  };

  const removeHorodatage = () => {
    setFormCreatedAt(null);
    /*
    const clone = { ...form };
    delete clone.createdAt;
    dispatch(
      forceSetActiveTabSearchForm(clone),
    );
    // */
  };

  const handleHorodatageChange = (timestamps: [number, number][]) => {
    // @ts-ignore
    setFormCreatedAt({
      ...form.createdAt,
      values: timestamps,
    });
    /*
    dispatch(
      setActiveTabSearchForm({
        createdAt: {
          ...form.createdAt,
          values: timestamps,
        },
      }),
    );
    // */
  };

  const handleDateTimePickerChange = (dates: [Date] | [Date, Date]) => {
    setStartInterval(dates[0]);
    setEndInterval(dates[1] || null);

    const timestamps = [dates.map((d) => d.getTime())];
    setFormCreatedAt({
      ...form.createdAt,
      // @ts-ignore
      values: timestamps,
    });
    /*
    dispatch(
      setActiveTabSearchForm({
        createdAt: {
          ...form.createdAt,
          values: timestamps,
        },
      }),
    );
    // */
  };

  const deleteCustomFieldByIndex = (index: number) => {
    deleteFormCustomFieldByIndex(index);
    // dispatch(deleteCustomFieldByKey({ index }));
  };

  return (
    <form
      className={cx(styles.Form, styles.Form__Body, className)}
      onSubmit={preventDefault}
    >
      <FormField>
        <FormTemplateLoaderWithInput
          templateSearchValue={templateSearchValue}
          tabType={BrowserTabType.Advanced}
          searchTemplates={searchTemplates}
          onTemplateSearchInputValueChange={onTemplateSearchInputValueChange}
          onTemplateLoaded={onTemplateLoaded}
          onTemplateUpdated={onTemplateUpdated}
        />
      </FormField>

      <FormField label="Mot-clé">
        <DropDownSelect
          className={styles.SearchFormSelect}
          values={defaultStrictnessSelectValues}
          selectedValues={[form.value?.strictness]}
          onChange={handleValueStrictnessChange}
        />
        <GroupedValuesInput
          className={styles.Input}
          placeholder="Saisir un mot-clé"
          values={form.value?.values}
          onChange={handleValueChange}
        />
      </FormField>
      <FormField label={"Type d'objet"}>
        <DropDownSelect
          className={styles.SearchFormSelect}
          values={typeStrictnessValues}
          selectedValues={[form.type?.strictness]}
          onChange={handleTypeStrictnessChange}
        />
        <DropDownSelect
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            styles.SearchFormSelect,
            styles.EntityType
          )}
          values={objectTypesSelectValues}
          // @ts-ignore
          selectedValues={form.type?.values}
          placeholder={"Choisir un type d'objet"}
          isMulti
          isFilterable
          // @ts-ignore
          onChange={handleTypeChange}
          // @ts-ignore
          customInputValueRenderer={typeValuesRenderer}
        />
      </FormField>

      {form?.__customFields?.map(
        ({ attributeKey, strictness, values }, index) => (
          <div
            key={`${attributeKey}-${index}`}
            className={styles.SearchFrom__CustomPropertyField}
          >
            <FormField label="Sélection de la propriété">
              <div
                className={cx(
                  commons.clickable,
                  commons.Hoverable,
                  styles.DeleteField
                )}
                onClick={() => {
                  deleteCustomFieldByIndex(index);
                }}
              >
                <IconCross className={styles.DeleteField__Icon} />
              </div>
              <DropDownSelect
                className={styles.SearchFormSelect}
                values={entityPropertiesDetailsAsArray}
                // @ts-ignore
                selectedValues={[attributeKey]}
                isMulti={false}
                isFilterable
                onChange={(e, data) =>
                  handleCustomFieldPropertyKeyChange(index, data)
                }
              />

              {attributeKey && (
                <>
                  <DropDownSelect
                    className={styles.SearchFormSelect}
                    values={defaultStrictnessSelectValues}
                    selectedValues={[strictness]}
                    onChange={(_, data) =>
                      handleCustomStrictnessChange(index, data)
                    }
                  />
                  {/*
                   * TODO
                   * get ontology prop type  */}
                  {/* {(ENTITY_PROPERTY_DETAILS[attributeKey]?.type === 'string'
                    || ENTITY_PROPERTY_DETAILS[attributeKey]?.type
                    === 'number') && ( */}
                  <GroupedValuesInput
                    className={styles.Input}
                    placeholder="Saisir une valeur"
                    values={values}
                    onChange={(data) =>
                      handleCustomFieldValuesChange(index, data)
                    }
                  />
                  {/* )} */}
                  {ENTITY_PROPERTY_DETAILS[attributeKey]?.type ===
                    "datetime" && (
                    <GroupedValuesCalendar
                      values={values as [number, number][]}
                      placeholder="Sélectionner une date"
                      onChange={(data) =>
                        handleCustomFieldValuesChange(index, data)
                      }
                    />
                  )}
                  {ENTITY_PROPERTY_DETAILS[attributeKey]?.type === "enum" &&
                    typeof ENTITY_PROPERTY_DETAILS[attributeKey]
                      ?.mappedDetails === "object" && (
                      <DropDownSelect
                        placeholder="Sélectionner une valeur"
                        className={cx(
                          commons.Flex,
                          commons.FlexAlignItemsCenter,
                          styles.NationalitySelect,
                          styles.SearchFormSelect
                        )}
                        values={Object.keys(
                          // @ts-ignore
                          ENTITY_PROPERTY_DETAILS[attributeKey]?.mappedDetails
                        ).map((key) => ({
                          // @ts-ignore
                          ...ENTITY_PROPERTY_DETAILS[attributeKey]
                            ?.mappedDetails[key],
                          value: key,
                        }))}
                        // @ts-ignore
                        customInputValueRenderer={
                          ENTITY_PROPERTY_DETAILS[attributeKey]?.customRenderer
                        }
                        isMulti
                        isFilterable
                        selectedValues={values as string[]}
                        onChange={(e, data) =>
                          handleCustomFieldValuesChange(index, data)
                        }
                      />
                    )}
                </>
              )}
            </FormField>
          </div>
        )
      )}

      {form.createdAt && (
        <div className={styles.SearchFrom__CustomPropertyField}>
          <FormField label="Intervalle de temps">
            <div
              className={cx(
                commons.clickable,
                commons.Hoverable,
                styles.DeleteField
              )}
              onClick={removeHorodatage}
            >
              <IconCross className={styles.DeleteField__Icon} />
            </div>
            {!form.createdAt.values.length && (
              <div
                className={commons.clickable}
                onClick={toggleHorodatageCalendarVisibility}
              >
                <GroupedValuesCalendar
                  className={commons.PointerEventsNone}
                  values={[]}
                  placeholder="Sélectionner une période"
                  isMulti={false}
                  onChange={handleHorodatageChange}
                />
              </div>
            )}
            {form.createdAt.values[0] && (
              <div
                className={cx(
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  styles.DateTimePicker_Container
                )}
                onClick={toggleHorodatageCalendarVisibility}
              >
                <DateTimeWithLabel
                  label="Début"
                  value={form.createdAt.values[0][0]}
                />
                <div
                  className={cx(
                    commons.Flex,
                    commons.FlexAlignItemsCenter,
                    styles.Separator
                  )}
                >
                  &#8212;
                </div>
                <DateTimeWithLabel
                  label="Fin"
                  value={form.createdAt.values[0][1]}
                />
              </div>
            )}

            {isHorodatageVisible && (
              <DateTimePicker
                className={cx(styles.DateTimePicker, {
                  [styles.DateTimePicker__DisplayLeft]: isOverflowLeft,
                })}
                value={[startInterval, endInterval]}
                selectRange
                allowPartialRange={false}
                onChange={handleDateTimePickerChange}
                toggleVisibility={toggleHorodatageCalendarVisibility}
              />
            )}
          </FormField>
        </div>
      )}

      <div
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.Form__Editor
        )}
      >
        <div
          className={cx(commons.clickable, commons.Hoverable)}
          onClick={addHorodatage}
        >
          <IconPlusOutline />
          <span className={commons.clickable}>
            Ajouter un intervalle de temps
          </span>
        </div>
        <div
          className={cx(commons.clickable, commons.Hoverable)}
          onClick={addCustomPropertyField}
        >
          <IconPlusOutline />
          <span>Ajouter une propriété</span>
        </div>
      </div>

      <div
        className={cx(commons.clickable, styles.Form__SubmitButton)}
        onClick={handleFormSubmit}
      >
        <IconSearch fill="#3083F7" />
        <span>Rechercher</span>
      </div>
    </form>
  );
};

interface DateTimeWithLabelProps {
  label: string;
  value: Date | number | null;
  onClick?: (e: React.MouseEvent) => void;
}

const DateTimeWithLabel = ({
  label,
  value,
  onClick,
}: DateTimeWithLabelProps) => (
  <div
    className={cx(
      commons.Flex,
      commons.FlexDirectionColumn,
      commons.clickable,
      styles.DateInput
    )}
    onClick={onClick}
  >
    {label && <div className={styles.Label}>{label}</div>}
    <div className={styles.Value}>
      {value ? <Moment format="DD/MM/YYYY">{value}</Moment> : "-"}
    </div>
    <div className={styles.Time}>
      {value ? <Moment format="HH:mm:ss.SSS">{value}</Moment> : <>&nbsp;</>}
    </div>
  </div>
);

export default BrowserAdvancedSearchForm;
