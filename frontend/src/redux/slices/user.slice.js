import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      axiosInstance
        .post("/auth/logout")
        .then(() => {
          state.user = null;
          state.isAuthenticated = false;
        })
        .catch((err) => {
          console.log("Error in logout slice:", err.message);
        });
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
