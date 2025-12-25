// WebSocket Worker для обработки Socket.IO в отдельном потоке
// Загружаем Socket.IO из CDN
importScripts('https://cdn.socket.io/4.7.2/socket.io.min.js');

let socket = null;

// Worker message types
const WorkerMessageType = {
  INIT: 'INIT',
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  EMIT: 'EMIT',
  SOCKET_EVENT: 'SOCKET_EVENT',
  ERROR: 'ERROR',
};

self.addEventListener('message', (event) => {
  const { type, payload, event: eventName } = event.data;

  switch (type) {
    case WorkerMessageType.INIT:
      initializeSocket(payload);
      break;

    case WorkerMessageType.CONNECT:
      connectSocket();
      break;

    case WorkerMessageType.DISCONNECT:
      disconnectSocket();
      break;

    case WorkerMessageType.EMIT:
      if (socket && eventName) {
        socket.emit(eventName, payload);
      }
      break;

    default:
  }
});

function initializeSocket({ url, token }) {
  try {
    // Создаем Socket.IO клиент с настройками
    socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      auth: token ? { token, userId: token } : undefined,
    });

    // Подписываемся на системные события
    socket.on('connect', () => {
      postMessage({
        type: WorkerMessageType.SOCKET_EVENT,
        event: 'connect',
        payload: { socketId: socket.id },
      });
    });

    socket.on('disconnect', (reason) => {
      postMessage({
        type: WorkerMessageType.SOCKET_EVENT,
        event: 'disconnect',
        payload: { reason },
      });
    });

    socket.on('connect_error', (error) => {
      postMessage({
        type: WorkerMessageType.ERROR,
        payload: { message: error.message },
      });
    });

    // Подписываемся на бизнес-события
    subscribeToEvents();

  } catch (error) {
    postMessage({
      type: WorkerMessageType.ERROR,
      payload: { message: error.message },
    });
  }
}

function subscribeToEvents() {
  if (!socket) return;

  // Новое сообщение
  socket.on('newMessage', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'newMessage',
      payload,
    });
  });

  // Сообщение доставлено
  socket.on('messageDelivered', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'messageDelivered',
      payload,
    });
  });

  // Сообщение прочитано
  socket.on('messageRead', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'messageRead',
      payload,
    });
  });

  // Пользователь печатает
  socket.on('userTyping', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'userTyping',
      payload,
    });
  });

  // Пользователь онлайн
  socket.on('userOnline', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'userOnline',
      payload,
    });
  });

  // Пользователь оффлайн
  socket.on('userOffline', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'userOffline',
      payload,
    });
  });

  // Список онлайн пользователей
  socket.on('onlineUsers', (payload) => {
    postMessage({
      type: WorkerMessageType.SOCKET_EVENT,
      event: 'onlineUsers',
      payload,
    });
  });
}

function connectSocket() {
  if (socket && !socket.connected) {
    socket.connect();
  }
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

