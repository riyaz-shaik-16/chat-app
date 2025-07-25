import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice.js";
import chatReducer from "../slices/chat.slice.js";
import usersReducer from "../slices/users.slice.js";


export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    users:usersReducer
  },
});

export default store;