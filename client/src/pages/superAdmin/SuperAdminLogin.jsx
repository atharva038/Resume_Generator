import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Lock,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {loginSuperAdmin, superAdminStorage} from "@/api/superAdmin.api";

export default function SuperAdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDefaultWarning, setIsDefaultWarning] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to super-admin panel
  useEffect(() => {
    if (superAdminStorage.isAuthenticated()) {
      navigate("/super-admin", {replace: true});
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the Super Admin master password");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await loginSuperAdmin(password, remember);

      if (res.success) {
        toast.success("🛡️ Super Admin access granted!");
        if (res.isDefaultPassword) {
          toast(
            "⚠️ Using default master password. Consider changing it in the panel for security.",
            {
              icon: "🔐",
              duration: 5000,
            }
          );
        }
        const from = location.state?.from?.pathname || "/super-admin";
        navigate(from, {replace: true});
      }
    } catch (err) {
      console.error("Super Admin login error:", err);
      const errMsg =
        err.response?.data?.error ||
        "Authentication failed. Please check your master password.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-950/20 via-teal-950/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Terminal Header Tag */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md shadow-lg shadow-emerald-500/5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              RESTRICTED GATEWAY • SUPER ADMIN
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 relative">
          {/* Top subtle glow line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-zinc-950 shadow-xl shadow-emerald-500/20 mb-2">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Environment & API Key Control
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto">
              Authenticate with your Super Admin master password to view & manage
              live server configurations.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs sm:text-sm text-rose-300 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="super-password"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                >
                  Master Password
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  SERVER-SIDE ENCRYPTED
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="super-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-11 py-3.5 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-400 select-none hover:text-zinc-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded-md bg-zinc-950 border-zinc-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="text-[11px] text-zinc-500 font-mono">
                24h Session
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Decrypting Gateway...</span>
                </>
              ) : (
                <>
                  <span>Access Control Panel</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper / Info */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
              <span>All access attempts are rate-limited & audit logged</span>
            </div>
          </div>
        </div>

        {/* Back to App Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
          >
            ← Return to SmartNShine Public Site
          </button>
        </div>
      </div>
    </div>
  );
}
