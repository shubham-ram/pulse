import { useForm } from "react-hook-form";

function useLoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return { control, handleSubmit, errors };
}

export default useLoginForm;
