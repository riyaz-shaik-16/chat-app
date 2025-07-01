import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  onlineUsers : []
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setOnlineUsers: (state,action) => {
      state.onlineUsers = action.payload;
    }
  },
});

export const { setUsers, setOnlineUsers } = usersSlice.actions;
export default usersSlice.reducer;
