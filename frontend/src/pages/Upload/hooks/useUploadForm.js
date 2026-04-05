import { useForm } from "react-hook-form";

function useUploadForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return { control, handleSubmit, reset, errors };
}

export default useUploadForm;
