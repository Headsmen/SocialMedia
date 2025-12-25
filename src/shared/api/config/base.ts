import { api } from "./axiosInstance";
import axios from 'axios';

const BASE_URL = 'https://db582e00da260208.mokky.dev';

api.interceptors.request.use(async (config) => {

  if (config.url === '/auth/login' || config.url === '/auth/register') {

    return {
      ...config,
      adapter: async (config) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

          const existingUserResponse = await axios.get(`${BASE_URL}/FriendsPlayers?email=${data.email}`);
          let user = existingUserResponse.data[0];

          if (!user && config.url === '/auth/register') {
            const newUserResponse = await axios.post(`${BASE_URL}/FriendsPlayers`, {
              email: data.email,
              firstName: data.firstName || 'Пользователь',
              lastName: data.lastName || 'Неизвестный',
              avatar: data.avatar || `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
              createdAt: new Date().toISOString(),
              FriendRequests: [], // Исходящие запросы
              IncomingRequests: [], // Входящие запросы
              Friends: [], // Список друзей
            });
            user = newUserResponse.data;
          }

          // Если логин и пользователя нет - ошибка
          if (!user && config.url === '/auth/login') {
            return Promise.reject({
              response: {
                data: { message: 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.' },
                status: 404,
              }
            });
          }

          const response = {
            data: {
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              token: 'mock-jwt-token-' + Date.now(),
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };

          return Promise.resolve(response);
        } catch (error) {
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

export { api };
