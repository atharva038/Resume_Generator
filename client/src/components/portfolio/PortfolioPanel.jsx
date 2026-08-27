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
    <section className="overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-zinc-950/90 shadow-sm dark:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-white/15">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50/70 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400 truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-white/[0.08] p-6 sm:p-7 space-y-5 bg-gray-50/30 dark:bg-zinc-900/20">
          {children}
        </div>
      )}
    </section>
  );
}
