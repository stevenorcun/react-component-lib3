import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SESSION_STORAGE_KEYS } from "../../constants/storage-keys";

export interface CaseState {
  currentCase: {
    id: string;
    label: string;
  } | null;
  currentPage: number;
  hasMore: boolean;
  listCases: Array<{}>;
  listFilteredCases: Array<{}>;
  listSupervisor: Array<{}>;
}

const initialState: CaseState = {
  currentCase: JSON.parse(
    sessionStorage.getItem(SESSION_STORAGE_KEYS.currentCase) || "null"
  ),
  currentPage: 1,
  hasMore: true,
  listCases: [],
  listFilteredCases: [],
  listSupervisor: [],
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    /**
     * Set the current opened case
     */
    setCurrentCase: (
      state,
      action: PayloadAction<{ id: string; label: string } | null>
    ) => {
      state.currentCase = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },

    setListCases: (state, action) => {
      const result = action.payload.sort((a, b) => a.updatedAt < b.updatedAt);
      state.listCases = result;
      state.listFilteredCases = result;
    },

    setListFilteredCases: (state, action) => {
      state.listFilteredCases = action.payload;
    },

    createCase: (state, action) => {
      const newCase = action.payload;
      state.listCases = [newCase, ...state.listCases];
      state.listFilteredCases = state.listCases;
    },
    setListSupervisor: (state, action) => {
      state.listSupervisor = action.payload;
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setCurrentCase,
  setListCases,
  setCurrentPage,
  setHasMore,
  setListFilteredCases,
  setListSupervisor,
  createCase,
  // reset slice
  resetSlice: resetSliceCase,
} = caseSlice.actions;

export const selectCase = (state) => state.case;

export default caseSlice.reducer;
