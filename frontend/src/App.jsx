import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages (placeholder for now — will be built in next steps)
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OrganizationPage from "@/pages/OrganizationPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadPage from "@/pages/UploadPage";
import VideoPlayerPage from "@/pages/VideoPlayerPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Auth required, no org needed */}
          <Route element={<ProtectedRoute />}>
            <Route path="/organization" element={<OrganizationPage />} />
          </Route>

          {/* Auth + org required */}
          <Route element={<ProtectedRoute requireOrg />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/videos/:id" element={<VideoPlayerPage />} />
          </Route>

          {/* Auth + org + editor/admin */}
          <Route element={<ProtectedRoute requireOrg roles={["admin", "editor"]} />}>
            <Route path="/upload" element={<UploadPage />} />
          </Route>

          {/* Auth + org + admin only */}
          <Route element={<ProtectedRoute requireOrg roles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
