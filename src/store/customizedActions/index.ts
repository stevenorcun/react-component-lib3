import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Method } from "axios";
import { NovaEntityType } from "../../API/DataModels/Database/NovaEntityEnum";
import {
  CustomizedActionsCallback,
  CustomizedActionsType,
} from "../../constants/customization";
import { LOCAL_STORAGE_KEYS } from "../../constants/storage-keys";

export interface ActionState {
  id: string;
  keys: string[];
  label: string;
  enabled: boolean;
  tags: {
    label: string;
    type: number;
  }[];
  objectTypes: NovaEntityType[];
  actionType: CustomizedActionsType;
  path: string;
  apiKey?: string;
  headers?: {
    [key: string]: string;
  };
  requestMethod?: Method;
  requestBody?: string;
  callback?: CustomizedActionsCallback;
  callbackFormat?: string;
  callbackMapping?: string;
}

export interface ActionsState {
  actions: ActionState[];
}

const initialState: ActionsState = {
  actions: [],
};

// fixme : cannot use hook here
// const { preferences, savePreferences } = usePreferences(LOCAL_STORAGE_KEYS.customizedActions)m
const storedActions = localStorage.getItem(
  LOCAL_STORAGE_KEYS.customizedActions
);
const customizedActionsLoaded = storedActions
  ? JSON.parse(storedActions)
  : null;

const actionsSlice = createSlice({
  name: "customizedActions",
  initialState: customizedActionsLoaded || initialState,
  reducers: {
    /**
     * Set the current opened property
     */
    setActions: (state, action: PayloadAction<any>) => {
      state.actions = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.customizedActions,
        JSON.stringify(state)
      );
    },
    addAction: (state, action: PayloadAction<any>) => {
      const id: string = uuidv4();
      const { payload } = action;
      if (payload) {
        state.actions.push({ id, ...payload });
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.customizedActions,
          JSON.stringify(state)
        );
      }
    },
    editAction: (state, action: PayloadAction<any>) => {
      const { payload } = action;
      if (payload.id && payload.action) {
        const actionIndex = state.actions.findIndex((a) => a.id === payload.id);
        if (actionIndex !== -1) {
          state.actions[actionIndex] = { ...payload.action };
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.customizedActions,
            JSON.stringify(state)
          );
        }
      }
    },
    removeAction: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      if (payload) {
        const actionIndex = state.actions.findIndex((a) => a.id === payload);
        if (actionIndex !== -1) {
          state.actions.splice(actionIndex, 1);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.customizedActions,
            JSON.stringify(state)
          );
        }
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setActions,
  addAction,
  editAction,
  removeAction,
  // reset slice
  resetSlice: resetSliceCustomizedActions,
} = actionsSlice.actions;

export const selectCustomizedActions = (state) => state.customizedActions;

export default actionsSlice.reducer;
