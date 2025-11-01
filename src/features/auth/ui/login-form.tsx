import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Notification,
  Stack,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { IconX } from "@tabler/icons-react";
import { useLogin } from "../model/auth-queries";
import { loginSchema } from "../../../shared/lib/validators";
import type { LoginData } from "../../../shared/types/auth";

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const loginMutation = useLogin();

  const form = useForm<LoginData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema) as any,
  });

  const handleSubmit = (values: LoginData) => {
    loginMutation.mutate(values);
  };

  return (
    <div className=''>
      <Box maw={400} mt="150" mx="auto" p="md">
        <Title order={2} mb="xl" ta="center">
          Вход в систему
        </Title>

        {loginMutation.isError && (
          <Notification
            icon={<IconX size="1.1rem" />}
            color="red"
            title="Ошибка входа"
            onClose={() => loginMutation.reset()}
            mb="md"
          >
            {loginMutation.error as unknown as string}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps("password")}
            />

            <Button
              type="submit"
              loading={loginMutation.isPending}
              fullWidth
              size="md"
            >
              Войти
            </Button>

            <Anchor onClick={onToggleMode} ta="center" size="sm">
              Нет аккаунта? Зарегистрируйтесь
            </Anchor>
          </Stack>
        </form>
      </Box>
    </div>
  );
}
