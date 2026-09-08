import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sun,
  Moon,
  Menu,
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  ChevronUp,
  Check,
  Copy,
  Layers,
  Code,
  FolderGit2,
  Terminal,
  Quote,
  ShieldCheck,
  Cpu,
  Palette,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/neomorphic-theme.css";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

/* Social Icon Resolver */
const resolveSocialIcon = (type = "", name = "") => {
  const query = `${type} ${name}`.toLowerCase();
  if (query.includes("git")) return Github;
  if (query.includes("link")) return Linkedin;
  if (query.includes("twit") || query.includes(" x")) return Twitter;
  if (query.includes("mail")) return Mail;
  return ExternalLink;
};

export default function NeomorphicTheme({
  data = {},
  isDarkMode: propDarkMode,
  toggleDarkMode: propToggleDarkMode,
  accentColor: propAccentColor,
}) {
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const isDark = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const toggleDark =
    propToggleDarkMode || (() => setLocalDarkMode((prev) => !prev));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState("all");
  const [pressedSkill, setPressedSkill] = useState(null);

  // 1. Data Destructuring & Safe Fallbacks
  const {
    profile = {},
    sections = {},
    skills: rawSkills = [],
    projects: rawProjects = [],
    experience: rawExperience = [],
    education: rawEducation = [],
    certifications: rawCertifications = [],
    achievements: rawAchievements = [],
    customSections: rawCustomSections = [],
    links: rawLinks = [],
    actions = {},
    themeAccent,
  } = data || {};

  // 2. Profile resolution
  const name = profile?.name || "Professional Portfolio";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SN";
  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const rawTagline = profile?.tagline || "";
  const role = rawTitle || (rawTagline.length <= 45 ? rawTagline : "Full-Stack Engineer");
  const bio = profile?.about || profile?.bio || profile?.summary || rawTagline || "";
  const location = profile?.location || data?.contact?.location || "";
  const email = profile?.email || data?.contact?.email || "";
  const phone =
    profile?.phone ||
    profile?.mobile ||
    profile?.contactNumber ||
    profile?.phoneNumber ||
    data?.contact?.phone ||
    "";
  const profileImage = resolveImageUrl(profile?.profileImage || profile?.heroImage || "");
  const resumeUrl = actions?.resumeDownloadUrl || profile?.resumeUrl || "";
  const availabilityStatus =
    profile?.availabilityStatus ||
    (profile?.isAvailable !== false ? "Available for select opportunities" : "");
  const headline =
    profile?.headline ||
    profile?.heroHeadline ||
    "Building digital experiences with intent.";

  // 3. Normalized Collections
  const projects = Array.isArray(rawProjects) ? rawProjects : [];
  const experience = Array.isArray(rawExperience) ? rawExperience : [];
  const education = Array.isArray(rawEducation) ? rawEducation : [];
  const certifications = Array.isArray(rawCertifications) ? rawCertifications : [];
  const achievements = Array.isArray(rawAchievements) ? rawAchievements : [];
  const customSections = Array.isArray(rawCustomSections) ? rawCustomSections : [];
  const links = Array.isArray(rawLinks) ? rawLinks : [];

  // 4. Normalized Skills
  const categorizedSkills = Array.isArray(rawSkills)
    ? rawSkills.map((categoryGroup, index) => {
        if (typeof categoryGroup === "string") {
          return {
            id: `cat-${index}`,
            category: "Core Technologies",
            items: [categoryGroup],
          };
        }
        return {
          id: categoryGroup?.id || `cat-${index}`,
          category: categoryGroup?.category || "Technical Stack",
          items: Array.isArray(categoryGroup?.items)
            ? categoryGroup.items
            : typeof categoryGroup?.skills === "string"
            ? categoryGroup.skills.split(",").map((s) => s.trim())
            : [],
        };
      })
    : [];

  const allSkillCategories = [
    "all",
    ...new Set(categorizedSkills.map((c) => c.category).filter(Boolean)),
  ];

  const filteredSkills =
    activeSkillCategory === "all"
      ? categorizedSkills
      : categorizedSkills.filter((c) => c.category === activeSkillCategory);

  // 5. Computed Stats
  const totalProjects = projects.length || 6;
  const yearsExperience = experience.length >= 2 ? `${experience.length * 2}+` : "4+";
  const totalSkillsCount = categorizedSkills.reduce(
    (acc, curr) => acc + (curr.items?.length || 0),
    0
  ) || 12;

  // Handlers
  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    toast.success("Phone number copied to clipboard");
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = ["hero", "about", "work", "skills", "experience", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "about", label: "About", num: "01" },
    { id: "work", label: "Work", num: "02" },
    { id: "skills", label: "Skills", num: "03" },
    { id: "experience", label: "Experience", num: "04" },
    { id: "contact", label: "Contact", num: "05" },
  ];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`neomorphic-theme w-full overflow-x-hidden min-h-screen ${
        isDark ? "dark-mode" : "light-mode"
      }`}
      style={{
        "--neo-gold": propAccentColor || themeAccent || (isDark ? "#e6be58" : "#b89047"),
      }}
    >
      {/* =========================================================================
          1. NAVIGATION: Tactile Control Panel Strip
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-all py-3.5 px-4 sm:px-8 border-b border-[var(--neo-border-dark)]/40">
        <div className="neo-container flex items-center justify-between gap-4">
          {/* Logo / Monogram Control */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="neo-btn flex items-center gap-3 px-3.5 py-1.5 rounded-2xl group"
          >
            <div className="w-8 h-8 rounded-xl neo-inset-sm flex items-center justify-center font-bold text-xs neo-accent-gold tracking-wider">
              {initials}
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:inline-block text-[var(--neo-text-primary)]">
              {name}
            </span>
          </a>

          {/* Center Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl neo-inset-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "neo-raised-sm neo-accent-gold shadow-md font-bold"
                      : "text-[var(--neo-text-secondary)] hover:text-[var(--neo-text-primary)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLed"
                      className="w-1.5 h-1.5 rounded-full bg-[var(--neo-gold)] neo-led-active shadow-[0_0_6px_var(--neo-gold)] shrink-0"
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Physical Theme Toggle & CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Ultra-Smooth Physical Neumorphic Rocker Switch */}
            <button
              onClick={toggleDark}
              className="neo-switch-track w-14 h-8 p-1 flex items-center cursor-pointer select-none shrink-0"
              aria-label="Toggle Theme Mode"
              title={isDark ? "Switch to Daylight Mode" : "Switch to Midnight Dark"}
            >
              <motion.div
                className="neo-switch-thumb w-6 h-6 rounded-full flex items-center justify-center text-xs"
                animate={{
                  x: isDark ? 24 : 0,
                  rotate: isDark ? 360 : 0,
                }}
                transition={{
                  type: "tween",
                  ease: [0.16, 1, 0.3, 1],
                  duration: 0.35,
                }}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-3.5 h-3.5 text-[var(--neo-gold)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-3.5 h-3.5 text-[var(--neo-gold)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

            {/* Resume / CTA button */}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0"
              >
                <Download className="w-3.5 h-3.5 neo-accent-gold" />
                <span>Resume</span>
              </a>
            )}

            <button
              onClick={() => scrollToSection("contact")}
              className="neo-btn-gold hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="neo-btn lg:hidden p-2 rounded-xl cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--neo-text-primary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--neo-text-primary)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden neo-panel mt-3 p-4 rounded-3xl flex flex-col gap-2 max-w-lg mx-auto"
            >
              {["about", "work", "skills", "experience", "contact"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className="neo-btn text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-[var(--neo-text-primary)] capitalize"
                >
                  {sec}
                </button>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 neo-accent-gold" />
                  <span>Download Resume PDF</span>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          2. HERO SECTION: Tactile Controls & Editorial Presence
          ========================================================================= */}
      <section id="hero" className="py-12 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="neo-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Statement & Tactile Panel */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Main Headline */}
              <h1 className="neo-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-[var(--neo-text-primary)] mb-6 leading-[1.08]">
                {headline}
              </h1>

              {/* Personal Bio Description */}
              <p className="text-base sm:text-lg text-[var(--neo-text-secondary)] font-normal leading-relaxed max-w-2xl mb-8">
                {bio ||
                  `Hi, I'm ${name} — an engineer crafting high-performance digital products, resilient distributed systems, and tactile human interfaces.`}
              </p>

              {/* Embedded Physical Control Area */}
              <div className="neo-raised p-4 sm:p-5 rounded-3xl w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {/* Status Indicator */}
                {availabilityStatus && (
                  <div className="neo-inset-sm p-3.5 rounded-2xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 neo-led-active shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--neo-text-muted)] font-bold">
                        STATUS
                      </p>
                      <p className="text-xs sm:text-sm font-semibold truncate text-[var(--neo-text-primary)]">
                        {availabilityStatus}
                      </p>
                    </div>
                  </div>
                )}

                {/* Role Pill */}
                {role && (
                  <div className="neo-inset-sm p-3.5 rounded-2xl flex items-center gap-3">
                    <Briefcase className="w-4 h-4 neo-accent-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--neo-text-muted)] font-bold">
                        ROLE
                      </p>
                      <p className="text-xs sm:text-sm font-semibold truncate text-[var(--neo-text-primary)]">
                        {role}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location Badge */}
                {location && (
                  <div className="neo-inset-sm p-3.5 rounded-2xl flex items-center gap-3">
                    <MapPin className="w-4 h-4 neo-accent-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--neo-text-muted)] font-bold">
                        LOCATION
                      </p>
                      <p className="text-xs sm:text-sm font-semibold truncate text-[var(--neo-text-primary)]">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Projects Stat */}
                <div className="neo-inset-sm p-3.5 rounded-2xl flex items-center gap-3">
                  <FolderGit2 className="w-4 h-4 neo-accent-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--neo-text-muted)] font-bold">
                      PROJECTS
                    </p>
                    <p className="text-xs sm:text-sm font-semibold truncate text-[var(--neo-text-primary)]">
                      {totalProjects}+ Completed
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection("work")}
                  className="neo-btn flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--neo-text-primary)]"
                >
                  <Layers className="w-4 h-4 neo-accent-gold" />
                  <span>View Projects</span>
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="neo-btn-gold flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Physical Raised Profile Module */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="neo-raised p-5 sm:p-6 rounded-[2.5rem] w-full max-w-md relative group">
                {/* Sunken Inset Viewport Frame */}
                <div className="neo-inset-deep p-3 sm:p-4 rounded-[2rem] aspect-[4/5] overflow-hidden relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[1.5rem] bg-[var(--neo-surface)] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-2xl neo-inset-sm flex items-center justify-center neo-accent-gold text-2xl font-bold mb-4">
                        {initials}
                      </div>
                      <p className="font-semibold text-base text-[var(--neo-text-primary)]">
                        {name}
                      </p>
                      {role && (
                        <p className="text-xs text-[var(--neo-text-secondary)] mt-1">
                          {role}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. STATISTICS: Dashboard-Style Tactile Digital Meters
          ========================================================================= */}
      <section className="py-12 relative">
        <div className="neo-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                number: totalProjects.toString().padStart(2, "0"),
                label: "FEATURED PROJECTS",
                sub: "Production grade",
              },
              {
                number: yearsExperience,
                label: "YEARS BUILDING",
                sub: "Systems engineering",
              },
              {
                number: totalSkillsCount.toString().padStart(2, "0"),
                label: "CORE TECHNOLOGIES",
                sub: "Modern stack",
              },
              {
                number: categorizedSkills.length.toString().padStart(2, "0"),
                label: "SKILL DOMAINS",
                sub: "Full-stack breadth",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="neo-raised p-6 rounded-3xl flex flex-col justify-between group hover:translate-y-[-2px] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="neo-mono text-[10px] uppercase tracking-widest text-[var(--neo-text-muted)] font-bold">
                    0{idx + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[var(--neo-gold)]" />
                </div>
                <div>
                  <p className="neo-display text-3xl sm:text-4xl lg:text-5xl font-bold neo-accent-gold mb-1">
                    {stat.number}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--neo-text-primary)]">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-[var(--neo-text-secondary)] mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. ABOUT SECTION: Editorial Statement + Tactile Panels
          ========================================================================= */}
      {sections?.showAbout !== false && (
        <section id="about" className="py-20 sm:py-28 relative">
          <div className="neo-container">
            <div className="neo-raised p-8 sm:p-12 lg:p-16 rounded-[3rem]">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)]" />
                <span className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                  ABOUT ME
                </span>
              </div>

              <h2 className="neo-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--neo-text-primary)] leading-tight mb-8">
                {headline}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
                <div className="lg:col-span-12">
                  <p className="text-base sm:text-lg text-[var(--neo-text-secondary)] leading-relaxed mb-6 font-normal">
                    {bio ||
                      "My approach centers around intentional simplicity, clean domain separation, and responsive design. Every button, interaction, and database query is crafted with absolute purpose."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          5. PROJECT SHOWCASE: Raised Physical Modules & Inset Frames
          ========================================================================= */}
      {sections?.showProjects !== false && projects.length > 0 && (
        <section id="work" className="py-20 sm:py-28 relative">
          <div className="neo-container">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)]" />
                  <span className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                    PORTFOLIO
                  </span>
                </div>
                <h2 className="neo-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--neo-text-primary)]">
                  Selected Work
                </h2>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {projects.map((project, idx) => {
                const projTitle = project?.title || project?.name || `Project ${idx + 1}`;
                const projDesc =
                  project?.description ||
                  project?.summary ||
                  project?.shortDescription ||
                  "";
                const projImage = resolveImageUrl(
                  project?.image || project?.thumbnail || project?.images?.[0]?.url || ""
                );
                const projTags = Array.isArray(project?.technologies)
                  ? project.technologies
                  : typeof project?.technologies === "string"
                  ? project.technologies.split(",").map((t) => t.trim())
                  : Array.isArray(project?.tags)
                  ? project.tags
                  : [];
                const liveUrl =
                  project?.links?.live ||
                  project?.liveUrl ||
                  project?.projectUrl ||
                  project?.demoUrl ||
                  project?.websiteUrl ||
                  project?.website ||
                  project?.link ||
                  project?.url ||
                  "";
                const githubUrl =
                  project?.links?.github ||
                  project?.githubUrl ||
                  project?.repoUrl ||
                  project?.repo ||
                  project?.github ||
                  project?.sourceCode ||
                  "";

                return (
                  <motion.div
                    key={project?.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="neo-raised p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-between group hover:translate-y-[-4px] transition-all"
                  >
                    <div>
                      {/* Deep Inset Image Frame */}
                      <div className="neo-inset-deep p-3 sm:p-4 rounded-3xl aspect-[16/10] overflow-hidden mb-6 relative group/img">
                        {projImage ? (
                          <img
                            src={projImage}
                            alt={projTitle}
                            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover/img:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full rounded-2xl bg-[var(--neo-surface)] flex flex-col items-center justify-center p-6 text-center">
                            <FolderGit2 className="w-12 h-12 neo-accent-gold mb-3" />
                            <p className="font-bold text-sm text-[var(--neo-text-primary)]">
                              {projTitle}
                            </p>
                          </div>
                        )}

                        {/* Top Module Index Badge */}
                        <div className="absolute top-6 left-6 neo-raised px-3 py-1.5 rounded-xl text-[10px] neo-mono font-bold uppercase tracking-wider neo-accent-gold">
                          0{idx + 1}
                        </div>

                        {/* Direct Live Link Corner Icon on Image */}
                        {liveUrl && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-6 right-6 neo-raised p-2 rounded-xl text-[var(--neo-text-primary)] hover:neo-accent-gold shadow-md transition-transform hover:scale-110"
                            aria-label="Open Live Demo"
                            title="Open Live Demo"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Project Meta & Title */}
                      <h3 className="neo-display text-2xl sm:text-3xl font-bold text-[var(--neo-text-primary)] mb-3">
                        {projTitle}
                      </h3>

                      {projDesc && (
                        <p className="text-sm text-[var(--neo-text-secondary)] leading-relaxed mb-6">
                          {projDesc}
                        </p>
                      )}

                      {/* Tech Chips (Pressed Inset Pills) */}
                      {projTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {projTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="neo-inset-sm px-3 py-1 rounded-xl text-[11px] font-semibold text-[var(--neo-text-secondary)] neo-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--neo-border-dark)]">
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="neo-btn-gold flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="neo-btn-gold flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider"
                        >
                          <span>View Details</span>
                        </button>
                      )}

                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="neo-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-[var(--neo-text-primary)]"
                          aria-label="View Source Code"
                          title="View GitHub Repository"
                        >
                          <Github className="w-4 h-4 neo-accent-gold" />
                          <span className="hidden sm:inline">Source</span>
                        </a>
                      )}

                      {liveUrl && (
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="neo-btn px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-[var(--neo-text-secondary)] hover:text-[var(--neo-text-primary)]"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. SKILLS SECTION: Physical Control-Board Matrix
          ========================================================================= */}
      {sections?.showSkills !== false && categorizedSkills.length > 0 && (
        <section id="skills" className="py-20 sm:py-28 relative">
          <div className="neo-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)]" />
                  <span className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                    SKILLS & CAPABILITIES
                  </span>
                </div>
                <h2 className="neo-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--neo-text-primary)]">
                  Technical Expertise
                </h2>
              </div>

              {/* Category Filter Keys */}
              {allSkillCategories.length > 2 && (
                <div className="neo-inset p-1.5 rounded-2xl flex flex-wrap gap-1">
                  {allSkillCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveSkillCategory(cat)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        activeSkillCategory === cat
                          ? "neo-raised neo-accent-gold"
                          : "text-[var(--neo-text-muted)] hover:text-[var(--neo-text-primary)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Physical Matrix of Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSkills.map((categoryGroup, idx) => (
                <div
                  key={categoryGroup.id || idx}
                  className="neo-raised p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--neo-border-dark)]">
                      <h3 className="neo-mono text-xs uppercase tracking-widest font-bold neo-accent-gold flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        {categoryGroup.category}
                      </h3>
                      <span className="neo-mono text-[10px] text-[var(--neo-text-muted)] font-bold">
                        {categoryGroup.items?.length || 0} SKILLS
                      </span>
                    </div>

                    {/* Interactive Keys */}
                    <div className="flex flex-wrap gap-3">
                      {categoryGroup.items?.map((skill, sIdx) => {
                        const isPressed = pressedSkill === `${idx}-${sIdx}`;
                        return (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setPressedSkill(`${idx}-${sIdx}`);
                              setTimeout(() => setPressedSkill(null), 350);
                            }}
                            className={`neo-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide text-[var(--neo-text-primary)] transition-all ${
                              isPressed ? "active" : ""
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neo-gold)]" />
                              {skill}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. EXPERIENCE: Neumorphic Timeline with Recessed Track
          ========================================================================= */}
      {sections?.showExperience !== false && experience.length > 0 && (
        <section id="experience" className="py-20 sm:py-28 relative">
          <div className="neo-container">
            <div className="max-w-3xl mb-16">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)]" />
                <span className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                  EXPERIENCE
                </span>
              </div>
              <h2 className="neo-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--neo-text-primary)]">
                Career History
              </h2>
            </div>

            {/* Timeline with Grooved Channel */}
            <div className="relative pl-6 sm:pl-10 space-y-12">
              {/* Recessed Vertical Line */}
              <div className="absolute top-4 bottom-4 left-2 sm:left-3 neo-groove-v" />

              {experience.map((exp, idx) => {
                const roleTitle = exp?.title || exp?.role || "Software Engineer";
                const companyName = exp?.company || "Company";
                const period = exp?.period || (exp?.startDate ? `${exp.startDate} - ${exp.endDate || (exp.current ? "Present" : "")}` : "");
                const expLocation = exp?.location || "";
                const bullets = Array.isArray(exp?.bullets)
                  ? exp.bullets
                  : typeof exp?.description === "string"
                  ? exp.description.split("\n").filter(Boolean)
                  : [];

                return (
                  <motion.div
                    key={exp?.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    {/* Recessed Node Indicator */}
                    <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-6 h-6 rounded-full neo-inset-sm flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)] neo-led-active" />
                    </div>

                    {/* Raised Module Card */}
                    <div className="neo-raised p-6 sm:p-8 rounded-[2rem]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="neo-display text-xl sm:text-2xl font-bold text-[var(--neo-text-primary)]">
                            {roleTitle}
                          </h3>
                          <p className="text-sm font-semibold neo-accent-gold mt-0.5">
                            {companyName} {expLocation ? `• ${expLocation}` : ""}
                          </p>
                        </div>
                        {period && (
                          <span className="neo-mono text-xs font-semibold px-3 py-1.5 rounded-xl neo-inset-sm text-[var(--neo-text-secondary)] self-start sm:self-auto">
                            {period}
                          </span>
                        )}
                      </div>

                      {bullets.length > 0 && (
                        <ul className="space-y-2 mt-4 text-xs sm:text-sm text-[var(--neo-text-secondary)]">
                          {bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <span className="neo-accent-gold font-bold mt-1 text-xs">◆</span>
                              <span className="leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          8. EDUCATION & CERTIFICATIONS: Tactile Credential Plaques
          ========================================================================= */}
      {(education.length > 0 || certifications.length > 0) && (
        <section className="py-20 sm:py-28 relative">
          <div className="neo-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Education Column */}
              {education.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <GraduationCap className="w-5 h-5 neo-accent-gold" />
                    <h3 className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                      EDUCATION
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="neo-raised p-6 rounded-3xl"
                      >
                        <h4 className="neo-display text-lg sm:text-xl font-bold text-[var(--neo-text-primary)]">
                          {edu?.degree || edu?.title || "Degree"}
                        </h4>
                        <p className="text-sm font-semibold neo-accent-gold mt-1">
                          {edu?.institution || edu?.school || "University"}
                        </p>
                        {(edu?.period || edu?.year || edu?.startDate) && (
                          <p className="text-xs text-[var(--neo-text-muted)] neo-mono mt-2">
                            {edu?.period || edu?.year || (edu?.startDate ? `${edu.startDate || ""} - ${edu.endDate || "Completed"}` : "")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Column */}
              {certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 neo-accent-gold" />
                    <h3 className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                      CERTIFICATIONS
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="neo-raised p-6 rounded-3xl"
                      >
                        <h4 className="neo-display text-lg sm:text-xl font-bold text-[var(--neo-text-primary)]">
                          {cert?.name || cert?.title || "Certification"}
                        </h4>
                        <p className="text-sm font-semibold neo-accent-gold mt-1">
                          {cert?.issuer || cert?.authority || "Issuing Body"}
                        </p>
                        {cert?.date && (
                          <p className="text-xs text-[var(--neo-text-muted)] neo-mono mt-2">
                            ISSUED: {cert.date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          9. CONTACT SECTION: Massive Tactile Statement & Control Deck
          ========================================================================= */}
      {sections?.showContact !== false && (
        <section id="contact" className="py-24 sm:py-32 relative">
          <div className="neo-container">
            <div className="neo-raised p-8 sm:p-12 lg:p-16 rounded-[3.5rem] relative overflow-hidden">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--neo-gold)]" />
                  <span className="neo-mono text-xs font-bold uppercase tracking-[0.2em] neo-accent-gold">
                    CONTACT
                  </span>
                </div>

                <h2 className="neo-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--neo-text-primary)] leading-[1.08] mb-6">
                  Let's work together.
                </h2>

                <p className="text-base sm:text-lg text-[var(--neo-text-secondary)] leading-relaxed mb-10">
                  Feel free to reach out for new opportunities, collaborations, or questions.
                </p>
              </div>

              {/* Tactile Control Desk */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Email Direct Module */}
                {email && (
                  <div className="neo-inset p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="neo-mono text-[10px] font-bold uppercase tracking-widest text-[var(--neo-text-muted)] mb-2">
                        EMAIL
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[var(--neo-text-primary)] break-all">
                        {email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <a
                        href={`mailto:${email}`}
                        className="neo-btn-gold flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Mail</span>
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="neo-btn p-2.5 rounded-xl"
                        aria-label="Copy Email"
                        title="Copy Email"
                      >
                        {copiedEmail ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 neo-accent-gold" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone Direct Module */}
                {phone && (
                  <div className="neo-inset p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="neo-mono text-[10px] font-bold uppercase tracking-widest text-[var(--neo-text-muted)] mb-2">
                        PHONE
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[var(--neo-text-primary)]">
                        {phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <a
                        href={`tel:${phone}`}
                        className="neo-btn flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-[var(--neo-text-primary)]"
                      >
                        <Phone className="w-3.5 h-3.5 neo-accent-gold" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={handleCopyPhone}
                        className="neo-btn p-2.5 rounded-xl"
                        aria-label="Copy Phone"
                        title="Copy Phone"
                      >
                        {copiedPhone ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 neo-accent-gold" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Social Network Array */}
                {links.length > 0 && (
                  <div className="neo-inset p-6 rounded-3xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
                    <div>
                      <p className="neo-mono text-[10px] font-bold uppercase tracking-widest text-[var(--neo-text-muted)] mb-2">
                        SOCIAL & PROFILES
                      </p>
                      <p className="text-xs text-[var(--neo-text-secondary)]">
                        Connect across platforms
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-6">
                      {links.map((link, idx) => {
                        const Icon = resolveSocialIcon(link?.type, link?.name || link?.label);
                        const linkUrl = link?.url || link?.href || "#";
                        return (
                          <a
                            key={idx}
                            href={linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="neo-btn p-3 rounded-2xl flex items-center justify-center text-[var(--neo-text-primary)] hover:neo-accent-gold transition-all"
                            aria-label={link?.name || link?.label || "Social link"}
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          10. PROJECT DETAIL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="neo-raised p-6 sm:p-10 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="neo-btn absolute top-6 right-6 p-2.5 rounded-xl"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[var(--neo-text-primary)]" />
              </button>

              <div className="neo-mono text-xs font-bold uppercase tracking-widest neo-accent-gold mb-2">
                PROJECT DETAILS
              </div>
              <h3 className="neo-display text-2xl sm:text-3xl font-bold text-[var(--neo-text-primary)] mb-4">
                {selectedProject?.title || selectedProject?.name}
              </h3>

              <div className="neo-inset-deep p-3 rounded-2xl mb-6">
                {resolveImageUrl(selectedProject?.image || selectedProject?.thumbnail) ? (
                  <img
                    src={resolveImageUrl(selectedProject?.image || selectedProject?.thumbnail)}
                    alt={selectedProject?.title}
                    className="w-full h-56 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-44 bg-[var(--neo-surface)] rounded-xl flex items-center justify-center neo-accent-gold">
                    <FolderGit2 className="w-12 h-12" />
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-base text-[var(--neo-text-secondary)] leading-relaxed mb-6">
                {selectedProject?.description || selectedProject?.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {(Array.isArray(selectedProject?.technologies)
                  ? selectedProject.technologies
                  : typeof selectedProject?.technologies === "string"
                  ? selectedProject.technologies.split(",")
                  : []
                ).map((t, idx) => (
                  <span
                    key={idx}
                    className="neo-inset-sm px-3 py-1 rounded-xl text-xs font-semibold neo-mono text-[var(--neo-text-secondary)]"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>

              {(() => {
                const modalLiveUrl =
                  selectedProject?.links?.live ||
                  selectedProject?.liveUrl ||
                  selectedProject?.projectUrl ||
                  selectedProject?.demoUrl ||
                  selectedProject?.websiteUrl ||
                  selectedProject?.website ||
                  selectedProject?.link ||
                  selectedProject?.url ||
                  "";
                const modalGithubUrl =
                  selectedProject?.links?.github ||
                  selectedProject?.githubUrl ||
                  selectedProject?.repoUrl ||
                  selectedProject?.repo ||
                  selectedProject?.github ||
                  selectedProject?.sourceCode ||
                  "";

                return (
                  <div className="flex flex-wrap items-center gap-4">
                    {modalLiveUrl && (
                      <a
                        href={modalLiveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-btn-gold flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Launch Live Demo</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                    {modalGithubUrl && (
                      <a
                        href={modalGithubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-btn px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-[var(--neo-text-primary)] flex items-center gap-2"
                      >
                        <Github className="w-4 h-4 neo-accent-gold" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
