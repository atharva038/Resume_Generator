import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import BlockableLink from "./BlockableLink";
import DarkModeToggle from "./DarkModeToggle";
import {useState, useEffect} from "react";
import {Menu, Sparkles, User, LogOut, LayoutDashboard} from "lucide-react";

const Navbar = ({toggleSidebar, isSidebarOpen}) => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg py-2"
          : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 text-xl lg:text-2xl font-bold group"
            >
              <div className="relative">
                <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 blur-md bg-blue-500/30 group-hover:bg-blue-500/50 transition-all duration-300"></div>
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
                SmartNShine
              </span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />

            {user ? (
              <>
                <BlockableLink
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">My Resumes</span>
                </BlockableLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <BlockableLink
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </BlockableLink>
                <BlockableLink
                  to="/upload"
                  className="group relative px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Build My Resume</span>
                    <span className="sm:hidden">Build</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
