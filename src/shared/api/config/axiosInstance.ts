import { createApiClient } from "../factories";

// Основной API для Mokky.dev
export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  withAuth: false,
});

// Отдельный экземпляр для чатов (локальный бекенд)
export const chatApi = createApiClient({
  baseURL: import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3001',
  withAuth: false,
});

// Отдельный экземпляр для JSONPlaceholder (комментарии)
export const commentsApi = createApiClient({
  baseURL: import.meta.env.TEXT_POSTS_COMMENTS?.replace('/comments', '') || 'https://jsonplaceholder.typicode.com',
  withAuth: false,
});