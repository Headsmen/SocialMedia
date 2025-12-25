import type { AxiosInstance, AxiosResponse } from 'axios';

export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total?: number;
    hasMore?: boolean;
  };
}

export class BaseCrudApi<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected api: AxiosInstance;
  protected endpoint: string;

  constructor(api: AxiosInstance, endpoint: string) {
    this.api = api;
    this.endpoint = endpoint;
  }

  async getAll(params?: Record<string, unknown>): Promise<AxiosResponse<T[]>> {
    return this.api.get<T[]>(this.endpoint, { params });
  }

  async getPaginated(params: PaginationParams): Promise<AxiosResponse<PaginatedResponse<T>>> {
    return this.api.get<PaginatedResponse<T>>(this.endpoint, { params });
  }

  async getById(id: string | number): Promise<AxiosResponse<T>> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: CreateDto): Promise<AxiosResponse<T>> {
    return this.api.post<T>(this.endpoint, data);
  }

  async update(id: string | number, data: UpdateDto): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string | number): Promise<AxiosResponse<void>> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Создает custom endpoint для специфичных операций
   */
  protected createCustomEndpoint(path: string) {
    return `${this.endpoint}${path}`;
  }
}
