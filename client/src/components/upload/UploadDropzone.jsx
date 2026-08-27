import {
  Upload as UploadIcon,
  FileText,
  RefreshCw,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

export default function UploadDropzone({
  getRootProps,
  getInputProps,
  isDragActive,
  uploading,
  error,
}) {
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]"
            : "border-gray-300 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500/60 bg-white dark:bg-zinc-900/90 shadow-sm"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 space-y-6 max-w-lg mx-auto">
          {/* Icon */}
          <div className="flex justify-center">
            {uploading ? (
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : isDragActive ? (
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce">
                <UploadIcon className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            )}
          </div>

          {/* Heading and descriptions */}
          {uploading ? (
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Parsing Resume with Neural AI...
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Extracting contact details, career history, and skill taxonomies
              </p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                Drop your resume file right here!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                We'll immediately begin parsing the contents
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Drag & Drop Your Resume Here
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                  or click anywhere to browse files from your computer
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-500/25 active:scale-95 text-xs sm:text-sm cursor-pointer"
                >
                  <UploadIcon className="w-4 h-4" />
                  <span>Choose Resume File</span>
                </button>
              </div>

              {/* Supported formats footer */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                <span className="font-semibold text-gray-700 dark:text-zinc-300">
                  Supported formats:
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800 font-mono font-bold text-gray-800 dark:text-zinc-200">
                  PDF
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800 font-mono font-bold text-gray-800 dark:text-zinc-200">
                  DOCX
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800 font-mono font-bold text-gray-800 dark:text-zinc-200">
                  DOC
                </span>
                <span className="text-gray-400 dark:text-zinc-600">• Max 5MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Upload Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
