import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

/**
 * KineticExperience
 * Clean vertical experience timeline with scroll-linked kinetic connecting lines and animated nodes.
 */
export default function KineticExperience({
  experience = [],
}) {
  if (!experience || experience.length === 0) {
    return null;
  }

  const displayExperience = experience;

  return (
    <section
      id="kinetic-experience-section"
      className="relative w-full overflow-hidden bg-[var(--kn-bg)] py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--kn-border)] pb-6 mb-16">
          <div>
            <span className="kn-meta-tag block mb-2 text-[var(--kn-accent)] font-semibold">
              02 / TRAJECTORY
            </span>
            <h2 className="kn-headline text-4xl sm:text-6xl font-bold tracking-tight text-[var(--kn-text-primary)]">
              EXPERIENCE
            </h2>
          </div>
        </div>

        {/* Vertical Timeline with Kinetic Spine */}
        <div className="relative pl-6 sm:pl-10 space-y-12">
          
          {/* Continuous Kinetic Spine Line */}
          <div className="absolute left-2 sm:left-3.5 top-3 bottom-3 w-[1px] bg-gradient-to-b from-[var(--kn-accent)] via-[var(--kn-border-strong)] to-transparent" />

          {displayExperience.map((item, idx) => {
            const role = item.role || item.position || item.title || "Software Engineer";
            const company = item.company || item.organization || item.employer || "Company";
            const period = item.period || item.dates || item.duration || "2024";
            const location = item.location || "";
            const desc = item.description || item.summary || "";
            const highlights = item.highlights || item.achievements || [];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Node Indicator */}
                <div className="absolute -left-[30px] sm:-left-[39px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--kn-border-strong)] bg-[var(--kn-bg)] transition-all duration-300 group-hover:border-[var(--kn-accent)] group-hover:scale-125">
                  <div className="h-2 w-2 rounded-full bg-[var(--kn-accent)]" />
                </div>

                {/* Timeline Card */}
                <div className="rounded-2xl border border-[var(--kn-border)] bg-[var(--kn-bg-surface)] p-6 sm:p-8 transition-all duration-300 hover:border-[var(--kn-border-strong)] hover:shadow-xl">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--kn-border)] pb-4">
                    <div>
                      <span className="kn-meta-tag text-[var(--kn-accent)]">
                        {period}
                      </span>
                      <h3 className="kn-display text-2xl sm:text-3xl font-bold text-[var(--kn-text-primary)] mt-1">
                        {role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-[var(--kn-text-secondary)] mt-1">
                        <span className="font-semibold text-[var(--kn-text-primary)]">
                          {company}
                        </span>
                        {location && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[var(--kn-accent)]" />
                              {location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {desc && (
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--kn-text-secondary)]">
                      {desc}
                    </p>
                  )}

                  {highlights && highlights.length > 0 && (
                    <div className="mt-4 space-y-2 pt-2">
                      {highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--kn-text-secondary)]">
                          <CheckCircle2 className="h-4 w-4 text-[var(--kn-accent)] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
