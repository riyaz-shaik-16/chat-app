import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    authSuccess: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    authFailure: (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload?.error || "Authentication failed";
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    }
  }
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  clearAuthError
} = authSlice.actions;


export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
