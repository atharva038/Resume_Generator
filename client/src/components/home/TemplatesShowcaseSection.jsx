import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Palette, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// High-res template IDs for hero fan
const heroTemplates = [
  { id: "impact-pro", rotate: -10, x: -90, y: 15, zIndex: 10 },
  { id: "strategic-leader", rotate: -3, x: -30, y: -5, zIndex: 20 },
  { id: "modern", rotate: 3, x: 30, y: -5, zIndex: 30 },
  { id: "structured-photo", rotate: 10, x: 90, y: 15, zIndex: 40 },
];

const allTemplates = [
  "classic",
  "creative2",
  "github-style",
  "impact-pro",
  "minimal",
  "modern",
  "professional",
  "professional2",
  "strategic-leader",
  "structured-photo",
  "tech",
];

export default function TemplatesShowcaseSection() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="templates" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 3D Fanning Stack Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5 dark:from-zinc-900/60 dark:to-zinc-950/80 border border-gray-200 dark:border-white/10 p-8 sm:p-12 overflow-hidden relative">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              Precision Document Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              11 Enterprise ATS-Certified Resume Formats
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 leading-relaxed">
              Engineered with zero tables, single-column fallback hierarchies, and recruiter-tested typography to guarantee 100% parseability across Greenhouse, Workday, Taleo, and Lever.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform"
              >
                <span>Browse All 11 Templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3D Interactive Floating Template Stack */}
          <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {heroTemplates.map((t, idx) => (
                <motion.div
                  key={t.id}
                  className="absolute w-[180px] sm:w-[220px] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-xl dark:shadow-2xl transition-all duration-500 cursor-pointer"
                  initial={{
                    rotateZ: t.rotate,
                    x: t.x,
                    y: t.y,
                  }}
                  animate={{
                    rotateZ: t.rotate,
                    x: t.x,
                    y: t.y,
                    zIndex: t.zIndex,
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: t.y - 20,
                    zIndex: 50,
                    rotateZ: 0,
                  }}
                >
                  <img
                    src={`/templates/${t.id}.png`}
                    alt={`Template ${t.id}`}
                    className="w-full h-auto block object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Live Template Gallery
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Crafted for readability by both applicant tracking algorithms and senior recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
      >
        {allTemplates.map((tid, idx) => (
          <div
            key={`${tid}-${idx}`}
            className="w-[260px] sm:w-[280px] shrink-0 snap-start group"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-sm hover:shadow-md transition-all">
              <img
                src={`/templates/${tid}.png`}
                alt={tid}
                className="w-full h-[360px] object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-xs">
                <Link
                  to={`/editor?template=${tid}`}
                  className="px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <p className="mt-2 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 capitalize">
              {tid.replace("-", " ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
