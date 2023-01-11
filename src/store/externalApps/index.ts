import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';

export interface ExternalAppState {
  id: string;
  label: string;
  enabled: boolean;
  tags: {
    label: string;
    type: number;
  }[];
  url: string;
  isAlwaysVisible: boolean;
}

const initialState: ExternalAppState[] = [];

// fixme : cannot use hook here
// const { preferences, savePreferences } = usePreferences(LOCAL_STORAGE_KEYS.customizedActions)m
const storedApps = localStorage.getItem(LOCAL_STORAGE_KEYS.externalAppsConfig);
const extApps = storedApps ? JSON.parse(storedApps) : null;

const extAppsSlice = createSlice({
  name: 'externalApps',
  initialState: extApps || initialState,
  reducers: {
    setExternalApps: (state, action: PayloadAction<ExternalAppState[]>) => {
      state = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.externalAppsConfig,
        JSON.stringify(state)
      );
    },
    addExternalApp: (state, action: PayloadAction<any>) => {
      const id: string = uuidv4();
      const { payload } = action;
      if (payload) {
        state.push({ id, ...payload });
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.externalAppsConfig,
          JSON.stringify(state)
        );
      }
    },
    editExternalApp: (state, action: PayloadAction<any>) => {
      const { payload } = action;
      if (payload?.id) {
        const actionIndex = state.findIndex((a) => a.id === payload.id);
        if (actionIndex !== -1) {
          state[actionIndex] = { ...payload.app };
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.externalAppsConfig,
            JSON.stringify(state)
          );
        }
      }
    },
    removeExternalApp: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      if (payload) {
        const actionIndex = state.findIndex((a) => a.id === payload);
        if (actionIndex !== -1) {
          state.splice(actionIndex, 1);
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
  setExternalApps,
  addExternalApp,
  editExternalApp,
  removeExternalApp,
  // reset slice
  resetSlice: resetSliceExternalApps,
} = extAppsSlice.actions;

export const selectExternalApps = (state) => state.externalApps;

export default extAppsSlice.reducer;
