import { Textarea, Button, Group, Stack } from '@mantine/core';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { modals } from '@mantine/modals';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import { postSchema } from '@/shared/lib/validators';
import type { PostFormProps } from '../model/types';

export function PostForm({ initialData, onSubmit, mode = 'create' }: PostFormProps) {
  const formik = useFormik({
    initialValues: initialData || {
      content: '',
      imageUrl: '',
    },
    validationSchema: toFormikValidationSchema(postSchema),
    onSubmit: async (values) => {
      await onSubmit(values);
      modals.closeAll();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="md">
        <Textarea
          label="Содержимое поста"
          placeholder="Что у вас нового?"
          required
          minRows={4}
          maxRows={8}
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.content && formik.errors.content ? formik.errors.content : undefined}
        />

        <ImageUpload
          value={formik.values.imageUrl}
          onChange={(value) => formik.setFieldValue('imageUrl', value || '')}
          error={formik.touched.imageUrl && formik.errors.imageUrl ? formik.errors.imageUrl : undefined}
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
