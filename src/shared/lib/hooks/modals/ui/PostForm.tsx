import { Textarea, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import type { PostFormProps } from '../model/types';

export function PostForm({ initialData, onSubmit, mode = 'create' }: PostFormProps) {
  const form = useForm({
    initialValues: initialData || {
      content: '',
      imageUrl: '',
    },
    validate: {
      content: (value) => {
        if (!value?.trim()) return 'Содержимое поста не может быть пустым';
        if (value.length > 1000) return 'Максимальная длина поста - 1000 символов';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await onSubmit(values);
    modals.closeAll();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Textarea
          label="Содержимое поста"
          placeholder="Что у вас нового?"
          required
          minRows={4}
          maxRows={8}
          {...form.getInputProps('content')}
        />

        <ImageUpload
          value={form.values.imageUrl}
          onChange={(value) => form.setFieldValue('imageUrl', value || '')}
          error={form.errors.imageUrl as string}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => modals.closeAll()}>
            Отмена
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Опубликовать' : 'Сохранить'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
