import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { z } from 'zod';

export interface UseFormProps<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  const formik = useFormik<T>({
    initialValues,
    validationSchema: validationSchema ? toFormikValidationSchema(validationSchema) : undefined,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return formik;
}
