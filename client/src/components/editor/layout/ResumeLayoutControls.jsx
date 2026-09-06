import { useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Palette,
  Sliders,
  Type,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LAYOUT_DEFAULTS } from "../constants/editorConstants";

// Matched 1:1 with ResumePreview toolbar
const PREVIEW_THEMES = [
  { id: "stripeIndigo", name: "Stripe Indigo", color: "#4f46e5" },
  { id: "cyberEmerald", name: "Cyber Emerald", color: "#059669" },
  { id: "midnightSlate", name: "Midnight Slate", color: "#1e293b" },
  { id: "monochromePro", name: "Monochrome Pro", color: "#18181b" },
];

const PREVIEW_DENSITIES = [
  { id: "compact", label: "⚡ Smart 1-Page" },
  { id: "medium", label: "Balanced" },
  { id: "spacious", label: "Spacious" },
];

const PREVIEW_FONTS = [
  {
    id: "modernSans",
    label: "Modern Sans (Inter)",
    font: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  {
    id: "editorialSerif",
    label: "Editorial Serif (Newsreader)",
    font: '"Newsreader", "Playfair Display", Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    id: "techMono",
    label: "Tech Mono (JetBrains Mono)",
    font: '"JetBrains Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
];

const FONT_MAP = {
  modernSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  editorialSerif: '"Newsreader", "Playfair Display", Georgia, Cambria, "Times New Roman", Times, serif',
  techMono: '"JetBrains Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
};

const ResumeLayoutControls = ({ resumeData = {}, updateField, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const settings = { ...LAYOUT_DEFAULTS, ...(resumeData.layoutSettings || {}) };

  const activeTheme =
    resumeData.selectedTheme || resumeData.colorTheme || "stripeIndigo";
  const activeDensity = resumeData.density || "medium";
  const activeFont = resumeData.fontPairing || "modernSans";

  const update = (field, value) => {
    const updated = { ...settings, [field]: value };
    if (onChange) onChange(updated);
    if (updateField) updateField("layoutSettings", updated);
  };

  const resetLayout = () => {
    if (onChange) onChange({ ...LAYOUT_DEFAULTS });
    if (updateField) {
      updateField("layoutSettings", { ...LAYOUT_DEFAULTS });
      updateField("density", "medium");
      updateField("selectedTheme", "stripeIndigo");
      updateField("colorTheme", "stripeIndigo");
      updateField("fontPairing", "modernSans");
    }
  };

  const handleThemeChange = (themeId) => {
    if (updateField) {
      updateField("selectedTheme", themeId);
      updateField("colorTheme", themeId);
    }
  };

  const handleDensityChange = (densityId) => {
    if (updateField) {
      updateField("density", densityId);
    }
    if (densityId === "compact") {
      update("sectionSpacing", 52);
      update("pagePaddingTop", "0.22in");
      update("pagePaddingBottom", "0.22in");
      update("pagePadding", "0.35in");
    } else if (densityId === "spacious") {
      update("sectionSpacing", 140);
      update("pagePaddingTop", "0.50in");
      update("pagePaddingBottom", "0.50in");
      update("pagePadding", "0.50in");
    } else {
      update("sectionSpacing", 100);
      update("pagePaddingTop", "0.35in");
      update("pagePaddingBottom", "0.35in");
      update("pagePadding", "0.44in");
    }
  };

  const handleFontChange = (fontId) => {
    const fontFam = FONT_MAP[fontId] || fontId;
    if (updateField) {
      updateField("fontPairing", fontId);
    }
    update("fontFamily", fontFam);
  };

  const marginValue = (value) => Number.parseFloat(value) || 0.35;

  const updateMargin = (field, value) =>
    update(
      field,
      `${Math.min(0.8, Math.max(0.2, Number(value))).toFixed(2)}in`
    );

  const contactOptions = [
    ["left-inline", "Left aligned"],
    ["center-inline", "Centered inline"],
    ["center-stacked", "Centered stacked"],
  ];

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-3 sm:p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-1.5 text-gray-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
              Resume Styling & Layout
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              100% matched with preview toolbar
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetLayout}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* 1. Color Themes - Matched 1:1 with Preview Toolbar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-gray-400" />
            Color Theme
          </label>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {PREVIEW_THEMES.find((t) => t.id === activeTheme)?.name || "Default"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PREVIEW_THEMES.map((theme) => {
            const isSelected = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/40 shadow-xs"
                    : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center relative shadow-xs"
                  style={{ backgroundColor: theme.color }}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
                  {theme.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Page Density & 1-Page Fit - Matched 1:1 with Preview Toolbar */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-gray-400" />
            Page Density & Fit
          </label>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-gray-100/90 dark:bg-zinc-900 p-1 rounded-lg border border-gray-200/60 dark:border-zinc-800/80">
          {PREVIEW_DENSITIES.map((d) => {
            const isSelected = activeDensity === d.id;
            const isOnePage = d.id === "compact";
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => handleDensityChange(d.id)}
                className={`py-1.5 px-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? isOnePage
                      ? "bg-emerald-600 text-white shadow-xs dark:bg-emerald-600 dark:text-white"
                      : "bg-white text-gray-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Font Pairing - Matched 1:1 with Preview Toolbar */}
      <div className="mt-3.5">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
          <Type className="w-3.5 h-3.5 text-gray-400" />
          Font Pairing
        </label>
        <select
          value={activeFont}
          onChange={(e) => handleFontChange(e.target.value)}
          className="h-8 w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white px-2.5 text-xs font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-900 dark:text-gray-100 cursor-pointer"
        >
          {PREVIEW_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Advanced Fine-Tuning Toggle */}
      <div className="mt-3.5 pt-2 border-t border-gray-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
        >
          <span>Fine-tune margins & spacing</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-2.5 grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Text size{" "}
              <span className="float-right tabular-nums font-semibold text-gray-900 dark:text-gray-100">
                {settings.fontScale}%
              </span>
              <input
                type="range"
                min="90"
                max="110"
                step="1"
                value={settings.fontScale}
                onChange={(e) => update("fontScale", Number(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-blue-600 dark:accent-blue-400"
              />
            </label>

            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Section spacing{" "}
              <span className="float-right tabular-nums font-semibold text-gray-900 dark:text-gray-100">
                {settings.sectionSpacing}%
              </span>
              <input
                type="range"
                min="50"
                max="140"
                step="5"
                value={settings.sectionSpacing}
                onChange={(e) => update("sectionSpacing", Number(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-blue-600 dark:accent-blue-400"
              />
            </label>

            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Contact alignment
              <select
                value={settings.contactLayout || "left-inline"}
                onChange={(e) => update("contactLayout", e.target.value)}
                className="mt-1 h-8 w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white px-2.5 text-xs text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-900 dark:text-gray-100"
              >
                {contactOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {[
              ["pagePadding", "Side margins"],
              ["pagePaddingTop", "Top margin"],
              ["pagePaddingBottom", "Bottom margin"],
            ].map(([field, label]) => (
              <label
                key={field}
                className="min-w-0 text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="flex min-w-0 items-center justify-between gap-1.5">
                  <span className="truncate">{label}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    <input
                      type="number"
                      min="0.20"
                      max="0.80"
                      step="0.02"
                      value={marginValue(settings[field])}
                      onChange={(e) => updateMargin(field, e.target.value)}
                      className="h-6 w-12 rounded border border-gray-200 dark:border-zinc-700 bg-white px-1 text-right text-xs text-gray-900 outline-none dark:bg-zinc-900 dark:text-gray-100"
                    />{" "}
                    in
                  </span>
                </span>
                <input
                  type="range"
                  min="0.20"
                  max="0.80"
                  step="0.02"
                  value={marginValue(settings[field])}
                  onChange={(e) => updateMargin(field, e.target.value)}
                  className="mt-1.5 h-1.5 w-full cursor-pointer accent-blue-600 dark:accent-blue-400"
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeLayoutControls;
