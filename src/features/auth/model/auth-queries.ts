// src/features/auth/model/auth-queries.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../../../shared/store/auth-store';
import type { RegisterData } from '../../../shared/types/auth';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      console.log('Register mutation started with data:', data);
      try {
        const result = await authApi.register(data);
        console.log('Register mutation success:', result);
        return result;
      } catch (error) {
        console.error('Register mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Register onSuccess called with:', data);
      setAuth(data.user, data.token);
    },
    onError: (error) => {
      console.error('Register onError called with:', error);
    },
  });
};