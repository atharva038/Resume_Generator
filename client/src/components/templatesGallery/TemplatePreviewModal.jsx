import { X, ArrowRight, Target, CheckCircle2, Palette } from "lucide-react";
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

  if (!template) return null;

  const TemplateComponent = template.component;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-950 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10">
        {/* Modal Header */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
              {template.category}
            </span>
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {template.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Preview, Right Controls */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Resume PDF Paper View */}
          <div className="lg:col-span-8 bg-gray-100 dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 flex items-center justify-center overflow-auto max-h-[65vh]">
            <div className="bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-6 text-black origin-top transform scale-[0.6] sm:scale-[0.75] md:scale-[0.85] lg:scale-[0.9]">
              <TemplateComponent
                resumeData={{
                  ...sampleResumeData,
                  colorTheme: selectedColorTheme,
                }}
              />
            </div>
          </div>

          {/* Right Info & Color Themes */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  ATS Score Rating
                </span>
              </div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {template.atsScore}% Pass Rate
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Color Swatch Picker */}
            {colorThemes && colorThemes.length > 0 && (
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/80 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                    Select Color Palette
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedColorTheme(theme.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedColorTheme === theme.id
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 font-bold"
                          : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/5 text-gray-700 dark:text-zinc-300 font-medium"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-700 shrink-0"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-xs truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Checklist */}
            {template.features && template.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                  Layout Highlights
                </p>
                <div className="space-y-1.5">
                  {template.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply & Use Button */}
            <div className="pt-2">
              <button
                onClick={() => onApply(template.id)}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
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
