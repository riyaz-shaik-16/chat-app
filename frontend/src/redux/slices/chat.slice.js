import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],       
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    fetchChatUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchChatUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    fetchChatUsersFailure: (state, action) => {
      state.users = [];
      state.loading = false;
      state.error = action.payload || "Failed to load user.";
    },

    clearChatUser: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },

    updateChatUsers: (state, action) => {
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
  fetchChatUsersStart,
  fetchChatUsersSuccess,
  fetchChatUsersFailure,
  clearChatUsers,
  updateChatUsers
} = userSlice.actions;

export default userSlice.reducer;


export const selectChatUsers = (state) => state.chat.users;
export const selectChatUsersLoading = (state) => state.chat.loading;
export const selectChatUsersError = (state) => state.chat.error;