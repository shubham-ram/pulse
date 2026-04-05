import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Building2, Users, LogOut } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

const OrganizationPage = () => {
  const { refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  // Create org state
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Join org state
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setCreating(true);
    try {
      await api.post("/organizations/create", {
        name: orgName.trim(),
        description: orgDescription.trim(),
      });
      await refreshUser();
      toast.success("Organization created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create organization");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Invite code is required");
      return;
    }

    setJoining(true);
    try {
      await api.post("/organizations/join", { inviteCode: inviteCode.trim() });
      await refreshUser();
      toast.success("Joined organization!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join organization");
    } finally {
      setJoining(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new organization or join an existing one
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        {/* Create Organization */}
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
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="org-name">Name</Label>
                <Input
                  id="org-name"
                  placeholder="My Organization"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="org-desc">Description</Label>
                <Input
                  id="org-desc"
                  placeholder="What does your team do?"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={creating} className="mt-1">
                {creating ? "Creating..." : "Create Organization"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Join Organization */}
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
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={joining} className="mt-1">
                {joining ? "Joining..." : "Join Organization"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 w-full max-w-3xl" />

      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
};

export default OrganizationPage;
