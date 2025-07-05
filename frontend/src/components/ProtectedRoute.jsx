import { selectAuthLoading, selectIsAuthenticated, selectAuthInitialized } from "@/redux/slices/auth.slice";
import { selectUserLoading } from "@/redux/slices/user.slice";
import { checkSession } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isUserLoading = useSelector(selectUserLoading);
  const isAuthLoading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectAuthInitialized)
  const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(()=>{
    dispatch(checkSession());
  },[dispatch])

  console.log("Is Authenticated: ",isAuthenticated);
  console.log("LOcation: ",location);

  if (isUserLoading || isAuthLoading || !initialized) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet/> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;

