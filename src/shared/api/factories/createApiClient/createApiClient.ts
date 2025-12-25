import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  withAuth?: boolean;
  timeout?: number;
}

/**
 * Фабричный метод для создания настроенных axios экземпляров
 */
export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  } as AxiosRequestConfig);

  // Добавляем interceptor для авторизации если нужно
  if (config.withAuth) {
    instance.interceptors.request.use(
      (requestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  // Interceptor для обработки ошибок
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Можно добавить централизованную обработку ошибок
      if (error.response?.status === 401) {
        // Обработка unauthorized
        localStorage.removeItem('authToken');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
