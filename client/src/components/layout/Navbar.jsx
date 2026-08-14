import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {BlockableLink} from "@/components/auth";
import {DarkModeToggle} from "@/components/common";
import {useEffect} from "react";
import {useToggle} from "@/hooks";
import {
  Menu,
  Sparkles,
  User,
  LogOut,
  Shield,
  ArrowRight,
} from "lucide-react";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [isScrolled, , setIsScrolledTrue, setIsScrolledFalse] =
    useToggle(false);

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

  return (
    <nav
      className={`fixed top-0 right-0 z-40 transition-all duration-300 no-print ${
        isSidebarOpen ? "left-0 lg:left-64" : "left-0 lg:left-20"
      } ${
        isScrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm"
          : "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Menu Button & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center text-xl font-bold group">
              <img
                src="/orb-logo.png"
                alt=""
                className="h-16 w-auto object-contain group-hover:scale-105 transition-all duration-300 -mr-1 dark:brightness-100 dark:saturate-100 brightness-50 contrast-125 saturate-200"
              />
              <span className="bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent hidden sm:inline tracking-tight">
                SmartNShine
              </span>
            </Link>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {user ? (
              <>
                {/* Admin Portal Button if Admin */}
                {isAdmin && (
                  <BlockableLink
                    to="/admin/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all"
                    title="Admin Portal"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </BlockableLink>
                )}

                {/* User Avatar & Name linking to Profile */}
                <BlockableLink
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200 group"
                  title="Profile & Settings"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {userInitial}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white max-w-[130px] truncate">
                    {displayName}
                  </span>
                </BlockableLink>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-full transition-all duration-200"
                  title="Login"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </BlockableLink>

                {/* CTA: Build Resume */}
                <BlockableLink
                  to="/upload"
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
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
