import React from "react";
import { Star } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE-2 @ Amazon",
    initials: "PS",
    color: "bg-purple-500",
    stars: 5,
    quote: "Went from 3% callback rate to 40% in two weeks. The STAR bullet generator is genuinely magic — it said things about my work I didn't know how to say myself.",
  },
  {
    name: "Marcus Chen",
    role: "Full Stack Eng @ Stripe",
    initials: "MC",
    color: "bg-blue-500",
    stars: 5,
    quote: "The ATS keyword analyzer caught 11 missing terms from the Stripe JD. I added them, resubmitted, and got a recruiter call the next morning. Unreal.",
  },
  {
    name: "Aisha Patel",
    role: "ML Engineer @ Anthropic",
    initials: "AP",
    color: "bg-emerald-500",
    stars: 5,
    quote: "I used the AI mock interview the night before my Anthropic call. It asked the exact same behavioral questions. I walked in completely prepared.",
  },
  {
    name: "Jordan Lee",
    role: "DevOps @ Netflix",
    initials: "JL",
    color: "bg-orange-500",
    stars: 5,
    quote: "Exported my portfolio in under 10 minutes. My manager found it on Google and forwarded it internally. Got fast-tracked to the senior engineering loop.",
  },
  {
    name: "Ravi Kiran",
    role: "Cloud SRE @ Google",
    initials: "RK",
    color: "bg-cyan-500",
    stars: 5,
    quote: "The ImpactPro template is legitimately beautiful. Recruiters at Google specifically complimented the format before the interview even started.",
  },
  {
    name: "Sofia Moreau",
    role: "Frontend Eng @ Figma",
    initials: "SM",
    color: "bg-rose-500",
    stars: 5,
    quote: "Went from bootcamp grad to Figma offer in 4 months. The One Master Profile feature saved me hours — I tailored 30 job applications from a single source.",
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { isDarkMode } = useDarkMode();

  return (
    <section className={"relative py-24 px-6 sm:px-10 lg:px-16 overflow-hidden transition-colors duration-300 " + (isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#f8f8f6] text-slate-900")}>
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px] bg-purple-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className={"inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wider uppercase " + (isDarkMode ? "bg-zinc-800/80 border-zinc-700/80 text-zinc-300" : "bg-white border-zinc-200 text-zinc-600")}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Engineers Love SmartNShine
          </div>
          <h2 className={"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight " + (isDarkMode ? "text-white" : "text-slate-900")}>
            Real engineers. Real offers.
          </h2>
          <p className={"text-sm font-normal leading-relaxed " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>
            Join thousands of engineers who used SmartNShine to land top-tier roles.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={"rounded-3xl border p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:shadow-xl " + (isDarkMode ? "bg-[#0f0f1a] border-zinc-800/80" : "bg-white border-zinc-100 shadow-sm")}
            >
              <Stars count={t.stars} />
              <p className={"text-sm font-normal leading-relaxed flex-1 " + (isDarkMode ? "text-zinc-300" : "text-slate-600")}>
                {t.quote}
              </p>
              <div className={"flex items-center gap-3 pt-2 mt-auto border-t " + (isDarkMode ? "border-zinc-800" : "border-zinc-100")}>
                <div className={"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 " + t.color}>
                  {t.initials}
                </div>
                <div>
                  <div className={"text-sm font-semibold " + (isDarkMode ? "text-white" : "text-slate-900")}>{t.name}</div>
                  <div className={"text-xs font-normal " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
