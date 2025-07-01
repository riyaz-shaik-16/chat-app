import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice.js";
import usersReducer from "../slices/users.slice.js"

export const store = configureStore({
  reducer: {
    user: userReducer,
    users:usersReducer
  },
});

export default store;