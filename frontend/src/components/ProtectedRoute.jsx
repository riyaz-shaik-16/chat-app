import React from "react";
import { Navigate } from "react-router-dom";
import { useAppData } from "../context/AppContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAppData();

  console.log("is auth im protected route",isAuth);

  if (loading) return <div>Loading...</div>;

  console.log("Is Auth: in ProtectedRoute:", isAuth);
  console.log("Loading: in ProtectedRoute:", loading);

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
