import { Button, Group, Stack } from '@mantine/core';
import type { ReactNode } from 'react';
import type { z } from 'zod';
import { useForm } from './model/useForm';

export interface FormField {
  name: string;
  component: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
  }) => ReactNode;
}

export interface FormProps<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  onCancel?: () => void;
  children: (formik: ReturnType<typeof useForm<T>>) => ReactNode;
  submitText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

export function Form<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  children,
  submitText = 'Сохранить',
  cancelText = 'Отмена',
  showCancelButton = true,
}: FormProps<T>) {
  const formik = useForm<T>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="md">
        {children(formik)}

        <Group justify="flex-end" mt="md">
          {showCancelButton && onCancel && (
            <Button variant="subtle" onClick={onCancel} type="button">
              {cancelText}
            </Button>
          )}
          <Button type="submit" loading={formik.isSubmitting}>
            {submitText}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
