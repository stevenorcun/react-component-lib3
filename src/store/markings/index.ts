import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Marking } from '@/API/controllers/markings-api';

export interface MarkingsConfigState {
  markings: Marking[];
}

const initialState: MarkingsConfigState = {
  markings: []
};

const markingsConfigSlice = createSlice({
  name: 'markingsConfig',
  initialState: initialState,
  reducers: {
    setMarkingsConfig: (state, action: PayloadAction<Marking[]>) => {
      state.markings = [...action.payload];
    },
    editMarkingsConfig: (state, action: PayloadAction<{ id: string, key: string, value: string }>) => {
      const { payload } = action;
      if (payload?.id) {
        const mIndex = state.markings.findIndex(m => m.id === payload.id);
        if (mIndex >= 0) {
          const newMarking = { ...state.markings[mIndex] }
          newMarking[payload.key] = payload.value;
          state.markings[mIndex] = newMarking;
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
  setMarkingsConfig,
  editMarkingsConfig,
  // reset slice
  resetSlice: resetSliceMarkings,
} = markingsConfigSlice.actions;

export const selectMarkingsConfig = (state) => state.markingsConfig;

export default markingsConfigSlice.reducer;
