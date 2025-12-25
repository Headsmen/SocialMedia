import { Button, Box, Stack, Title, Anchor, TextInput, PasswordInput } from "@mantine/core";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { useLoginForm } from "../model/useLoginForm";

interface LoginWidgetProps {
  onToggleMode: () => void;
}

export function LoginWidget({ onToggleMode }: LoginWidgetProps) {
  const { formik, isLoading, isError, error, reset } = useLoginForm();

  return (
    <Box maw={400} mt="150" mx="auto" p="md">
      <Title order={2} mb="xl" ta="center">
        Вход в систему
      </Title>

      {isError &&
        NotificationFactory.createError({
          title: "Ошибка входа",
          message: error?.message || "Произошла ошибка при входе",
          onClose: reset,
        })}

      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="Введите email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          />

          <Button type="submit" loading={isLoading} fullWidth size="md">
            Войти
          </Button>

          <Anchor onClick={onToggleMode} ta="center" size="sm">
            Нет аккаунта? Зарегистрируйтесь
          </Anchor>
        </Stack>
      </form>
    </Box>
  );
}
