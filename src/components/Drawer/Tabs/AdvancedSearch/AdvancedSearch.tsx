import React, { useEffect, useState } from "react";
import {
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserSearchFormField,
} from "../../../../constants/browser-related";
import BrowserAdvancedSearchForm, {
  CanLoadBrowserTemplates,
} from "../../../../components/Browser/ComplexSearch/Form/AdvancedSearch";
import cx from "classnames";
import {
  _addCustomFieldToForm,
  _deleteCustomFieldByKey,
  _editCustomFormFieldByIndex,
} from "../../../../store/browser/actions";
import {
  DrawerAdvancedSearchTabState,
  SearchResultFilterBy,
} from "../../../../store/drawer";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import {
  ENTITY_TYPE_DETAILS,
  getEntityStrIcon,
  getEntityTitleProperty,
  getObjectTypeLabel,
} from "../../../../constants/entity-related";
import DraggableEntityOrSummary from "../../../../components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import IconArrow from "../../../../assets/images/icons/IconArrow";
import DropDownSelect from "../../../../lib/Form/DropDownSelect/DropDownSelect";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { SaveFormAsTemplateWidget } from "../../../../pages/Browser/Browser";
import styles from "./styles.scss";
import { useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";

const searchFilterValues = [
  {
    label: SearchResultFilterBy.inProject,
    value: SearchResultFilterBy.inProject,
  },
  {
    label: SearchResultFilterBy.notInProject,
    value: SearchResultFilterBy.notInProject,
  },
  {
    label: SearchResultFilterBy.all,
    value: SearchResultFilterBy.all,
  },
];

interface AdvancedSearchTabProps extends CanLoadBrowserTemplates {
  form?: IBrowserAdvancedSearchForm;
  entitiesGroupedByNovaType: DrawerAdvancedSearchTabState["resultsByType"];
  loadedTemplate: BrowserSearchTemplate | null;
  entitiesAlreadyPresent: { [eId: EntityDto["id"]]: boolean };
  filterBy: SearchResultFilterBy;
  onFormChange: (
    partialForm: Partial<IBrowserAdvancedSearchForm>,
    isForced?: boolean
  ) => void;
  onFilterChange: (filter: SearchResultFilterBy) => void;
  onSubmit: () => void;
}

const DrawerTabAdvancedSearch = ({
  templateSearchValue,
  form,
  entitiesGroupedByNovaType = {},
  loadedTemplate,
  filterBy,
  entitiesAlreadyPresent,
  onFormChange,
  onSubmit,
  searchTemplates,
  onTemplateSearchInputValueChange,
  onTemplateLoaded,
  onTemplateUpdated,
  onFilterChange,
}: AdvancedSearchTabProps) => {
  if (!form) return null;

  // sorted by type ASC
  const [entitiesByTypeArray, setEntitiesByTypeArray] = useState<
    { type: NovaEntityType; entities: EntityDto[] }[]
  >([]);
  const [resultCount, setResultsCount] = useState(0);
  const { ont } = useAppSelector(selectOntologyConfig);

  useEffect(() => {
    let total = 0;
    const sortedTypesAsc = Object.keys(entitiesGroupedByNovaType).sort(
      (type1, type2) =>
        ENTITY_TYPE_DETAILS[type1]?.label >= ENTITY_TYPE_DETAILS[type2]?.label
          ? 1
          : -1
    );

    setEntitiesByTypeArray(
      // @ts-ignore
      sortedTypesAsc.map((novaType) => {
        total += entitiesGroupedByNovaType[novaType].length;
        return {
          type: novaType,
          entities:
            filterBy === SearchResultFilterBy.all
              ? entitiesGroupedByNovaType[novaType]
              : entitiesGroupedByNovaType[novaType].filter(({ id }) =>
                  filterBy === SearchResultFilterBy.inProject
                    ? entitiesAlreadyPresent[id]
                    : !entitiesAlreadyPresent[id]
                ),
        };
      })
    );
    setResultsCount(total);
  }, [entitiesGroupedByNovaType, filterBy]);

  const updateFormValueField = (
    formValue: Partial<IBrowserAdvancedSearchForm["value"]>
  ) => {
    onFormChange({ value: { ...form.value, ...formValue } });
  };
  const updateFormTypeField = (
    formType: Partial<IBrowserAdvancedSearchForm["type"]>
  ) => {
    onFormChange({ type: { ...form.type, ...formType } });
  };
  const updateFormCreatedAtField = (
    formCreatedAt: Partial<IBrowserAdvancedSearchForm["createdAt"]> | null
  ) => {
    if (!formCreatedAt) {
      const clonedForm = { ...form };
      delete clonedForm.createdAt;
      onFormChange({ ...clonedForm }, true);
      // @ts-ignore
    } else onFormChange({ createdAt: { ...form.createdAt, ...formCreatedAt } });
  };
  const setFormCustomFieldByIndex = (
    index: number,
    field: IBrowserSearchFormField<any>
  ) => {
    onFormChange({
      __customFields: _editCustomFormFieldByIndex(form, index, field),
    });
  };

  const createAdvSearchTabFormField = () => {
    onFormChange({
      __customFields: _addCustomFieldToForm(form),
    });
  };

  const deleteAdvSearchCustomFieldByIndex = (index: number) => {
    onFormChange({
      __customFields: _deleteCustomFieldByKey(form, index),
    });
  };

  const handleFilterChange = (_, filter: SearchResultFilterBy) => {
    onFilterChange(filter);
  };

  return (
    <div className={styles.Container}>
      <BrowserAdvancedSearchForm
        className={styles.Form}
        form={form as IBrowserAdvancedSearchForm}
        templateSearchValue={templateSearchValue}
        isOverflowLeft
        setFormValue={updateFormValueField}
        setFormType={updateFormTypeField}
        setFormCreatedAt={updateFormCreatedAtField}
        setFormCustomFieldByIndex={setFormCustomFieldByIndex}
        createFormCustomField={createAdvSearchTabFormField}
        deleteFormCustomFieldByIndex={deleteAdvSearchCustomFieldByIndex}
        onSubmit={onSubmit}
        searchTemplates={searchTemplates}
        onTemplateLoaded={onTemplateLoaded}
        onTemplateSearchInputValueChange={onTemplateSearchInputValueChange}
        onTemplateUpdated={onTemplateUpdated}
      />
      {!!entitiesByTypeArray?.length && (
        <>
          <div
            className={cx(
              commons.Flex,
              commons.FlexDirectionColumn,
              styles.Results__Container
            )}
          >
            <div
              className={cx(
                commons.Flex,
                commons.FlexAlignItemsCenter,
                styles.ResultsHeader
              )}
            >
              Affichage des résultats&nbsp;
              <span className={styles.ResultsHeader__Count}>
                ({resultCount})
              </span>
            </div>

            <div
              className={cx(
                commons.Flex,
                commons.FlexDirectionColumn,
                styles.SortAndFilters
              )}
            >
              <div className={cx(commons.Flex, styles.Sorting)}>
                <span className={styles.Label}>Trier par :</span>
                <div className={cx(commons.clickable, styles.Dropdown)}>
                  <span>Pertinence</span>
                  <IconArrow />
                </div>
                <div className={cx(commons.clickable, styles.Dropdown)}>
                  <span>Affichage en liste</span>
                  <IconArrow />
                </div>
              </div>

              <div
                className={cx(
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  styles.Filter
                )}
              >
                <span className={styles.Label}>Filtrer par:</span>
                <DropDownSelect
                  values={searchFilterValues}
                  selectedValues={[filterBy]}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div
              className={cx(
                commons.Flex,
                commons.FlexDirectionColumn,
                styles.Results
              )}
            >
              {entitiesByTypeArray?.map(
                (e) =>
                  !!e.entities.length && (
                    <div
                      className={cx(
                        commons.Flex,
                        commons.FlexDirectionColumn,
                        styles.TypeGroup
                      )}
                    >
                      <DraggableEntityOrSummary data={e.entities} isEntity>
                        <div className={styles.TypeHeader}>
                          {getObjectTypeLabel(+e.type, ont)}
                          &nbsp;
                          <span className={styles.TypeHeader__Count}>
                            ({e.entities.length})
                          </span>
                        </div>
                      </DraggableEntityOrSummary>
                      <div
                        className={cx(
                          commons.Flex,
                          commons.FlexDirectionColumn,
                          styles.TypeGroup__Entities
                        )}
                      >
                        {e.entities.map((entity) => {
                          const Icon = getEntityStrIcon(entity, ont);
                          return (
                            <>
                              <DraggableEntityOrSummary data={entity} isEntity>
                                <div
                                  className={cx(
                                    commons.Flex,
                                    styles.MiniResult
                                  )}
                                >
                                  {Icon && <Icon />}
                                  {getEntityTitleProperty(entity, ont)}
                                </div>
                              </DraggableEntityOrSummary>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <SaveFormAsTemplateWidget
            className={styles.SaveAsTemplateWidget}
            browserType={BrowserTabType.Advanced}
            form={form}
            loadedTemplate={loadedTemplate}
            templateSearchValue={templateSearchValue}
          />
        </>
      )}
    </div>
  );
};

export default DrawerTabAdvancedSearch;
