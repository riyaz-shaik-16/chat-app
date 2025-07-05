import { selectAuthLoading, selectIsAuthenticated } from "@/redux/slices/auth.slice";
import { selectUserLoading } from "@/redux/slices/user.slice";
import { checkSession } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isUserLoading = useSelector(selectUserLoading);
  const isAuthLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(checkSession());
  },[])

  console.log("Is Authenticated: ",isAuthenticated);

  if (isUserLoading || isAuthLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

