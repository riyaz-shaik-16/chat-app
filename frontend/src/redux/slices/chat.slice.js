import axiosInstance from "@/utils/axiosInstance";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  onlineUsers: [],
  selectedUser: null,
  conversations: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { message, myId } = action.payload;
      const { from, to } = message;
      const otherUserId = from === myId ? to : from;

      if (!state.conversations[otherUserId]) {
        state.conversations[otherUserId] = [];
      }

      state.conversations[otherUserId].push(message);
    },
    setConversation: (state, action) => {
      const { userId, messages } = action.payload;
      state.conversations[userId] = messages;
    },

    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateUnreadCount: (state, action) => {
      const user = state.users.find((u) => u._id === action.payload);
      console.log("useR: ", user);
      console.log("Matched: ", user._id === action.payload);
      state.users = state.users.map((user) =>
        String(user._id) === String(action.payload)
          ? { ...user, unreadCount: 0 }
          : user
      );
    },

    updateLastMessage: (state, action) => {
      const message = action.payload;
      console.log("this one triggered!: ",message);
      state.users = state.users.map((user) =>
        String(user._id) === String(message.id)
          ? {
              ...user,
              lastMessage: {
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                timestamp: message.timestamp,
              },
            }
          : user
      );
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
  updateUnreadCount,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
