import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice.js";
import userReducer from "../slices/user.slice.js";
import chatReducer from "../slices/chat.slice.js";


export const store = configureStore({
  reducer: {
    auth:authReducer,
    user: userReducer,
    chat:chatReducer,
  },
});

export default store;