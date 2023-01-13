import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserPhoneSearchForm,
  IBrowserPhysicalPersonSearchForm,
  IBrowserSearchForm,
  IBrowserSearchFormField,
  IBrowserSearchTab,
  IBrowserSimpleSearchForm,
} from "../../constants/browser-related";
import { EntityDto } from "../../API/DataModels/Database/NovaObject";
import { NovaEntityTypeGroup } from "../../API/DataModels/Database/NovaEntityEnum";
import { createBrowserSearchFormByType } from "../../utils/browser";
import {
  _addCustomFieldToForm,
  _deleteCustomFieldByKey,
  _editCustomFormFieldByIndex,
  _setActiveTabSearchForm,
  emptyStoreSearchQueries,
} from "../../store/browser/actions";
import { BrowserSearchTemplateStorage } from "../../hooks/usePreferences";

export interface BrowserState {
  currentSearch: string;
  tabs: Array<IBrowserSearchTab>;
  activeBrowserTabIndex: number | null;
  homepageKeywords: string;
  rawSearchQueries: BrowserSearchTemplate[];
  searchTemplates: BrowserSearchTemplateStorage;
}

const initialState: BrowserState = {
  currentSearch: "",
  tabs: [],
  activeBrowserTabIndex: null,
  homepageKeywords: "",
  rawSearchQueries: [],
  searchTemplates: emptyStoreSearchQueries,
};

const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    toggleResultSelection: (state, action: PayloadAction<EntityDto>) => {
      const { activeBrowserTabIndex, tabs } = state;

      if (
        activeBrowserTabIndex === null ||
        tabs[activeBrowserTabIndex].type === BrowserTabType.EntityDetails
      ) {
        console.warn(
          "[browserState.toggleResultSelection]",
          "Unable to toggle selection in the current Tab",
          activeBrowserTabIndex
        );
        return;
      }

      const tab = tabs[activeBrowserTabIndex];
      if (tab.selectedResults[action.payload.id]) {
        delete tab.selectedResults[action.payload.id];
        if (tab.activeEntity && tab.activeEntity.id === action.payload.id)
          tab.activeEntity = undefined;
      } else {
        tab.selectedResults[action.payload.id] = action.payload;
        tab.activeEntity = action.payload;
      }
    },

    toggleAllSelection: (state, action) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].selectedResults =
          action.payload;
      }
    },
    /**
     * Set the index of the currently active tab (an active tab is visible)
     * If the index is `null`, the BrowserHomePage will be displayed
     */
    setActiveTabByIndex: (state, action: PayloadAction<number | null>) => {
      if (typeof action.payload === "number" && state.tabs[action.payload])
        state.activeBrowserTabIndex = action.payload;
      else state.activeBrowserTabIndex = null;
    },
    /**
     * Closes a tab using its index
     *  If the closed tab was the last one existing, we display the BrowserHomePage
     *  If the closed tab was the last one of the array, we display the previous tab.
     */
    removeTabByIndex: (state, action: PayloadAction<number>) => {
      if (state.tabs[action.payload]) {
        const newTabs = [...state.tabs];
        newTabs.splice(action.payload, 1);
        // detect when user closes the right-most tab (and avoid "Array Index out of bounds" error)
        if (
          state.activeBrowserTabIndex !== null &&
          state.activeBrowserTabIndex === newTabs.length
        ) {
          state.activeBrowserTabIndex = !newTabs.length
            ? null
            : action.payload - 1;
        }
        state.tabs = newTabs;
      } else {
        console.warn(
          "[browserState.removeTabByIndex]",
          "Invalid index used to remove a Browser Tab",
          action.payload
        );
      }
    },
    /**
     * Sets the search keywords of the currently active tab
     *  If there is no active tab (`activeBrowserTabIndex === null`), we set the BrowserHomePage keywords
     */
    setActiveTabKeywords: (state, action: PayloadAction<string>) => {
      if (state.activeBrowserTabIndex === null)
        state.homepageKeywords = action.payload;
      else if (state.tabs[state.activeBrowserTabIndex]) {
        state.tabs[state.activeBrowserTabIndex].form.value.values = [
          action.payload,
        ];
        if (
          state.tabs[state.activeBrowserTabIndex].type === BrowserTabType.Simple
        )
          state.tabs[state.activeBrowserTabIndex].label = action.payload;
      } else {
        console.warn(
          "[browserState.setTabKeywordsByIndex]",
          "Invalid index used to set a tab's keywords",
          action.payload
        );
      }
    },
    // TODO? Args should be Partial<IBrowserTab> ?
    createTabByType: (
      state,
      action: PayloadAction<{
        type: BrowserTabType;
        value: string;
        isActive: boolean;
        activeEntity?: EntityDto;
        form?: IBrowserSearchForm;
        loadedTemplate?: BrowserSearchTemplate;
      }>
    ) => {
      let label;
      switch (action.payload.type) {
        case BrowserTabType.Advanced:
          label = "Recherche avancée";
          break;
        case BrowserTabType.Person:
          label = "Recherche personne physique";
          break;
        case BrowserTabType.Phone:
          label = "Recherche téléphone";
          break;
        case BrowserTabType.EntityDetails:
        case BrowserTabType.Simple:
        default:
          label = action.payload.value;
      }
      state.tabs.push({
        form:
          action.payload.form ||
          createBrowserSearchFormByType(
            action.payload.type,
            action.payload.value ? [action.payload.value] : []
          ),
        resultTypeFilters: [],
        resultTypeFiltersAsMap: {},
        activeEntity: action.payload.activeEntity,
        label,
        type: action.payload.type,
        results: [],
        resultsByTypeGroup: {},
        selectedResults: {},
        requestsCount: 0,
        // when true (collapsed by default), causes an initial blinking
        // (the Drawer appears to be at left: 0 before hiding itself with the animation)
        isDrawerCollapsed: true,

        // [T922] Form templates
        templateSearchValue: "",
        loadedTemplate: action.payload.loadedTemplate || null,
      });
      if (action.payload.isActive)
        state.activeBrowserTabIndex = state.tabs.length - 1;
      // Reset HomePage's value
      state.homepageKeywords = "";
    },
    setActiveEntity: (
      state,
      action: PayloadAction<{ entity: any; index: number | null }>
    ) => {
      const { entity, index = state.activeBrowserTabIndex } = action.payload;
      // /!\ async init in useEffect could try to update a deleted element /!\
      // fixme:
      //  - si 3 tabs existent, et que l'on suppr la tab 2 avant que l'init se soit fini,
      //    ça va update la tab 3 (maintenant devenue la 2)
      //  Il suffit de changer de tab et de revenir pour que ça re-requête.
      //  Mais si jamais, demain, on ne requête plus à chaque init() (si déjà requêté avant)
      //  ça ne sera plus un pb
      if (index !== null && state.tabs[index]) {
        state.tabs[index].activeEntity = entity;
        state.tabs[index].isDrawerCollapsed = true;
      }
    },
    setOnlyActiveEntity: (state, action: PayloadAction<any>) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].activeEntity = action.payload;
      }
    },
    setActiveTabSearchFilters: (state, action: PayloadAction<any>) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].resultTypeFilters =
          action.payload;
        state.tabs[state.activeBrowserTabIndex].resultTypeFiltersAsMap =
          Object.keys(action.payload).reduce((acc, curr) => {
            const types = Object.keys(action.payload[curr]).filter(
              (key) => key !== "total"
            );
            types.forEach((type) => {
              acc[type] = action.payload[curr][type].checked;
            });
            return acc;
          }, {});
      }
    },
    setActiveTabSearchForm: (
      state,
      action: PayloadAction<
        Partial<
          | IBrowserSimpleSearchForm
          | IBrowserAdvancedSearchForm
          | IBrowserPhysicalPersonSearchForm
          | IBrowserPhoneSearchForm
        >
      >
    ) => {
      _setActiveTabSearchForm(state, { form: action.payload, isForced: false });
      // if (state.activeBrowserTabIndex !== null) {
      //   const tab = state.tabs[state.activeBrowserTabIndex];
      //   tab.form = { ...tab.form, ...action.payload };
      // }
    },
    forceSetActiveTabSearchForm: (
      state,
      action: PayloadAction<
        Partial<
          | IBrowserSimpleSearchForm
          | IBrowserAdvancedSearchForm
          | IBrowserPhysicalPersonSearchForm
          | IBrowserPhoneSearchForm
        >
      >
    ) => {
      _setActiveTabSearchForm(state, { form: action.payload, isForced: true });
    },
    setActiveTabResults: (
      state,
      action: PayloadAction<{
        results: EntityDto[];
        resultsByTypeGroup: {
          [typeGroup in NovaEntityTypeGroup]?: EntityDto[];
        };
      }>
    ) => {
      if (state.activeBrowserTabIndex !== null) {
        const tab = state.tabs[state.activeBrowserTabIndex];
        tab.results = action.payload.results;
        tab.resultsByTypeGroup = action.payload.resultsByTypeGroup;
      }
    },
    incrActiveTabRequestCount: (state) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].requestsCount += 1;
      }
    },
    toggleActiveTabDrawer: (state) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].isDrawerCollapsed =
          !state.tabs[state.activeBrowserTabIndex].isDrawerCollapsed;
      }
    },
    addCustomFieldToForm: (state) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].form.__customFields =
          _addCustomFieldToForm(state.tabs[state.activeBrowserTabIndex].form);
      }
    },
    editCustomFormFieldByIndex: (
      state,
      action: PayloadAction<{
        index: number;
        newValue: IBrowserSearchFormField<any>;
      }>
    ) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].form.__customFields =
          _editCustomFormFieldByIndex(
            state.tabs[state.activeBrowserTabIndex].form,
            action.payload.index,
            action.payload.newValue
          );
      }
    },
    setTemplateSearchInputValue: (
      state: BrowserState,
      action: PayloadAction<IBrowserSearchTab["templateSearchValue"]>
    ) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].templateSearchValue =
          action.payload;
      }
    },
    setLoadedTemplate: (
      state: BrowserState,
      action: PayloadAction<IBrowserSearchTab["loadedTemplate"]>
    ) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].loadedTemplate = action.payload;
        state.tabs[state.activeBrowserTabIndex].templateSearchValue =
          action.payload?.title || "";
        if (action.payload) {
          _setActiveTabSearchForm(state, {
            form: action.payload.form,
            isForced: true,
          });
        }
      }
    },
    deleteCustomFieldByKey: (
      state: BrowserState,
      action: PayloadAction<{ index: number }>
    ) => {
      if (state.activeBrowserTabIndex !== null) {
        state.tabs[state.activeBrowserTabIndex].form.__customFields =
          _deleteCustomFieldByKey(
            state.tabs[state.activeBrowserTabIndex].form,
            action.payload.index
          );
      }
    },
    setSearchTemplates: (
      state: BrowserState,
      action: PayloadAction<BrowserState["searchTemplates"]>
    ) => {
      state.searchTemplates = action.payload;
    },
    updateTemplate: (
      state: BrowserState,
      action: PayloadAction<BrowserSearchTemplate>
    ) => {
      const { payload } = action;
      if (
        payload.id &&
        payload.type &&
        payload.formType &&
        state.searchTemplates?.[payload.formType]?.[payload.type]
      ) {
        state.searchTemplates[payload.formType][payload.type] =
          state.searchTemplates[payload.formType][payload.type].map(
            (template) => (template.id === payload.id ? payload : template)
          );
      }
    },
    createTemplate: (
      state: BrowserState,
      action: PayloadAction<BrowserSearchTemplate>
    ) => {
      const { payload } = action;
      if (
        payload.id &&
        payload.type &&
        payload.formType &&
        state.searchTemplates?.[payload.formType]?.[payload.type]
      ) {
        state.searchTemplates[payload.formType][payload.type].push(payload);
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  toggleResultSelection,
  setActiveTabByIndex,
  removeTabByIndex,
  setActiveTabKeywords,
  createTabByType,
  setActiveEntity,
  setOnlyActiveEntity,
  setActiveTabSearchFilters,
  setActiveTabSearchForm,
  forceSetActiveTabSearchForm,
  setActiveTabResults,
  incrActiveTabRequestCount,
  toggleActiveTabDrawer,
  addCustomFieldToForm,
  editCustomFormFieldByIndex,
  setTemplateSearchInputValue,
  setLoadedTemplate,
  deleteCustomFieldByKey,
  setSearchTemplates,
  updateTemplate,
  createTemplate,
  toggleAllSelection,
  // reset slice
  resetSlice: resetSliceBrowser,
} = browserSlice.actions;

export const selectBrowser = (state) => state.browser;

export default browserSlice.reducer;
