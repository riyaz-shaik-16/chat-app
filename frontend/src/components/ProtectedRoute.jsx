import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { setUser,logout } from "@/redux/slices/user.slice";

const ProtectedRoute = () => {
  const [isAllowed, setIsAllowed] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");

        // console.log("In Protected Route: ", response);

        if (response.data.success) {
          setIsAllowed(true);
          dispatch(setUser(response.data.data));
        } else {
          dispatch(logout());
          setIsAllowed(false);
          navigate("/login");
        }
      } catch (err) {
        dispatch(logout());
        setIsAllowed(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (isAllowed === null) return <h1>Loading..</h1>;

  return isAllowed ? <Outlet /> : null;
};

export default ProtectedRoute;
