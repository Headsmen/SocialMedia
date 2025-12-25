import { commentsApi as api } from '@/shared/api/config/axiosInstance';
import { BaseCrudApi } from '../factories/BaseCrudApi';

export interface Comment {
  id: string;
  email: string;
  body: string;
}

interface GetCommentsParams {
  page: number;
  limit: number;
}

interface GetCommentsResponse {
  comments: Comment[];
  hasMore: boolean;
  total: number;
}

class CommentApi extends BaseCrudApi<Comment> {
  constructor() {
    super(api, '/comments');
  }

  async getComments({ page, limit }: GetCommentsParams): Promise<GetCommentsResponse> {
    const start = (page - 1) * limit;

    const response = await this.getAll({
      _start: start,
      _limit: limit,
    });

    const filteredComments = response.data.map((comment: Comment) => ({
      id: comment.id,
      email: comment.email,
      body: comment.body,
    }));

    let hasMore = filteredComments.length === limit;
    let total: number | undefined;

    // Стратегия 1: Проверяем заголовок x-total-count
    if (response.headers['x-total-count']) {
      total = parseInt(response.headers['x-total-count'], 10);
      hasMore = start + limit < total;
    }
    // Стратегия 2: Проверяем тело ответа (если API возвращает pagination)
    else if ((response.data as any).pagination) {
      hasMore = (response.data as any).pagination.hasNextPage ?? hasMore;
      total = (response.data as any).pagination.total;
    }

    return {
      comments: filteredComments,
      hasMore,
      total: total ?? start + filteredComments.length,
    };
  }
}

export const commentApi = new CommentApi();
