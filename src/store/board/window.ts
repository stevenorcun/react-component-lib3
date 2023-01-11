import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BoardWindowState {
  windowDrag: boolean;
  mouseMove: boolean;
  windowPos: {
    xVal: number;
    yVal: number;
    innerWidth: number;
    innerHeight: number;
  };
  prevWindowPos: {
    prevX: number;
    prevY: number;
  };
  cursor: string;
}

const initialState: BoardWindowState = {
  windowDrag: false,
  mouseMove: false,
  windowPos: {
    xVal: 0,
    yVal: 0,
    innerWidth: 0,
    innerHeight: 0,
  },
  prevWindowPos: {
    prevX: 0,
    prevY: 0,
  },
  cursor: 'default',
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setWindowDrag: (
      state,
      action: PayloadAction<BoardWindowState['windowDrag']>,
    ) => {
      state.windowDrag = action.payload;
    },
    setMouseMove: (
      state,
      action: PayloadAction<BoardWindowState['mouseMove']>,
    ) => {
      state.mouseMove = action.payload;
    },
    setWindowPos: (
      state,
      action: PayloadAction<BoardWindowState['windowPos']>,
    ) => {
      state.windowPos = action.payload;
    },
    setPrevWindowPosition: (
      state,
      action: PayloadAction<BoardWindowState['prevWindowPos']>,
    ) => {
      state.prevWindowPos = action.payload;
    },
    setCursor: (state, action: PayloadAction<BoardWindowState['cursor']>) => {
      state.cursor = action.payload;
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  }
});

export const {
  setWindowDrag,
  setMouseMove,
  setWindowPos,
  setPrevWindowPosition,
  setCursor,
  // reset slice
  resetSlice: resetSliceBoard,
} = boardSlice.actions;

export const selectBoard = (state) => state.board;

export default boardSlice.reducer;
