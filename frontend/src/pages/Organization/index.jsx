import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import CreateOrgCard from "./components/CreateOrgCard";
import JoinOrgCard from "./components/JoinOrgCard";

const OrganizationPage = () => {
  const { refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const onCreateSubmit = async (data) => {
    try {
      await api.post("/organizations/create", {
        name: data.orgName.trim(),
        description: data.orgDescription.trim(),
      });
      await refreshUser();
      toast.success("Organization created!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create organization",
      );
    }
  };

  const onJoinSubmit = async (data) => {
    try {
      await api.post("/organizations/join", {
        inviteCode: data.inviteCode.trim(),
      });
      await refreshUser();
      toast.success("Joined organization!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to join organization",
      );
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
        <CreateOrgCard onSubmit={onCreateSubmit} />
        <JoinOrgCard onSubmit={onJoinSubmit} />
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
