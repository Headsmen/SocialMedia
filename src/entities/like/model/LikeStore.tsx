import { create } from "zustand";

interface LikeState {
  userLikes: Record<string, boolean>;
  likeCounts: Record<string, number>;
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  getLikeCount: (postId: string) => number;
}

export const useLikeStore = create<LikeState>((set, get) => ({
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
  
  isLiked: (postId: string) => get().userLikes[postId] || false,
  
  getLikeCount: (postId: string) => get().likeCounts[postId] || 0
}));