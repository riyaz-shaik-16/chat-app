import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <SocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </SocketProvider>
  </AppProvider>
);
