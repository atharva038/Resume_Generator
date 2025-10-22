import {useState, useEffect} from "react";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {resumeAPI} from "../services/api";

const ATSAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Load user's resumes on component mount
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await resumeAPI.list();
        setUserResumes(response.data.resumes);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setUploadedFile(file);
      setSelectedResume(null);
    } else {
      alert("Please upload a PDF or DOCX file");
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }

    if (!selectedResume && !uploadedFile) {
      alert("Please select a resume or upload a file");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);

      if (uploadedFile) {
        formData.append("resumeFile", uploadedFile);
      } else if (selectedResume) {
        formData.append("resumeId", selectedResume);
      }

      const response = await resumeAPI.analyzeResume(formData);
      setAnalysisResult(response.data);
    } catch (error) {
      alert(
        "Analysis failed: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 50) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ATS Job Match Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your resume and paste a job description to get AI-powered
            insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Section */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="card p-6">
              <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                📋 Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...&#10;&#10;Include:&#10;- Required skills&#10;- Qualifications&#10;- Responsibilities&#10;- Experience requirements"
                className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {jobDescription.length} characters
              </p>
            </div>

            {/* Resume Selection */}
            <div className="card p-6">
              <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                📄 Select Resume
              </label>

              {/* Existing Resumes Dropdown */}
              {loadingResumes ? (
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Loading your resumes...
                </p>
              ) : userResumes.length > 0 ? (
                <select
                  value={selectedResume || ""}
                  onChange={(e) => {
                    setSelectedResume(e.target.value);
                    setUploadedFile(null);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
                >
                  <option value="">Choose from your saved resumes...</option>
                  {userResumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.name} - {resume.contact?.name || "Unnamed Resume"}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No saved resumes found. Upload a file instead.
                </p>
              )}

              <div className="relative">
                <div className="text-center text-gray-500 dark:text-gray-400 mb-4">
                  OR
                </div>
              </div>

              {/* File Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  {uploadedFile ? (
                    <div>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        ✓ {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Upload Resume (PDF/DOCX)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Click to browse or drag & drop
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                !jobDescription.trim() ||
                (!selectedResume && !uploadedFile)
              }
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="inline-block w-5 h-5 mr-2" />
                  Analyze Job Match
                </>
              )}
            </button>
          </div>

          {/* Right Side - Analysis Results */}
          <div>
            {!analysisResult && !analyzing && (
              <div className="card p-12 text-center">
                <FileText className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter a job description and select your resume to get started
                </p>
              </div>
            )}

            {analyzing && (
              <div className="card p-12 text-center">
                <div className="animate-pulse">
                  <Sparkles className="w-24 h-24 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Analyzing Your Resume...
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    AI is comparing keywords, skills, and experience
                  </p>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6 animate-fadeIn">
                {/* Match Score Card */}
                <div
                  className={`card p-8 text-center ${getScoreBgColor(
                    analysisResult.match_score
                  )}`}
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    ATS Match Score
                  </h3>
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          80 *
                          (1 - analysisResult.match_score / 100)
                        }`}
                        className={getScoreColor(analysisResult.match_score)}
                        style={{transition: "stroke-dashoffset 1s ease-in-out"}}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`text-5xl font-bold ${getScoreColor(
                            analysisResult.match_score
                          )}`}
                        >
                          {analysisResult.match_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Match
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {analysisResult.eligible ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Strong Candidate
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          Needs Improvement
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Strengths */}
                {analysisResult.strengths &&
                  analysisResult.strengths.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {strength}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Missing Keywords */}
                {analysisResult.missing_keywords &&
                  analysisResult.missing_keywords.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missing_keywords.map(
                          (keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* AI Improvement Tips */}
                {analysisResult.improvements &&
                  analysisResult.improvements.length > 0 && (
                    <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        AI Improvement Tips
                      </h3>
                      <ul className="space-y-3">
                        {analysisResult.improvements.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">💡</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button className="btn-primary w-full mt-4">
                        <Sparkles className="inline-block w-4 h-4 mr-2" />
                        Apply AI Suggestions to Resume
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer;
