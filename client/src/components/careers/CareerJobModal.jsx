import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CareerJobModal({ job, isOpen, onClose, onApply }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!job) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[88vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 overscroll-contain"
          >
            {/* Header (Fixed) */}
            <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/50 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {job.department}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {job.experience}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-zinc-900 dark:text-white tracking-tight">
                    {job.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                    title="Share position"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Meta Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div
              data-lenis-prevent="true"
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-7 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-light"
            >
              {/* Overview */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                  Role Overview
                </h3>
                <p>{job.overview}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
                  What You'll Do
                </h3>
                <ul className="space-y-2.5">
                  {job.responsibilities?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
                  What We're Looking For
                </h3>
                <ul className="space-y-2.5">
                  {job.requirements?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to Have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
                    Bonus / Nice to Have
                  </h3>
                  <ul className="space-y-2.5">
                    {job.niceToHave.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-500 dark:text-zinc-400">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech stack tags */}
              {job.tags && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2">
                    Key Areas & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Apply Sticky Bar */}
            <div className="p-4 sm:p-6 border-t border-zinc-100 dark:border-white/10 bg-zinc-50/90 dark:bg-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ready to shape modern careers?
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Applications reviewed directly by founders
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Close
                </button>
                <button
                  onClick={() => onApply(job)}
                  className="px-6 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-medium shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
