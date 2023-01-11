import {
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
  IBrowserSearchTab,
} from '@/constants/browser-related';
import { createBrowserSearchFormByType } from '@/utils/browser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NovaEntityType } from '@/API/DataModels/Database/NovaEntityEnum';
import { EntityDto } from '@/API/DataModels/Database/NovaObject';

export interface DrawerAdvancedSearchTabState extends Omit<IBrowserSearchTab,
  |'requestsCount'
  |'isDrawerCollapsed'
  |'resultTypeFilters'
  |'selectedResults'
  |'activeEntity'
  |'label'
  |'results'
  |'resultTypeFiltersAsMap'
  |'resultsByTypeGroup'> {
  form: IBrowserAdvancedSearchForm;
  type: BrowserTabType.Advanced;
  resultsByType: {
    [key in NovaEntityType]?: EntityDto[];
  };
  // Filter/Order/Display mode TODO use and turn into enums
  sorting: 'Pertinence';
  displayMode: 'Affichage en ligne';
  filter: SearchResultFilterBy;
  // templates
  templateSearchValue: string;
  loadedTemplate: BrowserSearchTemplate|null;
}

export interface DrawerTabsState {
  advancedSearch: DrawerAdvancedSearchTabState
}

export interface DrawerState {
  graph: DrawerTabsState;
  map: DrawerTabsState;
}

export enum SearchResultFilterBy {
  inProject = 'Présent dans le plan de travail',
  notInProject = 'Non présent dans le plan de travail',
  all = 'Tous',
}

const init: () => DrawerAdvancedSearchTabState = () => ({
  templateSearchValue: '',
  loadedTemplate: null,
  form: createBrowserSearchFormByType(BrowserTabType.Advanced, []) as IBrowserAdvancedSearchForm,
  type: BrowserTabType.Advanced,
  resultsByType: {},
  sorting: 'Pertinence',
  displayMode: 'Affichage en ligne',
  filter: SearchResultFilterBy.all,
});

const initialState: DrawerState = {
  graph: { advancedSearch: init() },
  map: { advancedSearch: init() },
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setTabByKey: (
      state: DrawerState,
      action: PayloadAction<{
        storeKey: keyof DrawerState,
        update: DrawerTabsState,
      }>,
    ) => {
      state[action.payload.storeKey] = action.payload.update;
    },
    setResultsByGroupedByTypeByStoreKey: (
      state: DrawerState,
      action: PayloadAction<{
        storeKey: keyof DrawerState,
        resultsGroupedByNovaType: DrawerAdvancedSearchTabState['resultsByType'],
      }>,
    ) => {
      const { storeKey, resultsGroupedByNovaType } = action.payload;
      if (state[storeKey] && state[storeKey].advancedSearch?.resultsByType) {
        state[storeKey].advancedSearch.resultsByType = resultsGroupedByNovaType;
      }
    },
    setLoadedTemplateByStoreKey: (
      state: DrawerState,
      action: PayloadAction<{
        storeKey: keyof DrawerState,
        template: DrawerAdvancedSearchTabState['loadedTemplate']
      }>,
    ) => {
      const { storeKey, template } = action.payload;
      if (state[storeKey] && state[storeKey].advancedSearch && template?.form) {
        state[storeKey].advancedSearch.loadedTemplate = template;
        state[storeKey].advancedSearch.form = (template.form as IBrowserAdvancedSearchForm);
      }
    },
    setTemplateSearchValueByStoreKey: (
      state,
      action: PayloadAction<{
        storeKey: keyof DrawerState,
        str: DrawerAdvancedSearchTabState['templateSearchValue'],
      }>,
    ) => {
      const { storeKey, str } = action.payload;
      if (state[storeKey] && state[storeKey].advancedSearch) {
        state[storeKey].advancedSearch.templateSearchValue = str;
      }
    },
    setAdvSearchResultFilterByStoreKey: (
      state: DrawerState,
      action: PayloadAction<{
        storeKey: keyof DrawerState,
        filter: SearchResultFilterBy
      }>,
    ) => {
      const { storeKey, filter } = action.payload;
      if (state[storeKey] && state[storeKey].advancedSearch) {
        state[storeKey].advancedSearch.filter = filter;
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setTabByKey,
  setResultsByGroupedByTypeByStoreKey,
  setLoadedTemplateByStoreKey,
  setTemplateSearchValueByStoreKey,
  setAdvSearchResultFilterByStoreKey,
  // reset slice
  resetSlice: resetSliceDrawer,
} = drawerSlice.actions;

export const selectDrawer = (state) => state.drawer;

export default drawerSlice.reducer;
