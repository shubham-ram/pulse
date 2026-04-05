import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";

function useAdminData() {
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgRes, membersRes] = await Promise.all([
          api.get("/organizations/me"),
          api.get("/organizations/members"),
        ]);
        setOrg(orgRes.data.data.organization);
        setMembers(membersRes.data.data.members);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load admin data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.put(`/organizations/members/${memberId}/role`, {
        role: newRole,
      });
      setMembers((prev) =>
        prev.map((m) => (m._id === memberId ? { ...m, role: newRole } : m)),
      );
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemove = async (memberId) => {
    setRemovingId(memberId);
    try {
      await api.delete(`/organizations/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  const copyInviteCode = () => {
    if (org?.inviteCode) {
      navigator.clipboard.writeText(org.inviteCode);
      toast.success("Invite code copied!");
    }
  };

  return {
    org,
    members,
    loading,
    removingId,
    handleRoleChange,
    handleRemove,
    copyInviteCode,
  };
}

export default useAdminData;
