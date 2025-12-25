import { api } from '@/shared/api/config/axiosInstance';
import { BaseCrudApi } from '../factories/BaseCrudApi';

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  likedBy?: string[];
}

export interface CreatePostData {
  userId: string;
  content: string;
  imageUrl?: string;
}

const POSTS_STORAGE_KEY = 'social_media_posts';

const getLocalPosts = (): Post[] => {
  try {
    const posts = localStorage.getItem(POSTS_STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch {
    return [];
  }
};

const saveLocalPosts = (posts: Post[]): void => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

class PostsApi extends BaseCrudApi<Post, CreatePostData> {
  constructor() {
    super(api, '/posts');
  }

  async getPosts(): Promise<Post[]> {
    try {
      const response = await this.getAll();
      return response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      const posts = getLocalPosts();
      return posts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }

  async getPostById(id: string): Promise<Post> {
    try {
      const response = await this.getById(id);
      return response.data;
    } catch (error) {
      const posts = getLocalPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    }
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const newPost: Post = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      likedBy: [],
    };

    try {
      const response = await this.create(newPost);
      return response.data;
    } catch (error) {
      const posts = getLocalPosts();
      posts.unshift(newPost);
      saveLocalPosts(posts);
      return newPost;
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      await this.delete(id);
    } catch (error) {
      const posts = getLocalPosts();
      const filteredPosts = posts.filter((p) => p.id !== id);
      saveLocalPosts(filteredPosts);
    }
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    try {
      const currentPost = await this.getPostById(postId);
      const likedBy = currentPost.likedBy || [];
      const isLiked = likedBy.includes(userId);

      const updatedLikedBy = isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];

      const response = await this.update(postId, {
        likedBy: updatedLikedBy,
        likesCount: updatedLikedBy.length,
      });

      return response.data;
    } catch (error) {
      const posts = getLocalPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const post = posts[postIndex];
      const likedBy = post.likedBy || [];
      const isLiked = likedBy.includes(userId);

      const updatedLikedBy = isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];

      posts[postIndex] = {
        ...post,
        likedBy: updatedLikedBy,
        likesCount: updatedLikedBy.length,
      };

      saveLocalPosts(posts);
      return posts[postIndex];
    }
  }
}

export const postsApi = new PostsApi();
