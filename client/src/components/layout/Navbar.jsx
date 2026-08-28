import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BlockableLink } from "@/components/auth";
import { DarkModeToggle, FestiveSaleBanner } from "@/components/common";
import { useEffect, useMemo } from "react";
import { useToggle } from "@/hooks";
import {
  Menu,
  Sparkles,
  User,
  LogOut,
  Shield,
  ArrowRight,
  Palette,
  Wand2,
  Target,
  LayoutDashboard,
  UserCircle,
  Mic,
  Globe2,
  Tag,
  Home,
} from "lucide-react";

const Navbar = ({ toggleSidebar, isSidebarOpen, promotion }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, , setIsScrolledTrue, setIsScrolledFalse] = useToggle(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolledTrue();
      } else {
        setIsScrolledFalse();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolledTrue, setIsScrolledFalse]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin";
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.name || user?.email?.split("@")[0] || "Account";

  const userInitial = (displayName?.[0] || "U").toUpperCase();

  // Dynamic Workspace Meta for Desktop Header
  const activeWorkspace = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/templates")) {
      return { title: "Resume Templates", icon: Palette, badge: "Gallery" };
    }
    if (path.startsWith("/upload")) {
      return { title: "AI Enhancer", icon: Wand2, badge: "Parser" };
    }
    if (path.startsWith("/ats-analyzer")) {
      return { title: "ATS Analyzer", icon: Target, badge: "Diagnostics" };
    }
    if (path.startsWith("/my-resumes")) {
      return { title: "My Resumes", icon: LayoutDashboard, badge: "Hub" };
    }
    if (path.startsWith("/career-profile")) {
      return { title: "Career Profile", icon: UserCircle, badge: "Master Data" };
    }
    if (path.startsWith("/career-qa")) {
      return { title: "Career Q&A", icon: Mic, badge: "Interview Prep" };
    }
    if (path.startsWith("/portfolio")) {
      return { title: "Portfolios", icon: Globe2, badge: "Websites" };
    }
    if (path.startsWith("/pricing")) {
      return { title: "Pricing & Plans", icon: Tag, badge: "Pro" };
    }
    if (path.startsWith("/admin")) {
      return { title: "Admin Console", icon: Shield, badge: "Management" };
    }
    if (path.startsWith("/profile")) {
      return { title: "Account & Profile", icon: User, badge: "Settings" };
    }
    return { title: "SmartNShine", icon: Home, badge: "Workspace" };
  }, [location.pathname]);

  const ActiveIcon = activeWorkspace.icon;

  return (
    <nav
      className={`fixed top-0 right-0 z-40 transition-all duration-300 no-print ${
        isSidebarOpen ? "left-0 lg:left-64" : "left-0 lg:left-20"
      } ${
        isScrolled
          ? "bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 shadow-xs"
          : "bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Mobile Logo OR Desktop Workspace Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button + Brand Logo (Shown only on Mobile/Tablet) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center text-lg font-bold group">
                <img
                  src="/orb-logo.png"
                  alt=""
                  className="h-10 w-auto object-contain -mr-1 dark:brightness-100 brightness-75"
                />
                <span className="bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent tracking-tight font-extrabold text-sm sm:text-base">
                  SmartNShine
                </span>
              </Link>
            </div>

            {/* Desktop Workspace Breadcrumb (Replaces duplicate logo next to sidebar) */}
            <div className="hidden lg:flex items-center gap-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                  {activeWorkspace.title}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-white/5">
                  {activeWorkspace.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {user ? (
              <>
                {/* Admin Portal Button if Admin */}
                {isAdmin && (
                  <BlockableLink
                    to="/admin/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all"
                    title="Admin Portal"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </BlockableLink>
                )}

                {/* User Avatar & Name linking to Profile */}
                <BlockableLink
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/80 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200 group"
                  title="Profile & Settings"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                    {userInitial}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-gray-700 dark:text-zinc-200 group-hover:text-gray-900 dark:group-hover:text-white max-w-[130px] truncate">
                    {displayName}
                  </span>
                </BlockableLink>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <BlockableLink
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
                  title="Login"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </BlockableLink>

                {/* CTA: Build Resume */}
                <BlockableLink
                  to="/upload"
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Build My Resume"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Build Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </BlockableLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
