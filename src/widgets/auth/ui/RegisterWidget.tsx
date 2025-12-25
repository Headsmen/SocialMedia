import { Button, Group, Box, Stack, Title, Anchor, TextInput, PasswordInput } from "@mantine/core";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { useRegisterForm } from "../model/useRegisterForm";

interface RegisterWidgetProps {
  onToggleMode: () => void;
}

export function RegisterWidget({ onToggleMode }: RegisterWidgetProps) {
  const { formik, isLoading, isError, error, showSuccess, setShowSuccess, reset } = useRegisterForm();

  return (
    <Box maw={400} mt="100" mx="auto" p="md">
      <Title order={2} mb="xl" ta="center">
        Регистрация
      </Title>

      {showSuccess &&
        NotificationFactory.createSuccess({
          title: "Успешно!",
          message: "Регистрация прошла успешно! Добро пожаловать!",
          onClose: () => setShowSuccess(false),
        })}

      {isError &&
        NotificationFactory.createError({
          title: "Ошибка",
          message: String(error),
          onClose: reset,
        })}

      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Group grow>
            <TextInput
              label="Имя"
              placeholder="Введите ваше имя"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined}
            />
            <TextInput
              label="Фамилия"
              placeholder="Введите вашу фамилию"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined}
            />
          </Group>

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

          <PasswordInput
            label="Подтверждение пароля"
            placeholder="Повторите пароль"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
          />

          <Button type="submit" loading={isLoading} fullWidth size="md">
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
