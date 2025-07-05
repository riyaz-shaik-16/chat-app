import axiosInstance from "@/utils/axiosInstance";
import {
  authStart,
  authSuccess,
  authFailure,
  logout
} from "@/redux/slices/auth.slice";
import {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  clearUser
} from "@/redux/slices/user.slice";

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(authStart());
    await axiosInstance.post("/auth/login", credentials);
    dispatch(authSuccess());
    dispatch(fetchUserStart());
    const res = await axiosInstance.get("/auth/profile");
    console.log("Response for fetch user after logging in: ",res);
    dispatch(fetchUserSuccess(res.data.data));
  } catch (err) {
    dispatch(
      authFailure({
        error: err?.response?.data?.message || "Login failed."
      })
    );
    dispatch(fetchUserFailure("Failed to fetch user after login."));
  }
};


export const performLogout = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    console.warn("Logout request failed — may already be logged out.");
  } finally {
    dispatch(logout());
    dispatch(clearUser());
  }
};


export const checkSession = () => async (dispatch) => {
  try {
    dispatch(authStart());
    const res = await axiosInstance.get("/auth/profile");
    dispatch(authSuccess());
    dispatch(fetchUserSuccess(res.data.data));
  } catch (err) {
    dispatch(logout());
    dispatch(fetchUserFailure("Not authenticated."));
  }
};
