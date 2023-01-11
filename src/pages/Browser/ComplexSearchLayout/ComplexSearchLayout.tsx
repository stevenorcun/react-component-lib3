import React, { useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconArrow from "@/assets/images/icons/IconArrow";
import IconNewTab from "@/assets/images/icons/IconNewTab";
import {
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserPhoneSearchForm,
  IBrowserPhysicalPersonSearchForm,
  IBrowserSearchFormField,
} from "@/constants/browser-related";
import BrowserPhysicalPersonSearchForm from "@/components/Browser/ComplexSearch/Form/PhysicalPerson";
import ResultFilters from "@/components/Browser/ComplexSearch/ResultFilters/ResultFilters";
import BrowserSearchResult from "@/components/Browser/SearchResult/SearchResult";
import WidgetHeader from "@/components/Browser/WidgetHeader/WidgetHeader";
import Entity from "@/pages/Entity/Entity";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import BrowserPhoneSearchForm from "@/components/Browser/ComplexSearch/Form/Phone";
import BrowserAdvancedSearchForm from "@/components/Browser/ComplexSearch/Form/AdvancedSearch";
import { SearchTabLayoutProps } from "@/pages/Browser/SearchTabLayout/SearchTabLayout";
import { unhandle } from "@/utils/DOM";
import {
  addCustomFieldToForm,
  BrowserState,
  createTabByType,
  deleteCustomFieldByKey,
  editCustomFormFieldByIndex,
  forceSetActiveTabSearchForm,
  selectBrowser,
  setActiveTabSearchForm,
  setLoadedTemplate,
  setTemplateSearchInputValue,
  toggleAllSelection,
  updateTemplate,
} from "@/store/browser";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import IconBell from "@/assets/images/icons/IconBell";
import IconOpen from "@/assets/images/icons/IconOpen";

import styles from "./ComplexSearchLayout.scss";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import ModalTypes from "@/constants/modal";

const ComplexSearchLayout = ({
  tab,
  onResultClick,
  onResultSelect,
  onResultDragStart,
  onSubmit,
}: SearchTabLayoutProps) => {
  const browserState = useAppSelector<BrowserState>(selectBrowser);
  const dispatch = useAppDispatch();
  const { showModal } = useGlobalModalContext();

  const [isSearchWidgetCollapsed, setIsSearchWidgetCollapsed] = useState(false);
  const [isResultWidgetCollapsed, setIsResultWidgetCollapsed] = useState(false);

  const toggleSearchWidgetCollapsing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchWidgetCollapsed(!isSearchWidgetCollapsed);
  };
  const toggleResultWidgetCollapsing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResultWidgetCollapsed(!isResultWidgetCollapsed);
  };

  let title;
  let description;
  switch (tab.type) {
    case BrowserTabType.Advanced:
      title = "Recherche avancée";
      description = "Tout type d’entité, évènement ou doc...";
      break;
    case BrowserTabType.Person:
      title = "Recherche";
      description = "Personne physique";
      break;
    case BrowserTabType.Phone:
      title = "Recherche téléphone";
      break;
    default:
  }

  const handleOpenAllSelectDetails = (e: React.MouseEvent) => {
    unhandle(e);
    Object.keys(tab.selectedResults).forEach((id) => {
      dispatch(
        createTabByType({
          value: tab.selectedResults[id].label,
          type: BrowserTabType.EntityDetails,
          activeEntity: tab.selectedResults[id],
          isActive: false,
        })
      );
    });
  };

  const setFormValue = (newValue: Partial<IBrowserSearchFormField<string>>) =>
    dispatch(
      setActiveTabSearchForm({
        value: {
          ...tab.form.value,
          ...newValue,
        },
      })
    );

  const setFormType = (
    formValue: Partial<IBrowserAdvancedSearchForm["type"]>
  ) => {
    dispatch(
      setActiveTabSearchForm({
        // @ts-ignore
        type: {
          ...tab.form.type,
          ...formValue,
        },
      })
    );
  };

  const setFormCustomFieldByIndex = (
    index: number,
    field: IBrowserSearchFormField<any>
  ) => {
    dispatch(
      editCustomFormFieldByIndex({
        index,
        newValue: field,
      })
    );
  };

  const setFormCreatedAt = (
    createdAt: IBrowserAdvancedSearchForm["createdAt"] | null
  ) => {
    if (!createdAt) {
      const clonedForm = { ...tab.form };
      delete clonedForm.createdAt;
      dispatch(forceSetActiveTabSearchForm(clonedForm));
    } else {
      dispatch(setActiveTabSearchForm({ createdAt }));
    }
  };

  const createFormCustomField = () => dispatch(addCustomFieldToForm());

  const deleteFormCustomFieldByIndex = (index) =>
    dispatch(deleteCustomFieldByKey({ index }));

  const handleTemplateLoaded = (template: BrowserSearchTemplate) => {
    dispatch(setLoadedTemplate(template));
    dispatch(forceSetActiveTabSearchForm(template.form));
  };

  const handleTemplateUpdate = (templateToUpdate) => {
    dispatch(updateTemplate(templateToUpdate));
  };

  const handleTemplateSearchInputValueChange = (str: string) => {
    dispatch(setTemplateSearchInputValue(str));
  };

  const handleAllSelect = (e: React.BaseSyntheticEvent) => {
    const { checked } = e.target;
    if (checked) {
      const result = browserState.tabs[
        // @ts-ignore
        browserState.activeBrowserTabIndex
      ].results.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
      dispatch(toggleAllSelection(result));
    } else {
      dispatch(toggleAllSelection({}));
    }
  };

  const handleAddToListModal = () => {
    const entities = Object.values(tab.selectedResults).map(
      (element) => element
    );
    showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities });
  };

  return (
    <div className={cx(styles.MainContainer, commons.PrettyScroll)}>
      <div
        className={cx(styles.Widget, styles.SearchWidget, {
          [styles.Collapsed]: isSearchWidgetCollapsed,
        })}
      >
        <WidgetHeader
          title={title}
          description={description}
          isDescriptionLight={tab.type !== BrowserTabType.Phone}
          onToggle={toggleSearchWidgetCollapsing}
        />

        <div
          className={cx(
            styles.WidgetBody,
            styles.SearchWidget__Body,
            commons.PrettyScroll
          )}
        >
          <div className={styles.SearchWidget__FormContainer}>
            {tab.type === BrowserTabType.Advanced && (
              <BrowserAdvancedSearchForm
                templateSearchValue={tab.templateSearchValue}
                searchTemplates={browserState.searchTemplates}
                form={tab.form as IBrowserAdvancedSearchForm}
                setFormValue={setFormValue}
                setFormCreatedAt={setFormCreatedAt}
                setFormType={setFormType}
                setFormCustomFieldByIndex={setFormCustomFieldByIndex}
                createFormCustomField={createFormCustomField}
                deleteFormCustomFieldByIndex={deleteFormCustomFieldByIndex}
                onSubmit={onSubmit}
                onTemplateLoaded={handleTemplateLoaded}
                onTemplateSearchInputValueChange={
                  handleTemplateSearchInputValueChange
                }
                onTemplateUpdated={handleTemplateUpdate}
              />
            )}
            {tab.type === BrowserTabType.Person && (
              <BrowserPhysicalPersonSearchForm
                templateSearchValue={tab.templateSearchValue}
                searchTemplates={browserState.searchTemplates}
                form={tab.form as IBrowserPhysicalPersonSearchForm}
                onSubmit={onSubmit}
                onTemplateLoaded={handleTemplateLoaded}
                onTemplateSearchInputValueChange={
                  handleTemplateSearchInputValueChange
                }
                onTemplateUpdated={handleTemplateUpdate}
              />
            )}
            {tab.type === BrowserTabType.Phone && (
              <BrowserPhoneSearchForm
                templateSearchValue={tab.templateSearchValue}
                searchTemplates={browserState.searchTemplates}
                form={tab.form as IBrowserPhoneSearchForm}
                onSubmit={onSubmit}
                onTemplateLoaded={handleTemplateLoaded}
                onTemplateSearchInputValueChange={
                  handleTemplateSearchInputValueChange
                }
                onTemplateUpdated={handleTemplateUpdate}
              />
            )}
          </div>
          <div
            className={cx(
              { [commons.Hidden]: !tab.results.length },
              styles.SearchWidget__ResultTypeFilters
            )}
          >
            <ResultFilters filters={tab.resultTypeFilters} />
          </div>
        </div>
      </div>
      {!!tab.results?.length && (
        <div
          className={cx(styles.Widget, styles.ResultsWidget, {
            [styles.Collapsed]: isResultWidgetCollapsed,
            [styles.BothCollapsed]:
              isResultWidgetCollapsed && isSearchWidgetCollapsed,
          })}
        >
          <WidgetHeader
            title={`Affichage des résultats (${tab.results.length})`}
            // @ts-ignore
            description={
              <div className={styles.selectInput}>
                <input
                  className={styles.input}
                  type="checkbox"
                  id="allSelected"
                  onChange={handleAllSelect}
                />
                <label className={styles.label}>Tout sélectionner</label>
              </div>
            }
            isDescriptionLight
            className={styles.ResultsWidget__Header}
            onToggle={toggleResultWidgetCollapsing}
          >
            <div className={styles.ResultsWidget__Header__ButtonsContainer}>
              <div
                className={cx(
                  styles.ResultsWidget__Header_Button,
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.clickable
                )}
              >
                <IconBell width={14} />
              </div>
              <div
                className={cx(
                  styles.ResultsWidget__Header_Button,
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.clickable
                )}
                onClick={handleAddToListModal}
              >
                <IconOpen width={14} />
              </div>
              <div
                className={cx(
                  styles.ResultsWidget__Header_Button,
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.clickable
                )}
                onClick={handleOpenAllSelectDetails}
              >
                <IconNewTab width={12} />
              </div>
            </div>
          </WidgetHeader>

          <div className={styles.ResultsWidget__FiltersContainer}>
            <div className={styles.Filters}>
              <b>Trier par :</b>
              <div className={cx(commons.clickable, styles.Filter)}>
                Pertinence
                <IconArrow fill="#94969A" />
              </div>
              <div className={cx(commons.clickable, styles.Filter)}>
                Aperçu des résultats
                <IconArrow fill="#94969A" />
              </div>
            </div>
          </div>

          <div className={cx(styles.ResultsWidget__Body, commons.PrettyScroll)}>
            {tab.results.map(
              (result: EntityDto) =>
                (tab.resultTypeFiltersAsMap[result.type] === undefined ||
                  tab.resultTypeFiltersAsMap[result.type]) && (
                  <BrowserSearchResult
                    key={result.id}
                    entity={result}
                    isSelected={!!tab.selectedResults[result.id]}
                    className={styles.AdvancedSearchResult}
                    handleSelect={onResultSelect}
                    handleClick={onResultClick}
                    handleDragStart={onResultDragStart}
                  />
                )
            )}
          </div>
        </div>
      )}

      <div
        className={cx(
          commons.PrettyScroll,
          styles.Widget,
          styles.EntityDetailsWidget
        )}
      >
        {tab.activeEntity && <Entity entity={tab.activeEntity} />}
      </div>
    </div>
  );
};

export default ComplexSearchLayout;
