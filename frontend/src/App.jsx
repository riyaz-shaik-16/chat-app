import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Profile } from "./pages";
import { ProtectedRoute, PublicRoute, PageNotFound } from "./components";
import { Toaster } from "sonner"; // or 'react-hot-toast'
import SetPassword from "./components/SetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route element={<PublicRoute redirectTo="/profile" />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Route>
        {/* <Route path="/auth-success" element={<AuthSuccess />} /> */}
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
