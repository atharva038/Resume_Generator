import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Award,
} from "lucide-react";
import {resumeAPI} from "@/api/api";
import {JobMatchAnalyzer} from "@/components/features";
import {useToggle} from "@/hooks";
import {handleApiError} from "@/utils/errorHandler";

const ATSAnalyzer = () => {
  const [activeTab, setActiveTab] = useState("ats"); // "ats" or "ml"
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, toggleAnalyzing, setAnalyzingTrue, setAnalyzingFalse] =
    useToggle(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [
    loadingResumes,
    toggleLoadingResumes,
    setLoadingResumesTrue,
    setLoadingResumesFalse,
  ] = useToggle(true);
  const [selectedResumeData, setSelectedResumeData] = useState(null);
  const [
    loadingResumeData,
    toggleLoadingResumeData,
    setLoadingResumeDataTrue,
    setLoadingResumeDataFalse,
  ] = useToggle(false);

  // Load user's resumes on component mount
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await resumeAPI.list();
        setUserResumes(response.data.resumes);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoadingResumesFalse();
      }
    };
    loadResumes();
  }, [setLoadingResumesFalse]);

  // Load selected resume data for ML analysis
  useEffect(() => {
    const loadResumeData = async () => {
      if (selectedResume && activeTab === "ml") {
        setLoadingResumeDataTrue();
        try {
          const response = await resumeAPI.getById(selectedResume);
          // Backend returns resume directly, not wrapped in {data: {resume: ...}}
          const resumeData = response.data;
          console.log("Loaded resume data:", resumeData);
          setSelectedResumeData(resumeData);
          toast.success(
            `Loaded: ${resumeData.title || resumeData.name || "Resume"}`,
            {
              icon: "📄",
              duration: 2000,
            }
          );
        } catch (error) {
          console.error("Failed to load resume data:", error);
          toast.error("Failed to load resume data");
          setSelectedResumeData(null);
        } finally {
          setLoadingResumeDataFalse();
        }
      } else if (!selectedResume) {
        setSelectedResumeData(null);
      }
    };
    loadResumeData();
  }, [selectedResume, activeTab]);

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
      toast.error("Please upload a PDF or DOCX file", {
        icon: "📄",
        duration: 3000,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description", {
        icon: "📝",
        duration: 3000,
      });
      return;
    }

    if (!selectedResume && !uploadedFile) {
      toast.error("Please select a resume or upload a file", {
        icon: "📁",
        duration: 3000,
      });
      return;
    }

    setAnalyzingTrue();
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
      console.log("📊 ATS Analysis Response:", response.data);
      setAnalysisResult(response.data);
      toast.success("Analysis completed successfully!", {
        icon: "✅",
        duration: 2000,
      });
    } catch (error) {
      handleApiError(error, "Failed to analyze resume", toast);
    } finally {
      setAnalyzingFalse();
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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">
            ATS Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your resume and paste a job description to get AI-powered ATS
            compatibility insights
          </p>
        </div>

        {/* Tab Switcher */}
        {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE - ML Job Match Tab */}
        {/* <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab("ats")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "ats"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-gray-900 dark:text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Target className="w-5 h-5" />
              ATS Analysis
            </button>
            <button
              onClick={() => setActiveTab("ml")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "ml"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 dark:text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              AI Job Match
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                NEW
              </span>
            </button>
          </div>
        </div> */}

        {/* Content based on active tab */}
        {activeTab === "ats" ? (
          // Original ATS Analysis content
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Left Side - Input Section */}
            <div className="space-y-6">
              {/* Job Description */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <label className="text-lg font-bold text-gray-900 dark:text-white">
                    Job Description
                  </label>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here...&#10;&#10;Include:&#10;• Required skills and technologies&#10;• Qualifications and experience&#10;• Job responsibilities&#10;• Nice-to-have skills"
                  className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {jobDescription.length} characters
                  </p>
                  {jobDescription.length > 100 && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Good length
                    </span>
                  )}
                </div>
              </div>

              {/* Resume Selection */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <label className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Resume
                  </label>
                </div>

                {/* Existing Resumes Dropdown */}
                {loadingResumes ? (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                    <div className="w-5 h-5 border-2 border-gray-200 dark:border-zinc-800 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading your resumes...
                    </p>
                  </div>
                ) : userResumes.length > 0 ? (
                  <select
                    value={selectedResume || ""}
                    onChange={(e) => {
                      setSelectedResume(e.target.value);
                      setUploadedFile(null);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors mb-4"
                  >
                    <option value="">Choose from your saved resumes...</option>
                    {userResumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.name} -{" "}
                        {resume.contact?.name || "Unnamed Resume"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                    <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      No saved resumes found. Upload a file below.
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-zinc-950 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      OR
                    </span>
                  </div>
                </div>

                {/* File Upload */}
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            Upload Resume File
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PDF or DOCX, max 5MB
                          </p>
                        </div>
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
                className="w-full py-4 px-6 bg-primary-600 text-gray-900 dark:text-white font-bold text-lg rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6" />
                    Analyze Job Match
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Analysis Results */}
            <div className="lg:sticky lg:top-8 h-fit">
              {!analysisResult && !analyzing && (
                <div className="bg-white dark:bg-zinc-950 rounded-xl p-12 text-center border border-gray-200 dark:border-zinc-800">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Target className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter a job description and select your resume to get
                    AI-powered insights
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-primary-500" />
                      <span>Instant keyword matching</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span>AI-powered suggestions</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                      <span>ATS compatibility score</span>
                    </div>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="bg-white dark:bg-zinc-950 rounded-xl p-12 text-center border border-gray-200 dark:border-zinc-800">
                  <div className="w-12 h-12 mx-auto mb-6 border-2 border-gray-200 dark:border-zinc-800 border-t-primary-600 rounded-full animate-spin"></div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Analyzing Your Resume...
                  </h3>
                  <p className="text-gray-400">
                    AI is comparing keywords, skills, and experience
                  </p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Match Score Card */}
                  <div className="bg-white dark:bg-zinc-950 rounded-xl p-8 border border-gray-200 dark:border-zinc-800">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-6 text-white">
                        ATS Match Score
                      </h3>
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="16"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="url(#gradient)"
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 80}`}
                            strokeDashoffset={`${
                              2 *
                              Math.PI *
                              80 *
                              (1 - analysisResult.match_score / 100)
                            }`}
                            strokeLinecap="round"
                            style={{
                              transition: "stroke-dashoffset 1.5s ease-in-out",
                            }}
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor={
                                  analysisResult.match_score >= 75
                                    ? "#10b981"
                                    : analysisResult.match_score >= 50
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                              />
                              <stop
                                offset="100%"
                                stopColor={
                                  analysisResult.match_score >= 75
                                    ? "#059669"
                                    : analysisResult.match_score >= 50
                                      ? "#d97706"
                                      : "#dc2626"
                                }
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className={`text-5xl font-bold ${getScoreColor(
                                analysisResult.match_score || 0
                              )}`}
                            >
                              {analysisResult.match_score || 0}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                              Match Rate
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                          analysisResult.eligible
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        }`}
                      >
                        {analysisResult.eligible ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Strong Match
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            Room for Improvement
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  {analysisResult.strengths &&
                    analysisResult.strengths.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                            Your Strengths
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {analysisResult.strengths.map((strength, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-3 bg-black/30 rounded-lg"
                            >
                              <div className="flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400 mt-0.5">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <span className="text-gray-800 dark:text-gray-200 font-medium">
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
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300">
                            Missing Keywords
                          </h3>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                          Add these keywords to improve your match score:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missing_keywords.map(
                            (keyword, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-black text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium border border-orange-300 dark:border-orange-700"
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
                      <div className="bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            AI Improvement Tips
                          </h3>
                        </div>
                        <ul className="space-y-3 mb-6">
                          {analysisResult.improvements.map((tip, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-4 bg-black rounded-lg border border-gray-200 dark:border-zinc-800"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-0.5">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-800 dark:text-gray-200 font-medium">
                                {tip}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button className="w-full py-3 px-6 bg-primary-600 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Apply AI Suggestions to Resume
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        ) : null}
        {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE - ML Job Match Content */}
        {/* ) : (
          // AI Job Match Analysis content
          <div className="max-w-7xl mx-auto">
            {loadingResumeData ? (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl p-12 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Loading Resume Data...
                </h3>
                <p className="text-gray-400">
                  Please wait while we prepare your resume for analysis
                </p>
              </div>
            ) : !selectedResumeData ? (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl p-8 text-center">
                <Brain className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Select a Resume to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose one of your saved resumes to perform ML-powered job
                  matching
                </p>
                {userResumes.length > 0 ? (
                  <select
                    value={selectedResume || ""}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="max-w-md mx-auto px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="">Select a resume...</option>
                    {userResumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.title || `${resume.name}'s Resume`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-400">
                    <p className="mb-4">
                      You don't have any saved resumes yet.
                    </p>
                    <a
                      href="/upload"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      Create Your First Resume
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <JobMatchAnalyzer resumeData={selectedResumeData} />
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ATSAnalyzer;
