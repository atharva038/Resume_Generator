import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/smartnshine-theme.css";
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

export default function SmartNShineTheme({
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
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorFollowerPos, setCursorFollowerPos] = useState({ x: -100, y: -100 });

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

  // 2. Profile resolution (Pure User Data)
  const name = profile?.name || "Portfolio";
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
  const role = rawTitle || (rawTagline.length <= 45 ? rawTagline : "Full-Stack Developer");
  const bio = profile?.about || profile?.bio || profile?.summary || rawTagline || "";
  const location = profile?.location || data?.contact?.location || "";
  const email = profile?.email || data?.contact?.email || "";
  const phone = profile?.phone || profile?.mobile || profile?.contactNumber || profile?.phoneNumber || data?.contact?.phone || data?.contact?.mobile || "";
  const profileImage = resolveImageUrl(profile?.profileImage || profile?.heroImage || "");
  const resumeUrl = actions?.resumeDownloadUrl || profile?.resumeUrl || "";
  const availabilityStatus = profile?.availabilityStatus || (profile?.isAvailable ? "Available for select opportunities" : "");
  const headline = profile?.headline || profile?.heroHeadline || "";
  const quote = profile?.quote || profile?.editorialQuote || "";

  // 3. Projects data normalization
  const projectsList =
    Array.isArray(rawProjects) && rawProjects.length > 0
      ? rawProjects.map((p, idx) => ({
          id: p.id || p._id || `proj-${idx}`,
          number: `0${idx + 1}`,
          category: p.category || (p.featured ? "Featured Project" : "Project"),
          title: p.title || "Untitled Project",
          description:
            p.shortDescription ||
            p.description ||
            p.longDescription ||
            p.problem ||
            "",
          longDescription: p.longDescription || "",
          problem: p.problem || "",
          solution: p.solution || "",
          impact: p.impact || "",
          year: p.year || (p.duration ? p.duration.split("-")[0] : ""),
          technologies: Array.isArray(p.technologies)
            ? p.technologies
            : typeof p.technologies === "string"
            ? p.technologies.split(",").map((s) => s.trim())
            : [],
          liveUrl: p.links?.live || p.liveUrl || "",
          githubUrl: p.links?.github || p.githubUrl || "",
          caseStudyUrl: p.links?.caseStudy || "",
          image: resolveImageUrl(p.images?.[0]?.url || p.image || ""),
          highlights: p.highlights || [],
        }))
      : [];

  // 4. Experience data normalization
  const experienceList =
    Array.isArray(rawExperience) && rawExperience.length > 0
      ? rawExperience.map((exp) => ({
          period:
            exp.dateRange ||
            `${exp.startDate || ""} — ${
              exp.current ? "Present" : exp.endDate || ""
            }`,
          role: exp.role || exp.title || "",
          company: exp.company || "",
          location: exp.location || location,
          description: exp.description || "",
          contributions: Array.isArray(exp.highlights) && exp.highlights.length > 0
            ? exp.highlights
            : Array.isArray(exp.responsibilities)
            ? exp.responsibilities
            : [],
        }))
      : [];

  // 5. Education data normalization
  const educationList =
    Array.isArray(rawEducation) && rawEducation.length > 0
      ? rawEducation.map((edu) => ({
          degree: edu.degree || edu.fieldOfStudy || "",
          institution: edu.institution || edu.school || "",
          year: edu.dateRange || `${edu.startDate || ""} — ${edu.endDate || ""}`,
          grade: edu.grade || edu.gpa || "",
          honors: edu.honors || edu.achievements?.join(", ") || "",
        }))
      : [];

  // 6. Skills categorization
  const categorizedSkillsData = (() => {
    if (Array.isArray(rawSkills) && rawSkills.length > 0) {
      if (typeof rawSkills[0] === "object" && rawSkills[0].category) {
        return rawSkills.map((c) => ({
          category: (c.category || "SKILLS").toUpperCase(),
          items: (c.skills || c.items || []).map((s) =>
            typeof s === "string" ? s : s.name
          ),
        }));
      }
      const flat = rawSkills.map((s) => (typeof s === "string" ? s : s.name));
      return [
        { category: "CORE EXPERTISE", items: flat },
      ].filter((g) => g.items.length > 0);
    }
    return [];
  })();

  const skillsListFlat = Array.isArray(rawSkills)
    ? rawSkills.map((s) => (typeof s === "string" ? s : s.name || s.skills || "")).flat().filter(Boolean)
    : [];

  // 7. Stats / Achievements
  const statsList =
    Array.isArray(rawAchievements) && rawAchievements.length > 0
      ? rawAchievements.slice(0, 4).map((a, idx) => ({
          number: a.metric || `0${idx + 1}`,
          label: a.title || "Milestone",
          subtext: a.description || "",
        }))
      : [];

  // 8. Social Links normalization
  const socialLinksList =
    Array.isArray(rawLinks) && rawLinks.length > 0
      ? rawLinks.map((l) => ({
          name: l.label || l.type || "Social Link",
          url: l.url || "#",
          type: l.type || "",
        }))
      : Array.isArray(profile?.socialLinks) && profile.socialLinks.length > 0
      ? profile.socialLinks.map((l) => ({
          name: l.name || l.label || l.type || "Social Link",
          url: l.url || "#",
          type: l.type || "",
        }))
      : [];

  // 9. Certifications normalization
  const certificationsList =
    Array.isArray(rawCertifications) && rawCertifications.length > 0
      ? rawCertifications
      : [];

  // 10. Marquee list (from user skills or role/name)
  const marqueeList = (() => {
    if (skillsListFlat.length > 0) {
      return skillsListFlat;
    }
    if (role) {
      return [role, name, "Portfolio", "Selected Work"].filter(Boolean);
    }
    return [];
  })();

  // 11. Section Visibility Flags
  const showAbout =
    sections?.showAbout !== false &&
    Boolean(bio || educationList.length > 0 || location || role || quote);
  const showProjects = sections?.showProjects !== false && projectsList.length > 0;
  const showSkills = sections?.showSkills !== false && categorizedSkillsData.length > 0;
  const showExperience = sections?.showExperience !== false && experienceList.length > 0;
  const showCertifications =
    sections?.showCertifications !== false && certificationsList.length > 0;
  const showAchievements =
    sections?.showAchievements !== false && statsList.length > 0;
  const showCustomSections =
    sections?.showCustomSections !== false && rawCustomSections.length > 0;
  const showContact = sections?.showContact !== false;

  // Accent resolution
  const activeAccent = propAccentColor || themeAccent || "#b8943f";

  // Custom Cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => {
        setCursorFollowerPos({ x: e.clientX, y: e.clientY });
      }, 40);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth scroll helper
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

  // Handle contact button click
  const handleContactClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (actions?.onContactClick) {
      actions.onContactClick();
    }
    scrollTo("contact");
  };

  // Copy email helper
  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  // Copy phone helper
  const handleCopyPhone = () => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      toast.success("Phone number copied to clipboard");
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  return (
    <div
      className={`smartnshine-theme ${isDark ? "dark-mode" : ""}`}
      style={{ "--sns-gold": activeAccent }}
    >
      {/* Dynamic Cursor */}
      <div
        className="sns-cursor-dot"
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
      />
      <div
        className="sns-cursor-ring"
        style={{
          transform: `translate3d(${cursorFollowerPos.x - 16}px, ${
            cursorFollowerPos.y - 16
          }px, 0)`,
        }}
      />

      {/* ─── 1. FLOATING LUXURY NAVBAR ─── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 border-b border-[var(--sns-border)] bg-[var(--sns-bg)]/85">
        <div className="sns-container flex items-center justify-between h-20">
          {/* Monogram Brand */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <span className="sns-serif text-2xl font-normal tracking-tight text-[var(--sns-text-primary)]">
              {initials[0]}
              <span className="text-[var(--sns-gold)] italic font-serif">·</span>
              {initials[1] || initials[0]}
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--sns-text-secondary)] opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
              {name}
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-[var(--sns-text-secondary)]">
            {showAbout && (
              <button
                onClick={() => scrollTo("about")}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                About
              </button>
            )}
            {showProjects && (
              <button
                onClick={() => scrollTo("work")}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                Selected Work
              </button>
            )}
            {showExperience && (
              <button
                onClick={() => scrollTo("experience")}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                Experience
              </button>
            )}
            {showSkills && (
              <button
                onClick={() => scrollTo("skills")}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                Skills
              </button>
            )}
            {showCertifications && (
              <button
                onClick={() => scrollTo("certifications")}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                Certifications
              </button>
            )}
            {showContact && (
              <button
                onClick={handleContactClick}
                className="sns-link-underline hover:text-[var(--sns-text-primary)] transition-colors py-1 cursor-pointer"
              >
                Contact
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-full border border-[var(--sns-border)] flex items-center justify-center text-[var(--sns-text-secondary)] hover:text-[var(--sns-gold)] hover:border-[var(--sns-border-gold)] transition-all duration-300 cursor-pointer"
              title={isDark ? "Switch to Warm Ivory" : "Switch to Deep Charcoal"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Let's Talk CTA */}
            {showContact && (
              <button
                type="button"
                onClick={handleContactClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] transition-all duration-300 cursor-pointer"
              >
                Let's talk
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--sns-gold)]" />
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--sns-text-primary)] focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--sns-border)] bg-[var(--sns-bg)] px-6 py-8 flex flex-col gap-6"
            >
              {showAbout && (
                <button
                  onClick={() => scrollTo("about")}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  About
                </button>
              )}
              {showProjects && (
                <button
                  onClick={() => scrollTo("work")}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  Selected Work
                </button>
              )}
              {showExperience && (
                <button
                  onClick={() => scrollTo("experience")}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  Experience
                </button>
              )}
              {showSkills && (
                <button
                  onClick={() => scrollTo("skills")}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  Skills &amp; Craft
                </button>
              )}
              {showCertifications && (
                <button
                  onClick={() => scrollTo("certifications")}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  Certifications
                </button>
              )}
              {showContact && (
                <button
                  onClick={handleContactClick}
                  className="sns-serif text-2xl text-left text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] cursor-pointer"
                >
                  Contact
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ─── 2. HERO SECTION ─── */}
        <section id="hero" className="relative min-h-[85vh] flex items-end pb-16 pt-10 overflow-hidden">
          {/* Subtle Background Watermark Number */}
          <div className="absolute top-6 right-6 md:right-16 sns-serif text-[110px] md:text-[210px] font-normal leading-none select-none pointer-events-none opacity-[0.04] text-[var(--sns-text-primary)]">
            01
          </div>

          <div className="sns-container w-full relative z-10">
            {/* Top Grid: Headline + Right Cutout Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-end mb-12">
              {/* Left Column: Eyebrow + Headline */}
              <div className="lg:col-span-8 space-y-8">
                {/* Eyebrow & Status */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3.5"
                >
                  <span className="sns-eyebrow">PORTFOLIO</span>
                  {location ? (
                    <>
                      <span className="w-4 h-[1px] bg-[var(--sns-border-gold)]" />
                      <span className="sns-eyebrow flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[var(--sns-gold)]" />
                        {location}
                      </span>
                    </>
                  ) : null}
                  {availabilityStatus ? (
                    <>
                      <span className="w-4 h-[1px] bg-[var(--sns-border-gold)]" />
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--sns-border-gold)] bg-[var(--sns-gold-dim)]">
                        <span className="sns-live-pulse" />
                        <span className="text-[11px] font-medium tracking-wide text-[var(--sns-gold)]">
                          {availabilityStatus}
                        </span>
                      </div>
                    </>
                  ) : null}
                </motion.div>

                {/* Giant Typography Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className={`sns-headline ${
                    headline && headline.length > 40
                      ? "text-3xl sm:text-5xl md:text-6xl lg:text-6xl"
                      : "text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem]"
                  } text-[var(--sns-text-primary)] max-w-3xl leading-[1.04]`}
                >
                  {headline ? (
                    <span>{headline}</span>
                  ) : (
                    <>
                      Building <br className="hidden sm:block" />
                      <em className="italic font-serif text-[var(--sns-gold)]">thoughtful</em>{" "}
                      <br className="hidden sm:block" />
                      digital experiences.
                    </>
                  )}
                </motion.h1>
              </div>

              {/* Right Column: Editorial Hero Cutout Image */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end lg:-translate-y-4 xl:-translate-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="sns-hero-image-wrap relative w-full max-w-xs sm:max-w-sm lg:max-w-[360px]"
                >
                  {/* Subtle ambient backdrop aura behind cutout */}
                  <div className="absolute inset-0 -top-8 rounded-full bg-[var(--sns-gold-dim)] blur-3xl opacity-60 pointer-events-none" />

                  {profileImage ? (
                    <div className="relative z-10 w-full flex justify-center">
                      <img
                        src={profileImage}
                        alt={name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="sns-hero-image-fade w-full max-h-[390px] sm:max-h-[440px] lg:max-h-[470px] object-contain object-bottom"
                      />
                    </div>
                  ) : (
                    /* Elegant editorial card when no photo is uploaded */
                    <div className="sns-hero-image-fade relative z-10 w-full aspect-[4/5] max-h-[380px] rounded-2xl border border-[var(--sns-border-gold)] bg-gradient-to-b from-[var(--sns-bg-surface-elevated)] via-[var(--sns-bg-surface)] to-transparent p-6 flex flex-col justify-between overflow-hidden shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="sns-eyebrow text-[10px] text-[var(--sns-gold)]">PORTFOLIO</span>
                        <Sparkles className="w-4 h-4 text-[var(--sns-gold)] opacity-70" />
                      </div>
                      <div className="text-center my-auto space-y-2">
                        <span className="sns-serif text-6xl text-[var(--sns-gold)] font-light block opacity-85">
                          {initials}
                        </span>
                        <span className="text-xs font-semibold text-[var(--sns-text-primary)] block">
                          {name}
                        </span>
                        {role && (
                          <span className="text-[10px] text-[var(--sns-text-muted)] tracking-wider uppercase block">
                            {role}
                          </span>
                        )}
                      </div>
                      <div className="pt-3 border-t border-[var(--sns-border)] flex items-center justify-between text-[10px] font-mono text-[var(--sns-text-muted)]">
                        <span>PORTFOLIO</span>
                        {location && <span>{location.split(",")[0]}</span>}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Bottom Meta Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-8 border-t border-[var(--sns-border)]"
            >
              <div className="md:col-span-7">
                <p className="text-base sm:text-lg text-[var(--sns-text-secondary)] font-light leading-relaxed max-w-xl">
                  {bio ? (
                    bio.toLowerCase().startsWith("i am") || bio.toLowerCase().startsWith("i'm") ? (
                      bio
                    ) : (
                      <>
                        I'm <strong className="font-semibold text-[var(--sns-text-primary)]">{name}</strong>
                        {role ? <>, a <span className="text-[var(--sns-text-primary)]">{role}</span></> : null}
                        {bio ? <> — {bio}</> : <> focused on building thoughtful digital experiences.</>}
                      </>
                    )
                  ) : (
                    <>
                      I'm <strong className="font-semibold text-[var(--sns-text-primary)]">{name}</strong>
                      {role ? <>, a <span className="text-[var(--sns-text-primary)]">{role}</span></> : null}
                      <> focused on building useful products and meaningful experiences.</>
                    </>
                  )}
                </p>
              </div>

              {role && (
                <div className="md:col-span-4 md:border-l md:border-[var(--sns-border-gold)] md:pl-6">
                  <span className="block text-[10px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase mb-1">
                    ROLE / FOCUS
                  </span>
                  <span className="text-sm font-medium text-[var(--sns-text-primary)]">
                    {role}
                  </span>
                </div>
              )}

              <div className={`${role ? "md:col-span-1" : "md:col-span-5"} flex justify-end`}>
                <button
                  onClick={() => scrollTo(showProjects ? "work" : showAbout ? "about" : "contact")}
                  className="w-11 h-11 rounded-full border border-[var(--sns-border)] hover:border-[var(--sns-gold)] flex items-center justify-center text-[var(--sns-text-muted)] hover:text-[var(--sns-gold)] transition-colors cursor-pointer"
                  aria-label="Scroll down"
                >
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 3. CONTINUOUS MARQUEE STRIP ─── */}
        {marqueeList.length > 0 && (
          <section className="sns-marquee-container" aria-hidden="true">
            <div className="sns-marquee-track">
              {marqueeList.concat(marqueeList).map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold tracking-widest uppercase text-[var(--sns-text-muted)] flex items-center gap-6"
                >
                  {item}
                  <span className="text-[var(--sns-gold)] text-sm font-serif">✦</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. FEATURED WORK ─── */}
        {showProjects && (
          <section id="work" className="sns-section-pad">
            <div className="sns-container">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-6 border-b border-[var(--sns-border)]">
                <div>
                  <span className="sns-eyebrow block mb-3">02 — SELECTED WORK</span>
                  <h2 className="sns-subheading text-4xl sm:text-5xl md:text-6xl text-[var(--sns-text-primary)]">
                    Featured Projects
                  </h2>
                </div>
                <p className="text-xs text-[var(--sns-text-muted)] tracking-wider uppercase mt-4 md:mt-0 font-medium">
                  {projectsList.length} {projectsList.length === 1 ? "Project" : "Projects"}
                </p>
              </div>

              <div className="space-y-24 md:space-y-36">
                {projectsList.map((project, idx) => {
                  const isReverse = idx % 2 !== 0;
                  return (
                    <article
                      key={project.id || idx}
                      className="sns-project-card group grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center"
                    >
                      {/* Visual Block */}
                      <div
                        onClick={() => {
                          if (actions?.onProjectClick) {
                            actions.onProjectClick(project);
                          } else {
                            setSelectedProject(project);
                          }
                        }}
                        className={`lg:col-span-7 cursor-pointer ${
                          isReverse ? "lg:order-2" : "lg:order-1"
                        }`}
                      >
                        <div className="relative overflow-hidden rounded-md border border-[var(--sns-border)] bg-[var(--sns-bg-surface)] aspect-[16/10] flex items-center justify-center p-8 group-hover:border-[var(--sns-border-gold)] transition-colors duration-500">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              className="sns-project-img w-full h-full object-cover rounded-sm absolute inset-0"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--sns-bg-surface-elevated)] via-transparent to-[var(--sns-gold-dim)] opacity-60" />
                              <div className="relative z-10 text-center">
                                <span className="sns-serif text-6xl md:text-8xl text-[var(--sns-gold)] font-light tracking-tight opacity-70 block mb-2 group-hover:scale-105 transition-transform duration-700">
                                  {project.title.slice(0, 3).toUpperCase()}
                                </span>
                                <span className="text-xs font-mono tracking-widest text-[var(--sns-text-muted)] uppercase">
                                  {project.category}
                                </span>
                              </div>
                            </>
                          )}

                          {project.year && (
                            <div className="absolute top-4 left-5 text-xs font-mono text-[var(--sns-text-muted)] bg-[var(--sns-bg)]/80 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                              {project.year}
                            </div>
                          )}
                          <div className="absolute bottom-4 right-5 sns-serif text-3xl text-[var(--sns-border-gold)] font-light">
                            {project.number}
                          </div>
                        </div>
                      </div>

                      {/* Info Block */}
                      <div
                        className={`lg:col-span-5 ${
                          isReverse ? "lg:order-1" : "lg:order-2"
                        } space-y-5`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold tracking-widest text-[var(--sns-gold)] uppercase">
                            {project.category}
                          </span>
                          <span className="sns-serif text-2xl text-[var(--sns-text-muted)] opacity-60">
                            {project.number}
                          </span>
                        </div>

                        <h3
                          onClick={() => setSelectedProject(project)}
                          className="sns-subheading text-3xl sm:text-4xl text-[var(--sns-text-primary)] group-hover:text-[var(--sns-gold)] transition-colors cursor-pointer"
                        >
                          {project.title}
                        </h3>

                        {project.description && (
                          <p className="text-sm sm:text-base text-[var(--sns-text-secondary)] font-light leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        {/* Technologies Tags */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.technologies.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-sm border border-[var(--sns-border)] text-[var(--sns-text-muted)] bg-[var(--sns-bg-surface)] group-hover:border-[var(--sns-border-gold)] group-hover:text-[var(--sns-text-secondary)] transition-colors"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 flex items-center gap-6">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] sns-link-underline py-1"
                            >
                              Live Preview
                              <ArrowUpRight className="w-4 h-4 text-[var(--sns-gold)]" />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--sns-text-muted)] hover:text-[var(--sns-text-primary)] transition-colors py-1"
                            >
                              <Github className="w-3.5 h-3.5" />
                              GitHub
                            </a>
                          )}

                          <button
                            onClick={() => setSelectedProject(project)}
                            className="text-xs font-semibold tracking-wider uppercase text-[var(--sns-gold)] hover:underline ml-auto cursor-pointer"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── 5. ABOUT SECTION ─── */}
        {showAbout && (
          <section id="about" className="sns-section-pad bg-[var(--sns-bg-surface)] border-y border-[var(--sns-border)]">
            <div className="sns-container">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                <div className="lg:col-span-5 lg:sticky lg:top-28">
                  <span className="sns-eyebrow block mb-4">03 — ABOUT</span>
                  <blockquote className="sns-headline text-3xl sm:text-4xl md:text-5xl text-[var(--sns-text-primary)] leading-tight">
                    {quote ? (
                      quote
                    ) : role ? (
                      <>
                        Focused on excellence in{" "}
                        <em className="italic font-serif text-[var(--sns-gold)]">{role}</em>
                      </>
                    ) : (
                      <>
                        Building with{" "}
                        <em className="italic font-serif text-[var(--sns-gold)]">purpose</em> and precision.
                      </>
                    )}
                  </blockquote>
                </div>

                <div className="lg:col-span-7 space-y-8">
                  {bio && (
                    <div className="space-y-5 text-base sm:text-lg text-[var(--sns-text-secondary)] font-light leading-relaxed">
                      <p>{bio}</p>
                    </div>
                  )}

                  {/* Dynamic Details Grid */}
                  {(educationList[0] || role || location || skillsListFlat.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--sns-border)]">
                      {educationList[0] && (
                        <div>
                          <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase mb-1">
                            EDUCATION
                          </span>
                          <p className="text-sm font-medium text-[var(--sns-text-primary)]">
                            {educationList[0].degree}
                          </p>
                          <p className="text-xs text-[var(--sns-text-muted)]">
                            {educationList[0].institution} {educationList[0].year ? `(${educationList[0].year})` : ""}
                          </p>
                        </div>
                      )}

                      {role && (
                        <div>
                          <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase mb-1">
                            PRIMARY FOCUS
                          </span>
                          <p className="text-sm font-medium text-[var(--sns-text-primary)]">
                            {role}
                          </p>
                        </div>
                      )}

                      {location && (
                        <div>
                          <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase mb-1">
                            LOCATION
                          </span>
                          <p className="text-sm font-medium text-[var(--sns-text-primary)]">
                            {location}
                          </p>
                        </div>
                      )}

                      {skillsListFlat.length > 0 && (
                        <div>
                          <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase mb-1">
                            KEY SKILLS
                          </span>
                          <p className="text-sm font-medium text-[var(--sns-text-primary)]">
                            {skillsListFlat.slice(0, 4).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Download CV Action */}
                  <div className="pt-4 flex items-center gap-4">
                    {resumeUrl && resumeUrl !== "#" ? (
                      <a
                        href={resumeUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] bg-[var(--sns-bg)] transition-all duration-300"
                      >
                        <Download className="w-3.5 h-3.5 text-[var(--sns-gold)]" />
                        Download CV / Resume
                      </a>
                    ) : actions?.onResumeClick ? (
                      <button
                        onClick={actions.onResumeClick}
                        className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] bg-[var(--sns-bg)] transition-all duration-300 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[var(--sns-gold)]" />
                        View Full Resume
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── 6. NUMBERS & IMPACT ─── */}
        {showAchievements && (
          <section className="py-20 border-b border-[var(--sns-border)] bg-[var(--sns-bg)]">
            <div className="sns-container">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {statsList.map((stat, sIdx) => (
                  <div
                    key={sIdx}
                    className="space-y-2 border-l border-[var(--sns-border-gold)] pl-6 py-2"
                  >
                    <span className="sns-serif text-5xl sm:text-6xl md:text-7xl text-[var(--sns-text-primary)] leading-none block font-light">
                      {stat.number}
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide text-[var(--sns-text-primary)] block">
                      {stat.label}
                    </span>
                    {stat.subtext && (
                      <span className="text-[11px] text-[var(--sns-text-muted)] block">
                        {stat.subtext}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 7. EXPERIENCE TIMELINE ─── */}
        {showExperience && (
          <section id="experience" className="sns-section-pad">
            <div className="sns-container">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 pb-6 border-b border-[var(--sns-border)]">
                <div>
                  <span className="sns-eyebrow block mb-3">04 — CAREER TRAJECTORY</span>
                  <h2 className="sns-subheading text-4xl sm:text-5xl md:text-6xl text-[var(--sns-text-primary)]">
                    Experience
                  </h2>
                </div>
                <p className="text-xs text-[var(--sns-text-muted)] tracking-wider uppercase mt-4 md:mt-0 font-medium">
                  {experienceList.length} {experienceList.length === 1 ? "Role" : "Roles"}
                </p>
              </div>

              <div className="space-y-0 divide-y divide-[var(--sns-border)]">
                {experienceList.map((item, idx) => (
                  <div
                    key={idx}
                    className="sns-timeline-row py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start group"
                  >
                    <div className="md:col-span-3">
                      <span className="text-xs font-mono text-[var(--sns-gold)] tracking-wider uppercase font-semibold">
                        {item.period}
                      </span>
                      {item.location && (
                        <span className="block text-xs text-[var(--sns-text-muted)] mt-1">
                          {item.location}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <h3 className="sns-subheading text-2xl sm:text-3xl text-[var(--sns-text-primary)] group-hover:text-[var(--sns-gold)] transition-colors">
                        {item.role}
                      </h3>
                      {item.company && (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs font-semibold tracking-wider uppercase text-[var(--sns-text-secondary)]">
                            {item.company}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-5 space-y-4">
                      {item.description && (
                        <p className="text-sm sm:text-base text-[var(--sns-text-secondary)] font-light leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {item.contributions && item.contributions.length > 0 && (
                        <ul className="space-y-2 pt-2">
                          {item.contributions.map((c, cIdx) => (
                            <li
                              key={cIdx}
                              className="text-xs sm:text-sm text-[var(--sns-text-muted)] flex items-start gap-2.5 font-light"
                            >
                              <span className="text-[var(--sns-gold)] mt-0.5 text-xs">―</span>
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

        {/* ─── 8. SKILLS & CRAFT ─── */}
        {showSkills && (
          <section id="skills" className="sns-section-pad bg-[var(--sns-bg-surface)] border-y border-[var(--sns-border)]">
            <div className="sns-container">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--sns-border)]">
                <div>
                  <span className="sns-eyebrow block mb-3">05 — TOOLKIT &amp; METHODOLOGY</span>
                  <h2 className="sns-subheading text-4xl sm:text-5xl md:text-6xl text-[var(--sns-text-primary)]">
                    Skills &amp; Craft
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                {categorizedSkillsData.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-6">
                    <div className="pb-3 border-b border-[var(--sns-border-gold)]">
                      <span className="text-xs font-semibold tracking-widest uppercase text-[var(--sns-gold)]">
                        {group.category}
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {group.items.map((skill, sIdx) => (
                        <li
                          key={sIdx}
                          className="sns-serif text-xl sm:text-2xl text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] hover:translate-x-1.5 transition-all duration-200 cursor-default flex items-center justify-between border-b border-[var(--sns-border)] pb-2.5"
                        >
                          <span>{skill}</span>
                          <span className="text-xs font-mono text-[var(--sns-text-muted)] opacity-40 font-sans">
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

        {/* ─── 9. CERTIFICATIONS ─── */}
        {showCertifications && (
          <section id="certifications" className="sns-section-pad bg-[var(--sns-bg)]">
            <div className="sns-container">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--sns-border)]">
                <div>
                  <span className="sns-eyebrow block mb-3">06 — CREDENTIALS</span>
                  <h2 className="sns-subheading text-4xl sm:text-5xl md:text-6xl text-[var(--sns-text-primary)]">
                    Certifications
                  </h2>
                </div>
                <p className="text-xs text-[var(--sns-text-muted)] tracking-wider uppercase mt-4 md:mt-0 font-medium">
                  {certificationsList.length} {certificationsList.length === 1 ? "Credential" : "Credentials"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {certificationsList.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-md border border-[var(--sns-border)] bg-[var(--sns-bg-surface)] hover:border-[var(--sns-border-gold)] transition-colors duration-300 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-2">
                      <Award className="w-6 h-6 text-[var(--sns-gold)] mb-2" />
                      <h4 className="sns-serif text-xl text-[var(--sns-text-primary)]">
                        {cert.name || cert.title}
                      </h4>
                      {(cert.issuer || cert.issueDate) && (
                        <p className="text-xs text-[var(--sns-text-muted)]">
                          {cert.issuer ? `Issued by ${cert.issuer}` : ""} {cert.issueDate ? `· ${cert.issueDate}` : ""}
                        </p>
                      )}
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold tracking-wider uppercase text-[var(--sns-gold)] inline-flex items-center gap-1 hover:underline"
                      >
                        Verify Credential
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 9.5 CUSTOM SECTIONS (IF DEFINED BY USER) ─── */}
        {showCustomSections && (
          <section className="sns-section-pad bg-[var(--sns-bg-surface)] border-y border-[var(--sns-border)]">
            <div className="sns-container space-y-16">
              {rawCustomSections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[var(--sns-border)]">
                    <div>
                      <span className="sns-eyebrow block mb-2">ADDITIONAL SECTION</span>
                      <h3 className="sns-subheading text-3xl sm:text-4xl text-[var(--sns-text-primary)]">
                        {sec.title || sec.name || "Custom Showcase"}
                      </h3>
                    </div>
                  </div>

                  {sec.content && (
                    <p className="text-base sm:text-lg text-[var(--sns-text-secondary)] font-light leading-relaxed max-w-3xl">
                      {sec.content}
                    </p>
                  )}

                  {Array.isArray(sec.items) && sec.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sec.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-6 rounded-md border border-[var(--sns-border)] bg-[var(--sns-bg)] space-y-2"
                        >
                          <h4 className="sns-serif text-xl text-[var(--sns-text-primary)]">
                            {typeof item === "string" ? item : item.title || item.name}
                          </h4>
                          {typeof item === "object" && item.description && (
                            <p className="text-xs text-[var(--sns-text-secondary)] font-light leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 10. CONTACT SECTION ─── */}
        {showContact && (
          <section id="contact" className="sns-section-pad bg-[var(--sns-bg-surface)] border-t border-[var(--sns-border)]">
            <div className="sns-container">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
                <div className="lg:col-span-6 space-y-6">
                  <span className="sns-eyebrow block">07 — CONTACT</span>
                  <h2 className="sns-headline text-5xl sm:text-6xl md:text-7xl text-[var(--sns-text-primary)]">
                    Have an idea? <br />
                    <em className="italic font-serif text-[var(--sns-gold)]">Let's build it.</em>
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--sns-text-secondary)] font-light leading-relaxed max-w-lg">
                    Whether you're looking for collaboration, engineering, or product development, feel free to reach out.
                  </p>

                  {availabilityStatus && (
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--sns-border-gold)] bg-[var(--sns-gold-dim)]">
                        <span className="sns-live-pulse" />
                        <span className="text-xs font-medium text-[var(--sns-gold)]">
                          {availabilityStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 space-y-8 lg:pt-12">
                  {/* Email */}
                  {email && (
                    <div className="space-y-2">
                      <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase">
                        DIRECT EMAIL
                      </span>
                      <div className="flex items-center gap-2.5 max-w-full overflow-hidden">
                        <a
                          href={`mailto:${email}`}
                          className="sns-serif text-lg sm:text-xl md:text-2xl text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] inline-flex items-center gap-2 transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0"
                        >
                          <span className="truncate">{email}</span>
                          <ArrowUpRight className="w-5 h-5 text-[var(--sns-gold)] flex-shrink-0" />
                        </a>
                        <button
                          onClick={handleCopyEmail}
                          className="p-2 rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-muted)] hover:text-[var(--sns-gold)] transition-colors cursor-pointer flex-shrink-0"
                          title="Copy Email"
                        >
                          {copiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {phone && (
                    <div className="space-y-2">
                      <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase">
                        PHONE / DIRECT
                      </span>
                      <div className="flex items-center gap-2.5 max-w-full overflow-hidden">
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="sns-serif text-lg sm:text-xl md:text-2xl text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] inline-flex items-center gap-2 transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0"
                        >
                          <Phone className="w-4 h-4 text-[var(--sns-gold)] flex-shrink-0" />
                          <span className="truncate">{phone}</span>
                        </a>
                        <button
                          onClick={handleCopyPhone}
                          className="p-2 rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-muted)] hover:text-[var(--sns-gold)] transition-colors cursor-pointer flex-shrink-0"
                          title="Copy Phone Number"
                        >
                          {copiedPhone ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Social Matrix */}
                  {socialLinksList.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-[var(--sns-border)]">
                      <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-text-muted)] uppercase">
                        ONLINE PRESENCE
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        {socialLinksList.map((social, sIdx) => {
                          const IconComp = resolveSocialIcon(social.type, social.name);
                          return (
                            <a
                              key={sIdx}
                              href={social.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-sm border border-[var(--sns-border)] hover:border-[var(--sns-gold)] bg-[var(--sns-bg)] text-xs font-medium text-[var(--sns-text-primary)] hover:text-[var(--sns-gold)] transition-all flex items-center justify-between group"
                            >
                              <span className="flex items-center gap-2">
                                <IconComp className="w-3.5 h-3.5 text-[var(--sns-text-muted)] group-hover:text-[var(--sns-gold)]" />
                                <span>{social.name}</span>
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--sns-text-muted)] group-hover:text-[var(--sns-gold)] transition-colors" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fallback if no contact details provided */}
                  {!email && !phone && socialLinksList.length === 0 && (
                    <div className="p-6 rounded-md border border-[var(--sns-border-gold)] bg-[var(--sns-bg)] space-y-3">
                      <span className="block text-[11px] font-semibold tracking-widest text-[var(--sns-gold)] uppercase">
                        DIRECT CONNECT
                      </span>
                      <p className="text-sm text-[var(--sns-text-secondary)] font-light leading-relaxed">
                        Interested in collaborating, hiring, or discussing technical projects? Reach out to initiate conversation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ─── 11. FOOTER ─── */}
      <footer className="border-t border-[var(--sns-border)] bg-[var(--sns-bg)] py-10">
        <div className="sns-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="sns-serif text-lg font-normal text-[var(--sns-text-primary)]">
              {name}
            </span>
            <span className="text-xs text-[var(--sns-text-muted)]">
              · Portfolio · {new Date().getFullYear()}
            </span>
          </div>

          <button
            onClick={() => scrollTo("hero")}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--sns-text-secondary)] hover:text-[var(--sns-gold)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ChevronUp className="w-4 h-4 text-[var(--sns-gold)]" />
          </button>
        </div>
      </footer>

      {/* ─── PROJECT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--sns-border-gold)] bg-[var(--sns-bg)] p-6 sm:p-8 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-[var(--sns-border)] hover:border-[var(--sns-gold)] text-[var(--sns-text-muted)] hover:text-[var(--sns-gold)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-[var(--sns-gold)] uppercase">
                    {selectedProject.category} · {selectedProject.year}
                  </span>
                  <h3 className="sns-subheading text-3xl sm:text-4xl text-[var(--sns-text-primary)] mt-1">
                    {selectedProject.title}
                  </h3>
                </div>

                {selectedProject.image && (
                  <div className="rounded-md overflow-hidden border border-[var(--sns-border)] aspect-video">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4 text-sm sm:text-base text-[var(--sns-text-secondary)] font-light leading-relaxed">
                  <p>{selectedProject.longDescription || selectedProject.description}</p>
                  {selectedProject.problem && (
                    <div className="pt-2">
                      <strong className="font-semibold text-[var(--sns-text-primary)] block mb-1">
                        The Problem &amp; Architecture:
                      </strong>
                      <p>{selectedProject.problem}</p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="pt-2">
                      <strong className="font-semibold text-[var(--sns-text-primary)] block mb-1">
                        The Solution &amp; Engineering:
                      </strong>
                      <p>{selectedProject.solution}</p>
                    </div>
                  )}
                  {selectedProject.impact && (
                    <div className="pt-2">
                      <strong className="font-semibold text-[var(--sns-text-primary)] block mb-1">
                        Impact &amp; Metrics:
                      </strong>
                      <p>{selectedProject.impact}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--sns-border)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-sm border border-[var(--sns-border)] bg-[var(--sns-bg-surface)] text-[var(--sns-text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-sm bg-[var(--sns-gold)] text-white hover:opacity-90 transition-opacity"
                      >
                        Live Demo
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-sm border border-[var(--sns-border)] text-[var(--sns-text-primary)] hover:border-[var(--sns-gold)] transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Code
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
