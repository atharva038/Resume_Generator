import { Shield, Sparkles, Crown } from "lucide-react";

export default function ProfileBanner({ user, currentTier = "free" }) {
  const displayName =
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : null) ||
    user?.email?.split("@")[0] ||
    "My Profile";
  const isPro = currentTier === "pro";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {displayName}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isPro
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
            }`}>
              {isPro ? <Crown className="w-3.5 h-3.5 text-amber-500" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isPro ? "Pro Plan" : "Free Plan"}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 break-all font-medium">
            {user?.email || "No email linked"}
          </p>
        </div>

        {/* Quick Snapshot Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/80 dark:border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Account Active
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/80 dark:border-white/5">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
