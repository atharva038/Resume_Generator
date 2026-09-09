import { useState } from "react";
import {
  Code2,
  Terminal,
  Cpu,
  MapPin,
  ExternalLink,
  Github,
  Mail,
  Phone,
  Download,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ArrowUpRight,
  X,
  Layers,
  Activity,
  Boxes,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

export default function TechPortfolioTheme({ data = {}, isDarkMode = true, accentColor }) {
  const {
    profile = {},
    settings = {},
    actions = {},
    sections = {},
    sectionOrder = [],
    links = [],
    skills = [],
    projects = [],
    featuredProjects = [],
    experience = [],
    education = [],
    certifications = [],
    achievements = [],
    customSections = [],
  } = data || {};

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const profileImg = resolveImageUrl(profile.profileImage || profile.heroImage || "");
  const allProjects = hasItems(featuredProjects) ? featuredProjects : projects;

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (profile.phone) {
      navigator.clipboard.writeText(profile.phone);
      setCopiedPhone(true);
      toast.success("Phone copied to clipboard!");
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const sectionBlocks = {
    about: sections.showAbout && profile.about ? (
      <section key="about" id="about" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              // Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              About &amp; Stack
            </h2>
          </div>
          <div className="rounded-3xl border border-cyan-500/20 bg-zinc-950/80 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.04)]">
            <p className="text-base sm:text-lg leading-relaxed text-zinc-300 font-normal">
              {profile.about}
            </p>
            {profile.tagline && profile.tagline !== profile.about && (
              <p className="text-sm font-mono text-cyan-400">
                &gt; {profile.tagline}
              </p>
            )}
          </div>
        </div>
      </section>
    ) : null,

    skills: sections.showSkills && hasItems(skills) ? (
      <section key="skills" id="skills" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            // Core Stacks
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            Technical Arsenal
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <motion.div
              key={`${group.category}-${index}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-3xl border border-cyan-500/20 bg-zinc-950/80 backdrop-blur-md p-6 shadow-sm hover:border-cyan-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
                    <Boxes className="w-4 h-4" />
                    <span>{group.category || "Domain"}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{group.items?.length || 0} items</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(group.items || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    ) : null,

    projects: sections.showProjects && hasItems(allProjects) ? (
      <section key="projects" id="projects" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              // Engineering Builds
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              Featured Software Projects
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400/80">
            {allProjects.length} Repositories
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <motion.article
              key={project.id || project.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProject(project)}
              className="group rounded-3xl border border-cyan-500/20 bg-zinc-950/90 backdrop-blur-md p-6 shadow-sm hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Active Deploy
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white font-mono group-hover:text-cyan-300 transition-colors leading-tight mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                  {project.description || project.shortDescription || project.impact}
                </p>
              </div>

              <div>
                {hasItems(project.technologies) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-900 text-zinc-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs font-mono font-bold text-cyan-400">
                  <span>Explore Stack &amp; Impact →</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    ) : null,

    experience: sections.showExperience && hasItems(experience) ? (
      <section key="experience" id="experience" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            // Track Record
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            Work Experience
          </h2>
        </div>

        <div className="space-y-6">
          {experience.map((item, index) => (
            <motion.div
              key={`${item.company}-${index}`}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
              className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 hover:border-cyan-400 transition-colors group"
            >
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-black border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

              <div className="rounded-3xl border border-cyan-500/20 bg-zinc-950/80 p-6 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-black text-white font-mono leading-tight">
                      {item.title || item.role}
                    </h3>
                    <p className="text-sm font-mono font-bold text-cyan-400 mt-0.5">
                      {item.company}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 w-fit">
                      {item.dateRange}
                    </span>
                  )}
                </div>

                {hasItems(item.bullets) && (
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm text-zinc-300">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono text-xs mt-1 shrink-0">▹</span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    ) : null,

    education: sections.showEducation && hasItems(education) ? (
      <section key="education" id="education" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            // Credentials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            Academic Background
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((item, index) => (
            <div
              key={`${item.institution}-${index}`}
              className="rounded-3xl border border-cyan-500/20 bg-zinc-950/80 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2 font-mono text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>{item.dateRange || "Completed"}</span>
                </div>
                <h3 className="font-black text-base text-white font-mono">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm text-zinc-300">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {(item.gpa || item.grade || item.cgpa) && (
                  <div className="mt-2.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-bold">
                      CGPA: {item.gpa || item.grade || item.cgpa}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: sections.showCertifications && hasItems(certifications) ? (
      <section key="certifications" id="certifications" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            // Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            Certifications
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl border border-cyan-500/20 bg-zinc-950/80 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                <Award className="w-4 h-4" />
                <span>{item.issuer || "Verified"}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white font-mono">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    achievements: sections.showAchievements && hasItems(achievements) ? (
      <section key="achievements" id="achievements" className="scroll-mt-24 py-14 sm:py-18 border-t border-cyan-500/15">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            // Honors
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            Achievements
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-cyan-500/20 bg-zinc-950/80 p-5 text-sm text-zinc-300 flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 py-16 sm:py-24 border-t border-cyan-500/15">
        <div className="rounded-3xl border-2 border-cyan-500/30 bg-zinc-950 p-8 sm:p-12 shadow-[0_0_40px_rgba(6,182,212,0.06)] relative overflow-hidden">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            // Connect
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-4">
            Let's build reliable software.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mb-8">
            Available for full-stack engineering, cloud architecture, and technical consulting.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {profile.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{profile.email}</span>
              </button>
            )}

            {profile.phone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-zinc-900 text-cyan-300 hover:bg-zinc-800 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                <span>{profile.phone}</span>
              </button>
            )}

            {actions.resumeDownloadUrl && (
              <a
                href={actions.resumeDownloadUrl}
                download
                target="_blank"
                rel="noreferrer"
                onClick={actions.onResumeClick}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-zinc-900 text-cyan-300 hover:bg-zinc-800 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Resume (PDF)</span>
              </a>
            )}
          </div>
        </div>
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-[#06080d] text-zinc-100 transition-colors duration-200 font-sans selection:bg-cyan-400 selection:text-black">
      {/* Hero Section */}
      <section id="hero" className="border-b border-cyan-500/15 bg-zinc-900/40 pt-16 pb-20 sm:pt-24 sm:pb-28 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Available for Engineering Roles &amp; Consulting</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-mono tracking-tight leading-[1.08]">
                  {profile.name || "Developer"}
                </h1>
                <p className="mt-3 text-lg sm:text-2xl font-mono text-cyan-400 font-bold">
                  {profile.title || "Full Stack Software Engineer"}
                </p>
              </div>

              {profile.tagline && (
                <p className="max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                  {profile.tagline}
                </p>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Me</span>
                  </a>
                )}

                {actions.resumeDownloadUrl && (
                  <a
                    href={actions.resumeDownloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    onClick={actions.onResumeClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-zinc-900 text-cyan-300 hover:bg-zinc-800 font-mono font-bold text-xs transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resume</span>
                  </a>
                )}

                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 pl-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Avatar Frame */}
            {profileImg && (
              <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-black shrink-0">
                <img
                  src={profileImg}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Stream of Sections */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 space-y-4">
        {sectionOrder.map((sec) => sectionBlocks[sec])}
      </div>

      {/* Deep Project Inspection Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[90] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    Build Inspection
                  </span>
                  <h3 className="text-2xl font-black text-white font-mono">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedProject.description && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400/80 font-bold mb-1">
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {selectedProject.problem && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400/80 font-bold mb-1">
                    Engineering Challenge
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {selectedProject.problem}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400/80 font-bold mb-1">
                    Implemented Architecture
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {selectedProject.impact && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400/80 font-bold mb-1">
                    System Impact &amp; Metrics
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {selectedProject.impact}
                  </p>
                </div>
              )}

              {hasItems(selectedProject.technologies) && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400/80 font-bold mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Links */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                {selectedProject.links?.live && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-black text-xs font-mono font-bold shadow-sm"
                  >
                    <span>Open Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.links?.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-500/40 bg-zinc-900 text-cyan-300 text-xs font-mono font-bold"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
