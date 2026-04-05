import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import getField from "@/form/Controller/getField";
import useJoinOrgForm from "../hooks/useJoinOrgForm";
import joinOrgControls from "../config/joinOrgControls";

const JoinOrgCard = ({ onSubmit }) => {
  const [joining, setJoining] = useState(false);
  const { control, handleSubmit, errors } = useJoinOrgForm();

  const handleJoin = async (data) => {
    setJoining(true);
    try {
      await onSubmit(data);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Join Organization</CardTitle>
        </div>
        <CardDescription>
          Enter an invite code to join an existing organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleJoin)}
          className="flex flex-col gap-4"
        >
          {joinOrgControls.map((config) => {
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

          <Button type="submit" disabled={joining} className="mt-1">
            {joining ? "Joining..." : "Join Organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinOrgCard;
