import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function PortfolioPanel({
  title,
  description,
  icon: Icon = null,
  badge = null,
  defaultOpen = false,
  forceState,
  forceVersion,
  actions = null,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceVersion) {
      setIsOpen(Boolean(forceState));
    }
  }, [forceState, forceVersion]);

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200/90 dark:border-white/[0.1] bg-white dark:bg-zinc-950/90 shadow-sm dark:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-white/20">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-6 sm:px-7 py-5 sm:py-6 text-left hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200/60 dark:border-white/[0.06]">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 bg-gray-50/40 dark:bg-zinc-900/30">
          {children}
        </div>
      )}
    </section>
  );
}
