import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { loginSchema } from "@/shared/lib/validators";
import { useLogin } from "@/entities/user";

export const useLoginForm = () => {
  const loginMutation = useLogin();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    loginMutation.mutate(values);
  };

  return {
    form,
    handleSubmit,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
    reset: loginMutation.reset,
  };
};
