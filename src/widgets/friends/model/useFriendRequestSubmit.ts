import { useState, useCallback } from 'react';

interface UseFriendRequestSubmitParams {
  onSubmit?: () => Promise<void>;
  isRequestSent?: boolean;
}

export const useFriendRequestSubmit = ({ onSubmit, isRequestSent = false }: UseFriendRequestSubmitParams) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = useCallback(async () => {
    if (isRequestSent || isLoading) return;

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  }, [isRequestSent, isLoading, onSubmit]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/50';
  }, []);

  return {
    isLoading,
    handleAddFriend,
    handleImageError,
  };
};
