import { TextInput, Button, Group, Stack } from '@mantine/core';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { modals } from '@mantine/modals';
import { userSchema } from '@/shared/lib/validators';
import type { UserFormProps } from '../model/types';

export function UserForm({ initialData, onSubmit, mode = 'edit' }: UserFormProps) {
  const formik = useFormik({
    initialValues: initialData || {
      firstName: '',
      lastName: '',
    },
    validationSchema: toFormikValidationSchema(userSchema),
    onSubmit: async (values) => {
      await onSubmit(values);
      modals.closeAll();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack>
        <TextInput
          label="Имя"
          placeholder="Введите имя"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined}
          required
        />
        <TextInput
          label="Фамилия"
          placeholder="Введите фамилию"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined}
          required
        />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => modals.closeAll()}>
            Отмена
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
