import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import OrganizationPage from "@/pages/Organization";
import DashboardPage from "@/pages/Dashboard";
import UploadPage from "@/pages/Upload";
import VideoPlayerPage from "@/pages/VideoPlayer";
import AdminPage from "@/pages/Admin";

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
