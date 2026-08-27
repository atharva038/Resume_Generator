import { Shield, Sparkles, CheckCircle2, Crown, User } from "lucide-react";

export default function ProfileBanner({ user, currentTier = "free" }) {
  const displayName = user?.name || user?.firstName || "Member";
  const userInitial = (displayName[0] || "U").toUpperCase();
  const isPro = currentTier === "pro";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Avatar Orb */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-indigo-500/25 shrink-0 border border-white/20">
            {userInitial}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isPro
                  ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              }`}>
                {isPro ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isPro ? "Pro Plan" : "Free Plan"}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 break-all font-medium">
              {user?.email || "No email linked"}
            </p>
          </div>
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
