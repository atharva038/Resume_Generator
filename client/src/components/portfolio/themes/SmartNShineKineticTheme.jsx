import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  Download,
  ChevronUp,
} from "lucide-react";
import "@/styles/kinetic-theme.css";
import { resolveImageUrl } from "@/utils/imageUrlResolver";
import KineticHeroObject from "./kinetic/KineticHeroObject";
import KineticProjects from "./kinetic/KineticProjects";
import KineticExperience from "./kinetic/KineticExperience";
import KineticSkills from "./kinetic/KineticSkills";
import KineticContact from "./kinetic/KineticContact";
import KineticPersistentTravelingObject from "./kinetic/KineticPersistentTravelingObject";
import KineticSpatialAtmosphere from "./kinetic/KineticSpatialAtmosphere";
import KineticMarqueeRibbon from "./kinetic/KineticMarqueeRibbon";

/**
 * SMARTNSHINE KINETIC — Interactive Motion Portfolio Theme
 * Design Philosophy: Scroll × Transformation × Spatial Motion × Generative Atmosphere
 */
export default function SmartNShineKineticTheme({
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Destructure portfolio data from adapter or raw payload
  const {
    profile = {},
    skills: rawSkills = [],
    projects: rawProjects = [],
    experience: rawExperience = [],
    links: rawLinks = [],
    actions = {},
    themeAccent,
  } = data || {};

  const name = profile?.name || "";
  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const rawTagline = profile?.tagline || "";
  const role = rawTitle || rawTagline || "";
  const bio = profile?.about || profile?.bio || profile?.summary || rawTagline || "";
  const location = profile?.location || data?.contact?.location || "";
  const email = profile?.email || data?.contact?.email || "";
  const phone = profile?.phone || profile?.mobile || profile?.contactNumber || data?.contact?.phone || "";
  const profileImage = resolveImageUrl(profile?.profileImage || profile?.heroImage || "");
  const resumeUrl = actions?.resumeDownloadUrl || profile?.resumeUrl || "";
  const availabilityStatus = profile?.availabilityStatus || (profile?.isAvailable ? "AVAILABLE FOR WORK" : "");
  const headline = profile?.headline || profile?.heroHeadline || "";

  const effectiveAccent = propAccentColor || themeAccent || (isDark ? "#38bdf8" : "#2563eb");

  // Dynamic Marquee Ribbons (Customizable by user or automatically generated from real skills & role)
  const allSkillNames = (rawSkills || []).flatMap((s) => {
    if (typeof s === "string") return [s.trim()];
    if (s && typeof s === "object") {
      if (Array.isArray(s.skills)) {
        return s.skills.map((x) => (typeof x === "string" ? x : x.name || x.skill || "")).filter(Boolean);
      }
      if (Array.isArray(s.items)) {
        return s.items.map((x) => (typeof x === "string" ? x : x.name || x.skill || "")).filter(Boolean);
      }
      return [s.name || s.skill || ""].filter(Boolean);
    }
    return [];
  }).filter(Boolean);

  const customMarquee1 = data?.settings?.marqueeText1 || data?.themeSettings?.marquee1 || profile?.marquee1 || "";
  const customMarquee2 = data?.settings?.marqueeText2 || data?.themeSettings?.marquee2 || profile?.marquee2 || "";

  const marquee1 =
    customMarquee1 ||
    ([role, ...allSkillNames.slice(0, 5)].filter(Boolean).map((s) => s.toUpperCase()).join(" × ") ||
      "ENGINEERING × ARCHITECTURE × MODERN SYSTEMS");

  const marquee2 =
    customMarquee2 ||
    ([...allSkillNames.slice(5, 12), ...(rawProjects.map((p) => p.title || p.name))].filter(Boolean).map((s) => s.toUpperCase()).join(" × ") ||
      [role, ...allSkillNames].filter(Boolean).map((s) => s.toUpperCase()).join(" × ") ||
      "INTERFACE DESIGN × PERFORMANCE × SCALABLE CODE");

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 80);
      setShowScrollTop(y > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      style={{ "--kn-accent": effectiveAccent }}
      className={`kinetic-theme ${isDark ? "dark-mode" : ""} relative min-h-screen w-full overflow-x-hidden`}
    >
      {/* Dynamic Spatial Installation Atmosphere (Replaces generic square grid) */}
      <KineticSpatialAtmosphere isDark={isDark} accentColor={effectiveAccent} />

      {/* Dynamic Global Kinetic Spine Guides */}
      <div className="pointer-events-none fixed inset-y-0 left-6 sm:left-12 w-[1px] bg-[var(--kn-border)] opacity-20 z-0 hidden xl:block" />
      <div className="pointer-events-none fixed inset-y-0 right-6 sm:right-12 w-[1px] bg-[var(--kn-border)] opacity-20 z-0 hidden xl:block" />

      {/* Persistent Traveling 3D Kinetic Object (Scrolls & Transforms across every section) */}
      <KineticPersistentTravelingObject
        name={name}
        role={role}
        profileImage={profileImage}
        tagline={bio}
        location={location}
        availabilityStatus={availabilityStatus}
        onContactClick={actions?.onContactClick}
      />

      {/* Floating Kinetic Navbar */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-5xl transition-all duration-300 ${
          isScrolled
            ? "rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg)]/80 p-2.5 shadow-2xl backdrop-blur-xl"
            : "p-2 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Mark */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider text-[var(--kn-text-primary)] hover:text-[var(--kn-accent)] transition-colors cursor-pointer"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--kn-text-primary)] text-[var(--kn-bg)] text-[10px]">
              K
            </span>
            <span className="hidden sm:inline uppercase">{name || "PORTFOLIO"}</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
            <button
              onClick={() => scrollToSection("kinetic-work-section")}
              className="text-[var(--kn-text-secondary)] hover:text-[var(--kn-text-primary)] transition-colors cursor-pointer"
            >
              01 / WORK
            </button>
            <button
              onClick={() => scrollToSection("kinetic-experience-section")}
              className="text-[var(--kn-text-secondary)] hover:text-[var(--kn-text-primary)] transition-colors cursor-pointer"
            >
              02 / TRAJECTORY
            </button>
            <button
              onClick={() => scrollToSection("kinetic-about-section")}
              className="text-[var(--kn-text-secondary)] hover:text-[var(--kn-text-primary)] transition-colors cursor-pointer"
            >
              03 / ABOUT
            </button>
            <button
              onClick={() => scrollToSection("kinetic-contact-section")}
              className="text-[var(--kn-text-secondary)] hover:text-[var(--kn-text-primary)] transition-colors cursor-pointer"
            >
              04 / CONTACT
            </button>
          </nav>

          {/* Actions: Theme Toggle, Resume & Mobile Menu */}
          <div className="flex items-center gap-2.5">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-3.5 py-1.5 text-xs font-mono font-medium text-[var(--kn-text-primary)] hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] transition-all"
              >
                <Download className="h-3 w-3" />
                <span>RESUME</span>
              </a>
            )}

            <button
              onClick={toggleDark}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] text-[var(--kn-text-primary)] hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] transition-all cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] text-[var(--kn-text-primary)]"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[var(--kn-border)] mt-3 pt-3 space-y-2 text-xs font-mono"
            >
              <button
                onClick={() => scrollToSection("kinetic-work-section")}
                className="block w-full text-left py-2 px-3 rounded-lg text-[var(--kn-text-primary)] hover:bg-[var(--kn-bg-subtle)]"
              >
                01 / WORK
              </button>
              <button
                onClick={() => scrollToSection("kinetic-experience-section")}
                className="block w-full text-left py-2 px-3 rounded-lg text-[var(--kn-text-primary)] hover:bg-[var(--kn-bg-subtle)]"
              >
                02 / TRAJECTORY
              </button>
              <button
                onClick={() => scrollToSection("kinetic-about-section")}
                className="block w-full text-left py-2 px-3 rounded-lg text-[var(--kn-text-primary)] hover:bg-[var(--kn-bg-subtle)]"
              >
                03 / ABOUT
              </button>
              <button
                onClick={() => scrollToSection("kinetic-contact-section")}
                className="block w-full text-left py-2 px-3 rounded-lg text-[var(--kn-text-primary)] hover:bg-[var(--kn-bg-subtle)]"
              >
                04 / CONTACT
              </button>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 py-2 px-3 rounded-lg text-[var(--kn-accent)] font-semibold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DOWNLOAD RESUME</span>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Flow: Hero 3D Transformation, Work, Experience, Skills & Contact */}
      <main className="relative z-10 w-full">
        
        {/* HERO: The Kinetic Stage */}
        <KineticHeroObject
          name={name}
          role={role}
          bio={bio}
          availabilityStatus={availabilityStatus}
          onExploreClick={() => scrollToSection("kinetic-work-section")}
        />

        {/* Dynamic Spatial Marquee Ribbon 01 */}
        <KineticMarqueeRibbon text={marquee1} />

        {/* SECTION 01: Continuous Project Showcase & Fluid Shader */}
        <KineticProjects
          projects={rawProjects}
          isDark={isDark}
          accentColor={effectiveAccent}
        />

        {/* SECTION 02: Experience Timeline with Kinetic Spine */}
        <KineticExperience
          experience={rawExperience}
        />

        {/* Dynamic Spatial Marquee Ribbon 02 (Reverse) */}
        <KineticMarqueeRibbon text={marquee2} reverse={true} />

        {/* SECTION 03: About Philosophy, Typographic Skills & Field Shader */}
        <KineticSkills
          bio={bio}
          headline={headline}
          location={location}
          role={role}
          skills={rawSkills}
          stats={data?.stats}
          isDark={isDark}
          accentColor={effectiveAccent}
        />

        {/* SECTION 04: Final Convergence & Kinetic CTA */}
        <KineticContact
          email={email}
          phone={phone}
          socialLinks={rawLinks}
          name={name}
          onContactClick={actions?.onContactClick}
        />

      </main>

      {/* Quick Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg)]/80 text-[var(--kn-text-primary)] shadow-xl backdrop-blur-md hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] transition-all cursor-pointer"
            title="Return to top"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
