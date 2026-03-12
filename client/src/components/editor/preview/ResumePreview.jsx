import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {useReactToPrint} from "react-to-print";
import {useToggle, useMediaQuery} from "@/hooks";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ProfessionalV2Template from "@/components/templates/ProfessionalV2Template";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import TechTemplate from "@/components/templates/TechTemplate";
import Creative2Template from "@/components/templates/Creative2Template";
import AcademicTemplate from "@/components/templates/AcademicTemplate";
import CorporateEliteTemplate from "@/components/templates/CorporateEliteTemplate";
import StrategicLeaderTemplate from "@/components/templates/StrategicLeaderTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import FullPreviewModal from "./FullPreviewModal";

const ResumePreview = forwardRef(
  (
    {resumeData, template = "classic", twoPageMode = false, onPageUsageChange},
    ref
  ) => {
    const componentRef = useRef();
    const containerRef = useRef();
    const [
      hasOverflow,
      toggleOverflow,
      setHasOverflowTrue,
      setHasOverflowFalse,
    ] = useToggle(false);

    // Template-specific page usage from individual templates
    const [pageUsage, setPageUsage] = useState({
      currentHeight: 0,
      maxHeight: 1056,
      percentage: 0,
      isOverflowing: false,
      templateName: "",
    });

    const [
      showFullPreview,
      toggleFullPreview,
      setShowFullPreviewTrue,
      setShowFullPreviewFalse,
    ] = useToggle(false);
    const isMobile = useMediaQuery("(max-width: 1023px)"); // lg breakpoint
    const [numberOfPages, setNumberOfPages] = useState(1);

    // Callback to receive page usage data from individual templates
    const handlePageUsageChange = (usageInfo) => {
      setPageUsage(usageInfo);
      if (usageInfo.isOverflowing) {
        setHasOverflowTrue();
      } else {
        setHasOverflowFalse();
      }

      // Calculate number of pages needed
      if (usageInfo.currentHeight > 0) {
        const pages = Math.ceil(usageInfo.currentHeight / usageInfo.maxHeight);
        setNumberOfPages(pages);
      }

      // Pass data to parent Editor component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    };

    // Reset page usage when template changes or in two-page mode
    useEffect(() => {
      if (twoPageMode) {
        setPageUsage({
          currentHeight: 0,
          maxHeight: 1056,
          percentage: 0,
          isOverflowing: false,
          templateName: "",
        });
        setHasOverflowFalse();
      }
    }, [template, twoPageMode, setHasOverflowFalse]);

    // Check for content overflow in single-page mode
    // COMMENTED OUT: Universal page usage calculator
    // Now using template-specific calculations via onPageUsageChange callback
    /*
    useEffect(() => {
      if (!twoPageMode && containerRef.current) {
        const container = containerRef.current;
        const currentHeight = container.scrollHeight;
        const maxHeight = 1056; // A4 page height at 96 DPI
        const isOverflowing = currentHeight > maxHeight;
        const percentage = Math.min(Math.round((currentHeight / maxHeight) * 100), 100);
        
        setHasOverflow(isOverflowing);
        setPageUsage({
          currentHeight,
          maxHeight,
          percentage,
          isOverflowing,
        });
      } else {
        setHasOverflow(false);
        setPageUsage({
          currentHeight: 0,
          maxHeight: 1056,
          percentage: 0,
          isOverflowing: false,
        });
      }
    }, [resumeData, twoPageMode]);
    */

    const templates = {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      professional: ProfessionalTemplate,
      "professional-v2": ProfessionalV2Template,
      executive: ExecutiveTemplate,
      tech: TechTemplate,
      creative2: Creative2Template,
      academic: AcademicTemplate,
      "corporate-elite": CorporateEliteTemplate,
      "strategic-leader": StrategicLeaderTemplate,
      "impact-pro": ImpactProTemplate,
    };

    const SelectedTemplate = templates[template] || ClassicTemplate;

    const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `${resumeData?.name || "Resume"}_Resume`,
      pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    });

    // Expose handlePrint to parent component
    useImperativeHandle(ref, () => ({
      downloadPDF: handlePrint,
    }));

    if (!resumeData) return null;

    // Scale factors for visual preview
    const scaleFactor = isMobile ? 0.38 : 0.65;

    // A4_HEIGHT_PX = 11in at 96dpi, matches the standardised minHeight across all templates
    const A4_HEIGHT_PX = 1056;

    // Use the real measured height reported by the template, falling back to A4
    const templateHeightPx =
      pageUsage.currentHeight > 0 ? pageUsage.currentHeight : A4_HEIGHT_PX;

    // The visual (scaled) height that the layout should actually reserve
    const scaledHeightPx = Math.ceil(templateHeightPx * scaleFactor);

    // Visual width after scaling (in mm, valid CSS length)
    const scaledWidthMm = `${(210 * scaleFactor).toFixed(2)}mm`;

    return (
      <>
        <div className="flex flex-col resume-preview">
          {/* Download Button */}
          <div className="mb-4 no-print flex-shrink-0">
            <button
              onClick={handlePrint}
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📥</span>
              <span className="text-base">Download PDF</span>
            </button>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 font-medium">
              This will generate a text-based, ATS-friendly PDF
            </p>
          </div>

          {/* Page Counter */}
          {!twoPageMode && numberOfPages > 1 && (
            <div className="mb-3 no-print flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-300">
                  <span className="text-lg">📄</span>
                  <span className="font-bold text-sm">
                    {numberOfPages} Page{numberOfPages > 1 ? "s" : ""} Total
                  </span>
                </div>
              </div>
            </div>
          )}

          {/*
            Scroll container:
            - NOT flex-1 (would stretch to fill parent, adding empty space)
            - max-height keeps it scrollable without taking the full viewport
            - overflow-x-hidden clips the horizontal layout overshoot from transform
          */}
          <div
            className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-y-auto overflow-x-hidden"
            style={{
              maxHeight: isMobile ? "500px" : "calc(100vh - 15rem)",
              padding: isMobile ? "0.5rem" : "1rem",
            }}
          >
            {/*
              Pages wrapper — height is content-driven (no min-h-full).
              Centers the shrink wrapper horizontally.
            */}
            <div className="flex flex-col items-center w-full">
              {/*
                SHRINK WRAPPER — the key fix for the empty-space bug.

                CSS transform: scale() shrinks the element *visually* but keeps
                the original DOM dimensions in layout flow, causing a large blank
                area below the visible template.

                Solution: give this wrapper exactly the *visual* dimensions after
                scaling (scaledWidthMm × scaledHeightPx).  The actual template
                div is then positioned absolute inside it at full A4 size and
                scaled to fit.  The browser allocates only the visual footprint
                in the scroll container — no empty space.
              */}
              <div
                style={{
                  width: scaledWidthMm,
                  height: `${scaledHeightPx}px`,
                  position: "relative",
                  overflow: "visible", // page-break indicators can show outside
                  flexShrink: 0,
                }}
                onClick={isMobile ? setShowFullPreviewTrue : undefined}
              >
                {/* Full A4 template — scaled and anchored to top-left of shrink wrapper */}
                <div
                  ref={containerRef}
                  className={`bg-white dark:bg-gray-50 shadow-2xl rounded-sm relative ${
                    isMobile
                      ? "cursor-pointer group"
                      : ""
                  }`}
                  style={{
                    width: "210mm",
                    minHeight: "11in",
                    height: "auto",
                    transform: `scale(${scaleFactor})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  {/* Page break indicators */}
                  {!twoPageMode &&
                    numberOfPages > 1 &&
                    Array.from({length: numberOfPages - 1}).map((_, index) => (
                      <React.Fragment key={`page-break-${index}`}>
                        <div
                          className="absolute left-0 right-0 pointer-events-none"
                          style={{
                            top: `${(index + 1) * 297}mm`,
                            height: "0px",
                            borderTop: "3px dashed #ef4444",
                            opacity: 0.7,
                            zIndex: 1000,
                          }}
                        >
                          <div className="absolute left-1/2 -translate-x-1/2 -top-5 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg whitespace-nowrap">
                            📄 Page {index + 2}
                          </div>
                          <div className="absolute -left-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-md">
                            {index + 2}
                          </div>
                          <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-md">
                            {index + 2}
                          </div>
                        </div>
                        <div
                          className="absolute left-0 right-0 pointer-events-none"
                          style={{
                            top: `${(index + 1) * 297}mm`,
                            height: "20px",
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
                            zIndex: 999,
                          }}
                        />
                      </React.Fragment>
                    ))}

                  {/* Mobile tap-to-expand overlay */}
                  {isMobile && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center z-10 rounded-sm">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full p-4 shadow-lg transform group-hover:scale-105">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Template content */}
                  <div
                    style={{
                      pageBreakAfter: twoPageMode ? "auto" : "avoid",
                      pageBreakInside: twoPageMode ? "auto" : "avoid",
                    }}
                  >
                    <SelectedTemplate
                      ref={componentRef}
                      resumeData={resumeData}
                      twoPageMode={twoPageMode}
                      onPageUsageChange={handlePageUsageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Preview Modal — no transform needed, template renders at natural size */}
        <FullPreviewModal
          isOpen={showFullPreview}
          onClose={setShowFullPreviewFalse}
        >
          <div
            className="bg-white dark:bg-gray-50 shadow-2xl"
            style={{width: "210mm", minHeight: "11in", height: "auto"}}
          >
            <SelectedTemplate
              resumeData={resumeData}
              twoPageMode={twoPageMode}
              onPageUsageChange={handlePageUsageChange}
            />
          </div>
        </FullPreviewModal>
      </>
    );
  }
);

export default ResumePreview;
