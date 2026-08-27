import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Brain,
  RefreshCw,
  X,
} from "lucide-react";

export default function ATSResumeSelector({
  useCareerProfile,
  setUseCareerProfile,
  userResumes,
  loadingResumes,
  selectedResume,
  setSelectedResume,
  uploadedFile,
  setUploadedFile,
  handleFileUpload,
  analyzing,
  handleAnalyze,
  jobDescription,
}) {
  const canAnalyze =
    jobDescription.trim().length > 0 &&
    (useCareerProfile || selectedResume || uploadedFile);

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-7 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Select Resume Source
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Compare against Career Profile, a saved resume, or uploaded document
          </p>
        </div>
      </div>

      {/* Option 1: Master Career Profile */}
      <button
        type="button"
        onClick={() => {
          setUseCareerProfile(!useCareerProfile);
          if (!useCareerProfile) {
            setSelectedResume(null);
            setUploadedFile(null);
          }
        }}
        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
          useCareerProfile
            ? "bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600/80 shadow-sm"
            : "bg-gray-50/50 dark:bg-zinc-950/60 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-zinc-900"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              useCareerProfile
                ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                : "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Master Career Profile</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Recommended
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Analyze all verified experience, skills, and projects in your master hub
            </div>
          </div>
        </div>

        {useCareerProfile ? (
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 px-3 py-1 rounded-xl">
            Selected ✓
          </span>
        ) : (
          <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
            Click to use
          </span>
        )}
      </button>

      {/* Option 2: Saved Resume Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
          Or Select From Saved Resumes
        </label>
        {loadingResumes ? (
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-white/5">
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Loading your saved resumes...
            </p>
          </div>
        ) : userResumes.length > 0 ? (
          <select
            value={selectedResume || ""}
            onChange={(e) => {
              setSelectedResume(e.target.value);
              setUseCareerProfile(false);
              setUploadedFile(null);
            }}
            disabled={useCareerProfile}
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Choose from your saved resumes...</option>
            {userResumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.name} — {resume.contact?.name || "Target Resume"}
              </option>
            ))}
          </select>
        ) : (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No saved resumes yet. You can upload a PDF below.</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white dark:bg-zinc-900 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Or upload file
          </span>
        </div>
      </div>

      {/* Option 3: File Upload Dropzone */}
      <label
        className={`cursor-pointer block transition-all ${
          useCareerProfile ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="hidden"
          disabled={useCareerProfile}
        />
        <div className="border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500/60 rounded-2xl p-6 text-center bg-gray-50/40 dark:bg-zinc-950/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all">
          {uploadedFile ? (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    {(uploadedFile.size / 1024).toFixed(1)} KB • Click to replace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setUploadedFile(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-zinc-300">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200">
                Upload Resume File (PDF / DOCX)
              </p>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                Max file size 5MB • Instant offline parsing
              </p>
            </div>
          )}
        </div>
      </label>

      {/* Primary Analyze CTA Button */}
      <button
        onClick={handleAnalyze}
        disabled={analyzing || !canAnalyze}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
      >
        {analyzing ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Scanning ATS Keywords & Semantics...</span>
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            <span>Run Deep ATS Analysis</span>
          </>
        )}
      </button>
    </div>
  );
}
