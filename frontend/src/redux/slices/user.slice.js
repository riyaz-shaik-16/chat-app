import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: null,       
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchUserSuccess: (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = null;
    },

    fetchUserFailure: (state, action) => {
      state.info = null;
      state.loading = false;
      state.error = action.payload || "Failed to load user.";
    },

    clearUser: (state) => {
      state.info = null;
      state.loading = false;
      state.error = null;
    },

    updateUser: (state, action) => {
      if (state.info) {
        state.info = {
          ...state.info,
          ...action.payload
        };
      }
    }
  }
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  clearUser,
  updateUser
} = userSlice.actions;

export default userSlice.reducer;


export const selectUserInfo = (state) => state.user.info;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;