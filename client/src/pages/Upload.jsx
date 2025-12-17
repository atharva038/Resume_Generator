import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import UpgradeRequiredModal from "@/components/common/modals/UpgradeRequiredModal";
import {useToggle} from "@/hooks";
import {
  Upload as UploadIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  Zap,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

const Upload = () => {
  const [uploading, toggleUploading, setUploadingTrue, setUploadingFalse] =
    useToggle(false);
  const [error, setError] = useState("");
  const [
    showUpgradeModal,
    toggleUpgradeModal,
    setShowUpgradeModalTrue,
    setShowUpgradeModalFalse,
  ] = useToggle(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError("");
    setUploadingTrue();

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await resumeAPI.upload(formData);

      // Navigate to editor with parsed data
      navigate("/editor", {state: {resumeData: response.data.data}});
    } catch (err) {
      console.error("Upload error:", err);
      console.log("Error response data:", err.response?.data);
      console.log("Error status:", err.response?.status);

      // Check if it's a subscription/upgrade required error
      if (
        err.response?.data?.upgradeRequired ||
        err.response?.data?.quotaExceeded
      ) {
        console.log("🎯 Detected upgrade/quota error - showing modal");
        setUpgradeMessage(
          err.response.data.message || "Upgrade to access this premium feature!"
        );
        setShowUpgradeModalTrue();
      } else {
        console.log("⚠️ Not an upgrade error - showing regular error");
        setError(parseValidationErrors(err));
      }
    } finally {
      setUploadingFalse();
    }
  };

  // Create blank resume and navigate to editor
  const createBlankResume = () => {
    const blankResumeData = {
      name: "",
      contact: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: [],
      customSections: [],
    };

    navigate("/editor", {
      state: {resumeData: blankResumeData, isNewResume: true},
    });
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
              Upload Your Resume
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload a PDF or DOCX file and let our AI transform it into an
              ATS-optimized, recruiter-ready resume in minutes
            </p>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 sm:p-16 text-center cursor-pointer
              transition-colors duration-200
              ${
                isDragActive
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/10"
                  : "border-gray-300 dark:border-zinc-700 hover:border-primary-400 bg-white dark:bg-zinc-950"
              }
              ${uploading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />

            <div>
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                {uploading ? (
                  <div className="w-12 h-12 border-2 border-gray-200 dark:border-zinc-800 border-t-primary-600 rounded-full animate-spin"></div>
                ) : isDragActive ? (
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <UploadIcon className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* Text */}
              {uploading ? (
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Processing Your Resume...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Our AI is analyzing your resume structure
                  </p>
                </div>
              ) : isDragActive ? (
                <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  Drop your resume here to get started
                </p>
              ) : (
                <>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drag & Drop Your Resume Here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    or click to browse your files
                  </p>

                  {/* Upload Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <UploadIcon className="w-5 h-5" />
                    Choose File
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Supported formats:</span>{" "}
                      PDF, DOCX, DOC
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-medium">Maximum size:</span> 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 text-red-600 dark:text-red-400">
                  ✕
                </div>
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300 mb-1">
                    Upload Failed
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Divider with OR */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-400 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Start from Scratch Button */}
          <div className="text-center">
            <button
              onClick={createBlankResume}
              disabled={uploading}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Start from Scratch</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Create a new resume from a blank template
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {/* What Happens Next */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  What Happens Next?
                </h3>
              </div>
              <ol className="space-y-3">
                {[
                  "AI extracts and structures your resume data",
                  "Review and edit sections in our smart editor",
                  "Enhance content with AI-powered suggestions",
                  "Download your ATS-optimized resume",
                ].map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        {idx + 1}
                      </span>
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Features */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Why Upload Here?
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Smart AI text extraction",
                  "Automatic section categorization",
                  "ATS-friendly formatting",
                  "Privacy-focused & secure",
                ].map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <span className="font-medium">🔒 Your privacy matters.</span> All
              uploads are encrypted and processed securely. We never share your
              data with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeRequiredModal
          isOpen={showUpgradeModal}
          onClose={setShowUpgradeModalFalse}
          message={upgradeMessage}
          title="Upgrade Required"
          feature="AI Resume Parsing"
        />
      )}
    </div>
  );
};

export default Upload;
