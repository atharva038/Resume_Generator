import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {useReactToPrint} from "react-to-print";
import {Download, Palette, Sliders, Type, Check, Maximize2} from "lucide-react";
import {useToggle, useMediaQuery} from "@/hooks";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ProfessionalV2Template from "@/components/templates/ProfessionalV2Template";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import TechTemplate from "@/components/templates/TechTemplate";
import Creative2Template from "@/components/templates/Creative2Template";
import StrategicLeadershipTemplate from "@/components/templates/StrategicLeadershipTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "@/components/templates/GitHubStyleTemplate";
import StructuredPhotoTemplate from "@/components/templates/StructuredPhotoTemplate";
import SiliconValleyTemplate from "@/components/templates/SiliconValleyTemplate";
import FullPreviewModal from "./FullPreviewModal";
import ResumeWatermark from "./ResumeWatermark";

// Color themes supported for live toolbar customization
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
  { id: "modernSans", label: "Modern Sans" },
  { id: "editorialSerif", label: "Editorial Serif" },
  { id: "techMono", label: "Tech Mono" },
];

// Template page height in px (11 in @ 96 dpi — matches minHeight across all templates)
const PAGE_HEIGHT_PX = 1056;
// Minimum px of content before allowing a page break (avoids near-empty pages)
const MIN_CONTENT_PX = 100;
// Pages only appear when content overflows by more than this amount (avoids false 2nd pages)
const OVERFLOW_THRESHOLD_PX = 80;

const ResumePreview = forwardRef(
  ({resumeData, template = "classic", onPageUsageChange, onDownload, onUpdateField}, ref) => {
    const printTemplateRef = useRef();
    const templateRef = useRef(); // page-0 template wrapper — used for DOM section measurement
    const [showFullPreview, , setShowFullPreviewTrue, setShowFullPreviewFalse] =
      useToggle(false);
    const isMobile = useMediaQuery("(max-width: 1023px)");
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [measuredHeight, setMeasuredHeight] = useState(1056);
    // pageBreaks[i] = template-coordinate y where page i starts (template px, pre-scale)
    const [pageBreaks, setPageBreaks] = useState([0]);

    const [localTheme, setLocalTheme] = useState(
      resumeData?.selectedTheme || resumeData?.colorTheme || "stripeIndigo"
    );
    const [localDensity, setLocalDensity] = useState(
      resumeData?.density || "medium"
    );
    const [localFont, setLocalFont] = useState(
      resumeData?.fontPairing || "modernSans"
    );

    const activeTheme = resumeData?.selectedTheme || resumeData?.colorTheme || localTheme;
    const activeDensity = resumeData?.density || localDensity;
    const activeFont = resumeData?.fontPairing || localFont;

    const isCompact = activeDensity === "compact";

    // Intelligent Multi-Stage Micro-Scale:
    // Guarded floor of 0.92 strictly prevents text from becoming tiny or illegible.
    // Margins (0.22in) and section spacing (52%) handle 90% of the vertical space reduction.
    const autoFitScale = useMemo(() => {
      if (!isCompact) return 1.0;
      if (measuredHeight <= 1056) return 1.0;
      return Math.max(0.92, Math.min(1.0, 1045 / measuredHeight));
    }, [isCompact, measuredHeight]);

    const mergedResumeData = useMemo(() => ({
      ...resumeData,
      selectedTheme: activeTheme,
      colorTheme: activeTheme,
      density: activeDensity,
      fontPairing: activeFont,
    }), [resumeData, activeTheme, activeDensity, activeFont]);

    const handleThemeChange = (themeId) => {
      setLocalTheme(themeId);
      if (resumeData) {
        resumeData.selectedTheme = themeId;
        resumeData.colorTheme = themeId;
      }
      if (onUpdateField) onUpdateField("selectedTheme", themeId);
    };

    const DENSITY_SPACING_MAP = {
      compact: 52,
      medium: 100,
      spacious: 140,
    };

    const handleDensityChange = (densityId) => {
      setLocalDensity(densityId);
      const spacingVal = DENSITY_SPACING_MAP[densityId] || 100;
      if (resumeData) {
        resumeData.density = densityId;
        if (!resumeData.layoutSettings) resumeData.layoutSettings = {};
        resumeData.layoutSettings.sectionSpacing = spacingVal;
      }
      if (onUpdateField) {
        onUpdateField("density", densityId);
        onUpdateField("layoutSettings", {
          ...(resumeData?.layoutSettings || {}),
          sectionSpacing: spacingVal,
        });
      }
    };

    const handleFontChange = (fontId) => {
      setLocalFont(fontId);
      const fontFam = FONT_MAP[fontId] || fontId;
      if (resumeData) {
        resumeData.fontPairing = fontId;
        if (!resumeData.layoutSettings) resumeData.layoutSettings = {};
        resumeData.layoutSettings.fontFamily = fontFam;
      }
      if (onUpdateField) {
        onUpdateField("fontPairing", fontId);
        onUpdateField("layoutSettings", {
          ...(resumeData?.layoutSettings || {}),
          fontFamily: fontFam,
        });
      }
    };

    const handlePageUsageChange = (usageInfo) => {
      if (usageInfo.currentHeight > 0) {
        setMeasuredHeight(usageInfo.currentHeight);

        // In 1-Page Fit mode, guarantee 1 page if content can fit (up to 1450px unscaled)
        if (isCompact && (usageInfo.currentHeight <= 1450 || usageInfo.currentHeight * autoFitScale <= 1060)) {
          setNumberOfPages(1);
          setPageBreaks([0]);
        } else {
          const effectiveH = isCompact
            ? usageInfo.currentHeight * autoFitScale
            : usageInfo.currentHeight;
          const pages = Math.max(
            1,
            Math.ceil((effectiveH - OVERFLOW_THRESHOLD_PX) / usageInfo.maxHeight)
          );
          setNumberOfPages(pages);
        }
      }
      if (onPageUsageChange) onPageUsageChange(usageInfo);
    };

    // After the template renders, find <section> elements that straddle a page
    // boundary and compute smart break points so no section is split mid-content.
    useEffect(() => {
      if (numberOfPages <= 1) {
        setPageBreaks([0]);
        return;
      }

      // Wait for paint so getBoundingClientRect values are stable
      const tid = setTimeout(() => {
        const el = templateRef.current;
        if (!el) return;

        const scale = isMobile ? 0.38 : 0.65;
        const wrapperTop = el.getBoundingClientRect().top;
        const totalH = el.scrollHeight; // template-coord height (not affected by scale)

        // Collect every <section> in template coords (divide visual offset by scale)
        const sectionRects = Array.from(el.querySelectorAll("section"))
          .map((s) => {
            const r = s.getBoundingClientRect();
            return {
              top: (r.top - wrapperTop) / scale,
              bottom: (r.bottom - wrapperTop) / scale,
            };
          })
          .filter((r) => r.top >= 0 && r.bottom > r.top + 10);

        const breaks = [0];
        let pageStart = 0;

        for (let p = 0; p < numberOfPages - 1; p++) {
          const nominalEnd = pageStart + PAGE_HEIGHT_PX;
          if (nominalEnd >= totalH) break;

          // Any section whose body spans the page boundary?
          const straddling = sectionRects.find(
            (r) => r.top < nominalEnd && r.bottom > nominalEnd
          );

          if (
            straddling &&
            straddling.top > pageStart + MIN_CONTENT_PX
          ) {
            // Break just before this section starts
            breaks.push(straddling.top);
            pageStart = straddling.top;
          } else {
            breaks.push(nominalEnd);
            pageStart = nominalEnd;
          }
        }

        setPageBreaks(breaks);
      }, 150);

      return () => clearTimeout(tid);
    }, [numberOfPages, activeTheme, activeDensity, activeFont, resumeData, template, isMobile]);

    const templates = {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      professional: ProfessionalTemplate,
      "professional-v2": ProfessionalV2Template,
      executive: ExecutiveTemplate,
      tech: TechTemplate,
      GitHubStyle: GitHubStyleTemplate,
      creative2: Creative2Template,
      "strategic-leader": StrategicLeadershipTemplate,
      "strategic-leadership": StrategicLeadershipTemplate,
      "stratergic-leader": StrategicLeadershipTemplate,
      "impact-pro": ImpactProTemplate,
      "structured-photo": StructuredPhotoTemplate,
      "silicon-valley": SiliconValleyTemplate,
      siliconValley: SiliconValleyTemplate,
    };

    const SelectedTemplate = templates[template] || ClassicTemplate;
    const twoPageMode = numberOfPages > 1;
    const FONT_MAP = {
      modernSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      editorialSerif: '"Newsreader", "Playfair Display", Georgia, Cambria, "Times New Roman", Times, serif',
      techMono: '"JetBrains Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    };

    const layoutSettings = resumeData?.layoutSettings || {};

    const activeFontFamily =
      FONT_MAP[activeFont] ||
      layoutSettings.fontFamily ||
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const userFontScale = Number(layoutSettings.fontScale || 100) / 100;
    // If user has set an explicit custom fontScale (not 100), honor user's explicit preference!
    // Otherwise in 1-Page Fit, gently micro-scale with autoFitScale (capped at 0.92 floor)
    const finalScale = isCompact && autoFitScale < 1.0 && (!layoutSettings.fontScale || layoutSettings.fontScale === 100)
      ? autoFitScale.toFixed(3)
      : String(userFontScale);

    // Margins adapt to density: ultra-efficient in 1-Page Fit (0.22in top/bottom, 0.35in side)
    const defaultTopPad = isCompact
      ? "0.22in"
      : activeDensity === "spacious"
      ? "0.50in"
      : "0.35in";
    const defaultSidePad = isCompact
      ? "0.35in"
      : activeDensity === "spacious"
      ? "0.50in"
      : "0.44in";
    const defaultBottomPad = isCompact
      ? "0.22in"
      : activeDensity === "spacious"
      ? "0.50in"
      : "0.35in";

    const densityMultiplier =
      isCompact ? 0.52 : activeDensity === "spacious" ? 1.4 : 1.0;
    const effectiveSpacing = String(
      layoutSettings.sectionSpacing != null && layoutSettings.sectionSpacing !== ""
        ? Number(layoutSettings.sectionSpacing) / 100
        : densityMultiplier
    );

    const activeThemeColor =
      PREVIEW_THEMES.find((t) => t.id === activeTheme)?.color || "#4f46e5";

    const layoutStyle = {
      "--resume-layout-top": layoutSettings.pagePaddingTop || defaultTopPad,
      "--resume-layout-side": layoutSettings.pagePadding || defaultSidePad,
      "--resume-layout-bottom": layoutSettings.pagePaddingBottom || defaultBottomPad,
      "--resume-layout-scale": finalScale,
      "--resume-layout-spacing": effectiveSpacing,
      "--resume-layout-font-family": activeFontFamily,
      "--resume-layout-bullet-color": activeThemeColor,
    };

    const handlePrint = useReactToPrint({
      contentRef: printTemplateRef,
      documentTitle: `${resumeData?.name || "Resume"}_Resume`,
      pageStyle: `
        @page { size: A4; margin: 0; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `,
    });

    const handleMobilePrint = useCallback(async ({targetWindow} = {}) => {
      const printNode = printTemplateRef.current;
      if (!printNode) {
        handlePrint();
        return;
      }

      const printWindow = targetWindow || window.open("", "_blank");
      if (printWindow) {
        const documentTitle = `${resumeData?.name || "Resume"}_Resume`;
        const styleMarkup = Array.from(
          document.querySelectorAll('style, link[rel="stylesheet"]')
        )
          .map((node) => node.outerHTML)
          .join("\n");

        printWindow.document.open();
        printWindow.document.write(`
          <!doctype html>
          <html>
            <head>
              <title>${documentTitle}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              ${styleMarkup}
              <style>
                @page { size: A4; margin: 0; }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 210mm;
                  min-height: 297mm;
                  background: #ffffff;
                  color: #000000;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                body {
                  display: block;
                }
                .resume-preview {
                  box-shadow: none !important;
                  border: none !important;
                  margin: 0 auto !important;
                }
                .no-print {
                  display: none !important;
                }
              </style>
            </head>
            <body>
              ${printNode.cloneNode(true).outerHTML}
              <script>
                window.addEventListener("load", function () {
                  setTimeout(function () {
                    window.focus();
                    window.print();
                  }, 250);
                });
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return;
      }

      const existingPrintRoot = document.getElementById(
        "mobile-resume-print-root"
      );
      if (existingPrintRoot) existingPrintRoot.remove();

      const printRoot = document.createElement("div");
      printRoot.id = "mobile-resume-print-root";
      printRoot.appendChild(printNode.cloneNode(true));

      document.body.appendChild(printRoot);
      document.body.classList.add("printing-resume-template");

      const cleanup = () => {
        document.body.classList.remove("printing-resume-template");
        printRoot.remove();
        window.removeEventListener("afterprint", cleanup);
      };

      window.addEventListener("afterprint", cleanup);

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      window.print();
      window.setTimeout(cleanup, 10000);
    }, [handlePrint, resumeData?.name]);

    const downloadPDF = useCallback((options) => {
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobileDevice) {
        handleMobilePrint(options);
        return;
      }

      handlePrint();
    }, [handleMobilePrint, handlePrint]);

    useImperativeHandle(ref, () => ({
      downloadPDF,
    }), [downloadPDF]);

    if (!resumeData) return null;

    const scaleFactor = isMobile ? 0.38 : 0.65;
    const scaledPageHeightPx = Math.ceil(PAGE_HEIGHT_PX * scaleFactor);
    const scaledWidthMm = `${(210 * scaleFactor).toFixed(2)}mm`;

    return (
      <>
        <div className="flex min-w-0 max-w-full flex-col resume-preview items-center xl:h-full xl:flex-1 xl:overflow-hidden w-full">
          {/* Controls & Download Toolbar */}
          <div
            className="mb-2.5 flex flex-shrink-0 flex-col gap-2 no-print w-full"
            style={{ width: scaledWidthMm, maxWidth: "100%" }}
          >
            {/* Quick Live Customizer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2 shadow-xs backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-950/90">
              {/* Color Themes */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  <span className="hidden sm:inline">Color:</span>
                </span>
                <div className="flex items-center gap-1">
                  {PREVIEW_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      title={t.name}
                      type="button"
                      className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-all duration-150 ${
                        activeTheme === t.id
                          ? "ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-xs"
                          : "opacity-75 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{ backgroundColor: t.color }}
                    >
                      {activeTheme === t.id && (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density Toggle */}
              <div className="flex items-center gap-0.5 bg-gray-100/90 dark:bg-zinc-900 p-0.5 rounded-lg border border-gray-200/60 dark:border-zinc-800/80">
                <Sliders className="w-3 h-3 text-gray-400 ml-1 mr-0.5" />
                {PREVIEW_DENSITIES.map((d) => {
                  const isSelected = activeDensity === d.id;
                  const isOnePage = d.id === "compact";
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDensityChange(d.id)}
                      type="button"
                      className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-md transition-all flex items-center gap-1 ${
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

              {/* Font Pairing Dropdown */}
              <div className="flex items-center gap-1">
                <Type className="w-3 h-3 text-gray-400" />
                <select
                  value={activeFont}
                  onChange={(e) => handleFontChange(e.target.value)}
                  className="rounded-lg border border-gray-200/80 bg-gray-50/80 px-2 py-0.5 text-[10.5px] font-medium text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {PREVIEW_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Page Capacity Gauge */}
            {(() => {
              const pageFillPct = Math.min(200, Math.round((measuredHeight / 1056) * 100));
              const isOnePage = numberOfPages === 1;
              return (
                <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-gray-100/70 dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800/80 text-[11px]">
                  <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnePage ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-amber-500 animate-pulse"
                      }`}
                    />
                    Page Fill:{" "}
                    <strong className={isOnePage ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-amber-700 dark:text-amber-400 font-bold"}>
                      {pageFillPct}%
                    </strong>
                    <span className="text-gray-400 dark:text-gray-500">({numberOfPages} {numberOfPages === 1 ? "page" : "pages"})</span>
                  </span>

                  {!isCompact && !isOnePage && (
                    <button
                      type="button"
                      onClick={() => handleDensityChange("compact")}
                      className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      ⚡ Auto-Fit 1 Page
                    </button>
                  )}
                  {isCompact && (
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      ✓ Smart Fit Active
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Action Row: Download PDF & Fullscreen Preview */}
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload || downloadPDF}
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-700 bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-zinc-950"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={setShowFullPreviewTrue}
                title="Fullscreen Preview"
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300 dark:hover:bg-zinc-900"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
              Generated PDF is 100% text-based and ATS-friendly
            </p>
          </div>

          {/* Scrollable preview */}
          <div
            className="min-w-0 max-w-full rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 overflow-x-hidden overflow-y-auto scrollbar-thin relative flex-1 w-full flex flex-col items-center"
            style={{
              maxHeight: isMobile ? "520px" : "100%",
              height: isMobile ? "auto" : "100%",
              padding: isMobile ? "0.75rem" : "1rem",
            }}
          >
            {/* Pages stack */}
            <div
              className="flex flex-col items-center relative z-10"
              style={{gap: isMobile ? "10px" : "18px"}}
              onClick={isMobile ? setShowFullPreviewTrue : undefined}
            >
              {pageBreaks.map((pageStart, pageIndex) => {
                const nextBreak = pageBreaks[pageIndex + 1];

                // How many template-px of content this page card should show.
                // For non-last pages: exactly up to the next break point (section boundary).
                // For the last page: a full page height (template's own background fills rest).
                const visibleTemplatePx =
                  nextBreak !== undefined
                    ? nextBreak - pageStart // precise clip at section boundary
                    : PAGE_HEIGHT_PX; // last page — show full page height

                return (
                  <div
                    key={pageIndex}
                    style={{
                      width: scaledWidthMm,
                      height: `${scaledPageHeightPx}px`,
                      position: "relative",
                      flexShrink: 0,
                    }}
                    className={`bg-white dark:bg-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.18)] rounded-sm overflow-hidden ${
                      isMobile ? "cursor-pointer" : ""
                    }`}
                  >
                    {/* Anti-AI 3-tier SmartNShine security watermark overlay */}
                    <ResumeWatermark isMobile={isMobile} />

                    {/*
                      Inner clip div: height = visibleTemplatePx * scale.
                      overflow:hidden provides a hard pixel-perfect cut at the
                      section boundary — no floating-point overlay tricks needed.
                      The outer page card (white bg) fills the remaining space,
                      creating a blank "rest of page" just like a real PDF.
                    */}
                    <div
                      style={{
                        height: `${visibleTemplatePx * scaleFactor}px`,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        ref={pageIndex === 0 ? templateRef : undefined}
                        className="bg-white dark:bg-gray-50"
                        style={{
                          width: "210mm",
                          minHeight: "11in",
                          height: "auto",
                          transform: `scale(${scaleFactor})`,
                          transformOrigin: "top left",
                          position: "absolute",
                          top: `-${pageStart * scaleFactor}px`,
                          left: 0,
                        }}
                      >
                        <div
                          style={{
                            pageBreakAfter: twoPageMode ? "auto" : "avoid",
                            pageBreakInside: twoPageMode ? "auto" : "avoid",
                          }}
                        >
                          <div className="resume-layout-shell" style={layoutStyle} data-contact={layoutSettings.contactLayout || "center-inline"} data-density={activeDensity}>
                            <SelectedTemplate
                              resumeData={mergedResumeData}
                              twoPageMode={twoPageMode}
                              onPageUsageChange={
                                pageIndex === 0
                                  ? handlePageUsageChange
                                  : () => {}
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Page number badge */}
                    {numberOfPages > 1 && (
                      <div className="absolute bottom-2 right-2 no-print pointer-events-none z-10">
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-100/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-300">
                          {pageIndex + 1} / {numberOfPages}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full Preview Modal — renders at natural A4 size with SmartNShine watermark */}
        <FullPreviewModal
          isOpen={showFullPreview}
          onClose={setShowFullPreviewFalse}
          title={resumeData?.name ? `${resumeData.name} — Resume Preview` : "Resume Full Preview"}
          onDownload={handlePrint}
        >
          <div
            className="bg-white dark:bg-gray-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] rounded-sm border border-black/10 dark:border-white/10 relative overflow-hidden"
            style={{width: "210mm", minHeight: "11in", height: "auto"}}
          >
            {/* Anti-AI 3-tier SmartNShine security watermark overlay */}
            <ResumeWatermark isMobile={isMobile} />

            <div className="resume-layout-shell relative z-10" style={layoutStyle} data-contact={layoutSettings.contactLayout || "center-inline"} data-density={activeDensity}>
              <SelectedTemplate
                resumeData={mergedResumeData}
                twoPageMode={twoPageMode}
                onPageUsageChange={handlePageUsageChange}
              />
            </div>
          </div>
        </FullPreviewModal>

        {/* Dedicated print source: natural-size template without preview scaling/pagination wrappers */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-200vw",
            top: 0,
            width: "210mm",
            background: "#ffffff",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          <div ref={printTemplateRef} className="resume-layout-shell" style={layoutStyle} data-contact={layoutSettings.contactLayout || "center-inline"} data-density={activeDensity}>
            <SelectedTemplate
              resumeData={mergedResumeData}
              twoPageMode={false}
              printMode={template === "professional-v2"}
              onPageUsageChange={() => {}}
            />
          </div>
        </div>
      </>
    );
  }
);

export default ResumePreview;
