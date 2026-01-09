import { useState } from "react";
import { Group, Box, Title, Anchor, TextInput, PasswordInput } from "@mantine/core";
import { NotificationFactory } from "@/shared/ui/factories/notification-factory";
import { Form } from "@/shared/ui/Form";
import { registerSchema } from "@/shared/lib/validators";
import { useRegister } from "@/entities/user";

interface RegisterWidgetProps {
  onToggleMode: () => void;
}

export function RegisterWidget({ onToggleMode }: RegisterWidgetProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const registerMutation = useRegister();

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

      {registerMutation.isError &&
        NotificationFactory.createError({
          title: "Ошибка",
          message: String(registerMutation.error),
          onClose: registerMutation.reset,
        })}

      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          registerMutation.mutate(values as any, {
            onSuccess: () => {
              setShowSuccess(true);
            },
          });
        }}
        submitText="Зарегистрироваться"
        showCancelButton={false}
      >
        {(formik) => (
          <>
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

            <Anchor onClick={onToggleMode} ta="center" size="sm">
              Уже есть аккаунт? Войдите
            </Anchor>
          </>
        )}
      </Form>
    </Box>
  );
}
