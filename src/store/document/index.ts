import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentState {
  selection?: {
    pageIndex: number;
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
  }
}

const initialState: DocumentState = {
  selection: undefined,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    /**
     * Set the current selection
     */
    setSelection: (
      state,
      action: PayloadAction<{
        pageIndex: number;
        anchorKey: string;
        anchorOffset: number;
        focusKey: string;
        focusOffset: number;
      }|undefined>,
    ) => {
      state.selection = action.payload;
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setSelection,
  // reset slice
  resetSlice: resetSliceDocument,
} = documentSlice.actions;

export const selectDocument = (state) => state.document;

export default documentSlice.reducer;
