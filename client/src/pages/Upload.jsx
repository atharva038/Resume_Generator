import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import {resumeAPI} from "../services/api";
import {parseValidationErrors} from "../utils/errorHandler";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await resumeAPI.upload(formData);

      // Navigate to editor with parsed data
      navigate("/editor", {state: {resumeData: response.data.data}});
    } catch (err) {
      console.error("Upload error:", err);
      setError(parseValidationErrors(err));
    } finally {
      setUploading(false);
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

    navigate("/editor", {state: {resumeData: blankResumeData}});
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                AI-Powered Resume Parser
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upload Your Resume
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload a PDF or DOCX file and let our AI transform it into an
              ATS-optimized, recruiter-ready resume in minutes
            </p>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center cursor-pointer
              transition-all duration-300 backdrop-blur-sm
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-2xl"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 hover:shadow-xl"
              }
              ${uploading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />

            {/* Animated Background Effect */}
            {!uploading && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
              </div>
            )}

            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                {uploading ? (
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                ) : isDragActive ? (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                    <UploadIcon className="w-10 h-10 text-white" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>

              {/* Text */}
              {uploading ? (
                <div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Processing Your Resume...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Our AI is analyzing your resume structure
                  </p>
                </div>
              ) : isDragActive ? (
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  Drop your resume here to get started! 🎯
                </p>
              ) : (
                <>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Drag & Drop Your Resume Here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    or click to browse your files
                  </p>

                  {/* Upload Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <UploadIcon className="w-5 h-5" />
                    Choose File
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Supported formats:</span>{" "}
                      PDF, DOCX, DOC
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-semibold">Maximum size:</span> 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg dark:bg-red-900/20 dark:border-red-500 animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm">
                      ✕
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300 mb-1">
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
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-semibold">
                OR
              </span>
            </div>
          </div>

          {/* Start from Scratch Button */}
          <div className="text-center">
            <button
              onClick={createBlankResume}
              disabled={uploading}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Start from Scratch</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Create a new resume from a blank template
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {/* What Happens Next */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </span>
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Features */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
              🔒 <span className="font-semibold">Your privacy matters.</span>{" "}
              All uploads are encrypted and processed securely. We never share
              your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
