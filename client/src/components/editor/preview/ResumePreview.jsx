import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
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
import FullPreviewModal from "./FullPreviewModal";

const ResumePreview = forwardRef(({resumeData, template = "classic"}, ref) => {
  const componentRef = useRef();
  const previewContainerRef = useRef();
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <>
      <div
        ref={previewContainerRef}
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
          className={`flex-1 bg-gradient-to-br from-blue-50/50 via-indigo-50/40 to-purple-100/50 dark:from-slate-800/80 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-xl shadow-inner backdrop-blur-sm overflow-hidden relative`}
          style={{
            maxHeight: "calc(100vh - 15rem)",
            padding: isMobile ? "0.75rem 0.5rem" : "1rem",
          }}
        >
          <div className="flex justify-center items-start w-full h-full overflow-hidden">
            <div
              className={`bg-white dark:bg-gray-50 shadow-2xl rounded-sm relative ${
                isMobile
                  ? "cursor-pointer hover:shadow-3xl transition-shadow duration-300 group"
                  : "mr-4 mb-8"
              }`}
              style={{
                width: "210mm",
                minHeight: "297mm",
                transform: isMobile ? "scale(0.42)" : "scale(0.65)",
                transformOrigin: "top center",
              }}
              onClick={isMobile ? () => setShowFullPreview(true) : undefined}
            >
              {/* Hover overlay with expand icon - MOBILE ONLY */}
              {isMobile && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center z-10 rounded-sm">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white rounded-full p-4 shadow-2xl transform group-hover:scale-110">
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
              <SelectedTemplate ref={componentRef} resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      <FullPreviewModal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
      >
        <div
          className="bg-white dark:bg-gray-50 shadow-2xl"
          style={{
            width: "210mm",
            minHeight: "297mm",
          }}
        >
          <SelectedTemplate resumeData={resumeData} />
        </div>
      </FullPreviewModal>
    </>
  );
});

export default ResumePreview;
