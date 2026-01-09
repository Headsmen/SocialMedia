import { Box, Title, Anchor, TextInput, PasswordInput } from "@mantine/core";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { Form } from "@/shared/ui/Form";
import { loginSchema } from "@/shared/lib/validators";
import { useLogin } from "@/entities/user";

interface LoginWidgetProps {
  onToggleMode: () => void;
}

export function LoginWidget({ onToggleMode }: LoginWidgetProps) {
  const loginMutation = useLogin();

  return (
    <Box maw={400} mt="150" mx="auto" p="md">
      <Title order={2} mb="xl" ta="center">
        Вход в систему
      </Title>

      {loginMutation.isError &&
        NotificationFactory.createError({
          title: "Ошибка входа",
          message: loginMutation.error?.message || "Произошла ошибка при входе",
          onClose: loginMutation.reset,
        })}

      <Form
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          loginMutation.mutate(values);
        }}
        submitText="Войти"
        showCancelButton={false}
      >
        {(formik) => (
          <>
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

            <Anchor onClick={onToggleMode} ta="center" size="sm">
              Нет аккаунта? Зарегистрируйтесь
            </Anchor>
          </>
        )}
      </Form>
    </Box>
  );
}
