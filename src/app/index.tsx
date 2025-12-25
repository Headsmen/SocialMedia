import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProviders } from "./providers";
import { WebSocketProvider } from "./providers/WebSocketProvider";
import { useAuthStore } from "@/entities/user";
import { AuthPage } from "@/pages/auth";
import { InterestingPage } from "@/pages/interesting";
import { ProfilePage } from "@/pages/profile";
import { FriendsPage } from "@/pages/friends";
import { ChatPage } from "@/pages/chat";
import { ChatDialogPage } from "@/pages/chat-dialog";
import { MusicPage } from "@/pages/music";
import { NewsPageAutoScroll } from "@/pages/news";
import { NotificationsPage } from "@/pages/notifications";

export function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AppProviders>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<NewsPageAutoScroll />} />
                <Route path="/interesting" element={<InterestingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userEmail" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:userId" element={<ChatDialogPage />} />
                <Route path="/music" element={<MusicPage />} />
                <Route path="/notification" element={<NotificationsPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </AppProviders>
  );
}
