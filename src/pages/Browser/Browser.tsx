import React, { useEffect } from "react";
import cx from "classnames";
import "moment/locale/fr";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  BrowserState,
  createTabByType,
  createTemplate,
  removeTabByIndex,
  selectBrowser,
  setActiveTabByIndex,
  setActiveTabKeywords,
  setSearchTemplates,
  toggleActiveTabDrawer,
  updateTemplate,
} from "@/store/browser";
import Container from "@/containers/Container/Container";
import Layout from "@/containers/Layout/Layout";
import BrowserNavBar from "@/components/Browser/NavBar/NavBar";
import BrowserHomePage from "@/pages/Browser/BrowserHomePage/BrowserHomePage";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserSearchTemplate,
  BrowserTabType,
  BrowserTemplateVisibility,
  IBrowserAdvancedSearchForm,
  IBrowserPhoneSearchForm,
  IBrowserPhysicalPersonSearchForm,
  IBrowserSearchTab,
  IBrowserSimpleSearchForm,
} from "@/constants/browser-related";

import Entity from "@/pages/Entity/Entity";
import AuxiliariesDrawer from "@/components/Drawer/Drawer";
import SearchTabLayout from "@/pages/Browser/SearchTabLayout/SearchTabLayout";
import { unhandle } from "@/utils/DOM";
import { BrowserSearchTemplateStorage } from "@/hooks/usePreferences";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import ModalTypes from "@/constants/modal";
import ApiFactory from "@/API/controllers/api-factory";
import SearchQueriesApi from "@/API/controllers/search-queries-api";
import { emptyStoreSearchQueries } from "@/store/browser/actions";
import { formToSearchQuery } from "@/utils/browser";

import IconInboxSearch from "@/assets/images/icons/IconInboxSearch";
import IconNewTab from "@/assets/images/icons/IconNewTab";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

const BrowserPage = () => {
  const browserState = useAppSelector<BrowserState>(selectBrowser);
  const dispatch = useAppDispatch();

  const apiClient = ApiFactory.create<SearchQueriesApi>("SearchQueriesApi");

  const { tabs, activeBrowserTabIndex } = browserState;

  const closeTabByIndex = (index: number) => dispatch(removeTabByIndex(index));

  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    dispatch(setActiveTabKeywords(event.currentTarget.value));
  };

  const setActiveTab = (index: number | null) => {
    dispatch(setActiveTabByIndex(index));
  };

  const submitSearchByType = ({
    value,
    type,
  }: {
    value: string;
    type: BrowserTabType;
  }) => {
    dispatch(createTabByType({ value, type, isActive: true }));
  };
  /**
   * Create a new Simple Browser Tab with the submitted value
   */
  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (browserState.homepageKeywords) {
      submitSearchByType({
        value: browserState.homepageKeywords,
        type: BrowserTabType.Simple,
      });
    }
  };
  const handleAdvancedSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    submitSearchByType({
      value: browserState.homepageKeywords,
      type: BrowserTabType.Advanced,
    });
  };
  const handlePersonSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    submitSearchByType({
      value: browserState.homepageKeywords,
      type: BrowserTabType.Person,
    });
  };
  const handlePhoneSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    submitSearchByType({
      value: browserState.homepageKeywords,
      type: BrowserTabType.Phone,
    });
  };

  useEffect(() => {
    // poor attempt at only initializing once
    if (!browserState.rawSearchQueries.length) {
      apiClient
        .getTemplates()
        .then((res) => {
          // transform SearchQueryResponse into BrowserSearchTemplateStorage TODO turn into a function
          const init = res.results.reduce(
            (acc: BrowserSearchTemplateStorage, template) => {
              if (
                template.formType &&
                acc[template.formType] &&
                acc[template.formType][template.type]
              ) {
                acc[template.formType][template.type].push(template);
              }
              return acc;
            },
            // deep clone, or use the
            JSON.parse(JSON.stringify(emptyStoreSearchQueries))
          );
          // fixme: how to update ?
          dispatch(setSearchTemplates(init));
        })
        .catch(console.error);
    }
  }, []);

  return (
    <Layout>
      <BrowserNavBar
        handleTabClicked={setActiveTab}
        handleTabClosed={closeTabByIndex}
        tabs={browserState.tabs}
        activeTabIndex={activeBrowserTabIndex}
      />
      <div className={styles.main}>
        {activeBrowserTabIndex === null ? (
          <BrowserHomePage
            value={browserState.homepageKeywords}
            handleChange={handleOnChange}
            handleSubmit={handleSimpleSearch}
            onAdvancedSearchClicked={handleAdvancedSearch}
            onPersonSearchClicked={handlePersonSearch}
            onPhoneSearchClicked={handlePhoneSearch}
          />
        ) : (
          <RenderSearchResults tab={tabs[activeBrowserTabIndex]} />
        )}
      </div>
    </Layout>
  );
};

/**
 * On click, allows the user to save the current Search Form as a template for later
 */
export const SaveFormAsTemplateWidget = ({
  className,
  loadedTemplate,
  form,
  browserType,
  templateSearchValue = "",
}: {
  className?: string;
  loadedTemplate: BrowserSearchTemplate | null;
  form:
    | IBrowserSimpleSearchForm
    | IBrowserAdvancedSearchForm
    | IBrowserPhysicalPersonSearchForm
    | IBrowserPhoneSearchForm;
  browserType: BrowserTabType;
  templateSearchValue: string;
}) => {
  const dispatch = useAppDispatch();

  const apiClient = ApiFactory.create<SearchQueriesApi>("SearchQueriesApi");

  const { showModal, hideModal } = useGlobalModalContext();

  const createNewTemplate = ({ value }: { value: string }) => {
    const templateLabel = value.trim();
    if (!templateLabel) {
      toast.error("Veuillez nommer votre requête.");
      return;
    }

    apiClient
      .createTemplate({
        title: templateLabel,
        form,
        type: BrowserTemplateVisibility.Private,
        formType: browserType,
        favorite: false,
        // @ts-ignore
        query: formToSearchQuery(
          form,
          BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[browserType]
        ),
        sort: [],
      })
      .then((template) => {
        dispatch(createTemplate(template));
        toast.success("Requête enregistrée avec succès.");
      })
      .catch((err) => {
        console.error(err);
        toast.error(`La création a échoué: ${err.toString()}`);
      })
      .finally(() => {
        hideModal();
      });
  };

  // query to update backend and, if successful, update store
  // fixme duplicated in AdvancedSearch tab
  const updateExistingTemplate = ({
    id,
    template,
  }: {
    id: string;
    template: BrowserSearchTemplate;
  }) => {
    apiClient
      .updateTemplate(id, template)
      .then((updatedTemplate) => {
        dispatch(updateTemplate(template));
        toast.success("Mise à jour terminée");
      })
      .catch((err) => {
        console.error(err);
        toast.error(`La mise à jour a échoué: ${err.toString()}`);
      })
      .finally(() => {
        hideModal();
      });
  };

  const displayCreateNewTemplateModal = () => {
    showModal(ModalTypes.BROWSER_CREATE_FORM_TEMPLATE, {
      templateSearchValue,
      onClose: hideModal,
      onConfirm: createNewTemplate,
    });
  };

  /**
   * if overwriting -> save changes, else -> open the "create template" PU
   */
  const handleOverwritePopupConfirm = ({
    isOverwriting = true,
  }: {
    isOverwriting: boolean;
  }) => {
    if (isOverwriting && loadedTemplate) {
      updateExistingTemplate({
        id: loadedTemplate.id,
        template: {
          ...loadedTemplate,
          form,
        },
      });
    } else {
      displayCreateNewTemplateModal();
    }
  };

  const displayModal = () => {
    // switch depending on if
    // - we are creating a new template
    // - or editing an existing (PRIVATE) one
    if (
      !loadedTemplate ||
      loadedTemplate.type === BrowserTemplateVisibility.AdminPreset ||
      loadedTemplate.type === BrowserTemplateVisibility.Shared
    ) {
      displayCreateNewTemplateModal();
    } else {
      showModal(ModalTypes.BROWSER_OVERWRITE_FORM_TEMPLATE, {
        loadedTemplate,
        onClose: hideModal,
        onConfirm: handleOverwritePopupConfirm,
      });
    }
  };

  return (
    <div
      className={cx(commons.clickable, styles.CreateSearchAlert, className)}
      onClick={displayModal}
    >
      <IconInboxSearch />
      Enregistrer la requête
    </div>
  );
};

/**
 * HOTFIX T623 "open all selected objects in new tabs"
 */
const OpenAllSelectedObjectsInNewTabsWidget = ({
  tab,
}: {
  tab: IBrowserSearchTab;
}) => {
  const dispatch = useAppDispatch();

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

  return (
    <div
      className={cx(commons.clickable, styles.OpenAllInNewTabs)}
      onClick={handleOpenAllSelectDetails}
    >
      <IconNewTab />
      {Object.keys(tab.selectedResults).length} objet(s) sélectionné(s)
    </div>
  );
};

const RenderSearchResults = ({ tab }: { tab: IBrowserSearchTab }) => {
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => dispatch(toggleActiveTabDrawer());

  return (
    <Container className={styles.searchResultsContainer}>
      <div className={cx(commons.PrettyScroll, styles.leftContainer)}>
        {tab.type === BrowserTabType.EntityDetails && tab.activeEntity && (
          <div className={cx(commons.PrettyScroll, styles.EntityDetailsLayout)}>
            <div className={styles.EntityDetailsContainer}>
              <Entity entity={tab.activeEntity} />
            </div>
          </div>
        )}
        {tab.type !== BrowserTabType.EntityDetails && (
          <>
            <SearchTabLayout tab={tab} />
            <SaveFormAsTemplateWidget
              // @ts-ignore
              tab={tab}
            />
            {tab.type === BrowserTabType.Simple && (
              <OpenAllSelectedObjectsInNewTabsWidget tab={tab} />
            )}
          </>
        )}
      </div>

      <AuxiliariesDrawer
        // @ts-ignore
        storeKey="browser"
        entity={tab.activeEntity}
        isCollapsed={tab.isDrawerCollapsed}
        onToggle={handleDrawerToggle}
      />
    </Container>
  );
};

export default BrowserPage;
