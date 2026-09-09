import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
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
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  ChevronUp,
  Check,
  Copy,
  Layers,
  Code2,
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/swiss-architectural-theme.css";
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

export default function SwissArchitecturalTheme({
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

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

  // 2. Profile Resolution
  const name = profile?.name || "Portfolio";
  const nameParts = name.trim().split(" ").filter(Boolean);
  const firstName = nameParts[0] || name;
  const restName = nameParts.slice(1).join(" ") || "";

  const initials =
    nameParts
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SW";

  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const rawTagline = profile?.tagline || "";
  const role = rawTitle || (rawTagline.length <= 50 ? rawTagline : "DEVELOPER / DESIGNER");
  const bio = profile?.about || profile?.bio || profile?.summary || (rawTagline.length > 50 ? rawTagline : "");
  const location = profile?.location || data?.contact?.location || "";
  const email = profile?.email || data?.contact?.email || "";
  const phone = profile?.phone || profile?.mobile || profile?.contactNumber || profile?.phoneNumber || data?.contact?.phone || "";
  const profileImage = resolveImageUrl(profile?.profileImage || profile?.heroImage || "");
  const resumeUrl = actions?.resumeDownloadUrl || profile?.resumeUrl || "";
  const availabilityStatus = profile?.availabilityStatus || (profile?.isAvailable ? "AVAILABLE FOR SELECT WORK" : "AVAILABLE");
  
  const headline = profile?.headline || profile?.heroHeadline || "I build digital products where technology becomes simple enough to disappear.";
  const currentYear = new Date().getFullYear();

  // 3. Projects Normalization
  const projectsList = useMemo(() => {
    if (Array.isArray(rawProjects) && rawProjects.length > 0) {
      return rawProjects.map((p, idx) => ({
        id: p.id || p._id || `proj-${idx}`,
        number: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
        category: (p.category || (p.featured ? "PRODUCT / DIGITAL" : "SYSTEMS / WEB")).toUpperCase(),
        title: p.title || p.name || "Untitled Project",
        description:
          p.shortDescription ||
          p.description ||
          p.longDescription ||
          "",
        longDescription: p.longDescription || "",
        problem: p.problem || "",
        approach: p.solution || p.approach || "",
        result: p.impact || p.result || "",
        year: p.year || (p.duration ? p.duration.split("-")[0].trim() : `${currentYear}`),
        technologies: Array.isArray(p.technologies)
          ? p.technologies
          : typeof p.technologies === "string"
          ? p.technologies.split(",").map((s) => s.trim())
          : [],
        liveUrl: p.links?.live || p.liveUrl || p.projectUrl || p.demoUrl || "",
        githubUrl: p.links?.github || p.githubUrl || p.repoUrl || "",
        caseStudyUrl: p.links?.caseStudy || p.caseStudyUrl || "",
        image: resolveImageUrl(p.images?.[0]?.url || p.image || p.thumbnail || ""),
        featured: Boolean(p.featured) || idx === 0,
        role: p.role || "",
      }));
    }
    return [];
  }, [rawProjects, currentYear]);

  // Featured Project (Top project)
  const featuredProject = useMemo(() => {
    return projectsList.find((p) => p.featured) || projectsList[0] || null;
  }, [projectsList]);

  // Standard Projects List
  const standardProjectsList = useMemo(() => {
    return projectsList;
  }, [projectsList]);

  // 4. Experience Normalization
  const experienceList = useMemo(() => {
    if (Array.isArray(rawExperience) && rawExperience.length > 0) {
      return rawExperience.map((exp, idx) => {
        const rawBullets =
          Array.isArray(exp.contributions) && exp.contributions.length > 0
            ? exp.contributions
            : Array.isArray(exp.bullets) && exp.bullets.length > 0
            ? exp.bullets
            : Array.isArray(exp.highlights) && exp.highlights.length > 0
            ? exp.highlights
            : Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
            ? exp.responsibilities
            : typeof exp.description === "string" && (exp.description.includes("\n") || exp.description.includes("•"))
            ? exp.description.split(/[\n•]/).map((s) => s.replace(/^[-*]\s*/, "").trim()).filter(Boolean)
            : [];

        const desc =
          typeof exp.description === "string" && !exp.description.includes("\n") && !exp.description.includes("•")
            ? exp.description
            : exp.summary || (rawBullets.length === 0 && typeof exp.description === "string" ? exp.description : "");

        return {
          id: idx,
          year:
            exp.dateRange ||
            `${exp.startDate || ""} ${exp.startDate && (exp.endDate || exp.current) ? "—" : ""} ${exp.current ? "Present" : exp.endDate || ""}`.trim() ||
            exp.year ||
            "",
          role: (exp.role || exp.title || exp.position || "Senior Software Engineer").toUpperCase(),
          company: (exp.company || exp.organization || "Independent Studio").toUpperCase(),
          location: exp.location || "",
          description: desc,
          contributions: rawBullets,
        };
      });
    }
    // Fallback sample experience for template preview
    return [
      {
        id: 0,
        year: "2024 — PRESENT",
        role: "LEAD ARCHITECTURAL SYSTEMS ENGINEER",
        company: "APEX STUDIO // ZURICH",
        location: "Zurich, Switzerland",
        description: "Leading frontend architecture and high-performance design engineering across enterprise systems.",
        contributions: [
          "Engineered modular grid system improving page performance by 40%",
          "Architected real-time spatial canvas with sub-16ms render loop",
        ],
      },
      {
        id: 1,
        year: "2022 — 2024",
        role: "SENIOR DIGITAL CRAFT DEVELOPER",
        company: "METRIC LABS",
        location: "Geneva",
        description: "Built reactive web applications and interactive client monographs.",
        contributions: [
          "Developed typography token pipeline used across 8 client applications",
        ],
      },
    ];
  }, [rawExperience]);

  // 5. Education Normalization
  const educationList = useMemo(() => {
    if (Array.isArray(rawEducation) && rawEducation.length > 0) {
      return rawEducation.map((edu, idx) => ({
        id: idx,
        degree: edu.degree || edu.fieldOfStudy || edu.major || edu.field || "",
        institution: edu.institution || edu.school || edu.university || "",
        gpa: edu.gpa || edu.cgpa || edu.grade || edu.percentage || edu.score || "",
        location: edu.location || "",
        year: edu.dateRange || `${edu.startDate || ""} ${edu.startDate && edu.endDate ? "—" : ""} ${edu.endDate || ""}`.trim() || edu.year || "",
      }));
    }
    return [
      {
        id: 0,
        degree: "B.S. IN ARCHITECTURAL COMPUTING",
        institution: "ETH ZÜRICH // SWISS FEDERAL INSTITUTE",
        gpa: "3.9 / 4.0",
        location: "Zürich, Switzerland",
        year: "2020 — 2024",
      },
    ];
  }, [rawEducation]);

  // 6. Skills Categorization
  const categorizedSkills = useMemo(() => {
    if (Array.isArray(rawSkills) && rawSkills.length > 0) {
      if (typeof rawSkills[0] === "object" && rawSkills[0].category) {
        return rawSkills.map((c) => ({
          category: (c.category || "CAPABILITIES").toUpperCase(),
          items: (c.skills || c.items || []).map((s) =>
            typeof s === "string" ? s.toUpperCase() : s.name.toUpperCase()
          ).filter(Boolean),
        })).filter((c) => c.items.length > 0);
      }

      const flat = rawSkills
        .map((s) => (typeof s === "string" ? s.toUpperCase() : (s.name || "").toUpperCase()))
        .filter(Boolean);

      if (flat.length === 0) return [];

      const devKeywords = ["REACT", "NEXT", "VUE", "TYPESCRIPT", "JAVASCRIPT", "NODE", "PYTHON", "GO", "GRAPHQL", "API", "TAILWIND", "HTML", "CSS", "SQL", "POSTGRES", "MONGODB", "RUST", "JAVA", "BACKEND", "FRONTEND", "FULL STACK"];
      const designKeywords = ["FIGMA", "UI", "UX", "DESIGN", "WIREFRAMING", "PROTOTYPING", "SYSTEMS", "TYPOGRAPHY", "ANIMATION"];
      const aiKeywords = ["AI", "LLM", "LLMS", "GPT", "RAG", "AGENTS", "LANGCHAIN", "PROMPT", "AUTOMATION", "OPENAI", "CLAUDE", "MACHINE LEARNING"];

      const devItems = [];
      const designItems = [];
      const aiItems = [];
      const toolItems = [];

      flat.forEach((skill) => {
        if (aiKeywords.some((k) => skill.includes(k))) {
          aiItems.push(skill);
        } else if (designKeywords.some((k) => skill.includes(k))) {
          designItems.push(skill);
        } else if (devKeywords.some((k) => skill.includes(k))) {
          devItems.push(skill);
        } else {
          toolItems.push(skill);
        }
      });

      const categories = [];
      if (devItems.length > 0) categories.push({ category: "DEVELOPMENT", items: devItems });
      if (designItems.length > 0) categories.push({ category: "DESIGN", items: designItems });
      if (aiItems.length > 0) categories.push({ category: "AI & INTELLIGENCE", items: aiItems });
      if (toolItems.length > 0) categories.push({ category: "TOOLS & INFRASTRUCTURE", items: toolItems });

      if (categories.length === 0) {
        categories.push({ category: "CORE CAPABILITIES", items: flat });
      }
      return categories;
    }
    return [];
  }, [rawSkills]);

  // 7. Achievements Normalization
  const achievementsList = useMemo(() => {
    if (Array.isArray(rawAchievements) && rawAchievements.length > 0) {
      return rawAchievements
        .map((a) => (typeof a === "string" ? a : a.title || a.name || a.description || ""))
        .filter(Boolean);
    }
    return [];
  }, [rawAchievements]);

  // 8. Social Links
  const socialLinksList = useMemo(() => {
    if (Array.isArray(rawLinks) && rawLinks.length > 0) {
      return rawLinks.filter((l) => l.url && l.url !== "#").map((l) => ({
        name: (l.label || l.type || "LINK").toUpperCase(),
        url: l.url,
        type: l.type || "",
      }));
    }
    if (Array.isArray(profile?.socialLinks) && profile.socialLinks.length > 0) {
      return profile.socialLinks.filter((l) => l.url && l.url !== "#").map((l) => ({
        name: (l.name || l.label || l.type || "LINK").toUpperCase(),
        url: l.url,
        type: l.type || "",
      }));
    }
    return [];
  }, [rawLinks, profile]);

  // Section Visibility
  const showAbout = sections?.showAbout !== false && (Boolean(bio) || educationList.length > 0 || Boolean(role) || Boolean(location));
  const showProjects = sections?.showProjects !== false && projectsList.length > 0;
  const showSkills = sections?.showSkills !== false && categorizedSkills.length > 0;
  const showExperience = sections?.showExperience !== false && experienceList.length > 0;
  const showContact = sections?.showContact !== false;
  const showCertifications = sections?.showCertifications !== false && Array.isArray(rawCertifications) && rawCertifications.length > 0;

  // Active Accent (Default Cobalt Blue: #2251ff)
  const activeAccent = propAccentColor || themeAccent || "#2251ff";

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse move listener for floating preview
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll helper
  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "contact") {
      if (email) {
        window.location.href = `mailto:${email}`;
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }
  };

  // Contact handler
  const handleContactClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (actions?.onContactClick) {
      actions.onContactClick();
    }
    scrollTo("contact");
  };

  // Copy helpers
  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied");
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleCopyPhone = () => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      toast.success("Phone copied");
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  // Open project modal
  const handleOpenProject = (project, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setSelectedProject(project);
    if (actions?.onProjectClick) {
      actions.onProjectClick(project);
    }
  };

  return (
    <div
      className={`swiss-architectural-theme ${isDark ? "dark-mode" : ""}`}
      style={{ "--sw-cobalt": activeAccent }}
    >
      {/* ─── 4. ARCHITECTURAL HEADER ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-[var(--sw-border)] ${
          isScrolled
            ? "py-3 bg-[var(--sw-bg)]/95 backdrop-blur-md"
            : "py-5 bg-[var(--sw-bg)]"
        }`}
      >
        <div className="sw-container flex items-center justify-between">
          {/* Top Left: Name & Role */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex flex-col text-left group cursor-pointer"
          >
            <span className="sw-condensed text-2xl tracking-tighter text-[var(--sw-text-primary)] group-hover:text-[var(--sw-cobalt)] transition-colors">
              {name.toUpperCase()}
            </span>
            {role && (
              <span className="sw-mono text-[10px] tracking-widest text-[var(--sw-text-muted)] uppercase">
                {role}
              </span>
            )}
          </button>

          {/* Top Right: Index Links & Page Number */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="hidden md:flex items-center gap-6 sw-mono text-xs tracking-wider uppercase text-[var(--sw-text-secondary)]">
              {showAbout && (
                <button
                  onClick={() => scrollTo("about")}
                  className="hover:text-[var(--sw-cobalt)] transition-colors py-1 cursor-pointer"
                >
                  01/ABOUT
                </button>
              )}
              {showProjects && (
                <button
                  onClick={() => scrollTo("work")}
                  className="hover:text-[var(--sw-cobalt)] transition-colors py-1 cursor-pointer"
                >
                  02/WORK
                </button>
              )}
              {showExperience && (
                <button
                  onClick={() => scrollTo("experience")}
                  className="hover:text-[var(--sw-cobalt)] transition-colors py-1 cursor-pointer"
                >
                  03/TRAJECTORY
                </button>
              )}
              {showSkills && (
                <button
                  onClick={() => scrollTo("skills")}
                  className="hover:text-[var(--sw-cobalt)] transition-colors py-1 cursor-pointer"
                >
                  04/CAPABILITIES
                </button>
              )}
              {showContact && (
                <button
                  onClick={handleContactClick}
                  className="hover:text-[var(--sw-cobalt)] transition-colors py-1 cursor-pointer"
                >
                  05/CONTACT
                </button>
              )}
            </nav>

            {/* Page Indicator Tag */}
            <div className="hidden lg:flex items-center gap-2 sw-mono text-[11px] text-[var(--sw-text-muted)] border-l border-[var(--sw-border)] pl-4">
              <span className="sw-crosshair" />
              <span>EDITION / {currentYear}</span>
            </div>

            {/* Theme Toggle Button: ☼ / ◐ */}
            <button
              onClick={toggleDark}
              aria-label="Toggle light/dark theme"
              className="sw-theme-toggle"
              title={isDark ? "Switch to Architectural Light Mode" : "Switch to Graphite Dark Mode"}
            >
              {isDark ? (
                <span className="text-blue-400">☼</span>
              ) : (
                <span className="text-[var(--sw-text-secondary)]">◐</span>
              )}
            </button>

            {/* Let's Talk CTA */}
            {showContact && (
              <button
                type="button"
                onClick={handleContactClick}
                className="hidden sm:inline-flex sw-btn py-2 px-3 text-xs"
              >
                LET'S TALK
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--sw-cobalt)]" />
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--sw-text-primary)] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--sw-border)] bg-[var(--sw-bg)] px-6 py-6 flex flex-col gap-4 sw-mono text-sm"
            >
              {showAbout && (
                <button
                  onClick={() => scrollTo("about")}
                  className="text-left text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] py-2 border-b border-[var(--sw-border)]"
                >
                  01 / ABOUT
                </button>
              )}
              {showProjects && (
                <button
                  onClick={() => scrollTo("work")}
                  className="text-left text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] py-2 border-b border-[var(--sw-border)]"
                >
                  02 / WORK
                </button>
              )}
              {showExperience && (
                <button
                  onClick={() => scrollTo("experience")}
                  className="text-left text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] py-2 border-b border-[var(--sw-border)]"
                >
                  03 / TRAJECTORY
                </button>
              )}
              {showSkills && (
                <button
                  onClick={() => scrollTo("skills")}
                  className="text-left text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] py-2 border-b border-[var(--sw-border)]"
                >
                  04 / CAPABILITIES
                </button>
              )}
              {showContact && (
                <button
                  onClick={handleContactClick}
                  className="text-left text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] py-2"
                >
                  05 / CONTACT
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-24 sm:pt-28">
        {/* ─── 5. HERO — TYPOGRAPHIC ARCHITECTURE ─── */}
        <section
          id="hero"
          className="relative min-h-[88vh] flex flex-col justify-between pb-12 pt-6 border-b border-[var(--sw-border)]"
        >
          {/* Subtle Grid Coordinate Header Bar */}
          <div className="sw-container pb-4 border-b border-[var(--sw-border)] flex items-center justify-between sw-mono text-[11px] text-[var(--sw-text-muted)]">
            <div className="flex items-center gap-4">
              <span className="sw-coordinate">
                <span className="sw-crosshair" />
                <span>INDEX / 01</span>
              </span>
              <span>·</span>
              <span>PORTFOLIO / {currentYear}</span>
            </div>
            <div className="flex items-center gap-4">
              {location && <span>BASE / {location.toUpperCase()}</span>}
              <span>·</span>
              <span className="text-[var(--sw-cobalt)]">{availabilityStatus}</span>
            </div>
          </div>

          {/* Monumental Condensed Name Typography Composition */}
          <div className="sw-container my-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Left Column: Massive Broken Name */}
              <div className="lg:col-span-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="sw-display-title text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] tracking-tighter text-[var(--sw-text-primary)] select-none"
                >
                  <div className="leading-[0.82]">{firstName.toUpperCase()}</div>
                  {restName && (
                    <div className="leading-[0.82] text-[var(--sw-text-muted)] hover:text-[var(--sw-text-primary)] transition-colors">
                      {restName.toUpperCase()}
                    </div>
                  )}
                </motion.div>

                {/* Subtitle / Role Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="flex flex-wrap items-center gap-3 pt-2"
                >
                  <span className="sw-mono text-xs sm:text-sm font-bold tracking-widest text-[var(--sw-cobalt)] uppercase">
                    {role || "ENGINEER / DESIGNER / ARCHITECT"}
                  </span>
                  <span className="w-8 h-[1px] bg-[var(--sw-border-strong)]" />
                  <span className="sw-mono text-xs text-[var(--sw-text-muted)]">
                    SMARTNSHINE MINIMAL II
                  </span>
                </motion.div>
              </div>

              {/* Right Column: Narrow Editorial Text & Portrait or Architecture Frame */}
              <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-[var(--sw-border)] lg:pl-8">
                {profileImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="aspect-[4/5] max-w-[260px] border border-[var(--sw-border)] overflow-hidden bg-[var(--sw-bg-surface)]"
                  >
                    <img
                      src={profileImage}
                      alt={name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="aspect-[4/5] max-w-[260px] border border-[var(--sw-border)] p-6 flex flex-col justify-between bg-[var(--sw-bg-subtle)]">
                    <span className="sw-mono text-[10px] text-[var(--sw-cobalt)]">SWISS / 01</span>
                    <span className="sw-condensed text-7xl text-[var(--sw-text-primary)] font-black leading-none">
                      {initials}
                    </span>
                    <span className="sw-mono text-[10px] text-[var(--sw-text-muted)]">
                      {currentYear} ARCHIVE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Grid Coordinate Bar */}
          <div className="sw-container pt-4 border-t border-[var(--sw-border)] flex items-center justify-between sw-mono text-[11px]">
            <span className="text-[var(--sw-text-muted)]">DIGITAL PRECISION × CONTEMPORARY SWISS DESIGN</span>
            <button
              onClick={() => scrollTo(showProjects ? "work" : showAbout ? "about" : "contact")}
              className="hover:text-[var(--sw-cobalt)] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>SCROLL DOWN</span>
              <ArrowDown className="w-3.5 h-3.5 text-[var(--sw-cobalt)]" />
            </button>
          </div>
        </section>

        {/* ─── 7. INTRODUCTION (02 / INTRODUCTION) ─── */}
        <section id="about" className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg-subtle)]">
          <div className="sw-container">
            <div className="flex items-center gap-2 mb-10">
              <span className="sw-section-num">02</span>
              <span className="sw-meta-tag">INTRODUCTION &amp; STATEMENT</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left: Monumental Statement across 7 columns */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="sw-condensed text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] text-[var(--sw-text-primary)] leading-[0.94] tracking-tight">
                  {headline}
                </h2>
              </div>

              {/* Right: Narrow Biography Column */}
              <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-[var(--sw-border)] lg:pl-10">
                <div className="space-y-4 text-sm sm:text-base text-[var(--sw-text-secondary)] font-light leading-relaxed">
                  {bio ? (
                    <p>{bio}</p>
                  ) : (
                    <p>
                      Specialized in architecting high-performance web applications, scalable design systems, and digital interfaces that combine extreme utility with contemporary Swiss aesthetics.
                    </p>
                  )}
                  <p>
                    Rooted in structural alignment, deliberate typography, and zero-compromise digital engineering.
                  </p>
                </div>

                {/* Structured Matrix */}
                {(location || role) && (
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--sw-border)] sw-mono text-xs">
                    {location && (
                      <div>
                        <span className="text-[10px] text-[var(--sw-text-muted)] block mb-0.5">LOCATION</span>
                        <span className="font-semibold text-[var(--sw-text-primary)]">{location}</span>
                      </div>
                    )}
                    {role && (
                      <div>
                        <span className="text-[10px] text-[var(--sw-text-muted)] block mb-0.5">ROLE</span>
                        <span className="font-semibold text-[var(--sw-text-primary)]">{role}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Resume Button */}
                {resumeUrl && (
                  <div className="pt-2">
                    <a
                      href={resumeUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="sw-btn"
                    >
                      <Download className="w-3.5 h-3.5 text-[var(--sw-cobalt)]" />
                      DOWNLOAD CV / RESUME
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 10. FEATURED PROJECT (SELECTED / 01) ─── */}
        {showProjects && featuredProject && (
          <section className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg)]">
            <div className="sw-container">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--sw-border)]">
                <div className="flex items-center gap-2">
                  <span className="sw-section-num">03</span>
                  <span className="sw-meta-tag">SELECTED / 01 SPOTLIGHT</span>
                </div>
                <span className="sw-mono text-xs text-[var(--sw-cobalt)] font-semibold">
                  {featuredProject.year} RELEASE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Large Project Image */}
                <div
                  onClick={(e) => handleOpenProject(featuredProject, e)}
                  className="lg:col-span-8 cursor-pointer group"
                >
                  <div className="aspect-[16/9] border border-[var(--sw-border)] overflow-hidden bg-[var(--sw-bg-surface)] relative">
                    {featuredProject.image ? (
                      <img
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[var(--sw-bg-surface)] to-[var(--sw-bg-subtle)]">
                        <span className="sw-condensed text-7xl sm:text-9xl text-[var(--sw-text-primary)] opacity-40">
                          {featuredProject.title.slice(0, 3).toUpperCase()}
                        </span>
                        <span className="sw-mono text-xs text-[var(--sw-cobalt)] mt-2">
                          {featuredProject.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[var(--sw-bg)] border border-[var(--sw-border)] px-3 py-1 sw-mono text-[10px] font-bold">
                      FEATURED CASE 01
                    </div>
                  </div>
                </div>

                {/* Editorial Description Column */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block mb-1">
                      {featuredProject.category}
                    </span>
                    <h3
                      onClick={(e) => handleOpenProject(featuredProject, e)}
                      className="sw-condensed text-4xl sm:text-5xl lg:text-6xl text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] transition-colors cursor-pointer leading-[0.92]"
                    >
                      {featuredProject.title}
                    </h3>
                  </div>

                  {featuredProject.description && (
                    <p className="text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                      {featuredProject.description}
                    </p>
                  )}

                  {featuredProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {featuredProject.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 border border-[var(--sw-border)] sw-mono text-[10px] bg-[var(--sw-bg-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => handleOpenProject(featuredProject, e)}
                      className="sw-btn sw-btn-primary cursor-pointer"
                    >
                      EXPLORE PROJECT
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sw-mono text-xs hover:text-[var(--sw-cobalt)] inline-flex items-center gap-1 transition-colors"
                      >
                        Live <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── 8. SELECTED WORK (Architectural Project Index & 9. Hover) ─── */}
        {showProjects && (
          <section id="work" className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg)]">
            <div className="sw-container">
              <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--sw-border)]">
                <div className="flex items-center gap-2">
                  <span className="sw-section-num">04</span>
                  <span className="sw-meta-tag">SELECTED WORK ARCHIVE</span>
                </div>
                <span className="sw-mono text-xs text-[var(--sw-text-muted)]">
                  TOTAL / {projectsList.length} UNITS
                </span>
              </div>

              {/* Horizontal Architectural Rows */}
              <div className="border-t border-[var(--sw-border)]">
                {standardProjectsList.map((project, idx) => (
                  <div
                    key={project.id || idx}
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={(e) => handleOpenProject(project, e)}
                    className="sw-project-row py-6 sm:py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center cursor-pointer"
                  >
                    {/* Index Number */}
                    <div className="md:col-span-1 sw-mono text-sm font-bold text-[var(--sw-cobalt)]">
                      {project.number}
                    </div>

                    {/* Title */}
                    <div className="md:col-span-5">
                      <h4 className="sw-row-title sw-condensed text-3xl sm:text-4xl lg:text-5xl text-[var(--sw-text-primary)] tracking-tight">
                        {project.title}
                      </h4>
                    </div>

                    {/* Category Tags */}
                    <div className="md:col-span-3 sw-mono text-xs text-[var(--sw-text-muted)]">
                      {project.category}
                    </div>

                    {/* Year */}
                    <div className="md:col-span-1 sw-mono text-xs text-[var(--sw-text-muted)]">
                      {project.year}
                    </div>

                    {/* Action Arrow */}
                    <div className="md:col-span-2 flex items-center md:justify-end gap-2 sw-mono text-xs font-bold text-[var(--sw-text-primary)]">
                      <span className="sw-row-arrow inline-flex items-center gap-1.5">
                        VIEW UNIT
                        <ArrowUpRight className="w-4 h-4 text-[var(--sw-cobalt)]" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 9. HOVER BLUEPRINT PREVIEW ─── */}
        <AnimatePresence>
          {hoveredProject && hoveredProject.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                top: mousePos.y + 15,
                left: mousePos.x + 20,
              }}
              className="sw-floating-preview hidden lg:block"
            >
              <img
                src={hoveredProject.image}
                alt={hoveredProject.title}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-[var(--sw-bg)]/90 px-2 py-0.5 sw-mono text-[9px] font-bold">
                {hoveredProject.title.toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 11. PROJECT CASE STUDY (01 PROBLEM / 02 APPROACH / 03 RESULT) ─── */}
        {showProjects && featuredProject && (featuredProject.problem || featuredProject.approach || featuredProject.result) && (
          <section className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg-subtle)]">
            <div className="sw-container">
              <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[var(--sw-border)]">
                <span className="sw-section-num">05</span>
                <span className="sw-meta-tag">CASE STUDY METHODOLOGY / {featuredProject.title.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProject.problem && (
                  <div className="border-t-2 border-[var(--sw-text-primary)] pt-4 space-y-3">
                    <span className="sw-mono text-xs font-bold text-[var(--sw-cobalt)] block">
                      01 / THE PROBLEM
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                      {featuredProject.problem}
                    </p>
                  </div>
                )}

                {featuredProject.approach && (
                  <div className="border-t-2 border-[var(--sw-cobalt)] pt-4 space-y-3">
                    <span className="sw-mono text-xs font-bold text-[var(--sw-cobalt)] block">
                      02 / THE APPROACH
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                      {featuredProject.approach}
                    </p>
                  </div>
                )}

                {featuredProject.result && (
                  <div className="border-t-2 border-[var(--sw-text-primary)] pt-4 space-y-3">
                    <span className="sw-mono text-xs font-bold text-[var(--sw-cobalt)] block">
                      03 / THE RESULT
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                      {featuredProject.result}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── 13. EXPERIENCE (05 / TRAJECTORY) ─── */}
        {showExperience && (
          <section id="experience" className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg)]">
            <div className="sw-container">
              <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--sw-border)]">
                <div className="flex items-center gap-2">
                  <span className="sw-section-num">06</span>
                  <span className="sw-meta-tag">CAREER TRAJECTORY &amp; ENGAGEMENTS</span>
                </div>
                <span className="sw-mono text-xs text-[var(--sw-text-muted)]">
                  {experienceList.length} POSITIONS
                </span>
              </div>

              <div className="divide-y divide-[var(--sw-border)] border-t border-[var(--sw-border)]">
                {experienceList.map((item) => (
                  <div
                    key={item.id}
                    className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group"
                  >
                    <div className="md:col-span-3 sw-mono text-xs font-bold text-[var(--sw-cobalt)]">
                      {item.year}
                      {item.location && (
                        <span className="block text-[10px] text-[var(--sw-text-muted)] mt-1 font-normal">
                          {item.location}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <h4 className="sw-condensed text-3xl sm:text-4xl text-[var(--sw-text-primary)] group-hover:text-[var(--sw-cobalt)] transition-colors">
                        {item.role}
                      </h4>
                      <p className="sw-mono text-xs text-[var(--sw-text-secondary)] font-semibold">
                        {item.company}
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      {item.description && (
                        <p className="text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {item.contributions.length > 0 && (
                        <ul className="space-y-1 pt-1 sw-mono text-xs text-[var(--sw-text-muted)]">
                          {item.contributions.map((c, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2 font-light">
                              <span className="text-[var(--sw-cobalt)] font-bold">↳</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 14. SKILLS (06 / CAPABILITIES) ─── */}
        {showSkills && (
          <section id="skills" className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg-subtle)]">
            <div className="sw-container">
              <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--sw-border)]">
                <div className="flex items-center gap-2">
                  <span className="sw-section-num">07</span>
                  <span className="sw-meta-tag">CAPABILITIES &amp; TECHNICAL SYSTEMS</span>
                </div>
                <span className="sw-mono text-xs text-[var(--sw-cobalt)] font-bold">
                  INDEXED BY DISCIPLINE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categorizedSkills.map((group, gIdx) => (
                  <div key={gIdx} className="border-t-2 border-[var(--sw-border-strong)] pt-4 space-y-6">
                    <span className="sw-mono text-xs font-bold text-[var(--sw-cobalt)] block">
                      {group.category}
                    </span>

                    <ul className="space-y-2">
                      {group.items.map((skill, sIdx) => (
                        <li
                          key={sIdx}
                          className="sw-condensed text-2xl sm:text-3xl text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] hover:translate-x-1 transition-all duration-150 cursor-default border-b border-[var(--sw-border)] pb-1.5 flex items-center justify-between"
                        >
                          <span>{skill}</span>
                          <span className="sw-mono text-[9px] text-[var(--sw-text-muted)] font-normal">
                            0{sIdx + 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 15. HONORS & ACHIEVEMENTS (Rendered Only If User Has Real Achievements) ─── */}
        {achievementsList.length > 0 && (
          <section className="sw-section-pad-sm border-b border-[var(--sw-border)] bg-[var(--sw-bg)] py-12">
            <div className="sw-container">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[var(--sw-border)]">
                <span className="sw-section-num">08</span>
                <span className="sw-meta-tag">HONORS &amp; DISTINCTIONS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievementsList.map((ach, aIdx) => (
                  <div key={aIdx} className="p-6 border border-[var(--sw-border)] bg-[var(--sw-bg-subtle)] space-y-2">
                    <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                      HONOR / 0{aIdx + 1}
                    </span>
                    <p className="sw-condensed text-2xl text-[var(--sw-text-primary)]">
                      {ach}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 16. ACADEMIC FOUNDATIONS / EDUCATION ─── */}
        {educationList.length > 0 && (
          <section className="sw-section-pad-sm border-b border-[var(--sw-border)] bg-[var(--sw-bg-subtle)] py-12">
            <div className="sw-container">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[var(--sw-border)]">
                <span className="sw-section-num">08</span>
                <span className="sw-meta-tag">ACADEMIC BACKGROUND &amp; QUALIFICATIONS</span>
              </div>

              <div className="divide-y divide-[var(--sw-border)] border-t border-[var(--sw-border)]">
                {educationList.map((edu, idx) => (
                  <div key={idx} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 sw-mono text-xs font-bold text-[var(--sw-cobalt)]">
                      {edu.year || `ACADEMIC / 0${idx + 1}`}
                      {edu.location && (
                        <span className="block text-[10px] text-[var(--sw-text-muted)] font-normal mt-0.5">
                          {edu.location}
                        </span>
                      )}
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <h5 className="sw-condensed text-2xl sm:text-3xl text-[var(--sw-text-primary)]">
                        {edu.degree}
                      </h5>
                      {edu.gpa && (
                        <span className="inline-block px-2 py-0.5 border border-[var(--sw-cobalt)] text-[var(--sw-cobalt)] sw-mono text-[10px] font-bold">
                          CGPA / SCORE: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="md:col-span-4 sw-mono text-xs text-[var(--sw-text-muted)] md:text-right font-medium">
                      {edu.institution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 9.5 CERTIFICATIONS (If Present) ─── */}
        {showCertifications && (
          <section className="sw-section-pad-sm border-b border-[var(--sw-border)] bg-[var(--sw-bg)] py-12">
            <div className="sw-container">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[var(--sw-border)]">
                <span className="sw-section-num">09</span>
                <span className="sw-meta-tag">ACCREDITATIONS &amp; CERTIFICATIONS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rawCertifications.map((cert, idx) => (
                  <div key={idx} className="p-6 border border-[var(--sw-border)] bg-[var(--sw-bg)] space-y-2">
                    <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                      ACCREDITATION / 0{idx + 1}
                    </span>
                    <h5 className="sw-condensed text-2xl text-[var(--sw-text-primary)]">
                      {cert.name || cert.title}
                    </h5>
                    {(cert.issuer || cert.issueDate) && (
                      <p className="sw-mono text-xs text-[var(--sw-text-muted)]">
                        {cert.issuer} {cert.issueDate ? `· ${cert.issueDate}` : ""}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sw-mono text-xs text-[var(--sw-cobalt)] inline-flex items-center gap-1 hover:underline pt-2 font-bold"
                      >
                        VERIFY <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 18. CONTACT (08 / CONTACT — Architectural Panel) ─── */}
        {showContact && (
          <section id="contact" className="sw-section-pad border-b border-[var(--sw-border)] bg-[var(--sw-bg)]">
            <div className="sw-container">
              <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[var(--sw-border)]">
                <span className="sw-section-num">09</span>
                <span className="sw-meta-tag">INITIATE CONVERSATION</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 space-y-6">
                  {/* Huge Typography: LET'S BUILD. */}
                  <h2 className="sw-display-title text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[var(--sw-text-primary)] tracking-tighter leading-[0.84]">
                    LET'S<br />
                    <span className="text-[var(--sw-cobalt)]">BUILD.</span>
                  </h2>

                  <p className="text-base text-[var(--sw-text-secondary)] font-light leading-relaxed max-w-lg">
                    Have an interesting engineering problem, product architecture requirement, or system commission?
                  </p>

                  {email && (
                    <div className="pt-4">
                      <a
                        href={`mailto:${email}`}
                        className="sw-btn sw-btn-primary py-3 px-6 text-sm"
                      >
                        START A CONVERSATION
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-[var(--sw-border)] lg:pl-10 lg:pt-6">
                  {/* Direct Email */}
                  {email && (
                    <div className="space-y-2 pb-6 border-b border-[var(--sw-border)]">
                      <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                        DIRECT INBOX
                      </span>
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={`mailto:${email}`}
                          className="sw-mono text-sm sm:text-base font-bold text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] transition-colors truncate"
                        >
                          {email}
                        </a>
                        <button
                          onClick={handleCopyEmail}
                          className="p-1.5 border border-[var(--sw-border)] hover:border-[var(--sw-cobalt)] text-[var(--sw-text-muted)] hover:text-[var(--sw-cobalt)] transition-colors cursor-pointer"
                          title="Copy email"
                        >
                          {copiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Direct Phone */}
                  {phone && (
                    <div className="space-y-2 pb-6 border-b border-[var(--sw-border)]">
                      <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                        DIRECT VOICE
                      </span>
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="sw-mono text-sm sm:text-base font-bold text-[var(--sw-text-primary)] hover:text-[var(--sw-cobalt)] transition-colors truncate"
                        >
                          {phone}
                        </a>
                        <button
                          onClick={handleCopyPhone}
                          className="p-1.5 border border-[var(--sw-border)] hover:border-[var(--sw-cobalt)] text-[var(--sw-text-muted)] hover:text-[var(--sw-cobalt)] transition-colors cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedPhone ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Social Handles */}
                  {socialLinksList.length > 0 && (
                    <div className="space-y-3">
                      <span className="sw-mono text-[10px] text-[var(--sw-text-muted)] font-bold block">
                        EXTERNAL NODES
                      </span>
                      <div className="flex flex-wrap gap-4 sw-mono text-xs font-bold">
                        {socialLinksList.map((social, sIdx) => {
                          const IconComp = resolveSocialIcon(social.type, social.name);
                          return (
                            <a
                              key={sIdx}
                              href={social.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-[var(--sw-cobalt)] inline-flex items-center gap-1.5 py-1 border-b border-transparent hover:border-[var(--sw-cobalt)] transition-all"
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{social.name}</span>
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
      </main>

      {/* ─── 19. FOOTER & 20. SMARTNSHINE BRAND LAYER ─── */}
      <footer className="py-12 bg-[var(--sw-bg)] border-t border-[var(--sw-border)] sw-mono text-xs">
        <div className="sw-container space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--sw-border)]">
            <div>
              <span className="sw-condensed text-2xl text-[var(--sw-text-primary)] font-bold block">
                {name.toUpperCase()}
              </span>
              <span className="text-[10px] text-[var(--sw-text-muted)]">
                DESIGN / DEVELOPMENT / ARCHITECTURE
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[var(--sw-text-muted)]">
                © {currentYear} ALL RIGHTS RESERVED
              </span>
              <button
                onClick={() => scrollTo("hero")}
                className="hover:text-[var(--sw-cobalt)] inline-flex items-center gap-1 transition-colors cursor-pointer font-bold"
              >
                <span>BACK TO TOP</span>
                <ChevronUp className="w-3.5 h-3.5 text-[var(--sw-cobalt)]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[var(--sw-text-muted)]">
            <span>SMARTNSHINE / MINIMAL II</span>
            <span>A SMARTNSHINE TEMPLATE · DIGITAL EDITION</span>
          </div>
        </div>
      </footer>

      {/* ─── CASE STUDY & PROJECT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-[var(--sw-cobalt)] bg-[var(--sw-bg)] p-6 sm:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 border border-[var(--sw-border)] hover:border-[var(--sw-cobalt)] text-[var(--sw-text-muted)] hover:text-[var(--sw-cobalt)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block mb-1">
                    {selectedProject.category} · {selectedProject.year}
                  </span>
                  <h3 className="sw-condensed text-4xl sm:text-5xl text-[var(--sw-text-primary)] leading-[0.92]">
                    {selectedProject.title}
                  </h3>
                </div>

                {selectedProject.image && (
                  <div className="border border-[var(--sw-border)] aspect-video overflow-hidden bg-[var(--sw-bg-surface)]">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4 text-xs sm:text-sm text-[var(--sw-text-secondary)] font-light leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description ? (
                    <p>{selectedProject.longDescription || selectedProject.description}</p>
                  ) : null}

                  {(selectedProject.problem || selectedProject.approach || selectedProject.result) && (
                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[var(--sw-border)]">
                      {selectedProject.problem && (
                        <div className="space-y-1">
                          <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                            01 / THE PROBLEM
                          </span>
                          <p className="text-xs text-[var(--sw-text-secondary)] font-light">
                            {selectedProject.problem}
                          </p>
                        </div>
                      )}
                      {selectedProject.approach && (
                        <div className="space-y-1">
                          <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                            02 / THE APPROACH
                          </span>
                          <p className="text-xs text-[var(--sw-text-secondary)] font-light">
                            {selectedProject.approach}
                          </p>
                        </div>
                      )}
                      {selectedProject.result && (
                        <div className="space-y-1">
                          <span className="sw-mono text-[10px] text-[var(--sw-cobalt)] font-bold block">
                            03 / THE RESULT
                          </span>
                          <p className="text-xs text-[var(--sw-text-secondary)] font-light">
                            {selectedProject.result}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tech Tags & Actions */}
                <div className="pt-6 border-t border-[var(--sw-border)] flex flex-wrap items-center justify-between gap-4">
                  {selectedProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 border border-[var(--sw-border)] sw-mono text-[10px] bg-[var(--sw-bg-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 ml-auto">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sw-btn sw-btn-primary py-2 px-4 text-xs"
                      >
                        LIVE DEMO
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sw-btn py-2 px-4 text-xs"
                      >
                        <Github className="w-3.5 h-3.5" />
                        CODE
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
