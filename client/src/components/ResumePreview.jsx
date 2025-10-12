import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";

const ResumePreview = ({resumeData, template = "classic"}) => {
  const componentRef = useRef();

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
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

  if (!resumeData) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 no-print flex-shrink-0">
        <button onClick={handlePrint} className="w-full btn-primary">
          📥 Download PDF
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          This will generate a text-based, ATS-friendly PDF
        </p>
      </div>

      {/* Template Container - Always white background for resume */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-700 p-4 flex items-start justify-center">
        <SelectedTemplate ref={componentRef} resumeData={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreview;
