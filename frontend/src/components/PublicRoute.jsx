import { selectAuthLoading, selectIsAuthenticated } from "@/redux/slices/auth.slice";
import { selectUserLoading } from "@/redux/slices/user.slice";
import { checkSession } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ redirectTo = "/dashboard" }) => {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isUserLoading = useSelector(selectUserLoading);
  const isAuthLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkSession())
  },[])

  if (isUserLoading || isAuthLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default PublicRoute;
