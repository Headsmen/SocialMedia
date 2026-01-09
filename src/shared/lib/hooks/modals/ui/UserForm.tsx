import { TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { userSchema } from '@/shared/lib/validators';
import { Form } from '@/shared/ui/Form';
import type { UserFormProps } from '../model/types';

export function UserForm({ initialData, onSubmit, mode = 'edit' }: UserFormProps) {
  return (
    <Form
      initialValues={initialData || {
        firstName: '',
        lastName: '',
      }}
      validationSchema={userSchema}
      onSubmit={async (values) => {
        await onSubmit(values);
        modals.closeAll();
      }}
      onCancel={() => modals.closeAll()}
      submitText={mode === 'create' ? 'Создать' : 'Сохранить'}
    >
      {(formik) => (
        <>
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
        </>
      )}
    </Form>
  );
}
