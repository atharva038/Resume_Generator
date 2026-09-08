import { useEffect, useMemo, useRef, useState, Component } from "react";
import {
  Check,
  Search,
  Sparkles,
  X,
  Palette,
  Eye,
  Crown,
  LayoutTemplate,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks";
import { portfolioThemeList } from "./themes/themeRegistry";
import adaptPortfolioData from "./themes/adaptPortfolioData";

class ThumbnailErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Thumbnail preview error handled gracefully:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const PortfolioTemplateThumbnail = ({ theme, form, resume, projects }) => {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(0.25);
  const ThemeComponent = theme.component;

  useEffect(() => {
    if (!wrapperRef.current) return;
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const width = wrapperRef.current.clientWidth;
      if (width) {
        // Desktop design base is 1280px width
        setScale(width / 1280);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const previewPortfolio = useMemo(() => {
    return {
      ...(form || {}),
      themeId: theme.id,
      themeAccent: form?.themeAccent || theme.accentPresets?.[0],
    };
  }, [form, theme]);

  const previewData = useMemo(() => {
    try {
      return adaptPortfolioData({
        portfolio: previewPortfolio,
        resume,
        projects,
        mode: "preview",
      });
    } catch (err) {
      console.warn("adaptPortfolioData failed for preview:", err);
      return null;
    }
  }, [previewPortfolio, resume, projects]);

  const fallbackUI = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-4 text-center">
      <Palette className="w-8 h-8 text-emerald-400 mb-2 opacity-80" />
      <span className="font-bold text-sm">{theme.name}</span>
      <span className="text-xs text-zinc-400 mt-1">{theme.category}</span>
    </div>
  );

  if (!ThemeComponent || !previewData) {
    return fallbackUI;
  }

  return (
    <ThumbnailErrorBoundary fallback={fallbackUI}>
      <div className="relative w-full h-full overflow-hidden bg-white dark:bg-zinc-950 select-none pointer-events-none">
        <div ref={wrapperRef} className="w-full h-full relative">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "1280px",
              height: "820px",
            }}
            className="absolute top-0 left-0 bg-white dark:bg-zinc-950 overflow-hidden pointer-events-none"
          >
            <ThemeComponent
              data={previewData}
              portfolio={previewPortfolio}
              resume={resume}
              projects={projects}
              mode="preview"
              isDarkMode={true}
              accentColor={previewPortfolio.themeAccent}
            />
          </div>
        </div>
      </div>
    </ThumbnailErrorBoundary>
  );
};

export default function PortfolioTemplateSelectorModal({
  isOpen,
  onClose,
  selectedThemeId,
  onApplyTheme,
  form,
  resume,
  projects,
  userTier = "free",
}) {
  useBodyScrollLock(isOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [draftSelection, setDraftSelection] = useState(selectedThemeId || "smartnshine");

  useEffect(() => {
    if (!isOpen) return;
    setDraftSelection(selectedThemeId || "smartnshine");
    setSearchQuery("");
    setCategoryFilter("All");
  }, [isOpen, selectedThemeId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    const cats = new Set(portfolioThemeList.map((t) => t.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, []);

  const isThemeAllowed = (theme) => {
    return userTier === "admin" || theme.allowedTiers?.includes(userTier);
  };

  const filteredThemes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return portfolioThemeList.filter((theme) => {
      const matchCat = categoryFilter === "All" || theme.category === categoryFilter;
      const matchSearch =
        !q ||
        theme.name?.toLowerCase().includes(q) ||
        theme.category?.toLowerCase().includes(q) ||
        theme.description?.toLowerCase().includes(q) ||
        theme.tags?.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [searchQuery, categoryFilter]);

  const selectedThemeObj = useMemo(() => {
    return portfolioThemeList.find((t) => t.id === draftSelection) || portfolioThemeList[0];
  }, [draftSelection]);

  const handleApply = () => {
    if (draftSelection) {
      onApplyTheme(draftSelection);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 no-print animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-7xl h-[95vh] max-h-[920px] overflow-hidden border border-gray-200/90 dark:border-white/[0.08] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white dark:bg-zinc-950 p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 dark:text-white">
                    Choose Portfolio Template
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                    Live layout preview tailored with your projects, bio & photos. Instant switch with zero data loss.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-900 p-2 rounded-xl transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="mt-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by theme name, role, or style..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/80 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-zinc-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-zinc-400 hidden sm:inline">
                  Current:
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                  {portfolioThemeList.find((t) => t.id === selectedThemeId)?.name || "SmartNShine Editorial"}
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-gray-950 dark:bg-white text-white dark:text-gray-950 shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200/60 dark:border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              {filteredThemes.length} {filteredThemes.length === 1 ? "Template Available" : "Templates Available"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredThemes.map((theme) => {
              const isCurrent = selectedThemeId === theme.id;
              const isDraft = draftSelection === theme.id;
              const allowed = isThemeAllowed(theme);

              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    if (allowed) {
                      setDraftSelection(theme.id);
                    }
                  }}
                  className={`group relative rounded-2xl transition-all duration-200 overflow-hidden flex flex-col bg-white dark:bg-zinc-900 border-2 cursor-pointer shadow-sm hover:shadow-xl ${
                    isDraft
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10"
                      : isCurrent
                        ? "border-emerald-500/50 hover:border-emerald-500 dark:border-emerald-500/40"
                        : "border-gray-200/90 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600"
                  } ${!allowed ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {/* Top Mockup Browser Tab Bar */}
                  <div className="h-8 bg-gray-100 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800/80 px-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>

                    <div className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[10px] font-mono text-gray-500 dark:text-zinc-400 truncate max-w-[140px]">
                      yoursite.com/u/{form?.slug || "portfolio"}
                    </div>

                    <div className="flex items-center gap-1">
                      {isCurrent && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      {!allowed && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Crown className="w-3 h-3" /> Pro
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scaled Live Preview Thumbnail Viewport */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-950">
                    <PortfolioTemplateThumbnail
                      theme={theme}
                      form={form}
                      resume={resume}
                      projects={projects}
                    />

                    {/* Hover Selection Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/50 transition-opacity duration-200 flex items-center justify-center ${
                        isDraft ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-gray-950 font-bold text-xs shadow-lg transform group-hover:scale-105 transition-transform">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Click to Select</span>
                      </span>
                    </div>

                    {/* Selected Checkmark Badge */}
                    {isDraft && (
                      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-150">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Template Meta Info Footer */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-zinc-900">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-sm sm:text-base text-gray-950 dark:text-white leading-tight">
                          {theme.name}
                        </h3>
                        {theme.badge && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/5 shrink-0">
                            {theme.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {theme.subtitle || theme.description}
                      </p>
                    </div>

                    {/* Tags & Accent Swatches */}
                    <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {(theme.tags || [theme.category]).slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Accent color palette preview */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        {(theme.accentPresets || []).slice(0, 4).map((hex) => (
                          <span
                            key={hex}
                            className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 dark:text-zinc-400 text-center sm:text-left flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Applying a new template immediately updates your live preview. All content, links & uploaded images remain completely intact.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!draftSelection}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Apply "{selectedThemeObj?.name || "Template"}"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
