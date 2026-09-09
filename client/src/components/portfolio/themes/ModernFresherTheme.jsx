import { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  ExternalLink,
  Github,
  Mail,
  Phone,
  Download,
  Copy,
  Check,
  Briefcase,
  Award,
  ArrowUpRight,
  X,
  Code2,
  Rocket,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

export default function ModernFresherTheme({ data = {}, isDarkMode = false, accentColor }) {
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
  const primaryEducation = education?.[0];

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
      <section key="about" id="about" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
              Who I Am
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              About & Ambition
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-zinc-300 font-normal">
              {profile.about}
            </p>
            {profile.tagline && profile.tagline !== profile.about && (
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                "{profile.tagline}"
              </p>
            )}
          </div>
        </div>
      </section>
    ) : null,

    education: sections.showEducation && hasItems(education) ? (
      <section key="education" id="education" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            Academic Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Education & Degrees
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {education.map((item, index) => (
            <motion.div
              key={`${item.institution}-${index}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-3xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-gray-950 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm sm:text-base font-semibold text-sky-600 dark:text-sky-400">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {(item.gpa || item.grade || item.cgpa) && (
                  <div className="mt-2.5">
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      CGPA / Grade: {item.gpa || item.grade || item.cgpa}
                    </span>
                  </div>
                )}
              </div>

              {item.dateRange && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-zinc-400">
                  {item.dateRange}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    ) : null,

    projects: sections.showProjects && hasItems(allProjects) ? (
      <section key="projects" id="projects" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
              Hands-On Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              Featured Projects & Builds
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            {allProjects.length} Projects Completed
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project, idx) => (
            <motion.article
              key={project.id || project.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProject(project)}
              className="group rounded-3xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-sm hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 text-xs font-black flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                  {project.description || project.shortDescription || project.impact}
                </p>
              </div>

              <div>
                {hasItems(project.technologies) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Explore Project</span>
                  <span>→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    ) : null,

    skills: sections.showSkills && hasItems(skills) ? (
      <section key="skills" id="skills" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            Technical Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Skills & Knowledge Areas
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <div
              key={`${group.category}-${index}`}
              className="rounded-3xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-black text-base text-gray-950 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
                  {group.category || "Skills"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(group.items || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
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
      <section key="experience" id="experience" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            Professional Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Internships & Work
          </h2>
        </div>

        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={`${item.company}-${index}`}
              className="rounded-3xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white">
                    {item.title || item.role}
                  </h3>
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400">
                    {item.company}
                  </p>
                </div>
                {item.dateRange && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-400 w-fit">
                    {item.dateRange}
                  </span>
                )}
              </div>

              {hasItems(item.bullets) && (
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-zinc-300">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold shrink-0 mt-0.5">•</span>
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

    certifications: sections.showCertifications && hasItems(certifications) ? (
      <section key="certifications" id="certifications" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            Certifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Verified Credentials
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs text-gray-500 font-medium">{item.issuer || "Verified"}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-950 dark:text-white">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    achievements: sections.showAchievements && hasItems(achievements) ? (
      <section key="achievements" id="achievements" className="scroll-mt-24 py-12 sm:py-16 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            Recognitions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Achievements & Awards
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 text-sm text-gray-700 dark:text-zinc-300 font-medium flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 py-16 sm:py-24 border-t border-gray-200/80 dark:border-zinc-800/80">
        <div className="rounded-3xl border border-gray-200/90 dark:border-zinc-800 bg-gradient-to-br from-sky-500/10 via-white to-gray-50 dark:from-sky-950/40 dark:via-zinc-900 dark:to-zinc-950 p-8 sm:p-12 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight mb-4">
            Let's discuss opportunities.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-xl mb-8">
            I am actively looking for graduate opportunities, junior roles, and internships. Reach out via email or phone.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {profile.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-sky-500/20"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{profile.email}</span>
              </button>
            )}

            {profile.phone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Phone className="w-4 h-4" />}
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
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
    <main className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 transition-colors duration-200 font-sans selection:bg-sky-500 selection:text-white">
      {/* Hero Section */}
      <section id="hero" className="border-b border-gray-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div className="space-y-6">
              {/* Ready to start badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold">
                <Rocket className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Ready for Early Career &amp; Junior Roles</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.08]">
                  {profile.name || "Graduate"}
                </h1>
                <p className="mt-3 text-lg sm:text-2xl text-sky-600 dark:text-sky-400 font-bold">
                  {profile.title || "Aspiring Software Engineer"}
                </p>
              </div>

              {profile.tagline && (
                <p className="max-w-2xl text-base sm:text-lg text-gray-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {profile.tagline}
                </p>
              )}

              {/* Quick Contact & Resume Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-sky-500/20"
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </a>
                )}

                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 pl-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{profile.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Avatar Frame */}
            {profileImg && (
              <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-sky-500/30 shadow-2xl bg-gray-100 dark:bg-zinc-900 shrink-0">
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
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
                    Project Overview
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
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {selectedProject.problem && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    What Problem It Solves
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.problem}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Key Features &amp; Implementation
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {selectedProject.impact && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">
                    Learning &amp; Outcomes
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                    {selectedProject.impact}
                  </p>
                </div>
              )}

              {hasItems(selectedProject.technologies) && (
                <div>
                  <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm"
                  >
                    <span>Live Demo</span>
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
