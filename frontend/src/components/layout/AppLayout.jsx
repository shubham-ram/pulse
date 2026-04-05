import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Shield,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: null },
  { to: "/upload", icon: Upload, label: "Upload", roles: ["admin", "editor"] },
  { to: "/admin", icon: Shield, label: "Admin Panel", roles: ["admin"] },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Activity className="h-5 w-5 text-sidebar-primary" />
          <span className="text-lg font-semibold">Pulse</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Org name */}
        {user?.organizationId && (
          <div className="border-b px-4 py-2">
            <p className="truncate text-xs font-medium text-muted-foreground">
              Organization
            </p>
            <p className="truncate text-sm font-semibold">
              {user.organizationId.name}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t p-3">
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
              {user?.role}
            </p>
          </div>
          <Separator className="my-2" />
          <ThemeToggle />
          <Separator className="my-2" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-semibold">Pulse</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
