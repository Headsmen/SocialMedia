import { Button, Group, Box, Stack, Title, Anchor } from "@mantine/core";
import { FormFieldFactory } from "@/shared/ui/factories/form-factory";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { useRegisterForm } from "../model/useRegisterForm";

interface RegisterWidgetProps {
  onToggleMode: () => void;
}

export function RegisterWidget({ onToggleMode }: RegisterWidgetProps) {
  const { form, handleSubmit, isLoading, isError, error, showSuccess, setShowSuccess, reset } = useRegisterForm();

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

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group grow>
            {FormFieldFactory.createTextInput({
              label: "Имя",
              placeholder: "Введите ваше имя",
              inputProps: form.getInputProps("firstName"),
            })}
            {FormFieldFactory.createTextInput({
              label: "Фамилия",
              placeholder: "Введите вашу фамилию",
              inputProps: form.getInputProps("lastName"),
            })}
          </Group>

          {FormFieldFactory.createEmailInput(form.getInputProps("email"))}

          {FormFieldFactory.createPasswordInput({
            label: "Пароль",
            placeholder: "Введите пароль",
            inputProps: form.getInputProps("password"),
          })}

          {FormFieldFactory.createPasswordInput({
            label: "Подтверждение пароля",
            placeholder: "Повторите пароль",
            inputProps: form.getInputProps("confirmPassword"),
          })}

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
