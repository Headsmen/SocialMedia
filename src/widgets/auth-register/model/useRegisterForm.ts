import { useState } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { registerSchema } from "@/shared/lib/validators";
import { useRegister } from "@/entities/user";

export const useRegisterForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const registerMutation = useRegister();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    registerMutation.mutate(values as any, {
      onSuccess: () => {
        setShowSuccess(true);
        form.reset();
      },
    });
  };

  return {
    form,
    handleSubmit,
    isLoading: registerMutation.isPending,
    isError: registerMutation.isError,
    error: registerMutation.error,
    showSuccess,
    setShowSuccess,
    reset: registerMutation.reset,
  };
};
