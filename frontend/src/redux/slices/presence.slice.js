import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
  name: "presence",
  initialState: {
    onlineUsers: [],
    typingUsers: {},
  },
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    addOnlineUser(state, action) {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    removeOnlineUser(state, action) {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    setTyping(state, action) {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },
    clearPresenceState(state) {
      state.onlineUsers = [];
      state.typingUsers = {};
    }
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTyping,
  clearPresenceState,
} = presenceSlice.actions;

export const selectOnlineUsers = (state) => state.onlineUsers;
export const selectTypingUsers = (state) => state.typingUsers;

export default presenceSlice.reducer;
