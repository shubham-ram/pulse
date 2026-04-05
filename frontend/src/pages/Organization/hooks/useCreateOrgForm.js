import { useForm } from "react-hook-form";

function useCreateOrgForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      orgName: "",
      orgDescription: "",
    },
  });

  return { control, handleSubmit, errors };
}

export default useCreateOrgForm;
