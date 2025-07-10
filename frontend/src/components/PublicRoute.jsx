import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStart,
  fetchUserFailure,
  fetchUserSuccess,
  selectUserInfo,
  selectUserLoading,
  selectUserError,
} from "@/redux/slices/user.slice";

const PublicRoute = ({ redirectTo = "/dashboard" }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const checkAuthStatus = useCallback(async () => {
    if (error && !user?._id) return;
    if (user?._id) return;

    try {
      dispatch(fetchUserStart());
      const { data } = await axios.get(
        "http://localhost:5000/api/user/get-profile",
        {
          withCredentials: true,
        }
      );
      console.log("Public route - user found:", data);
      dispatch(fetchUserSuccess(data.user));
    } catch (error) {
      console.log(
        "Public route - no authenticated user:",
        error.response?.status
      );
      dispatch(
        fetchUserFailure(error.message || "Failed to check auth status")
      );
    }
  }, [dispatch, user?._id, error]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user?._id) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
