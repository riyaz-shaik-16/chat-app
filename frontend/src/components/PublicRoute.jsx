import React from "react";
import { Navigate } from "react-router-dom";
import { useAppData } from "../context/AppContext.jsx";

const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAppData();

  if (loading) return <div>Loading...</div>;

  return !isAuth ? children : <Navigate to="/chats" />;
};

export default PublicRoute;
