import {useState, useEffect} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useToggle} from "@/hooks";
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
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {useAuth} from "@/context/AuthContext";
import {useDarkMode} from "@/context/DarkModeContext";
import {PageTransition} from "@/components/common";

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
    setIsMobileMenuOpenTrue,
    setIsMobileMenuOpenFalse,
  ] = useToggle(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const {isDarkMode, toggleDarkMode} = useDarkMode();

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

  const toggleSidebar = () => {
    toggleMobileMenu();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpenFalse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30 shadow-lg">
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
              className="p-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 rounded-lg transition-all duration-200"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
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
        className={`fixed top-16 bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden shadow-xl
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
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 font-medium shadow-md border border-purple-200 dark:border-purple-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30"
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
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 transition-all duration-200 border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Floating Button to Open Sidebar (Desktop only, when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={setIsSidebarOpenTrue}
          className="hidden lg:flex fixed left-4 top-20 z-30 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 items-center justify-center group"
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
