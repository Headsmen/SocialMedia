import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { AppProviders } from "./providers";
import { WebSocketProvider } from "./providers/WebSocketProvider";
import { useAuthStore } from "@/entities/user";
import { AppRoutes } from "./router.tsx";

export function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AppProviders>
      <WebSocketProvider>
        <BrowserRouter>
          <AppRoutes isAuthenticated={isAuthenticated} />
        </BrowserRouter>
      </WebSocketProvider>
    </AppProviders>
  );
}
