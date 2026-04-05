import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OrganizationPage from "@/pages/OrganizationPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadPage from "@/pages/UploadPage";
import VideoPlayerPage from "@/pages/VideoPlayerPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Auth required, no org needed (no layout — standalone page) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/organization" element={<OrganizationPage />} />
            </Route>

            {/* Auth + org required — wrapped in AppLayout */}
            <Route element={<ProtectedRoute requireOrg />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/videos/:id" element={<VideoPlayerPage />} />
              </Route>
            </Route>

            {/* Auth + org + editor/admin */}
            <Route
              element={
                <ProtectedRoute requireOrg roles={["admin", "editor"]} />
              }
            >
              <Route element={<AppLayout />}>
                <Route path="/upload" element={<UploadPage />} />
              </Route>
            </Route>

            {/* Auth + org + admin only */}
            <Route element={<ProtectedRoute requireOrg roles={["admin"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
