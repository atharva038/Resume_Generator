import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import {resumeAPI} from "../services/api";

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
      setError(
        err.response?.data?.error || "Failed to upload and parse resume"
      );
    } finally {
      setUploading(false);
    }
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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Upload Your Resume
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload a PDF or DOCX file and let AI rebuild it into an ATS-optimized
          resume
        </p>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-primary-400 bg-white"
            }
            ${uploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="text-6xl mb-4">
            {uploading ? "⏳" : isDragActive ? "📥" : "📄"}
          </div>

          {uploading ? (
            <p className="text-lg font-medium text-gray-700">
              Processing your resume...
            </p>
          ) : isDragActive ? (
            <p className="text-lg font-medium text-primary-600">
              Drop your resume here
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <p className="text-sm text-gray-400">
                Supported formats: PDF, DOCX (max 5MB)
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        <div className="mt-8 card p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            What happens next?
          </h3>
          <ol className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">1.</span>
              <span>
                AI extracts text from your resume and structures it into
                sections
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">2.</span>
              <span>
                You'll be taken to the editor where you can review and edit each
                section
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">3.</span>
              <span>
                Use the "Enhance" button to optimize any section with AI
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">4.</span>
              <span>
                Preview and download your ATS-friendly resume as a PDF
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Upload;
