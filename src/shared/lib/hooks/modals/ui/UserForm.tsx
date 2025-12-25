import { TextInput, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import type { UserFormProps } from '../model/types';

export function UserForm({ initialData, onSubmit, mode = 'edit' }: UserFormProps) {
  const form = useForm({
    initialValues: initialData || {
      firstName: '',
      lastName: '',
    },
    validate: {
      firstName: (value) => (!value?.trim() ? 'Имя обязательно' : null),
      lastName: (value) => (!value?.trim() ? 'Фамилия обязательна' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await onSubmit(values);
    modals.closeAll();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Имя"
          placeholder="Введите имя"
          {...form.getInputProps('firstName')}
          required
        />
        <TextInput
          label="Фамилия"
          placeholder="Введите фамилию"
          {...form.getInputProps('lastName')}
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
