import { useForm } from "react-hook-form";

function useJoinOrgForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inviteCode: "",
    },
  });

  return { control, handleSubmit, errors };
}

export default useJoinOrgForm;
