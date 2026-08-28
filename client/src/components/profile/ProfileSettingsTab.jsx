import { User, Mail, Sparkles, CheckCircle2, ShieldCheck, Key, Lock, ArrowRight } from "lucide-react";

export function ProfileSettingsTab({ user }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Personal Information
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Account credentials synced with your authentication profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={user?.name || user?.firstName || ""}
              disabled
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none"
            />
            <User className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none"
            />
            <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Sync with Master Career Profile */}
      <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Master Career Profile Integration
            </h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Edit your detailed work history, projects, and skills in your dedicated Master Hub.
            </p>
          </div>
        </div>

        <a
          href="/career-profile"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 inline-flex items-center gap-1.5"
        >
          <span>Open Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export function SecuritySettingsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Security & Access Controls
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Password encryption and session safeguards
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-zinc-950/70 border border-gray-200/80 dark:border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Password Authentication
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Last updated securely via encrypted token authentication
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            Protected
          </span>
        </div>
      </div>
    </div>
  );
}
