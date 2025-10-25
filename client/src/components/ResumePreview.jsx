import {useRef, forwardRef, useImperativeHandle} from "react";
import {useReactToPrint} from "react-to-print";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import AcademicTemplate from "./templates/AcademicTemplate";

const ResumePreview = forwardRef(({resumeData, template = "classic"}, ref) => {
  const componentRef = useRef();

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
    creative: CreativeTemplate,
    academic: AcademicTemplate,
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
    <div className="h-full flex flex-col resume-preview">
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
        style={{maxHeight: "calc(100vh - 12rem)"}}
      >
        <div className="flex justify-center pb-12" style={{minHeight: "100%"}}>
          <div
            className="bg-white dark:bg-gray-50 shadow-2xl rounded-sm origin-top mb-8"
            style={{
              width: "210mm",
              height: "187mm",
              transform: "scale(0.65)",
              transformOrigin: "top center",
            }}
          >
            <SelectedTemplate ref={componentRef} resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;
