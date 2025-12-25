export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Message events
  SEND_MESSAGE: 'sendMessage',
  NEW_MESSAGE: 'newMessage',
  MESSAGE_DELIVERED: 'messageDelivered',
  MESSAGE_READ: 'messageRead',

  // Typing events
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  USER_TYPING: 'userTyping',

  // Presence events
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
  GET_ONLINE_USERS: 'getOnlineUsers',
  ONLINE_USERS: 'onlineUsers',

  // Chat events
  JOIN_CHAT: 'joinChat',
  LEAVE_CHAT: 'leaveChat',
} as const;

export type SocketEvents = typeof SocketEvents[keyof typeof SocketEvents];

// Worker message types
export const WorkerMessageType = {
  INIT: 'INIT',
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  EMIT: 'EMIT',
  SOCKET_EVENT: 'SOCKET_EVENT',
  ERROR: 'ERROR',
} as const;

export type WorkerMessageType = typeof WorkerMessageType[keyof typeof WorkerMessageType];
