import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import VerifyOtp from "./pages/VerifyOtp";
import Chat from "./pages/Chat";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors theme="dark" />
      <Routes>
        <Route element={<PublicRoute redirectTo="/" />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
