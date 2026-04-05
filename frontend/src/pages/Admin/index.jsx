import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import useAdminData from "./hooks/useAdminData";
import OrgInfoCard from "./components/OrgInfoCard";
import MembersTable from "./components/MembersTable";

const AdminPage = () => {
  const { user } = useAuth();
  const {
    org,
    members,
    loading,
    removingId,
    handleRoleChange,
    handleRemove,
    copyInviteCode,
  } = useAdminData();

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin Panel"
        description="Manage your organization and members"
      />
      <OrgInfoCard org={org} onCopyInviteCode={copyInviteCode} />
      <MembersTable
        members={members}
        currentUserId={user._id}
        removingId={removingId}
        onRoleChange={handleRoleChange}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default AdminPage;
