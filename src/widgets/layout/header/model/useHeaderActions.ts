import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { useUnreadCount } from '@/entities/notification';

export const useHeaderActions = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { unreadCount } = useUnreadCount(user?.email);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const isActiveRoute = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const unreadBadgeText = useMemo(() => {
    return unreadCount > 99 ? '99+' : unreadCount.toString();
  }, [unreadCount]);

  return {
    user,
    unreadCount,
    unreadBadgeText,
    handleLogout,
    isActiveRoute,
  };
};
