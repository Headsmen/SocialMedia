import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, usersApi, type LoginData, type RegisterData, type AuthResponse } from '@/shared/api';
import { api } from '@/shared/api';
import { useAuthStore } from './auth-store';
import { userKeys } from '../config/userKeys';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const existingUser = await usersApi.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже зарегистрирован');
      }

      const response = await authService.register(userData);

      try {
        await usersApi.createUser({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } catch (error) {
      }

      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      return authService.getCurrentUser();
    },
    enabled: !!localStorage.getItem('token'),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
  };
};
