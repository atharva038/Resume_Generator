import { useState } from "react";
import {
  Palette,
  Sparkles,
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
  ArrowUpRight,
  X,
  Layers,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

export default function CreativeTheme({ data = {}, isDarkMode = false, accentColor }) {
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

  const currentAccent = accentColor || "var(--pt-accent, #8b5cf6)";
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
      <section key="about" id="about" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
              Creative Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
              About &amp; Story
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg sm:text-xl leading-relaxed text-gray-700 dark:text-zinc-200 font-normal">
              {profile.about}
            </p>
            {profile.tagline && profile.tagline !== profile.about && (
              <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                "{profile.tagline}"
              </p>
            )}
          </div>
        </div>
      </section>
    ) : null,

    projects: sections.showProjects && hasItems(allProjects) ? (
      <section key="projects" id="projects" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
              Visual &amp; Digital Builds
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
              Selected Creations
            </h2>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
            {allProjects.length} Flagship Works
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project, idx) => (
            <motion.article
              key={project.id || project.title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedProject(project)}
              className="group rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 shadow-sm hover:border-purple-500 hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top gradient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/20">
                    Case 0{idx + 1}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight mb-3">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-6">
                  {project.description || project.shortDescription || project.impact}
                </p>
              </div>

              <div>
                {hasItems(project.technologies) && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>View Project Story</span>
                  <span>→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    ) : null,

    skills: sections.showSkills && hasItems(skills) ? (
      <section key="skills" id="skills" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            Toolkit &amp; Craft
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Creative Disciplines
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <div
              key={`${group.category}-${index}`}
              className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-black text-lg text-gray-950 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>{group.category || "Disciplines"}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(group.items || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    experience: sections.showExperience && hasItems(experience) ? (
      <section key="experience" id="experience" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Creative Experience
          </h2>
        </div>

        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={`${item.company}-${index}`}
              className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                    {item.company}
                  </p>
                </div>
                {item.dateRange && (
                  <span className="px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/20 w-fit">
                    {item.dateRange}
                  </span>
                )}
              </div>

              {hasItems(item.bullets) && (
                <ul className="mt-4 space-y-2.5 text-sm text-gray-600 dark:text-zinc-300">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-1" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    education: sections.showEducation && hasItems(education) ? (
      <section key="education" id="education" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Education
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {education.map((item, index) => (
            <div
              key={`${item.institution}-${index}`}
              className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 sm:p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-gray-950 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-base font-semibold text-purple-600 dark:text-purple-400">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {(item.gpa || item.grade || item.cgpa) && (
                  <div className="mt-2.5">
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                      CGPA / Grade: {item.gpa || item.grade || item.cgpa}
                    </span>
                  </div>
                )}
              </div>

              {item.dateRange && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500">
                  {item.dateRange}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: sections.showCertifications && hasItems(certifications) ? (
      <section key="certifications" id="certifications" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Certifications
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <Award className="w-4 h-4" />
                <span>{item.issuer || "Verified"}</span>
              </div>
              <h3 className="font-bold text-base text-gray-950 dark:text-white">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    achievements: sections.showAchievements && hasItems(achievements) ? (
      <section key="achievements" id="achievements" className="scroll-mt-24 py-16 sm:py-20 border-t border-purple-500/15">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Awards &amp; Recognition
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 text-sm text-gray-700 dark:text-zinc-300 font-medium flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 py-16 sm:py-24 border-t border-purple-500/15">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-white to-pink-500/10 dark:from-purple-950/50 dark:via-zinc-900 dark:to-zinc-950 p-8 sm:p-14 shadow-xl">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-2">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-4 leading-tight">
            Have a project in mind? Let's build it together.
          </h2>
          <p className="text-base text-gray-600 dark:text-zinc-300 max-w-xl mb-8">
            Always open to creative direction, UI/UX design, full-stack product builds, and creative consulting.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {profile.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-500/25"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{profile.email}</span>
              </button>
            )}

            {profile.phone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-purple-500" /> : <Phone className="w-4 h-4" />}
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
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
    <main className="min-h-screen bg-[#faf8fc] dark:bg-[#0c0a10] text-gray-950 dark:text-zinc-100 transition-colors duration-200 font-sans selection:bg-purple-600 selection:text-white">
      {/* Hero Section */}
      <section id="hero" className="border-b border-purple-500/15 bg-white dark:bg-zinc-900/40 pt-16 pb-20 sm:pt-24 sm:pb-32 relative overflow-hidden">
        {/* Background Ambient Aura Glow */}
        <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="space-y-6">
              {/* Creative Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-bold">
                <Wand2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Creative Design &amp; Digital Engineering</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.08]">
                  {profile.name || "Creator"}
                </h1>
                <p className="mt-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {profile.title || "UI/UX & Product Designer"}
                </p>
              </div>

              {profile.tagline && (
                <p className="max-w-2xl text-base sm:text-lg text-gray-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {profile.tagline}
                </p>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-purple-500/20"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Let's Talk</span>
                  </a>
                )}

                {actions.resumeDownloadUrl && (
                  <a
                    href={actions.resumeDownloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    onClick={actions.onResumeClick}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resume</span>
                  </a>
                )}

                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 pl-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    <span>{profile.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Avatar Frame */}
            {profileImg && (
              <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-white dark:bg-zinc-900 shrink-0">
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-zinc-700 shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Design &amp; Build Case Study
                  </span>
                  <h3 className="text-2xl font-black text-gray-950 dark:text-white">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedProject.description && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Overview
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {selectedProject.problem && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Design Challenge &amp; Problem
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.problem}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Crafted Solution &amp; UX
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {selectedProject.impact && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Outcomes &amp; Visual Impact
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.impact}
                  </p>
                </div>
              )}

              {hasItems(selectedProject.technologies) && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">
                    Tools &amp; Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Links */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center gap-3">
                {selectedProject.links?.live && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm"
                  >
                    <span>View Live Work</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.links?.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 text-xs font-bold"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
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
