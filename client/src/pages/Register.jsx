import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {parseValidationErrors} from "@/utils/errorHandler";
import {useToggle} from "@/hooks";
import {registerSchema, validateWithSchema} from "@/utils/validation";
import {config} from "@/utils/constants";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Github,
} from "lucide-react";
import {FcGoogle} from "react-icons/fc";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [error, setError] = useState("");
  const [loading, toggleLoading, setLoadingTrue, setLoadingFalse] =
    useToggle(false);
  const {register} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate with Yup
    const {isValid, errors} = await validateWithSchema(registerSchema, {
      name,
      email,
      password,
      confirmPassword,
    });

    if (!isValid) {
      setError(Object.values(errors)[0]); // Show first error
      return;
    }

    setLoadingTrue();

    try {
      await register(name, email, password);
      navigate("/dashboard");
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
                "Too many registration attempts. Please try again after 15 minutes.",
              retryAfter: err.response?.data?.retryAfter || "15 minutes",
            },
          },
        });
      } else {
        setError(parseValidationErrors(err));
      }
    } finally {
      setLoadingFalse();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Create your account
          </h1>
          <p className="text-gray-400">
            Start building professional resumes with AI
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 shadow-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Features */}
          <div className="mb-6 p-4 bg-primary-950/30 border border-primary-900/50 rounded-lg">
            <div className="space-y-2">
              {[
                "AI-powered resume enhancement",
                "8 professional templates",
                "ATS optimization",
                "Free forever plan",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 transition-all duration-200 text-sm"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 transition-all duration-200 text-sm"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-11 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 transition-all duration-200 text-sm"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-11 pr-4 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 transition-all duration-200 text-sm"
                  required
                  autoComplete="new-password"
                />
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-950 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google OAuth Button */}
            <a
              href={`${config.serverUrl}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200 font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </a>

            {/* GitHub OAuth Button */}
            <a
              href={`${config.serverUrl}/api/auth/github`}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200 font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </a>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-950 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 text-sm"
          >
            Log in instead
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-primary-400 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
