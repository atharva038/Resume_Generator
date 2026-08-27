import { Link } from "react-router-dom";
import { Sparkles, Plus, Globe2 } from "lucide-react";

export default function DashboardBanner({ userName, totalResumes }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold w-fit">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>AI Resume Management Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            My Resumes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            Welcome back, <span className="font-bold text-gray-900 dark:text-white">{userName || "User"}</span>! Manage, tailor, and generate ATS-optimized resumes and developer portfolio websites.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-md shadow-blue-500/20 active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Link>

          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 font-bold rounded-2xl border border-gray-200 dark:border-white/10 transition-all duration-200 shadow-xs active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Globe2 className="w-4 h-4 text-emerald-500" />
            <span>Portfolios Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
