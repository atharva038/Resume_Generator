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
  LayoutDashboard,
  Globe2,
  Tag,
  UserCircle,
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
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {user ? (
              <>
                {/* My Resumes */}
                <BlockableLink
                  to="/my-resumes"
                  className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="My Resumes"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Resumes</span>
                </BlockableLink>

                {/* Portfolios */}
                <BlockableLink
                  to="/portfolio"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="My Portfolios"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Portfolios</span>
                </BlockableLink>

                {/* Profile */}
                <BlockableLink
                  to="/profile"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="Profile & Subscription"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>Profile</span>
                </BlockableLink>

                {/* Pricing */}
                <BlockableLink
                  to="/pricing"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="View Pricing"
                >
                  <Tag className="w-4 h-4" />
                  <span>Pricing</span>
                </BlockableLink>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Pricing Link */}
                <BlockableLink
                  to="/pricing"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="View Pricing"
                >
                  <Tag className="w-4 h-4" />
                  <span>Pricing</span>
                </BlockableLink>

                {/* Login Button */}
                <BlockableLink
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
                  title="Login"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </BlockableLink>

                {/* CTA: Build Resume */}
                <BlockableLink
                  to="/upload"
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Build My Resume"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Build Resume</span>
                  <span className="sm:hidden">Build</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
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
