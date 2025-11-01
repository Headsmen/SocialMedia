import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProviders } from "./providers";
import { AuthPage } from "@/features/auth/ui/auth-page";
import { useAuthStore } from "@/shared/store/auth-store";
import InterestingPage from "@/pages/interesting/InterestingPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import FriendsPage from "@/pages/friends/FriendsPage";
import ChatPage from "@/pages/chat/ChatPage";
import MusicPage from "@/pages/music/MusicPage";
import NewsPageAutoScroll from "@/pages/news/NewsPageAutoScroll";

export function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/music" element={<MusicPage />} />


          {isAuthenticated ? (
            <>
              <Route path="/" element={<NewsPageAutoScroll />} />
              <Route path="/interesting" element={<InterestingPage />} />

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
    </AppProviders>
  );
}
