import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  User,
  Image,
  FileText,
  Mail,
  Library,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
  { to: "/dashboard/blog", icon: BookOpen, label: "Blog" },
  { to: "/dashboard/bio", icon: User, label: "Bio" },
  { to: "/dashboard/banner", icon: Image, label: "Banner" },
  { to: "/dashboard/resume", icon: FileText, label: "Resume" },
  { to: "/dashboard/contact", icon: Mail, label: "Contact" },
  { to: "/dashboard/media", icon: Library, label: "Media" },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { admin } = useAppSelector((s) => s.auth);
  const unread = useAppSelector((s) => s.contact.unreadCount);

  const handleLogout = () => {
    const res = confirm("Are you sure logout from dashboard?");
    if (!res) {
      return;
    } else {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
        flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-16"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          {sidebarOpen && (
            <span className="text-xl font-bold text-indigo-400 tracking-tight">
              Portfolio<span className="text-white">CMS</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors ml-auto"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{label}</span>
              )}
              {sidebarOpen && label === "Contact" && unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {unread}
                </span>
              )}
              {!sidebarOpen && (
                <div
                  className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                >
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin info */}
        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-sm font-bold">
              {admin?.name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{admin?.name}</p>
                <p className="text-xs text-gray-500 truncate">{admin?.role}</p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ChevronRight size={14} />
            <span className="text-white font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <div className="relative">
                <Bell size={18} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unread}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-400">
              Welcome,{" "}
              <span className="text-white font-medium">{admin?.name}</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
