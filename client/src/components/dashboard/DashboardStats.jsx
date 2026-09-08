import { FileText, Calendar, Sparkles, Layers } from "lucide-react";

export default function DashboardStats({ totalResumes, lastUpdated, proCount }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Total Resumes */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-zinc-950/80 p-6 shadow-sm hover:border-gray-300 dark:hover:border-white/15 transition-all">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Total Resumes
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {totalResumes}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-zinc-950/80 p-6 shadow-sm hover:border-gray-300 dark:hover:border-white/15 transition-all">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Last Updated
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {lastUpdated}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Enhanced */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-zinc-950/80 p-6 shadow-sm hover:border-gray-300 dark:hover:border-white/15 transition-all sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              AI Optimization Active
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {totalResumes}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
