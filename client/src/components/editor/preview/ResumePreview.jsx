import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
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
import StrategicLeadershipTemplate from "@/components/templates/StrategicLeadershipTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "@/components/templates/GitHubStyleTemplate";
import StructuredPhotoTemplate from "@/components/templates/StructuredPhotoTemplate";
import FullPreviewModal from "./FullPreviewModal";

// Template page height in px (11 in @ 96 dpi — matches minHeight across all templates)
const PAGE_HEIGHT_PX = 1056;
// Minimum px of content before allowing a page break (avoids near-empty pages)
const MIN_CONTENT_PX = 100;
// Pages only appear when content overflows by more than this amount (avoids false 2nd pages)
const OVERFLOW_THRESHOLD_PX = 80;

const ResumePreview = forwardRef(
  ({resumeData, template = "classic", onPageUsageChange}, ref) => {
    const printTemplateRef = useRef();
    const templateRef = useRef(); // page-0 template wrapper — used for DOM section measurement
    const [showFullPreview, , setShowFullPreviewTrue, setShowFullPreviewFalse] =
      useToggle(false);
    const isMobile = useMediaQuery("(max-width: 1023px)");
    const [numberOfPages, setNumberOfPages] = useState(1);
    // pageBreaks[i] = template-coordinate y where page i starts (template px, pre-scale)
    const [pageBreaks, setPageBreaks] = useState([0]);

    const handlePageUsageChange = (usageInfo) => {
      if (usageInfo.currentHeight > 0) {
        // Require OVERFLOW_THRESHOLD_PX extra before counting an additional page,
        // which prevents tiny overflows (e.g. bottom margin) from making a false 2nd page.
        const pages = Math.max(
          1,
          Math.ceil(
            (usageInfo.currentHeight - OVERFLOW_THRESHOLD_PX) /
              usageInfo.maxHeight
          )
        );
        setNumberOfPages(pages);
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
    }, [numberOfPages, resumeData, template, isMobile]);

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
    };

    const SelectedTemplate = templates[template] || ClassicTemplate;
    const twoPageMode = numberOfPages > 1;

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
      if (isMobile) {
        handleMobilePrint(options);
        return;
      }

      handlePrint();
    }, [handleMobilePrint, handlePrint, isMobile]);

    useImperativeHandle(ref, () => ({
      downloadPDF,
    }), [downloadPDF]);

    if (!resumeData) return null;

    const scaleFactor = isMobile ? 0.38 : 0.65;
    const scaledPageHeightPx = Math.ceil(PAGE_HEIGHT_PX * scaleFactor);
    const scaledWidthMm = `${(210 * scaleFactor).toFixed(2)}mm`;

    return (
      <>
        <div className="flex flex-col resume-preview">
          {/* Download Button */}
          <div className="mb-4 no-print flex-shrink-0">
            <button
              onClick={downloadPDF}
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📥</span>
              <span className="text-base">Download PDF</span>
            </button>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 font-medium">
              This will generate a text-based, ATS-friendly PDF
            </p>
          </div>

          {/* Scroll container — PDF viewer style */}
          <div
            className="bg-zinc-200 dark:bg-zinc-900 rounded-xl overflow-y-auto overflow-x-hidden"
            style={{
              maxHeight: isMobile ? "500px" : "calc(100vh - 15rem)",
              padding: isMobile ? "0.75rem" : "1.25rem",
            }}
          >
            {/* Pages stack */}
            <div
              className="flex flex-col items-center"
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
                    className={`bg-white dark:bg-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.18)] rounded-sm ${
                      isMobile ? "cursor-pointer" : ""
                    }`}
                  >
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
                          <SelectedTemplate
                            resumeData={resumeData}
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

        {/* Full Preview Modal — renders at natural A4 size */}
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
          <SelectedTemplate
            ref={printTemplateRef}
            resumeData={resumeData}
            twoPageMode={false}
            printMode={template === "professional-v2"}
            onPageUsageChange={() => {}}
          />
        </div>
      </>
    );
  }
);

export default ResumePreview;
