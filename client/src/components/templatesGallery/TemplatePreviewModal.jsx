import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Target, CheckCircle2, Palette, FileText, Info } from "lucide-react";
import { useBodyScrollLock } from "@/hooks";

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
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/*
        Modal shell
        Mobile  : bottom-sheet, rounded top corners only, 96vh
        Desktop : centered card, fully rounded, 92vh, max-w-6xl
      */}
      <div className="
        relative z-10 w-full flex flex-col overflow-hidden
        bg-white dark:bg-zinc-950
        border border-gray-200 dark:border-white/10
        shadow-2xl
        rounded-t-3xl h-[96svh]
        lg:rounded-3xl lg:max-w-6xl lg:h-[92vh] lg:mx-4
      ">

        {/* Drag handle pill (mobile only) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full lg:hidden pointer-events-none" />

        {/* ── Header (always pinned) ── */}
        <div className="shrink-0 px-3 sm:px-4 lg:px-5 pt-5 pb-3 lg:py-3.5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              aria-label="Back to templates"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="shrink-0 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-bold border border-blue-500/20 uppercase tracking-wide">
              {template.category}
            </span>
            <h2 className="text-sm lg:text-base font-black text-gray-900 dark:text-white truncate">
              {template.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 ml-2 p-1.5 lg:p-2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
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
            Preview
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
            Details
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">

          {/*
            LEFT panel — resume paper preview
            • Mobile: visible only when mobileTab === "preview"
            • Desktop (lg+): always shown
          */}
          <div className={`
            lg:col-span-8 overflow-y-auto overflow-x-hidden
            bg-zinc-100 dark:bg-zinc-900/70
            p-3 sm:p-5
            flex-col items-center gap-4
            ${mobileTab === "preview" ? "flex flex-1" : "hidden"} lg:flex lg:flex-none
          `}>
            {/* Wrapper scales the A4 page proportionally to whatever width it has */}
            <div className="w-full" style={{ aspectRatio: "1 / 1.414", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "794px",      /* 210mm @ 96dpi */
                  minHeight: "1123px", /* 297mm @ 96dpi */
                  transformOrigin: "top left",
                  background: "white",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                }}
                ref={(el) => {
                  if (!el) return;
                  const scale = () => {
                    const w = el.parentElement?.offsetWidth ?? 300;
                    el.style.transform = `scale(${(w / 794).toFixed(4)})`;
                  };
                  scale();
                  if (el._ro) el._ro.disconnect();
                  const ro = new ResizeObserver(scale);
                  ro.observe(el.parentElement);
                  el._ro = ro;
                }}
                className="relative text-black"
              >
                {/* Centre watermark */}
                <div
                  className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="font-black uppercase tracking-widest"
                    style={{
                      fontSize: "64px",
                      letterSpacing: "0.22em",
                      color: "#0f172a",
                      opacity: 0.05,
                      transform: "rotate(-25deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    SmartNShine
                  </span>
                </div>

                {/* Tiled watermark */}
                <div
                  className="pointer-events-none select-none absolute inset-0 z-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90'><text x='20' y='50' fill='%230f172a' fill-opacity='0.025' font-size='12' font-family='sans-serif' font-weight='800' letter-spacing='1.5' transform='rotate(-20 20 50)'>SmartNShine</text></svg>")`,
                    backgroundSize: "160px 90px",
                  }}
                  aria-hidden="true"
                />

                <TemplateComponent
                  resumeData={{
                    ...sampleResumeData,
                    colorTheme: selectedColorTheme,
                  }}
                />
              </div>
            </div>
          </div>

          {/*
            RIGHT panel — info + palette + CTA
            • Mobile: visible only when mobileTab === "info"
            • Desktop (lg+): always shown
          */}
          <div className={`
            lg:col-span-4 flex-col
            border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/10
            ${mobileTab === "info" ? "flex flex-1" : "hidden"} lg:flex lg:flex-none
            lg:h-full
          `}>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">

              {/* ATS Score */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    ATS Score Rating
                  </span>
                </div>
                <p className="text-2xl lg:text-3xl font-black text-emerald-500 dark:text-emerald-400 leading-none">
                  {template.atsScore}% Pass Rate
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="h-px bg-gray-100 dark:bg-white/8" />

              {/* Color Palette Picker */}
              {colorThemes && colorThemes.length > 0 && (
                <div className="space-y-3 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-white/6">
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      Select Color Palette
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedColorTheme(theme.id)}
                        className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedColorTheme === theme.id
                            ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 font-bold ring-1 ring-blue-500/30"
                            : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/5 text-gray-700 dark:text-zinc-300 font-medium hover:border-gray-300 dark:hover:border-white/15"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300/50 dark:border-zinc-600 shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="text-[10px] sm:text-xs truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Checklist */}
              {template.features && template.features.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    Layout Highlights
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                    {template.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sticky CTA ── */}
            <div className="shrink-0 p-3 sm:p-4 border-t border-gray-100 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
              <button
                onClick={() => onApply(template.id)}
                className="w-full py-3 sm:py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
