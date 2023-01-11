import {
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserPhoneSearchForm,
  IBrowserPhysicalPersonSearchForm,
  IBrowserSearchForm,
  IBrowserSearchFormField,
  IBrowserSimpleSearchForm,
} from "@/constants/browser-related";
import {
  NovaEntityGender,
  NovaEntityType,
} from "@/API/DataModels/Database/NovaEntityEnum";
import { DB_STRICTNESS } from "@/constants/strictness-select-values";
import { ENTITY_PROPERTY_DETAILS } from "@/constants/entity-related";
import { Optional } from "@/utils/types";

/**
 * Formats a form to become a elastic-KQL valid query
 * The `formKeyToApiMap` translates the keys in the form to the keys expected by the backend
 * (only really useful for transforming value into label/names/phoneNumber etc...)
 */
export const formToSearchQuery = (
  form: IBrowserSearchForm,
  formKeyToApiMap: { [key: string]: string } = {}
) => {
  const queries: string[] = [];

  if (!form) return;

  Object.keys(form).forEach((key) => {
    // this is stupid, repetition from attributeKey
    const k = formKeyToApiMap[key] || key;
    const field =
      (form[key] as IBrowserSearchFormField<any>) ||
      form.__customFields.find(
        (customField) => customField.attributeKey === key
      );

    if (
      !field.attributeKey &&
      !formKeyToApiMap[key] &&
      field.values &&
      field.type
    ) {
      queries.push(`${field.values.join(" OR ")}`);
    } else if (!!field && !!field.values && field.values.length) {
      const { values } = field;

      let query = "";

      if (field.type === "datetime") {
        // DO NOTHING (ignores horodatage)
        return;
        // values = values.map((interval: [number, number]) => {
        //   const q = `${k}: [${interval[0]} TO ${interval[1]}]`;
        //   return q;
        // });
        // query = values.join(' OR ');
      }
      switch (field.strictness) {
        case DB_STRICTNESS.EXACT:
          query = `${k}:"${values.join(`" AND ${k}:"`)}"`;
          break;
        case DB_STRICTNESS.ONE_OF:
          query = `${k}:${values.join(` OR ${k}:`)}`;
          break;
        case DB_STRICTNESS.IS:
          // TODO double check KQL, seems this is the same as ONE_OF
          query = `${k}:${values
            .map((v: string) => (v.slice(-1) === "*" ? v : `${v}*`))
            .join(` OR ${k}:`)}`;
          break;
        // Not used anymore, but for Integer intervals maybe later
        case DB_STRICTNESS.RANGE:
          if (Array.isArray(field.values) && field.values.length === 2) {
            query = `${formKeyToApiMap[key]}>=${field.values[0]} AND ${formKeyToApiMap[key]}<=${field.values[1]}`;
          } else console.warn(form[key], "is not a range");
          break;
        default:
          console.error("Invalid strictness", key, field.strictness);
      }

      // fails silently if still empty, but should never occur
      if (query) queries.push(`(${query})`);
    } else if (key === "__customFields") {
      const objFlattenedCustomFields = form.__customFields.reduce((acc, f) => {
        if (f.attributeKey) acc[f.attributeKey] = f;
        return acc;
      }, {});
      // @ts-ignore
      const customFieldsQuery = formToSearchQuery(objFlattenedCustomFields);
      if (customFieldsQuery!.length) queries.push(customFieldsQuery!);
    }
  });
  return queries.join(" AND ");
};

// TODO throw if no attributeKey ?
export const createBrowserSearchFormField = ({
  attributeKey,
  values = [],
  strictness = DB_STRICTNESS.IS,
  type = "string",
}: Optional<
  IBrowserSearchFormField<typeof values>,
  "type" | "values" | "strictness"
>) => ({
  attributeKey,
  values,
  strictness:
    // @ts-ignore
    ENTITY_PROPERTY_DETAILS[attributeKey]?.strictness[0]?.value ?? strictness,
  // @ts-ignore
  type: ENTITY_PROPERTY_DETAILS[attributeKey]?.type ?? type,
});

export const createBrowserSearchFormByType: (
  type: BrowserTabType,
  initialValue: string[]
) =>
  | IBrowserSearchForm
  | IBrowserSimpleSearchForm
  | IBrowserAdvancedSearchForm
  | IBrowserPhysicalPersonSearchForm
  | IBrowserPhoneSearchForm = (type: BrowserTabType, initialValue) => {
  const base = {
    // @ts-ignore
    value: createBrowserSearchFormField({
      // attributeKey: 'MOTS_CLES', // si ajouté ici, sera affecté dans les recherches Simples, et on ne veut pas ça
      values: initialValue,
    }),
    __customFields: [],
  };
  switch (type) {
    case BrowserTabType.Person:
      return {
        ...base,
        birthDate: createBrowserSearchFormField({
          attributeKey: "birthDate",
          values: new Array<[number, number]>(),
          strictness: DB_STRICTNESS.RANGE,
          type: "datetime",
        }),
        addresses: createBrowserSearchFormField({ attributeKey: "address" }),
        nationalities: createBrowserSearchFormField({
          attributeKey: "nationalities",
        }),
        sex: createBrowserSearchFormField({
          values: new Array<NovaEntityGender>(),
          attributeKey: "sex",
        }),
        source: createBrowserSearchFormField({ attributeKey: "source" }),
      };
    case BrowserTabType.Advanced:
      return {
        ...base,
        type: createBrowserSearchFormField({
          values: new Array<NovaEntityType>(),
          strictness: DB_STRICTNESS.ONE_OF,
          type: "string",
          attributeKey: "type",
        }),
        /*     createdAt: createBrowserSearchFormField({
              values: new Array<[number, number]>(),
              strictness: DB_STRICTNESS.RANGE,
              type: 'datetime'
            }), */
      };
    case BrowserTabType.Phone:
      return {
        ...base,
        source: createBrowserSearchFormField({
          attributeKey: "source",
          type: "string",
        }),
      };
    case BrowserTabType.Simple:
      return {
        ...base,
        createdAt: createBrowserSearchFormField(
          createBrowserSearchFormField({
            values: new Array<[number, number]>(),
            strictness: DB_STRICTNESS.RANGE,
            type: "datetime",
            attributeKey: "createdAt",
          })
        ),
      };
    case BrowserTabType.EntityDetails:
    default:
      return base;
  }
};
