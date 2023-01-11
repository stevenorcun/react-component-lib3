/* eslint-disable import/no-cycle */
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import boardReducer from './board/window';
import graphReducer from './graph';
import browserReducer from './browser';
import caseReducer from './case';
import mapReducer from './map';
import tagsReducer from './tags';
import actionsReducer from './customizedActions';
import extAppsReducer from './externalApps';
import listsReducer from './lists';
import drawerReducer from './drawer';
import explorerReducer from './explorer';
import documentReducer from './document';
import markingsConfigReducer from './markings';
import ontologyReducer from './ontology';
import tokenReducer from './token';

// /!\ PENSEZ À CRÉER UNE ACTION "resetSlice" /!\
// /!\ SI VOUS CRÉEZ DE NOUVEAUX SLICES       /!\
// /!\ ET L'IMPORTER DANS useResetStore.ts    /!\
export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActionPaths: [
        //          'payload.actions',
      ],
      ignoredPaths: [
        'browser.tabs',
        'graph.listFonts',
      ],
    },
  }),
  reducer: {
    board: boardReducer,
    graph: graphReducer,
    browser: browserReducer,
    case: caseReducer,
    map: mapReducer,
    tags: tagsReducer,
    customizedActions: actionsReducer,
    externalApps: extAppsReducer,
    lists: listsReducer,
    drawer: drawerReducer,
    explorer: explorerReducer,
    document: documentReducer,
    markingsConfig: markingsConfigReducer,
    ontologyConfig: ontologyReducer,
    token: tokenReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
RootState,
unknown,
Action<string>>;
