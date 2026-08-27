import { Link } from "react-router-dom";
import { PlusCircle, ArrowRight, Sparkles } from "lucide-react";

export default function UploadActionOptions({
  onCreateBlank,
  uploading,
}) {
  return (
    <div className="space-y-6">
      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-gray-50/50 dark:bg-[#09090b] text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            Or Choose An Alternative
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option 1: Start from Scratch */}
        <button
          onClick={onCreateBlank}
          disabled={uploading}
          className="group text-left p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] hover:border-blue-500 dark:hover:border-blue-500/60 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <PlusCircle className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Start from Scratch
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Create a fresh resume starting from a blank ATS-compliant template.
            </p>
          </div>
        </button>

        {/* Option 2: Build with Career Profile */}
        <Link
          to="/career-profile"
          className="group text-left p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] hover:border-purple-500 dark:hover:border-purple-500/60 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Use Career Profile
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Hub
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Pull all verified experience, skills, and projects from your Master Hub.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
