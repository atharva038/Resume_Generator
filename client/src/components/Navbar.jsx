import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 no-print">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold text-primary-600 dark:text-primary-400"
          >
            AI Resume Rebuilder
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/upload"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Upload Resume
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  My Resumes
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
