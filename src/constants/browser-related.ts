import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import {
  NovaEntityGender,
  NovaEntityType,
  NovaEntityTypeGroup,
} from "@/API/DataModels/Database/NovaEntityEnum";
import { AggregatedBucket } from "@/API/controllers/search-api";
import { NovaDataType } from "@/constants/entity-related";
import { DB_STRICTNESS } from "@/constants/strictness-select-values";

export enum BrowserTabType {
  Simple = "simple",
  Advanced = "advanced",
  Person = "physical_person",
  Phone = "phone",
  EntityDetails = "DETAILS",
}

export interface SearchResultTypeFiler extends Omit<AggregatedBucket, "key"> {
  key: string | number | NovaEntityType;
  checked: boolean;
}

export interface IBrowserSearchTab {
  // [T922]
  templateSearchValue: string;
  loadedTemplate: BrowserSearchTemplate | null;

  label: string;
  type: BrowserTabType;
  activeEntity?: EntityDto;
  resultTypeFiltersAsMap: { [key in NovaEntityType]?: boolean };
  selectedResults: { [key: string]: EntityDto };
  resultTypeFilters: SearchResultTypeFiler[];
  form:
    | IBrowserSimpleSearchForm
    | IBrowserAdvancedSearchForm
    | IBrowserPhysicalPersonSearchForm
    | IBrowserPhoneSearchForm;
  results: EntityDto[];
  resultsByTypeGroup: {
    // heavy/duplication...
    [key in NovaEntityTypeGroup]?: EntityDto[];
  };
  requestsCount: number;
  isDrawerCollapsed: boolean;
}

export interface IBrowserSearchFormField<T> {
  values: T[];
  strictness: DB_STRICTNESS;
  type: NovaDataType | null; // datetime means Array<[number, number]>
  attributeKey: keyof EntityDto | null; // is only null when we "add" a custom field to a search form (no initial value)
  source?: string | null;
}

export interface IBrowserSearchForm {
  value: IBrowserSearchFormField<string>;
  __customFields: Array<IBrowserSearchFormField<any>>;

  [key: string]:
    | IBrowserSearchFormField<any>
    | Array<IBrowserSearchFormField<any>>;
}

export interface IBrowserSimpleSearchForm extends IBrowserSearchForm {
  createdAt: IBrowserSearchFormField<[number, number]>;
}

export interface IBrowserPhysicalPersonSearchForm extends IBrowserSearchForm {
  birthDate: IBrowserSearchFormField<[number, number]>;
  addresses: IBrowserSearchFormField<string>;
  nationalities: IBrowserSearchFormField<string>;
  sex: IBrowserSearchFormField<NovaEntityGender>;
  source: IBrowserSearchFormField<string>;
}

export interface IBrowserAdvancedSearchForm extends IBrowserSearchForm {
  type: IBrowserSearchFormField<NovaEntityType>;
  // createdAt needs to be undefined initially because that's what
  // @ts-ignore
  createdAt?: IBrowserSearchFormField<[number, number]>;
}

export interface IBrowserPhoneSearchForm extends IBrowserSearchForm {
  // @ts-ignore
  source?: IBrowserSearchFormField<string>;
}

// [T922] Charger/Sauvegarder des template de recherche
export enum BrowserTemplateVisibility {
  Private = "personal", // only type of templates that can be overwritten
  AdminPreset = "preset",
  Shared = "shared",
}

export interface BrowserSearchTemplate {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  query: string; // KQL translation
  formType: BrowserTabType;
  favorite: boolean;
  sort: [];
  title: string; // what the user can search for
  type: BrowserTemplateVisibility;
  form: IBrowserSearchTab["form"];
}

// TODO remove and instead make the "value" field a customField
//  ce mapping est utilisé et remplace le potentiel "attrKey".. bref, à revoir
export const BROWSER_FORM_MAPPING_BY_TYPE_DETAILS = {
  [BrowserTabType.Simple]: {
    // value: 'label',
  },
  [BrowserTabType.Person]: {
    value: "names",
  },
  [BrowserTabType.Phone]: {
    value: "label",
  },
  [BrowserTabType.Advanced]: {
    value: "MOTS_CLES",
  },
  [BrowserTabType.EntityDetails]: {},
};
