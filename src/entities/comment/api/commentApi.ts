import axios from 'axios';
import type { Comment } from '../model/types';

interface GetCommentsParams {
  page: number;
  limit: number;
}

interface GetCommentsResponse {
  comments: Comment[];
  hasMore: boolean;
  total: number;
}

export const commentApi = {
  getComments: async ({ page, limit }: GetCommentsParams): Promise<GetCommentsResponse> => {
    const start = (page - 1) * limit;

    const response = await axios.get('https://jsonplaceholder.typicode.com/comments', {
      params: {
        _start: start,
        _limit: limit,
      },
    });

    // Оставляем только email и body
    const filteredComments = response.data.map((comment: any) => ({
      email: comment.email,
      body: comment.body,
    }));

    // Универсальное определение hasMore (работает для большинства API)
    let hasMore = filteredComments.length === limit;
    let total: number | undefined;

    // Стратегия 1: Проверяем заголовок x-total-count
    if (response.headers['x-total-count']) {
      total = parseInt(response.headers['x-total-count'], 10);
      hasMore = start + limit < total;
    }
    // Стратегия 2: Проверяем тело ответа (если API возвращает pagination)
    else if (response.data.pagination) {
      hasMore = response.data.pagination.hasNextPage ?? hasMore;
      total = response.data.pagination.total;
    }
    // Стратегия 3: Fallback - по длине массива
    // (уже установлено выше)

    return {
      comments: filteredComments,
      hasMore,
      total: total ?? start + filteredComments.length,
    };
  },
};
