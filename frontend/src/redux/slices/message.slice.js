import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";


export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (selectedUserId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/messages/get-messages/${selectedUserId}`);
      console.log("Response for fetching messages: ",res);
      return res.data.data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch messages");
    }

  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        console.log("Fullfilled");
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        console.log("Rejected")
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;

export const selectMessages = (state) => state.messages.messages;
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectMessagesError = (state) => state.messages.error;