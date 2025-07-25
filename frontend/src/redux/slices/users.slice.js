import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],       
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    fetchUsersFailure: (state, action) => {
      state.users = [];
      state.loading = false;
      state.error = action.payload || "Failed to load user.";
    },

    clearUser: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },

    updateUsers: (state, action) => {
      if (state.users) {
        state.users = {
          ...state.users,
          ...action.payload
        };
      }
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  clearUsers,
  updateUsers
} = userSlice.actions;

export default userSlice.reducer;


export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;