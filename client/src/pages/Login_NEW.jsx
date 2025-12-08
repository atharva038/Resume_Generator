import {useState} from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {parseValidationErrors} from "../utils/errorHandler";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, {replace: true});
    } catch (err) {
      if (
        err.response?.status === 429 ||
        err.response?.data?.type === "AUTH_RATE_LIMIT_EXCEEDED"
      ) {
        navigate("/rate-limit-exceeded", {
          state: {
            errorDetails: {
              message:
                err.response?.data?.error ||
                "Too many authentication attempts. Please try again after 15 minutes.",
              retryAfter: err.response?.data?.retryAfter || "15 minutes",
            },
          },
        });
      } else {
        setError(parseValidationErrors(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0D0D0D] flex flex-col">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-bold group"
          >
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              SmartNShine
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Log in to your SmartNShine account
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            {/* Auth Required Message */}
            {location.state?.from && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Please log in to access this feature
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-900 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-500 dark:text-gray-400">
                  New to SmartNShine?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/register"
              className="block w-full text-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 text-sm"
            >
              Create an account
            </Link>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            By logging in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
