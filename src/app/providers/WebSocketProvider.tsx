import { useAuthStore } from '@/entities/user';
import { useWebSocket } from '@/shared/lib/hooks/useWebSocket';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  useWebSocket(isAuthenticated ? user?.id || null : null);

  return <>{children}</>;
}
