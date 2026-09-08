import {useEffect, useRef, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
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
  HelpCircle,
  Check,
  CheckCheck,
  ArrowRight,
  CreditCard,
  ShieldAlert,
  XCircle,
  UserPlus,
  Loader2,
  ShieldCheck,
  Bot,
  Sliders,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import {useAuth} from "@/context/AuthContext";
import {useDarkMode} from "@/context/DarkModeContext";
import {PageTransition} from "@/components/common";
import {
  getAdminNotificationStats,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/admin.api";

const typeIcons = {
  user: UserPlus,
  ai: Sparkles,
  payment: CreditCard,
  quota: ShieldAlert,
  system: XCircle,
  contact: MessageSquare,
  feedback: MessageSquare,
  security: ShieldAlert,
};

const severityBadgeStyles = {
  info: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  error: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  critical: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const past = new Date(dateStr);
  const diffSec = Math.floor((now - past) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

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
  const [notificationStats, setNotificationStats] = useState(null);
  
  // Notification popover state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [quickNotifications, setQuickNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationDropdownRef = useRef(null);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpenTrue();
      } else {
        setIsSidebarOpenFalse();
        setIsMobileMenuOpenFalse();
      }
    };

    handleResize();
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
      path: "/admin/interviews",
      icon: Bot,
      label: "AI Interviews & Costs",
      color: "text-purple-500",
    },
    {
      path: "/admin/ai-analytics",
      icon: Sparkles,
      label: "AI Usage & Quotas",
      color: "text-orange-500",
    },
    {
      path: "/admin/questions",
      icon: HelpCircle,
      label: "Question Bank",
      color: "text-indigo-400",
    },
    {
      path: "/admin/templates",
      icon: FileBox,
      label: "Templates",
      color: "text-fuchsia-500",
    },
    {
      path: "/admin/feedback",
      icon: MessageSquare,
      label: "Messages & Feedback",
      color: "text-pink-500",
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

  const fetchNotificationStats = async () => {
    try {
      const response = await getAdminNotificationStats();
      setNotificationStats(response.data.data);
    } catch {
      setNotificationStats(null);
    }
  };

  const fetchQuickNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await getAdminNotifications({limit: 6});
      setQuickNotifications(response.data.data.notifications || []);
    } catch (error) {
      console.error("Failed to load quick notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotificationStats();
    const interval = window.setInterval(fetchNotificationStats, 60000);
    return () => window.clearInterval(interval);
  }, [location.pathname]);

  // Close notifications on location change or outside click
  useEffect(() => {
    setIsNotificationOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationOpen]);

  const handleToggleNotifications = () => {
    const nextState = !isNotificationOpen;
    setIsNotificationOpen(nextState);
    if (nextState) {
      fetchQuickNotifications();
      fetchNotificationStats();
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read");
      setQuickNotifications((prev) =>
        prev.map((item) => ({...item, status: "read"}))
      );
      fetchNotificationStats();
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotificationItemClick = async (notification) => {
    if (notification.status === "unread") {
      try {
        await markNotificationRead(notification._id);
        setQuickNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? {...n, status: "read"} : n))
        );
        fetchNotificationStats();
      } catch {
        // silent fail
      }
    }
    setIsNotificationOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else {
      navigate("/admin/notifications");
    }
  };

  const handleSingleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setQuickNotifications((prev) =>
        prev.map((n) => (n._id === id ? {...n, status: "read"} : n))
      );
      fetchNotificationStats();
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const toggleSidebar = () => {
    toggleMobileMenu();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpenFalse();
  };

  const activeMenuItem =
    menuItems.find((item) => location.pathname.startsWith(item.path)) ||
    menuItems[0];
  const ActiveIcon = activeMenuItem?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-[#09090b] text-gray-900 dark:text-white overflow-x-hidden">
      {/* Floating Top Navigation Bar */}
      <header className="fixed top-3 left-3 right-3 sm:left-4 sm:right-4 z-30">
        <div className="bg-white/80 dark:bg-[#121214]/85 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-lg shadow-black/[0.03] dark:shadow-black/40 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Menu Toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleMobileMenu();
                } else {
                  toggleSidebarOpen();
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand / Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/20 overflow-hidden shrink-0">
                <Logo
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  alt="SmartNShine logo"
                />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  Admin Panel
                </h1>

                {/* Active Menu Breadcrumb Pill */}
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <ActiveIcon className={`w-3.5 h-3.5 ${activeMenuItem.color || "text-purple-500"}`} />
                  {activeMenuItem.label}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Notifications Popover Dropdown */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-200 border ${
                  isNotificationOpen
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500/50 text-blue-600 dark:text-blue-400"
                    : "bg-gray-50/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                }`}
                title="Notifications"
                aria-label="Notifications"
                aria-expanded={isNotificationOpen}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notificationStats?.unread > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {notificationStats.unread > 99
                      ? "99+"
                      : notificationStats.unread}
                  </span>
                )}
              </button>

              {/* Mini Notification Popover Card */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-[340px] sm:w-[400px] max-w-[90vw] bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Bar */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/70 dark:bg-zinc-900/60 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        Notifications
                      </span>
                      {notificationStats?.unread > 0 && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          {notificationStats.unread} new
                        </span>
                      )}
                    </div>
                    {notificationStats?.unread > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List Content */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                    {loadingNotifications ? (
                      <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="text-xs">Loading alerts...</span>
                      </div>
                    ) : quickNotifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">No notifications yet</p>
                      </div>
                    ) : (
                      quickNotifications.map((item) => {
                        const Icon = typeIcons[item.type] || Bell;
                        const isUnread = item.status === "unread";
                        return (
                          <div
                            key={item._id}
                            onClick={() => handleNotificationItemClick(item)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer transition-colors ${
                              isUnread
                                ? "bg-blue-50/40 dark:bg-blue-950/20"
                                : ""
                            }`}
                          >
                            <div className="relative shrink-0 mt-0.5">
                              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300">
                                <Icon className="w-4 h-4" />
                              </div>
                              {isUnread && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                  {formatTimeAgo(item.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                {item.message}
                              </p>
                              <div className="mt-1.5 flex items-center justify-between">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${
                                    severityBadgeStyles[item.severity] ||
                                    severityBadgeStyles.info
                                  }`}
                                >
                                  {item.severity || "info"}
                                </span>
                                {isUnread && (
                                  <button
                                    onClick={(e) => handleSingleMarkRead(e, item._id)}
                                    className="text-[10px] font-medium text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3 h-3" />
                                    Read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className="p-2 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 backdrop-blur-md">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setIsNotificationOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                    >
                      <span>Show Full Notifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-right hidden lg:block px-3 py-1.5 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                Administrator
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 bg-gray-50/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/10"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all border border-red-500/20 text-xs sm:text-sm font-semibold"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Floating Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed z-40 transition-all duration-300 overflow-hidden
          /* Mobile Drawer */
          ${
            isMobileMenuOpen
              ? "inset-y-3 left-3 w-72 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }
          /* Desktop Floating Sidebar */
          lg:top-20 lg:bottom-4 lg:left-4 lg:rounded-2xl lg:bg-white/90 lg:dark:bg-[#121214]/90 lg:backdrop-blur-xl lg:border lg:border-gray-200/80 lg:dark:border-white/10 lg:shadow-xl lg:shadow-black/[0.03] lg:dark:shadow-black/40
          ${isSidebarOpen ? "lg:w-64 lg:opacity-100" : "lg:w-0 lg:opacity-0 lg:pointer-events-none"}
        `}
      >
        <div className="h-full flex flex-col justify-between overflow-y-auto p-3">
          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Admin Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? "text-purple-600 dark:text-purple-400" : item.color
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Site */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/10">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-purple-500/20"
            >
              <Shield className="w-4 h-4" />
              <span>Back to Candidate Portal</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`pt-20 sm:pt-24 transition-all duration-300 min-h-screen ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
