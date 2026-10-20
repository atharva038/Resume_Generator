import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Target,
  CheckCircle2,
  Palette,
  FileText,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks";

const A4_WIDTH_PX = 794; // 210mm @ 96dpi
const A4_HEIGHT_PX = 1123; // 297mm @ 96dpi

export default function TemplatePreviewModal({
  template,
  sampleResumeData,
  selectedColorTheme,
  setSelectedColorTheme,
  colorThemes = [],
  onClose,
  onApply,
}) {
  useBodyScrollLock(Boolean(template));

  // Mobile tab state: "preview" | "info"
  const [mobileTab, setMobileTab] = useState("preview");
  const [zoomLevel, setZoomLevel] = useState(1); // multiplier on top of auto-fit
  const [autoScale, setAutoScale] = useState(0.85);
  const effectiveScale = autoScale * zoomLevel;

  const containerRef = useRef(null);
  const paperRef = useRef(null);

  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  // Auto-calculate scale to fit in zoom-out mode: entire A4 page is visible on screen with zero scrolling needed
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 32; // padding buffer
    const availableHeight = containerRef.current.clientHeight - 32;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    // Fit both width AND height so 100% of resume is visible on screen
    const widthScale = availableWidth / A4_WIDTH_PX;
    const heightScale = availableHeight / A4_HEIGHT_PX;

    const fitted = Math.min(widthScale, heightScale);
    const clamped = Math.max(0.35, Math.min(fitted, 0.95));
    setAutoScale(clamped);
  }, []);

  useEffect(() => {
    if (!template) return;
    calculateScale();

    const observer = new ResizeObserver(() => {
      calculateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [template, calculateScale]);

  // Keep wrapper height accurately in sync with resume content
  useEffect(() => {
    if (!paperRef.current) return;
    const updateHeight = () => {
      if (paperRef.current) {
        setContentHeight(Math.max(A4_HEIGHT_PX, paperRef.current.scrollHeight));
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [template, selectedColorTheme]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!template) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [template, onClose]);

  if (!template) return null;

  const TemplateComponent = template.component;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/*
        Modal shell
        Mobile  : bottom-sheet, rounded top corners only
        Desktop : centered card, comfortably reduced height & width with clear margins
      */}
      <div className="
        relative z-10 w-full flex flex-col overflow-hidden
        bg-white dark:bg-zinc-950
        border border-gray-200 dark:border-white/10
        shadow-2xl
        rounded-t-3xl sm:rounded-2xl lg:rounded-3xl
        h-[90svh] sm:h-[84vh] lg:h-[82vh]
        max-h-[92svh] sm:max-h-[780px] lg:max-h-[820px]
        max-w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-[1100px]
      ">
        {/* Drag handle pill (mobile only) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full lg:hidden pointer-events-none" />

        {/* ── Header (always pinned) ── */}
        <div className="shrink-0 px-3 sm:px-5 pt-5 pb-3 lg:py-3.5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              aria-label="Back to templates"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="shrink-0 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[10px] sm:text-xs font-bold border border-blue-500/20 uppercase tracking-wide">
              {template.category}
            </span>
            <h2 className="text-sm lg:text-base font-black text-gray-900 dark:text-white truncate">
              {template.name}
            </h2>
            {template.badge && (
              <span className="hidden sm:inline-block shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/20">
                {template.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls on desktop */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 rounded-xl p-1 border border-gray-200/80 dark:border-white/5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                className="p-1 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="px-2 py-0.5 text-[11px] font-bold text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(effectiveScale * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                className="p-1 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>

        {/* ── Mobile tab bar (hidden on lg+) ── */}
        <div className="shrink-0 flex lg:hidden border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-zinc-900/60">
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              mobileTab === "preview"
                ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-950"
                : "border-transparent text-gray-500 dark:text-zinc-500"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Live Preview
          </button>
          <button
            onClick={() => setMobileTab("info")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              mobileTab === "info"
                ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-950"
                : "border-transparent text-gray-500 dark:text-zinc-500"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Details & Palettes
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">
          {/*
            LEFT panel — live A4 document canvas (centered in zoom-out mode, smoothly scrollable when zoomed in)
          */}
          <div
            ref={containerRef}
            className={`
              lg:col-span-8 h-full min-h-0 max-h-full overflow-auto
              scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              bg-zinc-200/70 dark:bg-zinc-900/90
              ${mobileTab === "preview" ? "flex flex-1" : "hidden"} lg:flex lg:flex-none
            `}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div
              className={`
                min-w-full min-h-full p-4 sm:p-6 w-max h-max flex
                ${zoomLevel > 1 ? "items-start justify-center" : "items-center justify-center"}
              `}
            >
              {/* Scaled wrapper: accurately sized bounding box */}
              <div
                style={{
                  width: `${A4_WIDTH_PX * effectiveScale}px`,
                  height: `${contentHeight * effectiveScale}px`,
                  position: "relative",
                  transition: "width 0.15s ease-out, height 0.15s ease-out",
                }}
                className="shadow-2xl rounded-sm shrink-0"
              >
              <div
                ref={paperRef}
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  background: "#ffffff",
                }}
                className="relative text-black overflow-hidden shadow-2xl bg-white"
              >
                {/* Subtle anti-theft watermark */}
                <div
                  className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="font-black uppercase tracking-widest text-slate-900/5 dark:text-slate-900/5 select-none"
                    style={{
                      fontSize: "64px",
                      letterSpacing: "0.22em",
                      transform: "rotate(-25deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    SmartNShine
                  </span>
                </div>

                {TemplateComponent ? (
                  <TemplateComponent
                    resumeData={{
                      ...sampleResumeData,
                      colorTheme: selectedColorTheme,
                      selectedTheme: selectedColorTheme,
                      themeColor: selectedColorTheme,
                    }}
                  />
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <p className="font-bold">Template preview currently loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {/*
            RIGHT panel — info + palette picker + CTA (button permanently visible & pinned)
          */}
          <div className={`
            lg:col-span-4 flex flex-col h-full min-h-0 max-h-full overflow-hidden
            border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/10
            ${mobileTab === "info" ? "flex flex-1" : "hidden"} lg:flex
            bg-white dark:bg-zinc-950
          `}>
            {/* Scrollable details */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-4 sm:p-5 space-y-4">
              {/* ATS Score Rating Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-gray-200/80 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                      ATS Compliance Score
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-500 dark:text-emerald-400">
                    {template.atsScore || 98}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Color Palette Picker */}
              {colorThemes && colorThemes.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-white/6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                        Color Palettes
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">
                      {colorThemes.length} curated themes
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedColorTheme(theme.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedColorTheme === theme.id
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold ring-1 ring-blue-500/30 shadow-xs"
                            : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/5 text-gray-700 dark:text-zinc-300 font-medium hover:border-gray-300 dark:hover:border-white/15"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300/60 dark:border-zinc-700 shrink-0 shadow-2xs"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="text-xs truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Highlights */}
              {template.features && template.features.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    Key Template Features
                  </p>
                  <div className="space-y-2">
                    {template.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action CTA */}
            <div className="shrink-0 p-4 border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => onApply(template.id)}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
