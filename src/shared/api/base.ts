// src/shared/api/base.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {

  if (config.url === '/auth/login' || config.url === '/auth/register') {
    console.log('Mock auth request:', config.url, config.data);

    return {
      ...config,
      adapter: async (config) => {
        try {

          await new Promise(resolve => setTimeout(resolve, 500));

          const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

          console.log('Mock auth data:', data);

          const response = {
            data: {
              user: {
                id: '1',
                email: data.email || 'user@example.com',
                firstName: data.firstName || 'Иван',
                lastName: data.lastName || 'Иванов',
              },
              token: 'mock-jwt-token-' + Date.now(),
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };

          console.log('Mock auth response:', response);
          return Promise.resolve(response);
        } catch (error) {
          console.error('Mock auth error:', error);
          return Promise.reject(error);
        }
      },
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data?.message || 'Ошибка сети');
  }
);