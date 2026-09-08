import { useState } from "react";
import {
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
  Code,
  Shield,
  Activity,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

export default function CyberDevTheme({ data = {}, isDarkMode = true, accentColor }) {
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

  const neonAccent = accentColor || "var(--pt-accent, #00ff88)";
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
      <section key="about" id="about" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
              [01] // SYSTEM_BIO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              &lt;About /&gt;
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-black/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_25px_rgba(0,255,136,0.05)] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono text-emerald-400/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LOG: PROFILE_SUMMARY_INITIATED</span>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-zinc-300 font-sans font-normal">
              {profile.about}
            </p>
          </div>
        </div>
      </section>
    ) : null,

    skills: sections.showSkills && hasItems(skills) ? (
      <section key="skills" id="skills" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="mb-10">
          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            [02] // MODULES_AND_CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            &lt;TechStackMatrix /&gt;
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <motion.div
              key={`${group.category}-${index}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-2xl border border-emerald-500/30 bg-zinc-950/80 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(0,255,136,0.03)] hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>{group.category || "General"}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">[{group.items?.length || 0} PKGS]</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(group.items || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-colors"
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
      <section key="projects" id="projects" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
              [03] // PRODUCTION_DEPLOYMENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              &lt;ShippedProjects /&gt;
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400/80">
            {allProjects.length} REPOSITORIES_ACTIVE
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <motion.article
              key={project.id || project.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProject(project)}
              className="group rounded-2xl border border-emerald-500/30 bg-zinc-950/90 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(0,255,136,0.03)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Neon top hairline */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    STATUS: DEPLOYED
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white font-mono group-hover:text-emerald-300 transition-colors leading-tight mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4 font-sans">
                  {project.description || project.shortDescription || project.impact}
                </p>
              </div>

              <div>
                {hasItems(project.technologies) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-900 text-zinc-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs font-mono font-bold text-emerald-400">
                  <span>EXEC: INSPECT_BUILD →</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    ) : null,

    experience: sections.showExperience && hasItems(experience) ? (
      <section key="experience" id="experience" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="mb-10">
          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            [04] // TIMELINE_RECORDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            &lt;WorkHistory /&gt;
          </h2>
        </div>

        <div className="space-y-6">
          {experience.map((item, index) => (
            <motion.div
              key={`${item.company}-${index}`}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
              className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/40 hover:border-emerald-400 transition-colors group"
            >
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-black border-2 border-emerald-400 shadow-[0_0_10px_rgba(0,255,136,0.6)]" />

              <div className="rounded-2xl border border-emerald-500/30 bg-zinc-950/80 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-black text-white font-mono leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                      @ {item.company}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 w-fit">
                      [{item.dateRange}]
                    </span>
                  )}
                </div>

                {hasItems(item.bullets) && (
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm text-zinc-300 font-sans">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono text-xs mt-1 shrink-0">&gt;&gt;</span>
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
      <section key="education" id="education" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="mb-10">
          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            [05] // ACADEMIC_METRICS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            &lt;Education /&gt;
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((item, index) => (
            <div
              key={`${item.institution}-${index}`}
              className="rounded-2xl border border-emerald-500/30 bg-zinc-950/80 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>[{item.dateRange || "COMPLETED"}]</span>
                </div>
                <h3 className="font-black text-base text-white font-mono">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm text-zinc-300 font-sans">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: sections.showCertifications && hasItems(certifications) ? (
      <section key="certifications" id="certifications" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="mb-10">
          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            [06] // VERIFIED_KEYS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            &lt;Certifications /&gt;
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl border border-emerald-500/30 bg-zinc-950/80 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>{item.issuer || "VERIFIED"}</span>
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
      <section key="achievements" id="achievements" className="scroll-mt-24 py-12 sm:py-16 border-t border-emerald-500/20">
        <div className="mb-10">
          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            [07] // SYSTEM_HONORS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            &lt;Achievements /&gt;
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-500/30 bg-zinc-950/80 p-5 text-sm text-zinc-300 font-sans flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 py-16 sm:py-24 border-t border-emerald-500/20">
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-zinc-950 p-8 sm:p-12 shadow-[0_0_40px_rgba(0,255,136,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-emerald-400/40 hidden sm:block">
            PORT: 443 // ENCRYPTED_SSL
          </div>

          <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase block mb-2">
            [08] // INITIATE_HANDSHAKE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-4">
            &lt;ContactChannel /&gt;
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mb-8 font-sans">
            Ready to deploy new systems or discuss high-impact software engineering roles? Open a direct communication channel below.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {profile.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.3)]"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{profile.email}</span>
              </button>
            )}

            {profile.phone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/40 bg-zinc-900 text-emerald-300 hover:bg-zinc-800 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/40 bg-zinc-900 text-emerald-300 hover:bg-zinc-800 font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD_RESUME.pdf</span>
              </a>
            )}
          </div>
        </div>
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-zinc-100 transition-colors duration-200 font-sans selection:bg-emerald-400 selection:text-black">
      {/* Background Matrix Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,136,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,136,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Hero Terminal Section */}
      <section id="hero" className="relative z-10 border-b border-emerald-500/20 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* Terminal Window Header */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-zinc-950/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,136,0.06)] overflow-hidden">
            <div className="h-10 bg-zinc-900/90 border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400 font-bold">
                root@{profile.name?.toLowerCase().replace(/\s+/g, "_") || "system"}:~ (zsh)
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <Activity className="w-3 h-3 animate-pulse" />
                <span className="hidden sm:inline">ONLINE</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                <div className="space-y-6">
                  <div className="font-mono text-xs sm:text-sm text-emerald-400/90">
                    $ echo "Initializing portfolio..."
                  </div>

                  <div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-mono tracking-tight leading-[1.08]">
                      {profile.name || "Software Developer"}
                    </h1>
                    <p className="mt-3 text-lg sm:text-2xl font-mono text-emerald-400 font-bold">
                      &gt; {profile.title || "Full Stack Engineer"}
                    </p>
                  </div>

                  {profile.tagline && (
                    <p className="max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-sans font-normal">
                      {profile.tagline}
                    </p>
                  )}

                  {/* Quick Shell Commands Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-black font-mono font-bold text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>SEND_MESSAGE</span>
                      </a>
                    )}

                    {actions.resumeDownloadUrl && (
                      <a
                        href={actions.resumeDownloadUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        onClick={actions.onResumeClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/40 bg-zinc-900 text-emerald-300 hover:bg-zinc-800 font-mono font-bold text-xs transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>RESUME.pdf</span>
                      </a>
                    )}

                    {profile.location && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 pl-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{profile.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Avatar Frame */}
                {profileImg && (
                  <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-emerald-400 shadow-[0_0_30px_rgba(0,255,136,0.2)] bg-black shrink-0 relative group">
                    <img
                      src={profileImg}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stream of Sections */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 space-y-4">
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
              className="bg-zinc-950 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(0,255,136,0.15)] p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                    EXEC: BUILD_SPEC_VIEW
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
                  <h4 className="text-xs font-mono uppercase text-emerald-400/80 font-bold mb-1">
                    &gt; DESCRIPTION
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {selectedProject.problem && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-400/80 font-bold mb-1">
                    &gt; PROBLEM_STATEMENT
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                    {selectedProject.problem}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-400/80 font-bold mb-1">
                    &gt; ARCHITECTURE_SOLUTION
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {selectedProject.impact && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-400/80 font-bold mb-1">
                    &gt; BENCHMARK_IMPACT
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                    {selectedProject.impact}
                  </p>
                </div>
              )}

              {hasItems(selectedProject.technologies) && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-400/80 font-bold mb-2">
                    &gt; STACK_DEPENDENCIES
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 text-black text-xs font-mono font-bold shadow-sm"
                  >
                    <span>OPEN_LIVE_DEMO</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.links?.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/40 bg-zinc-900 text-emerald-300 text-xs font-mono font-bold"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>SOURCE_REPO</span>
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
