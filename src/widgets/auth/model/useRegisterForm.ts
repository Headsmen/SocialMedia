import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchema } from "@/shared/lib/validators";
import { useRegister } from "@/entities/user";

export const useRegisterForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const registerMutation = useRegister();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values, { resetForm }) => {
      registerMutation.mutate(values as any, {
        onSuccess: () => {
          setShowSuccess(true);
          resetForm();
        },
      });
    },
  });

  return {
    formik,
    isLoading: registerMutation.isPending,
    isError: registerMutation.isError,
    error: registerMutation.error,
    showSuccess,
    setShowSuccess,
    reset: registerMutation.reset,
  };
};
