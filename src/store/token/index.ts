import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "../../API/controllers/auth-api";
import { getTokenFromStorage } from "../../store/token/actions";
import { SESSION_STORAGE_KEYS } from "../../constants/storage-keys";
import { RootState } from "../../store";

export interface TokenState {
  token?: LoginResponse | null;
}

const initialState: TokenState = {
  token: getTokenFromStorage() || null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    saveToken: (
      state: TokenState,
      action: PayloadAction<LoginResponse | null>
    ) => {
      const data = action.payload;
      if (data) {
        try {
          sessionStorage.setItem(
            SESSION_STORAGE_KEYS.token,
            JSON.stringify(data)
          );
          state.token = data;
        } catch (e) {
          console.error("Failed to save token", e);
        }
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEYS.token);
        state.token = null;
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  saveToken,
  // reset slice
  resetSlice: resetSliceToken,
} = tokenSlice.actions;

export const selectToken = (state: RootState) => state.token;

export default tokenSlice.reducer;
