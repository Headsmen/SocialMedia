import { useCallback } from 'react';

interface UsePostActionsProps {
  postId: string;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
}

export const usePostActions = ({ postId, onDelete, onLike }: UsePostActionsProps) => {
  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(postId);
    }
  }, [postId, onDelete]);

  const handleLike = useCallback(() => {
    if (onLike) {
      onLike(postId);
    }
  }, [postId, onLike]);

  return {
    handleDelete,
    handleLike,
  };
};
