import { Textarea } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import { postSchema } from '@/shared/lib/validators';
import { Form } from '@/shared/ui/Form';
import type { PostFormProps } from '../model/types';

export function PostForm({ initialData, onSubmit, mode = 'create' }: PostFormProps) {
  return (
    <Form
      initialValues={initialData || {
        content: '',
        imageUrl: '',
      }}
      validationSchema={postSchema}
      onSubmit={async (values) => {
        await onSubmit(values);
        modals.closeAll();
      }}
      onCancel={() => modals.closeAll()}
      submitText={mode === 'create' ? 'Опубликовать' : 'Сохранить'}
    >
      {(formik) => (
        <>
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
        </>
      )}
    </Form>
  );
}
