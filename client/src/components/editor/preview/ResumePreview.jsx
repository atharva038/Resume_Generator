import {useRef, forwardRef, useImperativeHandle, useState, useEffect} from "react";
import {useReactToPrint} from "react-to-print";
import ClassicTemplate from "../../templates/ClassicTemplate";
import ModernTemplate from "../../templates/ModernTemplate";
import MinimalTemplate from "../../templates/MinimalTemplate";
import ProfessionalTemplate from "../../templates/ProfessionalTemplate";
import ProfessionalV2Template from "../../templates/ProfessionalV2Template";
import ExecutiveTemplate from "../../templates/ExecutiveTemplate";
import TechTemplate from "../../templates/TechTemplate";
import CreativeTemplate from "../../templates/CreativeTemplate";
import AcademicTemplate from "../../templates/AcademicTemplate";
import CorporateEliteTemplate from "../../templates/CorporateEliteTemplate";
import StrategicLeaderTemplate from "../../templates/StrategicLeaderTemplate";
import ImpactProTemplate from "../../templates/ImpactProTemplate";

const ResumePreview = forwardRef(({resumeData, template = "classic", twoPageMode = false}, ref) => {
  const componentRef = useRef();
  const containerRef = useRef();
  const [hasOverflow, setHasOverflow] = useState(false);

  // Check for content overflow in single-page mode
  useEffect(() => {
    if (!twoPageMode && containerRef.current) {
      const container = containerRef.current;
      const isOverflowing = container.scrollHeight > container.clientHeight;
      setHasOverflow(isOverflowing);
    } else {
      setHasOverflow(false);
    }
  }, [resumeData, twoPageMode]);

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    "professional-v2": ProfessionalV2Template,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
    creative: CreativeTemplate,
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

  return (
    <div
      className="h-full flex flex-col resume-preview"
      // style={{height: "calc(100vh - 8rem)"}}
    >
      {/* Stylish Download Button */}
      <div className="mb-4 no-print flex-shrink-0">
        <button
          onClick={handlePrint}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">📥</span>
          <span className="text-base">Download PDF</span>
        </button>
        <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 font-medium">
          This will generate a text-based, ATS-friendly PDF
        </p>
      </div>

      {/* Resume Container - Fully visible and scrollable */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-blue-50/50 via-indigo-50/40 to-purple-100/50 dark:from-slate-800/80 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-xl shadow-inner p-4 backdrop-blur-sm"
        style={{maxHeight: "calc(100vh - 15rem)"}}
      >
        <div
          className="flex justify-center pb-4"
          style={{minHeight: "100%"}}
        >
          <div
            ref={containerRef}
            className="bg-white dark:bg-gray-50 shadow-2xl rounded-sm mb-8 relative"
            style={{
              width: "210mm",
              minHeight: twoPageMode ? "297mm" : "297mm",
              height: twoPageMode ? "auto" : "297mm",
              maxHeight: twoPageMode ? "none" : "297mm",
              overflow: twoPageMode ? "visible" : "hidden",
              transform: "scale(0.65)",
              transformOrigin: "top center",
              margin: "0 auto",
            }}
          >
            <SelectedTemplate ref={componentRef} resumeData={resumeData} twoPageMode={twoPageMode} />
            
            {/* Content overflow warning for single page mode - only show if actually overflowing */}
            {!twoPageMode && hasOverflow && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.98))",
                }}
              >
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <div className="inline-block bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 px-5 py-2 rounded-full text-sm font-bold border-2 border-red-400 dark:border-red-600 shadow-lg animate-pulse">
                    ⚠️ Content Below This Line is Hidden
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;
