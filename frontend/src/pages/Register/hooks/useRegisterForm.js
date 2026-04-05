import { useForm } from "react-hook-form";

function useRegisterForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return { control, handleSubmit, errors };
}

export default useRegisterForm;
