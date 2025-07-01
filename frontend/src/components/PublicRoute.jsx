import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { setUser, logout } from "@/redux/slices/user.slice";

const PublicRoute = () => {
  const [isAllowed, setIsAllowed] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");

        console.log("Response in public Route: ",response);

        if (response.data.success) {
          dispatch(setUser(response.data.data));
          setIsAllowed(false);
          navigate("/profile");
        } else {
          dispatch(logout());
          setIsAllowed(true);
        }
      } catch (err) {
        dispatch(logout());
        setIsAllowed(true);
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (isAllowed === null) return <h1>Loading...</h1>;

  return isAllowed ? <Outlet /> : null;
};

export default PublicRoute;
