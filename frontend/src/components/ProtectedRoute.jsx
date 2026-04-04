import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Requires authentication. Optionally requires org membership and specific roles.
const ProtectedRoute = ({ requireOrg = false, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Needs org but doesn't have one
  if (requireOrg && !user.organizationId) {
    return <Navigate to="/organization" replace />;
  }

  // Role check (only when roles array is provided)
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
