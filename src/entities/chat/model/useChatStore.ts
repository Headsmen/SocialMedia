import { create } from 'zustand';

interface ChatStore {
  onlineUsers: Set<string>;
  setOnlineUsers: (userIds: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  isUserOnline: (userId: string) => boolean;

  typingUsers: Map<string, Set<string>>;
  addTypingUser: (chatId: string, userId: string) => void;
  removeTypingUser: (chatId: string, userId: string) => void;
  getTypingUsers: (chatId: string) => string[];
  isUserTyping: (chatId: string, userId: string) => boolean;

  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  currentChatId: string | null;
  setCurrentChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  onlineUsers: new Set(),
  setOnlineUsers: (userIds) =>
    set({ onlineUsers: new Set(userIds) }),
  addOnlineUser: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.add(userId);
      return { onlineUsers: newSet };
    }),
  removeOnlineUser: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),
  isUserOnline: (userId) => get().onlineUsers.has(userId),

  typingUsers: new Map(),
  addTypingUser: (chatId, userId) =>
    set((state) => {
      const newMap = new Map(state.typingUsers);
      if (!newMap.has(chatId)) {
        newMap.set(chatId, new Set());
      }
      newMap.get(chatId)!.add(userId);
      return { typingUsers: newMap };
    }),
  removeTypingUser: (chatId, userId) =>
    set((state) => {
      const newMap = new Map(state.typingUsers);
      const chatTyping = newMap.get(chatId);
      if (chatTyping) {
        chatTyping.delete(userId);
        if (chatTyping.size === 0) {
          newMap.delete(chatId);
        }
      }
      return { typingUsers: newMap };
    }),
  getTypingUsers: (chatId) => {
    const typingSet = get().typingUsers.get(chatId);
    return typingSet ? Array.from(typingSet) : [];
  },
  isUserTyping: (chatId, userId) => {
    const typingSet = get().typingUsers.get(chatId);
    return typingSet ? typingSet.has(userId) : false;
  },

  isConnected: false,
  setConnected: (connected) => set({ isConnected: connected }),

  currentChatId: null,
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
}));
