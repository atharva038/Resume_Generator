import {useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  FileBox,
  Activity,
  Moon,
  Sun,
} from "lucide-react";
import {useAuth} from "../context/AuthContext";
import {useDarkMode} from "../context/DarkModeContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const {isDarkMode, toggleDarkMode} = useDarkMode();

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      color: "text-blue-500",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: "User Management",
      color: "text-green-500",
    },
    {
      path: "/admin/templates",
      icon: FileBox,
      label: "Templates",
      color: "text-purple-500",
    },
    {
      path: "/admin/ai-analytics",
      icon: BarChart3,
      label: "AI Analytics",
      color: "text-orange-500",
    },
    {
      path: "/admin/contacts",
      icon: MessageSquare,
      label: "Contact Messages",
      color: "text-pink-500",
    },
    {
      path: "/admin/logs",
      icon: Activity,
      label: "Activity Logs",
      color: "text-cyan-500",
    },
    {
      path: "/admin/settings",
      icon: Settings,
      label: "Settings",
      color: "text-gray-500",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "admin@smartnshine.com"}
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : ""}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Main Site */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
