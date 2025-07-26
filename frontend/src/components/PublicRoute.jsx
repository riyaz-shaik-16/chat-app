import React from "react";
import { Navigate } from "react-router-dom";
import { useAppData } from "../context/AppContext.jsx";
import Loading from "./Loading.jsx";

const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAppData();

  if (loading) return <Loading/>;

  return !isAuth ? children : <Navigate to="/chats" />;
};

export default PublicRoute;
