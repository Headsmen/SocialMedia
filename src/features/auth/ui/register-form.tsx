// src/features/auth/ui/register-form.tsx
import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Notification,
  Stack,
  Title,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRegister } from '../model/auth-queries';
import { registerSchema } from '../../../shared/lib/validators';
import type { RegisterData } from '../../../shared/types/auth';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const registerMutation = useRegister();

  const form = useForm<RegisterData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: zodResolver(registerSchema) as any,
  });

  const handleSubmit = (values: RegisterData) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setShowSuccess(true);
        form.reset();
      },
    });
  };

  return (
    <Box maw={400} mt="100" mx="auto" p="md">
      <Title order={2} mb="xl" ta="center">
        Регистрация
      </Title>

      {showSuccess && (
        <Notification
          icon={<IconCheck size="1.1rem" />}
          color="teal"
          title="Успешно!"
          onClose={() => setShowSuccess(false)}
          mb="md"
        >
          Регистрация прошла успешно! Добро пожаловать!
        </Notification>
      )}

      {registerMutation.isError && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          title="Ошибка"
          onClose={() => registerMutation.reset()}
          mb="md"
        >
          {registerMutation.error as unknown as string}
        </Notification>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group grow>
            <TextInput
              label="Имя"
              placeholder="Введите ваше имя"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Фамилия"
              placeholder="Введите вашу фамилию"
              {...form.getInputProps('lastName')}
            />
          </Group>

          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label="Подтверждение пароля"
            placeholder="Повторите пароль"
            {...form.getInputProps('confirmPassword')}
          />

          <Button
            type="submit"
            loading={registerMutation.isPending}
            fullWidth
            size="md"
          >
            Зарегистрироваться
          </Button>

          <Anchor onClick={onToggleMode} ta="center" size="sm">
            Уже есть аккаунт? Войдите
          </Anchor>
        </Stack>
      </form>
    </Box>
  );
}