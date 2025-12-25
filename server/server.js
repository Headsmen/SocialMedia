import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());

// CORS настройки
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Socket.IO с CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const onlineUsers = new Map();
const userSockets = new Map();
const typingUsers = new Map();

const chats = new Map();
const messages = new Map();

function addOnlineUser(socketId, userId) {
  onlineUsers.set(socketId, userId);

  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socketId);
}

function removeOnlineUser(socketId) {
  const userId = onlineUsers.get(socketId);
  if (userId) {
    onlineUsers.delete(socketId);

    const sockets = userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        userSockets.delete(userId);
        return userId;
      }
    }
  }
  return null;
}

function isUserOnline(userId) {
  return userSockets.has(userId) && userSockets.get(userId).size > 0;
}

function getOnlineUserIds() {
  return Array.from(userSockets.keys());
}

function getOrCreateChat(chatId, participantIds = []) {
  if (!chats.has(chatId)) {
    let participants = participantIds;
    if (participants.length === 0 && chatId.includes("_")) {
      participants = chatId.split("_").filter((id) => !id.includes("@"));
    }

    const chat = {
      id: chatId,
      participantIds: participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    chats.set(chatId, chat);
    messages.set(chatId, []);
  }
  return chats.get(chatId);
}

function saveMessage(message) {
  const chatMessages = messages.get(message.chatId) || [];
  chatMessages.push(message);
  messages.set(message.chatId, chatMessages);

  // Обновляем lastMessage в чате
  const chat = chats.get(message.chatId);
  if (chat) {
    chat.lastMessage = message;
    chat.updatedAt = new Date().toISOString();
  }

  return message;
}

function getMessages(chatId, page = 1, limit = 50) {
  const chatMessages = messages.get(chatId) || [];
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMessages = chatMessages.slice(startIndex, endIndex);

  return {
    data: paginatedMessages,
    total: chatMessages.length,
    hasMore: endIndex < chatMessages.length,
  };
}

// Socket.IO события
io.on("connection", (socket) => {
  // Аутентификация пользователя
  const userId =
    socket.handshake.auth?.userId || socket.handshake.query?.userId;

  if (userId) {
    addOnlineUser(socket.id, userId);

    // Отправляем список онлайн пользователей новому клиенту
    socket.emit("onlineUsers", { userIds: getOnlineUserIds() });

    // Уведомляем всех о новом онлайн пользователе
    socket.broadcast.emit("userOnline", { userId, isOnline: true });
  }

  // Присоединение к чату
  socket.on("joinChat", ({ chatId }) => {
    socket.join(`chat:${chatId}`);
  });

  // Выход из чата
  socket.on("leaveChat", ({ chatId }) => {
    socket.leave(`chat:${chatId}`);
  });

  // Отправка сообщения
  socket.on("sendMessage", ({ chatId, content, tempId }) => {
    // Создаем сообщение
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      chatId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
      tempId,
    };

    // Сохраняем сообщение в хранилище
    saveMessage(message);

    // Отправляем сообщение всем в чате (включая отправителя)
    io.to(`chat:${chatId}`).emit("newMessage", message);

    // Также отправляем всем участникам чата уведомление (если они не в комнате)
    socket.broadcast.emit("newMessage", message);
  });

  // Начало печати
  socket.on("typingStart", ({ chatId }) => {
    if (!typingUsers.has(chatId)) {
      typingUsers.set(chatId, new Set());
    }
    typingUsers.get(chatId).add(userId);

    // Уведомляем других в чате
    socket.to(`chat:${chatId}`).emit("userTyping", {
      chatId,
      userId,
      isTyping: true,
    });
  });

  // Окончание печати
  socket.on("typingStop", ({ chatId }) => {
    if (typingUsers.has(chatId)) {
      typingUsers.get(chatId).delete(userId);
      if (typingUsers.get(chatId).size === 0) {
        typingUsers.delete(chatId);
      }
    }

    // Уведомляем других в чате
    socket.to(`chat:${chatId}`).emit("userTyping", {
      chatId,
      userId,
      isTyping: false,
    });
  });

  // Сообщение прочитано
  socket.on("messageRead", ({ chatId, messageId }) => {
    socket.to(`chat:${chatId}`).emit("messageRead", {
      chatId,
      messageId,
      userId,
    });
  });

  // Запрос списка онлайн пользователей
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", { userIds: getOnlineUserIds() });
  });

  // Отключение
  socket.on("disconnect", () => {
    const disconnectedUserId = removeOnlineUser(socket.id);

    if (disconnectedUserId && !isUserOnline(disconnectedUserId)) {
      // Уведомляем всех об оффлайн статусе
      socket.broadcast.emit("userOffline", {
        userId: disconnectedUserId,
        isOnline: false,
      });
    }
  });
});

// REST API эндпоинты

// Получить все чаты
app.get("/chats", (req, res) => {
  const allChats = Array.from(chats.values());
  res.json({
    data: allChats,
    total: allChats.length,
  });
});

// Получить чат по ID
app.get("/chats/:chatId", (req, res) => {
  const { chatId } = req.params;
  const chat = chats.get(chatId);

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json(chat);
});

// Создать или найти чат
app.post("/chats/find-or-create", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Ищем существующий чат с этим пользователем
  const existingChat = Array.from(chats.values()).find((chat) =>
    chat.participantIds.includes(userId)
  );

  if (existingChat) {
    return res.json(existingChat);
  }

  // Создаем новый чат
  const chatId = `${Date.now()}_${userId}`;
  const chat = getOrCreateChat(chatId, [userId]);

  res.json(chat);
});

// Получить сообщения чата
app.get("/chats/:chatId/messages", (req, res) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  // Создаем чат если его нет
  getOrCreateChat(chatId);

  const result = getMessages(chatId, page, limit);
  res.json(result);
});

// Отправить сообщение (через REST API)
app.post("/chats/:chatId/messages", (req, res) => {
  const { chatId } = req.params;
  const { content, senderId } = req.body;

  if (!content || !senderId) {
    return res.status(400).json({ error: "content and senderId are required" });
  }

  // Создаем чат если его нет
  getOrCreateChat(chatId);

  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    chatId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  saveMessage(message);

  // Отправляем через WebSocket если есть активные соединения
  io.to(`chat:${chatId}`).emit("newMessage", message);

  res.json(message);
});

// Отметить сообщения как прочитанные
app.patch("/chats/:chatId/messages/read", (req, res) => {
  const { chatId } = req.params;
  const { messageIds } = req.body;

  if (!messageIds || !Array.isArray(messageIds)) {
    return res.status(400).json({ error: "messageIds array is required" });
  }

  const chatMessages = messages.get(chatId) || [];

  messageIds.forEach((messageId) => {
    const message = chatMessages.find((m) => m.id === messageId);
    if (message) {
      message.isRead = true;
    }
  });

  res.json({ success: true });
});

// Удалить сообщение
app.delete("/chats/:chatId/messages/:messageId", (req, res) => {
  const { chatId, messageId } = req.params;
  const chatMessages = messages.get(chatId) || [];

  const index = chatMessages.findIndex((m) => m.id === messageId);
  if (index !== -1) {
    chatMessages.splice(index, 1);
    messages.set(chatId, chatMessages);
  }

  res.json({ success: true });
});

// Удалить чат
app.delete("/chats/:chatId", (req, res) => {
  const { chatId } = req.params;

  chats.delete(chatId);
  messages.delete(chatId);

  res.json({ success: true });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    onlineUsers: getOnlineUserIds().length,
    chatsCount: chats.size,
    timestamp: new Date().toISOString(),
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {});
