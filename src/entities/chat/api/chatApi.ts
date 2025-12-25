// Re-export from shared API services
export { chatApi } from '@/shared/api/chat';
export type {
  Chat,
  Message,
  GetChatsResponse,
  GetMessagesResponse,
  GetMessagesParams,
  SendMessageParams,
  CreateChatParams,
  MarkAsReadParams,
} from '@/shared/api/chat';
