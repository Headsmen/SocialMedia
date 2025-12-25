import { Button, Box, Stack, Title, Anchor } from "@mantine/core";
import { FormFieldFactory } from "@/shared/ui/factories/form-factory";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { useLoginForm } from "../model/useLoginForm";

interface LoginWidgetProps {
  onToggleMode: () => void;
}

export function LoginWidget({ onToggleMode }: LoginWidgetProps) {
  const { form, handleSubmit, isLoading, isError, error, reset } = useLoginForm();

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

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {FormFieldFactory.createEmailInput(form.getInputProps("email"))}

          {FormFieldFactory.createPasswordInput({
            label: "Пароль",
            placeholder: "Введите пароль",
            inputProps: form.getInputProps("password"),
          })}

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
