import { TiltCard } from "../ui/be-ui-tilt-card";
import {
  Zap,
  Upload,
  Brain,
  Target,
  Globe2,
  Mic,
  UserCheck,
} from "lucide-react";

const corePillars = [
  {
    icon: Upload,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "1. AI Resume Extraction",
    desc: "Drop any existing PDF or DOCX file. Our AI instantly parses work history, skills, and education into an editable format.",
  },
  {
    icon: Brain,
    colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    title: "2. Bullet Point Rewriter",
    desc: "Generate high-impact action verbs, quantifiable metrics, and role-targeted achievements tailored for ATS scoring systems.",
  },
  {
    icon: Target,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "3. ATS Diagnostic Scanner",
    desc: "Receive instant compatibility percentages, semantic gap analysis, and missing keyword alerts before applying.",
  },
  {
    icon: Globe2,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "4. Live Web Portfolios",
    desc: "Turn your career milestones into a responsive, public personal website with customizable themes and shareable links.",
  },
  {
    icon: Mic,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    title: "5. Career Q&A Studio",
    desc: "Generate project-specific behavioral and technical mock interview questions with verified model answers.",
  },
  {
    icon: UserCheck,
    colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    title: "6. Master Profile Sync",
    desc: "Store all your verified projects and experience in one central database. Sync changes to multiple resumes with 1 click.",
  },
];

export default function CorePillarsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Complete Career Toolkit</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          One Workspace. Endless Opportunities.
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">
          Everything you need from your first draft to your final technical interview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
        {corePillars.map((pillar, idx) => {
          const IconComponent = pillar.icon;
          return (
            <TiltCard
              key={idx}
              max={18}
              glare={true}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-2xl transition-all h-full"
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${pillar.colorClass} flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
