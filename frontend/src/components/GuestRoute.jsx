import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Only accessible when NOT logged in. Redirects authenticated users.
const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // If user has no org, send to org page; otherwise dashboard
    return <Navigate to={user.organizationId ? "/" : "/organization"} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
