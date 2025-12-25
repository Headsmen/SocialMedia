import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "@/shared/lib/validators";
import { useLogin } from "@/entities/user";

export const useLoginForm = () => {
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return {
    formik,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
    reset: loginMutation.reset,
  };
};
