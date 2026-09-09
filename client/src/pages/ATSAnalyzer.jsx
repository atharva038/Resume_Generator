import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "@/components/common/SEO";
import { resumeAPI } from "@/api/api";
import { useToggle } from "@/hooks";
import { handleApiError } from "@/utils/errorHandler";
import {
  ATSAnalyzerBanner,
  ATSJobDescriptionInput,
  ATSResumeSelector,
  ATSScoreHero,
  ATSResultsBreakdown,
  ATSEmptyState,
  ATSLoadingState,
} from "@/components/atsAnalyzer";

export default function ATSAnalyzer() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [useCareerProfile, setUseCareerProfile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, , setAnalyzingTrue, setAnalyzingFalse] = useToggle(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, , , setLoadingResumesFalse] = useToggle(true);
  const [showAllImprovements, setShowAllImprovements] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    recommendations: true,
    strengths: false,
    keywords: false,
  });

  // Load user's resumes on mount
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await resumeAPI.list();
        setUserResumes(response.data?.resumes || []);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoadingResumesFalse();
      }
    };
    loadResumes();
  }, [setLoadingResumesFalse]);

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
      setUseCareerProfile(false);
      toast.success(`Attached ${file.name}`);
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

    if (!useCareerProfile && !selectedResume && !uploadedFile) {
      toast.error("Please select a resume, use Career Profile, or upload a file", {
        icon: "📁",
        duration: 3000,
      });
      return;
    }

    setAnalyzingTrue();
    setAnalysisResult(null);
    setShowAllImprovements(false);
    setExpandedSections({
      recommendations: true,
      strengths: false,
      keywords: false,
    });

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);

      if (useCareerProfile) {
        formData.append("useCareerProfile", "true");
      } else if (uploadedFile) {
        formData.append("resumeFile", uploadedFile);
      } else if (selectedResume) {
        formData.append("resumeId", selectedResume);
      }

      const response = await resumeAPI.analyzeResume(formData);
      setAnalysisResult(response.data);
      toast.success("Analysis completed successfully!", {
        icon: "✅",
        duration: 2500,
      });
    } catch (error) {
      handleApiError(error, "Failed to analyze resume", toast);
    } finally {
      setAnalyzingFalse();
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEditRecommendation = (recommendation) => {
    if (!selectedResume) {
      toast.error("Select a saved resume first to edit these recommendations.");
      return;
    }

    localStorage.setItem("currentResumeId", selectedResume);
    navigate("/editor", { state: { atsRecommendation: recommendation } });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      <SEO
        title="ATS Resume Analyzer - Check Resume Compatibility | SmartNShine"
        description="Analyze your resume against job descriptions with AI-powered ATS compatibility checker. Get instant feedback and optimization suggestions to pass applicant tracking systems."
        keywords="ATS analyzer, resume checker, ATS compatibility, resume scanner, job match analyzer, applicant tracking system, resume optimization"
        url="https://www.smartnshine.app/ats-analyzer"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Ambient Top Hero Banner */}
        <ATSAnalyzerBanner />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs and focused improvement actions */}
          <div className="lg:col-span-6 space-y-6">
            <ATSJobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />

            <ATSResumeSelector
              useCareerProfile={useCareerProfile}
              setUseCareerProfile={setUseCareerProfile}
              userResumes={userResumes}
              loadingResumes={loadingResumes}
              selectedResume={selectedResume}
              setSelectedResume={setSelectedResume}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleFileUpload={handleFileUpload}
              analyzing={analyzing}
              handleAnalyze={handleAnalyze}
              jobDescription={jobDescription}
            />

            {analysisResult && (
              <section className="space-y-4" aria-labelledby="resume-improvements-title">
                <div className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                  <div>
                    <h2 id="resume-improvements-title" className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Resume Improvements
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                      Choose a specific action to update your resume faster.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Next steps
                  </span>
                </div>
                <ATSResultsBreakdown
                  analysisResult={analysisResult}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  showAllImprovements={showAllImprovements}
                  setShowAllImprovements={setShowAllImprovements}
                  onEditResume={handleEditRecommendation}
                  showStrengths={false}
                />
              </section>
            )}
          </div>

          {/* Right Column: Dynamic Results & Diagnostics */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            {!analysisResult && !analyzing && <ATSEmptyState />}

            {analyzing && <ATSLoadingState />}

            {analysisResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Full Analysis</h2>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Your overall ATS score and verified resume strengths.</p>
                </div>
                <ATSScoreHero analysisResult={analysisResult} />

                <ATSResultsBreakdown
                  analysisResult={analysisResult}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  showAllImprovements={showAllImprovements}
                  setShowAllImprovements={setShowAllImprovements}
                  onEditResume={handleEditRecommendation}
                  showRecommendations={false}
                  showKeywords={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
