import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building2, Copy } from "lucide-react";

const OrgInfoCard = ({ org, onCopyInviteCode }) => {
  if (!org) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>{org.name}</CardTitle>
        </div>
        {org.description && (
          <CardDescription>{org.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Invite Code:</span>
          <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
            {org.inviteCode}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onCopyInviteCode}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgInfoCard;
