import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useToggle} from "@/hooks";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  Menu,
  FileBox, 
  Activity,
  Moon,
  Sun,
  TrendingUp,
  Sparkles,
  Bell,
} from "lucide-react";
import {useAuth} from "@/context/AuthContext";
import {useDarkMode} from "@/context/DarkModeContext";
import {PageTransition} from "@/components/common";
import {getAdminNotificationStats} from "@/api/admin.api";

const AdminLayout = () => {
  const [
    isSidebarOpen,
    toggleSidebarOpen,
    setIsSidebarOpenTrue,
    setIsSidebarOpenFalse,
  ] = useToggle(true); // Open by default for desktop
  const [
    isMobileMenuOpen,
    toggleMobileMenu,
    setIsMobileMenuOpenFalse,
  ] = useToggle(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const {isDarkMode, toggleDarkMode} = useDarkMode();
  const [notificationStats, setNotificationStats] = useState(null);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      // On desktop (>= 1024px), sidebar should be open by default
      // On mobile, it should be closed
      if (window.innerWidth >= 1024) {
        setIsSidebarOpenTrue();
      } else {
        setIsSidebarOpenFalse();
        setIsMobileMenuOpenFalse();
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpenTrue, setIsSidebarOpenFalse, setIsMobileMenuOpenFalse]);

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      color: "text-blue-500",
    },
    {
      path: "/admin/earnings",
      icon: TrendingUp,
      label: "Earnings",
      color: "text-green-500",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: "User Management",
      color: "text-cyan-500",
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
      path: "/admin/ai-quota",
      icon: TrendingUp,
      label: "AI Quota Management",
      color: "text-yellow-500",
    },
    {
      path: "/admin/ai-extraction",
      icon: Sparkles,
      label: "AI Extraction Usage",
      color: "text-violet-500",
    },
    {
      path: "/admin/contacts",
      icon: MessageSquare,
      label: "Contact Messages",
      color: "text-pink-500",
    },
    {
      path: "/admin/feedback",
      icon: MessageSquare,
      label: "User Feedback",
      color: "text-indigo-500",
    },
    {
      path: "/admin/logs",
      icon: Activity,
      label: "Activity Logs",
      color: "text-cyan-500",
    },
    {
      path: "/admin/notifications",
      icon: Bell,
      label: "Notifications",
      color: "text-rose-500",
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

  useEffect(() => {
    let isMounted = true;

    const fetchNotificationStats = async () => {
      try {
        const response = await getAdminNotificationStats();
        if (isMounted) {
          setNotificationStats(response.data.data);
        }
      } catch {
        if (isMounted) {
          setNotificationStats(null);
        }
      }
    };

    fetchNotificationStats();
    const interval = window.setInterval(fetchNotificationStats, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [location.pathname]);

  const toggleSidebar = () => {
    toggleMobileMenu();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpenFalse();
  };

  const activeMenuItem =
    menuItems.find((item) => location.pathname.startsWith(item.path)) ||
    menuItems[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">

      {/* Top Navigation Bar */}
      <nav className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Single Menu Toggle for All Devices */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                } else {
                  toggleSidebarOpen();
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
                <img
                  src="/orb-logo.png"
                  alt="SmartNShine logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {activeMenuItem?.label}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              className="relative p-2.5 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200 border border-gray-200 dark:border-white/10"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {notificationStats?.unread > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {notificationStats.unread > 99
                    ? "99+"
                    : notificationStats.unread}
                </span>
              )}
            </Link>

            {/* User Info */}
            <div className="text-right hidden md:block px-3 py-1.5 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-white/10">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200 border border-gray-200 dark:border-white/10"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 border border-gray-200 dark:border-white/10"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 bg-white dark:bg-black border-r border-gray-200 dark:border-white/10 transition-all duration-300 overflow-hidden
          ${isMobileMenuOpen ? "left-0 z-40" : "-left-full z-40"} 
          w-64 
          lg:z-20
          ${isSidebarOpen ? "lg:left-0 lg:w-64" : "lg:-left-full lg:w-0"}
        `}
      >
        {/* Sidebar Content with Scroll */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900/10 text-gray-900 dark:bg-white/10 dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? item.color : ""
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Main Site */}
          <div className="px-4 pb-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl transition-all duration-200"
            >
              <Shield className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Floating Button to Open Sidebar (Desktop only, when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={setIsSidebarOpenTrue}
          className="hidden lg:flex fixed left-4 top-20 z-30 p-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 items-center justify-center group"
          aria-label="Open sidebar"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 min-h-screen
          ${
            // Desktop only: add margin when sidebar is open
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          }
          // Mobile: always no margin (sidebar is overlay)
          ml-0
        `}
      >
        <div className="p-3 sm:p-4 md:p-6">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
