import { Search, Layers, RefreshCw, Star, Check } from "lucide-react";

export default function QASidebar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  items,
  loading,
  selectedItem,
  onSelectQuestion,
  onToggleStar,
  categoryBadgeStyles,
}) {
  return (
    <div className="space-y-4">
      {/* Category Filter Pills (Wrapped neatly into rows) */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 dark:bg-purple-600"
                  : "bg-white dark:bg-zinc-900/90 text-gray-700 dark:text-zinc-300 border border-gray-200/80 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400 dark:text-zinc-400"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all shadow-xs"
        />
      </div>

      {/* Questions List Card Container */}
      <div className="bg-white dark:bg-zinc-950/90 rounded-3xl p-3 sm:p-4 border border-gray-200/80 dark:border-white/[0.08] shadow-sm max-h-[680px] overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm font-medium">Loading questions...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-zinc-500 space-y-2">
            <Layers className="w-9 h-9 mx-auto opacity-40" />
            <p className="text-sm font-semibold">No questions found</p>
            <p className="text-xs text-gray-400">Try changing your search query or category filter.</p>
          </div>
        ) : (
          items.map((item, idx) => {
            const isSelected = selectedItem?.question === item.question;
            const hasSaved = Boolean(item.savedAnswer?.trim());
            const hasDraft = Boolean(item.aiDraft?.trim());
            const categoryStyle =
              categoryBadgeStyles[item.category] ||
              "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

            return (
              <div
                key={item._id || `${item.category}-${item.question}-${idx}`}
                onClick={() => onSelectQuestion(item)}
                className={`p-4 sm:p-4.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3.5 text-left relative overflow-hidden group ${
                  isSelected
                    ? "bg-purple-50/90 dark:bg-purple-950/35 border-purple-400 dark:border-purple-600/70 shadow-sm"
                    : "bg-gray-50/70 dark:bg-zinc-900/40 border-gray-200/70 dark:border-white/[0.05] hover:bg-gray-100/90 dark:hover:bg-zinc-900/90"
                }`}
              >
                {/* Active Indicator Bar on Left */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600" />
                )}

                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${categoryStyle}`}>
                      {item.category}
                    </span>
                    {hasSaved ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    ) : hasDraft ? (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
                        Draft Ready
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[13.5px] sm:text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-relaxed">
                    {item.question}
                  </p>
                </div>

                <button
                  onClick={(e) => onToggleStar(item, e)}
                  className={`p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors shrink-0 mt-0.5 cursor-pointer ${
                    item.isStarred ? "text-amber-400" : "text-gray-300 dark:text-zinc-700 hover:text-amber-400"
                  }`}
                  title="Star favorite"
                >
                  <Star className={`w-4 h-4 ${item.isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
