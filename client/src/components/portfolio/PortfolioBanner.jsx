import { Link } from "react-router-dom";
import { Globe2, Plus, Eye, Download, MousePointerClick, Sparkles } from "lucide-react";

export default function PortfolioBanner({
  portfoliosCount = 0,
  totalViews = 0,
  totalResumeDownloads = 0,
  totalProjectClicks = 0,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Live Personal Websites</span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{portfoliosCount} Active {portfoliosCount === 1 ? "Site" : "Sites"}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Developer Portfolios Hub
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Transform your resume into a stunning, responsive portfolio website. Track visitor analytics, project engagement, and resume downloads in real-time.
            </p>
          </div>

          <div>
            <Link
              to="/portfolio/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Portfolio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950/90 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Total Portfolios</span>
            <Globe2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {portfoliosCount}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950/90 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {totalViews}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950/90 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Resume Downloads</span>
            <Download className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {totalResumeDownloads}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950/90 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Project Clicks</span>
            <MousePointerClick className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalProjectClicks}
          </div>
        </div>
      </div>
    </div>
  );
}
