import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Login.jsx";
import ChatPage from "./pages/Chat.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Verify from "./pages/Verify.jsx"
import PageNotFound from "./pages/PageNotFound.jsx";

import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/verify"
          element={
              <Verify />
          }
        />

        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </Router>
  );
};

export default App;
