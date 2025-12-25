// src/shared/lib/validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Некорректный email' }),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const registerSchema = loginSchema
  .extend({
    firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const postSchema = z.object({
  content: z.string()
    .min(1, 'Содержимое поста не может быть пустым')
    .max(1000, 'Максимальная длина поста - 1000 символов'),
  imageUrl: z.string().optional(),
});

export const userSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
});