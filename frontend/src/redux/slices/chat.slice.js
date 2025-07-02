import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  onlineUsers: [],
  selectedUser: null,
  conversations: {},
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { userId, message } = action.payload;

      if (!state.conversations[userId]) {
        state.conversations[userId] = [];
      }
      state.conversations[userId].push(message);

      if (state.selectedUser !== userId && message.from === userId) {
        state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
      }
    },

    setConversation: (state, action) => {
      const { userId, messages } = action.payload;
      state.conversations[userId] = messages;
    },

    selectUser: (state, action) => {
      state.selectedUser = action.payload;
      state.unreadCounts[action.payload] = 0;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  addMessage,
  setConversation,
  selectUser,
  setUsers,
  setOnlineUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
