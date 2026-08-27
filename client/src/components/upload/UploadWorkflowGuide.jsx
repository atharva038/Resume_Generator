import { Zap, Sparkles, CheckCircle2, Shield, Brain, Download, Cpu } from "lucide-react";

export function UploadWorkflowGuide() {
  const steps = [
    {
      title: "AI Text Extraction",
      desc: "Our AI model identifies dates, job titles, companies, and contact credentials.",
      icon: Cpu,
    },
    {
      title: "Skill & Section Structuring",
      desc: "Work experience bullet points and skill taxonomies are parsed into clean JSON schemas.",
      icon: Brain,
    },
    {
      title: "AI Enhancements & Tailoring",
      desc: "Instantly optimize phrasing, fix weak verbs, and tailor to job descriptions.",
      icon: Sparkles,
    },
    {
      title: "Export Recruiter-Ready PDF",
      desc: "Download an ATS-guaranteed, single-page or multi-page executive PDF.",
      icon: Download,
    },
  ];

  const features = [
    "Smart AI text extraction with 99.4% accuracy",
    "Automatic section categorization & chronology detection",
    "Clean, ATS-friendly typography and formatting",
    "Zero data sharing with third parties",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {/* Step by Step Flow */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-7 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              What Happens Next?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              The automated extraction pipeline
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50/60 dark:bg-zinc-950/60 border border-gray-200/60 dark:border-white/5"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Upload Here */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-7 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Why SmartNShine?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Built specifically for ATS passing rates
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-emerald-950 dark:text-emerald-200">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UploadSecurityNotice() {
  return (
    <div className="rounded-3xl p-4 sm:p-5 bg-white dark:bg-zinc-900/70 border border-gray-200/80 dark:border-white/[0.06] text-center shadow-xs">
      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
          <Shield className="w-4 h-4 text-blue-500" /> Privacy & Security Guarantee:
        </span>
        <span>
          All resume uploads are encrypted and processed securely. We never sell or share your data.
        </span>
      </p>
    </div>
  );
}
