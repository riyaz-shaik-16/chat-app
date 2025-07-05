import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const fetchChatUsers = createAsyncThunk(
  "chat/fetchChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/chat/users");
      console.log("Fetched users for sidebr response: ",res.data.data.users);
      return res.data.data.users; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch sidebar users");
    }
  }
);

const initialState = {
  chatUsers: [],         
  selectedChat: null,    
  loading: false,        
  error: null,           
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    clearSelectedChat(state) {
      state.selectedChat = null;
    },
    updateLastMessage(state, action) {
      const { id, content, timestamp, sender, type = "text" } = action.payload;
      const user = state.chatUsers.find((u) => u._id === id);
      if (user) {
        user.lastMessage = { content, timestamp, sender, type };
      }
    },
    incrementUnread(state, action) {
      const id = action.payload;
      const user = state.chatUsers.find((u) => u._id === id);
      if (user) {
        user.unreadCount = (user.unreadCount || 0) + 1;
      }
    },
    resetUnread(state, action) {
      const id = action.payload;
      const user = state.chatUsers.find((u) => u._id === id);
      if (user) {
        user.unreadCount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.chatUsers = action.payload;
      })
      .addCase(fetchChatUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  setSelectedChat,
  clearSelectedChat,
  updateLastMessage,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;



export const selectChatUsers = (state) => state.chat.chatUsers;
export const selectSelectedChat = (state) => state.chat.selectedChat;
export const selectSidebarLoading = (state) => state.chat.loading;
export const selectSidebarError = (state) => state.chat.error;
