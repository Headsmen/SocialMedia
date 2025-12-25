import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { websocketManager } from "@/shared/api/websocket/websocketManager";
import { SocketEvents } from "@/shared/api/websocket/config/events";
import { useChatStore, chatKeys } from "@/entities/chat";
import type { Message } from "@/entities/chat";

export const useWebSocket = (userId: string | null) => {
  const queryClient = useQueryClient();
  const isInitialized = useRef(false);
  const {
    addOnlineUser,
    removeOnlineUser,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
    setConnected,
  } = useChatStore();

  useEffect(() => {
    if (!userId || isInitialized.current) return;

    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3001";

    //
    websocketManager.initialize(wsUrl, userId);
    websocketManager.connect();
    isInitialized.current = true;

    const unsubscribeConnect = websocketManager.on("connect", () => {
      setConnected(true);

      websocketManager.emit(SocketEvents.GET_ONLINE_USERS);
    });

    const unsubscribeDisconnect = websocketManager.on("disconnect", () => {
      setConnected(false);
    });

    const unsubscribeNewMessage = websocketManager.on(
      "newMessage",
      (message: Message) => {

        queryClient.setQueryData(
          chatKeys.messages(message.chatId),
          (old: any) => {
            if (!old) return old;

            const messageExists = old.pages.some((page: any) =>
              page.data.some(
                (msg: Message) =>
                  msg.id === message.id ||
                  (message.tempId && msg.tempId === message.tempId)
              )
            );

            if (messageExists) return old;

            return {
              ...old,
              pages: old.pages.map((page: any, index: number) =>
                index === 0 ? { ...page, data: [...page.data, message] } : page
              ),
            };
          }
        );

        queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      }
    );

    const unsubscribeUserOnline = websocketManager.on(
      "userOnline",
      ({ userId }: any) => {
        addOnlineUser(userId);
      }
    );

    const unsubscribeUserOffline = websocketManager.on(
      "userOffline",
      ({ userId }: any) => {
        removeOnlineUser(userId);
      }
    );

    const unsubscribeOnlineUsers = websocketManager.on(
      "onlineUsers",
      ({ userIds }: any) => {
        setOnlineUsers(userIds);
      }
    );

    const unsubscribeTyping = websocketManager.on(
      "userTyping",
      ({ chatId, userId, isTyping }: any) => {
        if (isTyping) {
          addTypingUser(chatId, userId);
        } else {
          removeTypingUser(chatId, userId);
        }
      }
    );

    const unsubscribeMessageRead = websocketManager.on(
      "messageRead",
      ({ chatId, messageId }: any) => {

        queryClient.setQueryData(chatKeys.messages(chatId), (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((msg: Message) =>
                msg.id === messageId ? { ...msg, isRead: true } : msg
              ),
            })),
          };
        });
      }
    );

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeNewMessage();
      unsubscribeUserOnline();
      unsubscribeUserOffline();
      unsubscribeOnlineUsers();
      unsubscribeTyping();
      unsubscribeMessageRead();
      websocketManager.destroy();
      isInitialized.current = false;
    };
  }, [
    userId,
    queryClient,
    addOnlineUser,
    removeOnlineUser,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
    setConnected,
  ]);

  return {
    isConnected: useChatStore((state) => state.isConnected),
  };
};
