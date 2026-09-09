import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  X,
  CheckCircle2,
} from "lucide-react";
import KineticFluidShader from "./KineticFluidShader";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

/**
 * KineticProjectItem
 * Viewport-anchored kinetic project showcase with subtle scroll perspective tilt and depth.
 */
function KineticProjectItem({
  project,
  index,
  total,
  onOpenModal,
}) {
  const itemRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 === 0 ? [-2, 0, 2] : [2, 0, -2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const yShift = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const rawImage = project?.image || project?.imageUrl || project?.coverImage || project?.images?.[0]?.url || "";
  const imageUrl = resolveImageUrl(rawImage);
  
  const title = project?.title || project?.name || "Project";
  const category = (project?.category || project?.type || "PROJECT").toUpperCase();
  const description = project?.description || project?.summary || project?.shortDescription || "";
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : typeof project?.technologies === "string"
    ? project.technologies.split(",").map((s) => s.trim())
    : project?.tags || project?.stack || [];
  const liveUrl = project?.liveUrl || project?.demoUrl || project?.link || project?.links?.live || "";
  const githubUrl = project?.githubUrl || project?.repoUrl || project?.github || project?.links?.github || "";

  const numLabel = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={itemRef}
      className="relative w-full flex items-center justify-center py-10 sm:py-14"
    >
      {/* Background Kinetic Connector Line */}
      <div className="kinetic-line-v left-1/2 -top-10 h-20 hidden lg:block" />

      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Project Image Viewport (Cols 1-7 or 6-12 based on index) */}
        <motion.div
          style={{ rotate, scale, y: yShift }}
          className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
        >
          <div
            onClick={() => onOpenModal(project)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-surface)] p-2.5 sm:p-3 shadow-2xl transition-all duration-500 hover:border-[var(--kn-accent)] hover:shadow-[var(--kn-accent-glow)]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[var(--kn-bg-subtle)] flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[var(--kn-bg-surface)] to-[var(--kn-bg-subtle)] border border-[var(--kn-border)]">
                  <span className="kn-mono text-3xl sm:text-4xl font-black text-[var(--kn-text-primary)] opacity-40 uppercase tracking-widest">
                    {title.slice(0, 3)}
                  </span>
                  <span className="text-xs font-mono text-[var(--kn-accent)] mt-2 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              )}
              
              {/* Subtle glass hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-mono font-medium text-white backdrop-blur-md">
                  <span>EXPAND CASE STUDY</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Bottom Meta Stripe */}
            <div className="mt-3 flex items-center justify-between px-2 py-1 text-[11px] font-mono text-[var(--kn-text-muted)]">
              <span>PROJECT / {numLabel}</span>
              <span className="text-[var(--kn-accent)] font-semibold">{category}</span>
            </div>
          </div>
        </motion.div>

        {/* Project Details Typography (Cols 8-12) */}
        <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"} space-y-4`}>
          
          <div className="flex items-center gap-3">
            <span className="kn-mono text-xs font-bold text-[var(--kn-accent)]">
              {numLabel} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-[var(--kn-border-strong)]" />
            <span className="kn-meta-tag">{category}</span>
          </div>

          <h3
            onClick={() => onOpenModal(project)}
            className="kn-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--kn-text-primary)] hover:text-[var(--kn-accent)] transition-colors cursor-pointer leading-tight"
          >
            {title}
          </h3>

          <p className="text-sm sm:text-base leading-relaxed text-[var(--kn-text-secondary)]">
            {description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {technologies.map((tech, i) => (
              <span
                key={i}
                className="rounded-md border border-[var(--kn-border)] bg-[var(--kn-bg-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--kn-text-secondary)] transition-colors hover:border-[var(--kn-accent-border)]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4 pt-3">
            <button
              onClick={() => onOpenModal(project)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--kn-text-primary)] px-5 py-2.5 text-xs font-mono font-medium text-[var(--kn-bg)] transition-all hover:bg-[var(--kn-accent)] hover:text-white cursor-pointer"
            >
              <span>EXPLORE CASE</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--kn-text-secondary)] hover:text-[var(--kn-accent)] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>LIVE DEMO</span>
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--kn-text-secondary)] hover:text-[var(--kn-accent)] transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>SOURCE</span>
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

/**
 * KineticProjects
 * Complete Section 01 / WORK with atmospheric fluid shader background and interactive modal.
 */
export default function KineticProjects({
  projects = [],
  isDark = false,
  accentColor = "#2563eb",
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || projects.length === 0) {
    return null;
  }

  const displayProjects = projects;

  return (
    <section
      id="kinetic-work-section"
      className="relative min-h-screen w-full overflow-hidden bg-[var(--kn-bg)] pt-12 pb-24"
    >
      {/* Generative Shader Environment 01 */}
      <KineticFluidShader isDark={isDark} accentColor={accentColor} />

      {/* Kinetic Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--kn-border)] pb-6">
          <div>
            <span className="kn-meta-tag block mb-2 text-[var(--kn-accent)] font-semibold">
              01 / WORK
            </span>
            <h2 className="kn-headline text-4xl sm:text-6xl font-bold tracking-tight text-[var(--kn-text-primary)]">
              PROJECTS
            </h2>
          </div>
        </div>
      </div>

      {/* Continuous Visual Project List */}
      <div className="relative z-10 space-y-8">
        {displayProjects.map((project, idx) => (
          <KineticProjectItem
            key={idx}
            project={project}
            index={idx}
            total={displayProjects.length}
            onOpenModal={setSelectedProject}
          />
        ))}
      </div>

      {/* Interactive Project Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg)] p-6 sm:p-8 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[var(--kn-border)] pb-4">
                <div>
                  <span className="kn-meta-tag text-[var(--kn-accent)]">
                    {selectedProject?.category || "CASE STUDY"}
                  </span>
                  <h3 className="kn-display text-2xl sm:text-4xl font-bold text-[var(--kn-text-primary)] mt-1">
                    {selectedProject?.title || selectedProject?.name}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full p-2 text-[var(--kn-text-muted)] hover:bg-[var(--kn-bg-subtle)] hover:text-[var(--kn-text-primary)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Media */}
              <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/10 border border-[var(--kn-border)]">
                <img
                  src={
                    resolveImageUrl(
                      selectedProject?.image ||
                        selectedProject?.imageUrl ||
                        selectedProject?.coverImage
                    ) ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt={selectedProject?.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="mt-6 space-y-4">
                <h4 className="kn-mono text-xs font-semibold uppercase tracking-wider text-[var(--kn-text-muted)]">
                  OVERVIEW & ARCHITECTURE
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--kn-text-secondary)]">
                  {selectedProject?.description ||
                    "Engineered end-to-end with high responsiveness, spatial micro-interactions, and high-performance animation lifecycles."}
                </p>

                {/* Highlights */}
                {selectedProject?.highlights && (
                  <div className="space-y-2 pt-2">
                    <h5 className="kn-mono text-xs font-semibold text-[var(--kn-text-muted)] uppercase">
                      KEY DELIVERABLES
                    </h5>
                    <ul className="space-y-1 text-sm text-[var(--kn-text-secondary)]">
                      {selectedProject.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[var(--kn-accent)] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Badges */}
                <div className="pt-4 border-t border-[var(--kn-border)]">
                  <span className="kn-meta-tag block mb-2">TECHNOLOGY STACK</span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      selectedProject?.technologies ||
                      selectedProject?.tags ||
                      selectedProject?.stack || ["React", "TypeScript"]
                    ).map((t, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--kn-text-primary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Links */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--kn-border)]">
                  {selectedProject?.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--kn-border-strong)] px-4 py-2 text-xs font-mono text-[var(--kn-text-primary)] hover:border-[var(--kn-accent)]"
                    >
                      <Github className="h-4 w-4" />
                      <span>CODE REPOSITORY</span>
                    </a>
                  )}

                  {selectedProject?.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--kn-accent)] px-5 py-2 text-xs font-mono font-medium text-white shadow-lg hover:opacity-90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>VISIT LIVE APP</span>
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
