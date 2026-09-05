import { Layout, Palette, Sparkles, Filter } from "lucide-react";

export default function TemplatesBanner({
  categories,
  selectedCategory,
  setSelectedCategory,
  totalTemplates,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold w-fit">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{totalTemplates} ATS-Certified Templates</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Resume Templates
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
              Choose from recruiter-approved, ATS-optimized layouts. Tailored for corporate, technical, leadership, and creative career paths with multiple dynamic color themes.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-zinc-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedCategory === category
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md shadow-black/10 dark:shadow-white/10"
                  : "bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200/60 dark:border-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
