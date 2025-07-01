import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Profile, AuthSuccess } from "./pages";
import { ProtectedRoute, PublicRoute, PageNotFound } from "./components";
import { Toaster } from "sonner"; // or 'react-hot-toast'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } /> */}

        <Route element={<PublicRoute/>}>
          <Route path="/login" element={<Login/>}/>
        </Route>

        <Route element={<ProtectedRoute/>}>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/" element={<Home/>}/>
        </Route>
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
