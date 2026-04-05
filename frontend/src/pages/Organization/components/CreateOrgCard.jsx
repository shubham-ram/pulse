import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import getField from "@/form/getField";
import useCreateOrgForm from "../hooks/useCreateOrgForm";
import createOrgControls from "../config/createOrgControls";

const CreateOrgCard = ({ onSubmit }) => {
  const [creating, setCreating] = useState(false);
  const { control, handleSubmit, errors } = useCreateOrgForm();

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      await onSubmit(data);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Create Organization</CardTitle>
        </div>
        <CardDescription>
          Start a new organization and invite your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleCreate)}
          className="flex flex-col gap-4"
        >
          {createOrgControls.map((config) => {
            const Element = getField(config.type);
            return (
              <Element
                key={config.name}
                {...config}
                control={control}
                errors={errors}
              />
            );
          })}

          <Button type="submit" disabled={creating} className="mt-1">
            {creating ? "Creating..." : "Create Organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateOrgCard;
