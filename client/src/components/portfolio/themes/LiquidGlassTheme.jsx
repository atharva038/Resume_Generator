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
  Check,
  Copy,
  Layers,
  Code2,
  FolderGit2,
  Terminal,
  Cpu,
  Send,
  Compass,
  Radio,
  Zap,
  Boxes,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/liquid-glass-theme.css";
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

export default function LiquidGlassTheme({
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
  const [activeSection, setActiveSection] = useState("hero");

  // 1. Data Destructuring
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
      .toUpperCase() || "LG";
  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const rawTagline = profile?.tagline || "";
  const role = rawTitle || (rawTagline.length <= 45 ? rawTagline : "Full-Stack Systems Engineer");
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
    (profile?.isAvailable !== false ? "Open for High-Impact Roles" : "");
  const headline =
    profile?.headline ||
    profile?.heroHeadline ||
    "Designing and building fluid digital systems that scale with elegance.";

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
            category: "Core Stack",
            items: [categoryGroup],
          };
        }
        return {
          id: categoryGroup?.id || `cat-${index}`,
          category: categoryGroup?.category || "Discipline",
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

  // Computed Stats
  const totalProjects = projects.length || 6;
  const yearsExperience = experience.length >= 2 ? `${experience.length * 2}+` : "4+";
  const totalSkillsCount = categorizedSkills.reduce(
    (acc, curr) => acc + (curr.items?.length || 0),
    0
  ) || 16;

  // Scroll Spy Observer
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

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "Philosophy", num: "01" },
    { id: "work", label: "Gallery", num: "02" },
    { id: "skills", label: "Stack", num: "03" },
    { id: "experience", label: "Journey", num: "04" },
    { id: "contact", label: "Terminal", num: "05" },
  ];

  return (
    <div
      className={`liquid-glass-theme min-h-screen relative overflow-x-hidden ${
        isDark ? "dark-mode" : "light-mode"
      }`}
      style={{
        "--lg-accent-primary": propAccentColor || themeAccent || (isDark ? "#ffffff" : "#d4af37"),
      }}
    >
      {/* =========================================================================
          LIVING CAUSTIC REFRACTION BACKGROUND
          ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="caustic-blob w-[650px] h-[650px] -top-32 -left-32 bg-slate-200/20 dark:bg-white/[0.04]" />
        <div
          className="caustic-blob w-[700px] h-[700px] top-[35%] -right-44 bg-zinc-200/15 dark:bg-white/[0.035]"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="caustic-blob w-[600px] h-[600px] -bottom-32 left-[25%] bg-stone-200/15 dark:bg-white/[0.03]"
          style={{ animationDelay: "-16s" }}
        />
      </div>

      {/* =========================================================================
          1. SPATIAL GLASS ISLAND DOCK (NAVBAR)
          ========================================================================= */}
      <header className="sticky top-2 sm:top-5 z-50 w-full px-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Capsule */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="spatial-capsule px-2.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 sm:gap-3 group select-none shrink min-w-0 max-w-[150px] sm:max-w-[220px] md:max-w-[260px]"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[var(--lg-accent-primary)] to-zinc-200 text-black flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-sm shrink-0">
              {initials}
            </div>
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-[var(--lg-text-primary)] truncate">
              {name}
            </span>
          </a>

          {/* Center VisionOS Floating Pill Tabs (Spacious & Clean) */}
          <nav className="hidden xl:flex items-center gap-1 spatial-capsule px-2 py-1 shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white/90 dark:bg-white/15 text-[var(--lg-text-primary)] shadow-md font-bold"
                      : "text-[var(--lg-text-secondary)] hover:text-[var(--lg-text-primary)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="liquidActivePip"
                      className="w-1.5 h-1.5 rounded-full bg-[var(--lg-accent-primary)] shadow-[0_0_8px_var(--lg-accent-primary)]"
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Floating Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Liquid Theme Switch */}
            <button
              onClick={toggleDark}
              className="spatial-capsule w-11 sm:w-14 h-7 sm:h-8 p-0.5 sm:p-1 flex items-center cursor-pointer select-none shrink-0"
              aria-label="Toggle Spatial Theme"
              title={isDark ? "Switch to Daylight" : "Switch to Midnight Spatial"}
            >
              <motion.div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md text-xs"
                animate={{
                  x: isDark ? (typeof window !== "undefined" && window.innerWidth < 640 ? 16 : 20) : 0,
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
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--lg-accent-primary)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--lg-accent-primary)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

            {/* Resume Button */}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="spatial-capsule hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-[var(--lg-text-primary)] shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[var(--lg-accent-primary)]" />
                <span>CV</span>
              </a>
            )}

            {/* Connect Button */}
            <button
              onClick={() => scrollToSection("contact")}
              className="liquid-cta-btn hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="spatial-capsule xl:hidden p-2 rounded-full cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--lg-text-primary)]" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--lg-text-primary)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="xl:hidden spatial-glass-panel mt-3 p-4 rounded-3xl flex flex-col gap-2 shadow-2xl max-w-lg mx-auto"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="spatial-capsule text-left px-4 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--lg-text-primary)] cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2 border-t border-[var(--lg-glass-border-subtle)]">
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="spatial-capsule flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--lg-text-primary)]"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--lg-accent-primary)]" />
                    <span>Resume</span>
                  </a>
                )}
                <button
                  onClick={() => scrollToSection("contact")}
                  className="liquid-cta-btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  <span>Connect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          2. SPATIAL CINEMATIC HERO
          ========================================================================= */}
      <section id="hero" className="pt-6 pb-12 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Spatial Statement */}
            <div className="lg:col-span-7 flex flex-col items-start min-w-0">
              {/* Massive Modern Headline */}
              <h1 className="font-spatial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--lg-text-primary)] mb-5 sm:mb-6 leading-[1.08] break-words">
                {headline}
              </h1>

              {/* Bio Summary */}
              <p className="text-sm sm:text-base md:text-lg text-[var(--lg-text-secondary)] font-normal leading-relaxed max-w-2xl mb-8">
                {bio ||
                  `Hi, I'm ${name} — crafting modern high-performance web applications and fluid digital experiences.`}
              </p>

              {/* Floating Spatial Capabilities Pill Array */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-10">
                {role && (
                  <div className="spatial-capsule px-3 py-1.5 sm:px-3.5 sm:py-1.5 flex items-center gap-2 text-xs font-semibold text-[var(--lg-text-primary)]">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--lg-accent-primary)]" />
                    <span>{role}</span>
                  </div>
                )}
                {location && (
                  <div className="spatial-capsule px-3 py-1.5 sm:px-3.5 sm:py-1.5 flex items-center gap-2 text-xs font-semibold text-[var(--lg-text-primary)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--lg-accent-primary)]" />
                    <span>{location}</span>
                  </div>
                )}
                {availabilityStatus && (
                  <div className="spatial-capsule px-3 py-1.5 sm:px-3.5 sm:py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-500">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>{availabilityStatus}</span>
                  </div>
                )}
              </div>

              {/* Dual Action Deck */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => scrollToSection("work")}
                  className="spatial-capsule px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--lg-text-primary)] hover:bg-white/30 dark:hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-[var(--lg-accent-primary)]" />
                    <span>View Projects</span>
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="liquid-cta-btn px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Spatial Glass Holographic Prism Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="spatial-glass-panel p-6 rounded-[3rem] w-full max-w-md relative group">
                {/* Refractive Image Lens */}
                <div className="spatial-lens aspect-[4/5] rounded-[2.25rem] overflow-hidden relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-white/10 to-white/5 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--lg-accent-primary)] to-zinc-200 text-black flex items-center justify-center font-bold text-2xl mb-4 shadow-xl">
                        {initials}
                      </div>
                      <p className="font-spatial text-lg font-bold text-[var(--lg-text-primary)]">
                        {name}
                      </p>
                      {role && (
                        <p className="text-xs text-[var(--lg-text-secondary)] mt-1 font-tech">
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
          3. SPATIAL BENTO MATRIX (ABOUT)
          ========================================================================= */}
      {sections?.showAbout !== false && (
        <section id="about" className="py-12 sm:py-20 lg:py-28 relative z-10">
          <div className="lg-container">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
              {/* Large Bento Statement Slab */}
              <div className="md:col-span-8 spatial-glass-panel p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                    <Compass className="w-4 h-4" />
                    <span>ABOUT ME</span>
                  </div>
                  <h2 className="font-spatial text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--lg-text-primary)] leading-[1.15] mb-4 sm:mb-6">
                    {headline}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-[var(--lg-text-secondary)] leading-relaxed font-normal">
                    {bio ||
                      "Passionate about building scalable web architectures, fluid user interfaces, and clean code that solves real-world problems."}
                  </p>
                </div>
              </div>

              {/* Bento Stat Pillar 1 */}
              <div className="md:col-span-4 spatial-glass-panel p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <span className="font-tech text-xs font-bold text-[var(--lg-text-muted)] uppercase tracking-widest">
                    PROJECTS
                  </span>
                  <p className="font-spatial text-4xl sm:text-5xl md:text-6xl font-black text-[var(--lg-accent-primary)] my-3 sm:my-4">
                    {totalProjects.toString().padStart(2, "0")}+
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--lg-text-primary)] uppercase tracking-wider">
                    Completed Works
                  </p>
                </div>
              </div>

              {/* Bento Stat Pillar 2 */}
              <div className="md:col-span-4 spatial-glass-panel p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <span className="font-tech text-xs font-bold text-[var(--lg-text-muted)] uppercase tracking-widest">
                    EXPERIENCE
                  </span>
                  <p className="font-spatial text-4xl sm:text-5xl md:text-6xl font-black text-[var(--lg-accent-primary)] my-3 sm:my-4">
                    {yearsExperience}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--lg-text-primary)] uppercase tracking-wider">
                    Years in Industry
                  </p>
                </div>
              </div>

              {/* Bento Stat Pillar 3 */}
              <div className="md:col-span-8 spatial-glass-panel p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <span className="font-tech text-xs font-bold text-[var(--lg-text-muted)] uppercase tracking-widest">
                    SKILLS & CAPABILITIES
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                    <div className="spatial-lens p-3.5 sm:p-4 text-center">
                      <p className="font-spatial text-xl sm:text-2xl font-bold text-[var(--lg-accent-primary)]">
                        {totalSkillsCount}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--lg-text-secondary)] mt-1 uppercase font-tech">
                        Technologies
                      </p>
                    </div>
                    <div className="spatial-lens p-3.5 sm:p-4 text-center">
                      <p className="font-spatial text-xl sm:text-2xl font-bold text-[var(--lg-accent-primary)]">
                        {categorizedSkills.length}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--lg-text-secondary)] mt-1 uppercase font-tech">
                        Skill Domains
                      </p>
                    </div>
                    <div className="spatial-lens p-3.5 sm:p-4 text-center col-span-2 sm:col-span-1">
                      <p className="font-spatial text-xl sm:text-2xl font-bold text-[var(--lg-accent-primary)]">
                        {experience.length}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--lg-text-secondary)] mt-1 uppercase font-tech">
                        Positions Held
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          4. SPATIAL PROJECT GALLERY (LAYERED GLASS SLABS)
          ========================================================================= */}
      {sections?.showProjects !== false && projects.length > 0 && (
        <section id="work" className="py-20 sm:py-28 relative z-10">
          <div className="lg-container">
            {/* Gallery Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                  <Boxes className="w-4 h-4" />
                  <span>FEATURED WORK</span>
                </div>
                <h2 className="font-spatial text-3xl sm:text-5xl font-extrabold text-[var(--lg-text-primary)]">
                  Projects & Systems
                </h2>
              </div>
            </div>

            {/* Gallery Slabs Grid */}
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
                    transition={{ duration: 0.45, delay: idx * 0.1 }}
                    className="spatial-glass-panel p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Lens */}
                      <div className="spatial-lens aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative group/img">
                        {projImage ? (
                          <img
                            src={projImage}
                            alt={projTitle}
                            className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover/img:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center p-6 text-center">
                            <FolderGit2 className="w-12 h-12 text-[var(--lg-accent-primary)] mb-3" />
                            <p className="font-spatial font-bold text-base text-[var(--lg-text-primary)]">
                              {projTitle}
                            </p>
                          </div>
                        )}

                        {/* Top Index Tag */}
                        <div className="absolute top-5 left-5 spatial-capsule px-3 py-1 text-[11px] font-tech font-bold uppercase tracking-wider text-[var(--lg-accent-primary)] shadow-lg">
                          0{idx + 1}
                        </div>

                        {/* Direct Live Link Corner Icon on Image */}
                        {liveUrl && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-5 right-5 spatial-capsule p-2 text-[var(--lg-text-primary)] hover:text-[var(--lg-accent-primary)] shadow-lg transition-transform hover:scale-110"
                            aria-label="Open Live Site"
                            title="Open Live Site"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-spatial text-2xl sm:text-3xl font-bold text-[var(--lg-text-primary)] group-hover:translate-x-1 transition-transform">
                          {projTitle}
                        </h3>
                      </div>

                      {projDesc && (
                        <p className="text-sm text-[var(--lg-text-secondary)] leading-relaxed mb-6">
                          {projDesc}
                        </p>
                      )}

                      {/* Tech Chips */}
                      {projTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {projTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="spatial-capsule px-3 py-1 text-[11px] font-tech font-semibold text-[var(--lg-text-secondary)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Deck */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--lg-glass-border-subtle)]">
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="liquid-cta-btn flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider shadow-lg"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="liquid-cta-btn flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider"
                        >
                          <span>View Details</span>
                        </button>
                      )}

                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="spatial-capsule flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--lg-text-primary)]"
                          aria-label="View Source Code"
                          title="View GitHub Repository"
                        >
                          <Github className="w-4 h-4 text-[var(--lg-accent-primary)]" />
                          <span className="hidden sm:inline">Source</span>
                        </a>
                      )}

                      {liveUrl && (
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="spatial-capsule px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--lg-text-secondary)] hover:text-[var(--lg-text-primary)]"
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
          5. SKILLS: Translucent Spatial Refractive Tiles
          ========================================================================= */}
      {sections?.showSkills !== false && categorizedSkills.length > 0 && (
        <section id="skills" className="py-20 sm:py-28 relative z-10">
          <div className="lg-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                  <Cpu className="w-4 h-4" />
                  <span>SKILLS & EXPERTISE</span>
                </div>
                <h2 className="font-spatial text-3xl sm:text-5xl font-extrabold text-[var(--lg-text-primary)]">
                  Technical Stack
                </h2>
              </div>

              {/* Filter Pills */}
              {allSkillCategories.length > 2 && (
                <div className="spatial-capsule p-1.5 flex flex-wrap gap-1">
                  {allSkillCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveSkillCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        activeSkillCategory === cat
                          ? "bg-white/90 dark:bg-white/20 text-[var(--lg-text-primary)] shadow-sm"
                          : "text-[var(--lg-text-muted)] hover:text-[var(--lg-text-primary)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Matrix of Spatial Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSkills.map((categoryGroup, idx) => (
                <div
                  key={categoryGroup.id || idx}
                  className="spatial-glass-panel p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--lg-glass-border-subtle)]">
                      <h3 className="font-tech text-xs uppercase tracking-widest font-bold text-[var(--lg-accent-primary)] flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        {categoryGroup.category}
                      </h3>
                      <span className="font-tech text-[10px] text-[var(--lg-text-muted)] font-bold">
                        {categoryGroup.items?.length || 0} SKILLS
                      </span>
                    </div>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      {categoryGroup.items?.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="spatial-capsule px-3.5 py-2 text-xs font-semibold tracking-wide text-[var(--lg-text-primary)] hover:border-[var(--lg-accent-primary)]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lg-accent-primary)]" />
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. SPATIAL ORBIT TIMELINE (EXPERIENCE)
          ========================================================================= */}
      {sections?.showExperience !== false && experience.length > 0 && (
        <section id="experience" className="py-20 sm:py-28 relative z-10">
          <div className="lg-container">
            <div className="max-w-3xl mb-16">
              <div className="flex items-center gap-2 mb-3 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                <Globe className="w-4 h-4" />
                <span>EXPERIENCE</span>
              </div>
              <h2 className="font-spatial text-3xl sm:text-5xl font-extrabold text-[var(--lg-text-primary)]">
                Career History
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 sm:pl-10 space-y-12">
              {/* Vertical Conduit */}
              <div className="absolute top-4 bottom-4 left-2 sm:left-3 w-[2px] bg-gradient-to-b from-[var(--lg-accent-primary)] via-white/30 to-transparent rounded-full" />

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
                    transition={{ duration: 0.45 }}
                    className="relative"
                  >
                    {/* Node */}
                    <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-6 h-6 rounded-full spatial-capsule flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--lg-accent-primary)] shadow-[0_0_8px_var(--lg-accent-primary)]" />
                    </div>

                    {/* Slab */}
                    <div className="spatial-glass-panel p-6 sm:p-8 rounded-[2rem]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-spatial text-xl sm:text-2xl font-bold text-[var(--lg-text-primary)]">
                            {roleTitle}
                          </h3>
                          <p className="text-sm font-semibold text-[var(--lg-accent-primary)] mt-0.5 font-tech">
                            {companyName} {expLocation ? `• ${expLocation}` : ""}
                          </p>
                        </div>
                        {period && (
                          <span className="font-tech text-xs font-semibold px-3.5 py-1 rounded-full spatial-capsule text-[var(--lg-text-secondary)] self-start sm:self-auto">
                            {period}
                          </span>
                        )}
                      </div>

                      {bullets.length > 0 && (
                        <ul className="space-y-2 mt-4 text-xs sm:text-sm text-[var(--lg-text-secondary)]">
                          {bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <span className="text-[var(--lg-accent-primary)] font-bold mt-1 text-xs">◆</span>
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
          7. EDUCATION & CREDENTIALS
          ========================================================================= */}
      {(education.length > 0 || certifications.length > 0) && (
        <section className="py-20 sm:py-28 relative z-10">
          <div className="lg-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {education.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                    <GraduationCap className="w-5 h-5" />
                    <span>EDUCATION</span>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx} className="spatial-glass-panel p-6 rounded-3xl">
                        <h4 className="font-spatial text-lg font-bold text-[var(--lg-text-primary)]">
                          {edu?.degree || edu?.title || "Degree"}
                        </h4>
                        <p className="text-sm font-semibold text-[var(--lg-accent-primary)] mt-1 font-tech">
                          {edu?.institution || edu?.school || "Institution"}
                        </p>
                        {(edu?.period || edu?.year || edu?.startDate) && (
                          <p className="text-xs text-[var(--lg-text-muted)] font-tech mt-2">
                            {edu?.period || edu?.year || (edu?.startDate ? `${edu.startDate} - ${edu.endDate || "Completed"}` : "")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                    <Award className="w-5 h-5" />
                    <span>CERTIFICATIONS</span>
                  </div>
                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="spatial-glass-panel p-6 rounded-3xl">
                        <h4 className="font-spatial text-lg font-bold text-[var(--lg-text-primary)]">
                          {cert?.name || cert?.title || "Certification"}
                        </h4>
                        <p className="text-sm font-semibold text-[var(--lg-accent-primary)] mt-1 font-tech">
                          {cert?.issuer || cert?.authority || "Issuing Body"}
                        </p>
                        {cert?.date && (
                          <p className="text-xs text-[var(--lg-text-muted)] font-tech mt-2">
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
          8. SPATIAL DISPATCH TERMINAL (CONTACT)
          ========================================================================= */}
      {sections?.showContact !== false && (
        <section id="contact" className="py-24 sm:py-32 relative z-10">
          <div className="lg-container">
            <div className="spatial-glass-panel p-8 sm:p-12 lg:p-16 rounded-[3.5rem] relative overflow-hidden">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4 font-tech text-xs font-bold uppercase tracking-[0.2em] text-[var(--lg-accent-primary)]">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>CONTACT</span>
                </div>

                <h2 className="font-spatial text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--lg-text-primary)] leading-[1.04] mb-6">
                  Let's work together.
                </h2>

                <p className="text-base sm:text-lg text-[var(--lg-text-secondary)] leading-relaxed mb-10">
                  Feel free to reach out for new opportunities, collaborations, or questions.
                </p>
              </div>

              {/* Action Deck */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Email Direct */}
                {email && (
                  <div className="spatial-lens p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="font-tech text-[10px] font-bold uppercase tracking-widest text-[var(--lg-text-muted)] mb-2">
                        EMAIL
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[var(--lg-text-primary)] break-all font-tech">
                        {email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <a
                        href={`mailto:${email}`}
                        className="liquid-cta-btn flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Mail</span>
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="spatial-capsule p-2.5"
                        aria-label="Copy Email"
                        title="Copy Email"
                      >
                        {copiedEmail ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--lg-accent-primary)]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone Direct */}
                {phone && (
                  <div className="spatial-lens p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="font-tech text-[10px] font-bold uppercase tracking-widest text-[var(--lg-text-muted)] mb-2">
                        PHONE
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[var(--lg-text-primary)] font-tech">
                        {phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <a
                        href={`tel:${phone}`}
                        className="spatial-capsule flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-[var(--lg-text-primary)]"
                      >
                        <Phone className="w-3.5 h-3.5 text-[var(--lg-accent-primary)]" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={handleCopyPhone}
                        className="spatial-capsule p-2.5"
                        aria-label="Copy Phone"
                        title="Copy Phone"
                      >
                        {copiedPhone ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--lg-accent-primary)]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Social Network */}
                {links.length > 0 && (
                  <div className="spatial-lens p-6 rounded-3xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
                    <div>
                      <p className="font-tech text-[10px] font-bold uppercase tracking-widest text-[var(--lg-text-muted)] mb-2">
                        SOCIAL & PROFILES
                      </p>
                      <p className="text-xs text-[var(--lg-text-secondary)]">
                        Connect across platforms
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {links.map((link, idx) => {
                        const Icon = resolveSocialIcon(link?.type, link?.name || link?.label);
                        const linkUrl = link?.url || link?.href || "#";
                        return (
                          <a
                            key={idx}
                            href={linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="spatial-capsule p-3 flex items-center justify-center text-[var(--lg-text-primary)] hover:text-[var(--lg-accent-primary)] transition-colors"
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
          9. PROJECT DETAIL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="spatial-glass-panel p-6 sm:p-10 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="spatial-capsule absolute top-6 right-6 p-2.5"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[var(--lg-text-primary)]" />
              </button>

              <div className="font-tech text-xs font-bold uppercase tracking-widest text-[var(--lg-accent-primary)] mb-2">
                PROJECT DETAILS
              </div>
              <h3 className="font-spatial text-2xl sm:text-3xl font-bold text-[var(--lg-text-primary)] mb-4">
                {selectedProject?.title || selectedProject?.name}
              </h3>

              <div className="spatial-lens p-3 rounded-2xl mb-6">
                {resolveImageUrl(selectedProject?.image || selectedProject?.thumbnail) ? (
                  <img
                    src={resolveImageUrl(selectedProject?.image || selectedProject?.thumbnail)}
                    alt={selectedProject?.title}
                    className="w-full h-56 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-44 bg-white/5 rounded-xl flex items-center justify-center text-[var(--lg-accent-primary)]">
                    <FolderGit2 className="w-12 h-12" />
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-base text-[var(--lg-text-secondary)] leading-relaxed mb-6">
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
                    className="spatial-capsule px-3 py-1 text-xs font-semibold font-tech text-[var(--lg-text-secondary)]"
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
                        className="liquid-cta-btn flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
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
                        className="spatial-capsule px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--lg-text-primary)] flex items-center gap-2"
                      >
                        <Github className="w-4 h-4 text-[var(--lg-accent-primary)]" />
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
