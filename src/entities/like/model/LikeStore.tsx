import { create } from "zustand";

export interface LikeState {
  userLikes: Record<string, boolean>;
  likeCounts: Record<string, number>;
  toggleLike: (postId: string) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  userLikes: {},
  likeCounts: {},

  toggleLike: (postId: string) => set((state) => {
    const isCurrentlyLiked = state.userLikes[postId] || false;
    const currentCount = state.likeCounts[postId] || 0;

    return {
      userLikes: {
        ...state.userLikes,
        [postId]: !isCurrentlyLiked
      },
      likeCounts: {
        ...state.likeCounts,
        [postId]: isCurrentlyLiked ? currentCount - 1 : currentCount + 1
      }
    };
  }),
}));