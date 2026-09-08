import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Radio,
  Wifi,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  CornerDownRight,
  Maximize2,
  X,
  Send,
  Sliders,
  Layers,
  Code2,
  Database,
  Activity,
  Shield,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/retro-futuristic-theme.css";
import { resolveImageUrl } from "@/utils/imageUrlResolver";

/* Web Audio Synthesizer for Retro UI Sound FX (Always Active) */
class RetroSoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  beep(freq = 800, type = "sine", duration = 0.05, gainValue = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context silently ignored if autoplay policy blocks it
    }
  }

  click() {
    this.beep(1200, "square", 0.03, 0.025);
  }

  command() {
    this.beep(600, "sawtooth", 0.06, 0.03);
  }

  transmit() {
    this.beep(950, "sine", 0.12, 0.05);
    setTimeout(() => this.beep(1400, "sine", 0.18, 0.04), 80);
  }
}

const sfx = new RetroSoundFX();

/* Social Icon Resolver */
const resolveSocialIcon = (type = "", name = "") => {
  const query = `${type} ${name}`.toLowerCase();
  if (query.includes("git")) return Github;
  if (query.includes("link")) return Linkedin;
  if (query.includes("twit") || query.includes(" x")) return Twitter;
  if (query.includes("mail")) return Mail;
  return ExternalLink;
};

export default function RetroFuturisticTheme({
  data = {},
  isDarkMode: propDarkMode,
  toggleDarkMode: propToggleDarkMode,
  accentColor: propAccentColor,
}) {
  const [localDarkMode, setLocalDarkMode] = useState(true);
  const isDark = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const toggleDark =
    propToggleDarkMode || (() => setLocalDarkMode((prev) => !prev));

  // CRT Overlay State
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProjectCategory, setActiveProjectCategory] = useState("all");
  const [activeSkillCategory, setActiveSkillCategory] = useState("all");

  // Terminal interactive state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState([
    { type: "system", text: "SYSTEM_INITIALIZED: Kernel v2.026_PROD loaded." },
    { type: "prompt", cmd: "whoami", res: "Loading operator identity credentials..." },
  ]);

  // Audio Auto-Init on first user gesture
  useEffect(() => {
    const handleGesture = () => {
      sfx.init();
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
    window.addEventListener("click", handleGesture, { once: true });
    window.addEventListener("keydown", handleGesture, { once: true });
    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Transmission form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [transmitting, setTransmitting] = useState(false);

  // 1. Data Destructuring
  const {
    profile = {},
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
  const name = profile?.name || "Alex Vance";
  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const rawTagline = profile?.tagline || "";
  const role = rawTitle || (rawTagline.length <= 45 ? rawTagline : "Systems Architect & Developer");
  const bio =
    profile?.about ||
    profile?.bio ||
    profile?.summary ||
    rawTagline ||
    "Architecting scalable software systems, high-speed interfaces, and resilient digital architectures at the intersection of retro aesthetics and modern cloud precision.";
  const location = profile?.location || data?.contact?.location || "Earth // Sector 07";
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
    (profile?.isAvailable !== false ? "ONLINE // OPEN FOR SELECT PROJECTS" : "STATUS: ENGAGED");
  const headline =
    profile?.headline ||
    profile?.heroHeadline ||
    "BUILDING THE FUTURE, ONE IDEA AT A TIME.";

  // 3. Collections Normalization
  const projects = useMemo(() => (Array.isArray(rawProjects) ? rawProjects : []), [rawProjects]);
  const experience = useMemo(() => (Array.isArray(rawExperience) ? rawExperience : []), [rawExperience]);
  const education = useMemo(() => (Array.isArray(rawEducation) ? rawEducation : []), [rawEducation]);
  const certifications = useMemo(() => (Array.isArray(rawCertifications) ? rawCertifications : []), [rawCertifications]);
  const achievements = useMemo(() => (Array.isArray(rawAchievements) ? rawAchievements : []), [rawAchievements]);
  const customSections = useMemo(() => (Array.isArray(rawCustomSections) ? rawCustomSections : []), [rawCustomSections]);
  const links = useMemo(() => (Array.isArray(rawLinks) ? rawLinks : []), [rawLinks]);

  // 4. Skills Normalization
  const categorizedSkills = useMemo(() => {
    return Array.isArray(rawSkills)
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
  }, [rawSkills]);

  const allSkillCategories = useMemo(() => {
    return ["all", ...new Set(categorizedSkills.map((c) => c.category).filter(Boolean))];
  }, [categorizedSkills]);

  const filteredSkills = useMemo(() => {
    return activeSkillCategory === "all"
      ? categorizedSkills
      : categorizedSkills.filter((c) => c.category === activeSkillCategory);
  }, [activeSkillCategory, categorizedSkills]);

  // Project Categories
  const projectCategories = useMemo(() => {
    const cats = new Set(
      projects
        .map((p) => p.category || (p.tags && p.tags[0]) || "Systems")
        .filter(Boolean)
    );
    return ["all", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeProjectCategory === "all") return projects;
    return projects.filter(
      (p) =>
        p.category?.toLowerCase() === activeProjectCategory.toLowerCase() ||
        (p.tags && p.tags.some((t) => t.toLowerCase() === activeProjectCategory.toLowerCase()))
    );
  }, [activeProjectCategory, projects]);

  // Terminal command executor
  const executeCommand = (cmdText) => {
    const cleanCmd = (cmdText || terminalInput).trim().toLowerCase();
    if (!cleanCmd) return;
    sfx.command();

    let response = "";
    switch (cleanCmd) {
      case "whoami":
        response = `OPERATOR: ${name} // ROLE: ${role} // BASE: ${location}`;
        break;
      case "current_status":
      case "status":
        response = availabilityStatus;
        break;
      case "skills":
      case "stack":
        response = `ACTIVE MODULES: ${categorizedSkills.flatMap((c) => c.items).slice(0, 8).join(" • ")}...`;
        break;
      case "projects":
        response = `TOTAL_ARCHIVES: ${projects.length} verified projects loaded into memory.`;
        break;
      case "contact":
        response = `COMM_LINK: ${email || "channel ready"} // Location: ${location}`;
        break;
      case "clear":
      case "cls":
        setTerminalLogs([]);
        setTerminalInput("");
        return;
      case "help":
        response = "AVAILABLE COMMANDS: whoami, status, stack, projects, contact, resume, clear, ping";
        break;
      case "ping":
        response = "PONG! Latency: 12ms // Protocol: HTTP/3 QUIC SECURE";
        break;
      case "resume":
      case "cat resume":
        response = resumeUrl ? `DISPATCHING: ${resumeUrl}` : "Resume data stream available in nav bar.";
        if (resumeUrl) window.open(resumeUrl, "_blank");
        break;
      default:
        response = `COMMAND NOT RECOGNIZED: '${cleanCmd}'. Type 'help' for directory.`;
    }

    setTerminalLogs((prev) => [
      ...prev.slice(-6),
      { type: "prompt", cmd: cleanCmd, res: response },
    ]);
    setTerminalInput("");
  };

  const copyToBuffer = (text, type = "email") => {
    sfx.click();
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
    toast.success(`BUFFER COPIED: [${text}]`, {
      style: {
        background: "#07090c",
        color: "#00ff66",
        border: "1px solid #00ff66",
        fontFamily: "JetBrains Mono, monospace",
      },
    });
  };

  const handleTransmitMessage = (e) => {
    e.preventDefault();
    sfx.transmit();
    setTransmitting(true);

    setTimeout(() => {
      setTransmitting(false);
      if (email) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(
          contactForm.subject || "TRANSMISSION: Project Inquiry"
        )}&body=${encodeURIComponent(
          `Sender: ${contactForm.name} (${contactForm.email})\n\n${contactForm.message}`
        )}`;
      }
      toast.success("TRANSMISSION DISPATCHED TO OPERATOR BUFFER", {
        style: {
          background: "#07090c",
          color: "#00ff66",
          border: "1px solid #00ff66",
          fontFamily: "JetBrains Mono, monospace",
        },
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  // Custom accent color injection
  const accent = propAccentColor || themeAccent || (isDark ? "#00ff66" : "#0d8a43");

  return (
    <div
      className={`retro-futuristic-theme w-full overflow-x-hidden min-h-screen ${isDark ? "dark-mode" : "light-mode"}`}
      data-rf-mode={isDark ? "dark" : "light"}
      style={{
        "--rf-accent-primary": accent,
        "--rf-accent-glow": `${accent}40`,
        "--rf-accent-dim": `${accent}18`,
        "--rf-border-primary": `${accent}45`,
      }}
    >
      {/* Background Technical Grid Layer (Eye-Soothing Brutalist Architecture) */}
      <div className="rf-background-layer" />

      {/* Subtle CRT Scanlines & Vignette */}
      {crtEnabled && (
        <>
          <div className="rf-scanlines" />
          <div className="rf-crt-vignette" />
        </>
      )}

      {/* ==========================================================================
         1. TOP SYSTEM HUD / NAVIGATION BAR
         ========================================================================== */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-[var(--rf-border-secondary)] bg-[var(--rf-bg-header)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand / System Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="rf-led rf-led-green animate-pulse" />
            <a
              href="#hero"
              onClick={() => sfx.click()}
              className="text-sm font-mono font-bold tracking-tight hover:text-[var(--rf-accent-primary)] transition-colors flex items-center gap-2"
            >
              <span>SMARTNSHINE</span>
              <span className="text-xs text-[var(--rf-text-muted)] font-medium tracking-wider uppercase hidden sm:inline">
                PORTFOLIO
              </span>
            </a>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[var(--rf-border-primary)] bg-[var(--rf-bg-inset)] rounded text-[var(--rf-accent-primary)] font-bold hidden md:inline">
              ONLINE
            </span>
          </div>

          {/* Desktop Navigation - Clean, Single-line, No '//' */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-mono tracking-wider shrink-0">
            {[
              { id: "about", label: "01 ABOUT" },
              { id: "work", label: "02 WORK" },
              { id: "experience", label: "03 EXPERIENCE" },
              { id: "skills", label: "04 SKILLS" },
              { id: "contact", label: "05 CONTACT" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => sfx.click()}
                className="text-[var(--rf-text-secondary)] hover:text-[var(--rf-accent-primary)] transition-colors py-1 relative group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--rf-accent-primary)] transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* System Hardware Controls (Clean, No Timer, No SFX button) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* CRT Toggle Button */}
            <button
              onClick={() => {
                sfx.click();
                setCrtEnabled(!crtEnabled);
              }}
              title={crtEnabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
              className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                crtEnabled
                  ? "border-[var(--rf-border-primary)] text-[var(--rf-accent-primary)] bg-[var(--rf-accent-dim)]"
                  : "border-[var(--rf-border-secondary)] text-[var(--rf-text-muted)] hover:border-[var(--rf-border-primary)]"
              }`}
            >
              {crtEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold">CRT</span>
            </button>

            {/* Dark/Light Mode Hardware Switch */}
            <button
              onClick={() => {
                sfx.click();
                toggleDark();
              }}
              title={isDark ? "Switch to 1990s Manual Light Mode" : "Switch to Flagship Dark Mode"}
              className="rf-btn py-1 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--rf-accent-secondary)]" />
                  <span className="text-[10px] font-bold">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--rf-accent-primary)]" />
                  <span className="text-[10px] font-bold">DARK</span>
                </>
              )}
            </button>

            {/* Mobile / Tablet Hamburger */}
            <button
              onClick={() => {
                sfx.click();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded border border-[var(--rf-border-secondary)] text-[var(--rf-text-primary)] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-b border-[var(--rf-border-primary)] bg-[var(--rf-bg-panel)] px-4 py-4 space-y-3 font-mono text-xs overflow-hidden"
            >
              <div className="text-[10px] text-[var(--rf-text-muted)] tracking-widest pb-1 border-b border-[var(--rf-border-subtle)]">
                NAVIGATION
              </div>
              {[
                { id: "about", label: "01 ABOUT" },
                { id: "work", label: "02 WORK" },
                { id: "experience", label: "03 EXPERIENCE" },
                { id: "skills", label: "04 SKILLS" },
                { id: "contact", label: "05 CONTACT" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    sfx.click();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-1.5 text-[var(--rf-text-primary)] hover:text-[var(--rf-accent-primary)]"
                >
                  {item.label}
                </a>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rf-btn rf-btn-primary w-full justify-center text-center mt-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD RESUME</span>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 sm:space-y-32 relative z-10">
        
        {/* ==========================================================================
           2. HERO SECTION: COMMAND CENTER & RETRO MONITOR
           ========================================================================== */}
        <section id="hero" className="pt-2 sm:pt-6">
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--rf-text-muted)] mb-6 pb-2 border-b border-[var(--rf-border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="rf-led rf-led-green animate-ping" />
              <span>SYSTEM INITIALIZED • PORTFOLIO v2.026</span>
            </div>
            <div className="flex items-center gap-4">
              <span>OPERATOR: [{name.toUpperCase()}]</span>
              <span className="hidden sm:inline">LOC: [{location.toUpperCase()}]</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Huge Headline, Intro, Terminal Interface */}
            <div className="lg:col-span-7 space-y-6">
              {/* Monospace System Prompt Intro */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-primary)] rounded text-xs font-mono text-[var(--rf-accent-primary)]">
                <Terminal className="w-3.5 h-3.5" />
                <span>&gt; hello_world.exe --operator=&quot;{name}&quot;</span>
              </div>

              {/* Massive Geometric Display Headline */}
              <h1
                style={{ fontFamily: "var(--rf-font-display)" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--rf-text-primary)] leading-[1.08] uppercase"
              >
                {headline}
              </h1>

              {/* Editorial / Monospace Intro */}
              <p className="text-base sm:text-lg text-[var(--rf-text-secondary)] font-normal max-w-2xl leading-relaxed">
                {bio}
              </p>

              {/* Interactive Terminal Sub-System */}
              <div className="rf-terminal-window p-4 sm:p-5 relative overflow-hidden">
                <div className="rf-rivet-tl">+</div>
                <div className="rf-rivet-tr">+</div>
                <div className="rf-rivet-bl">+</div>
                <div className="rf-rivet-br">+</div>

                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--rf-border-subtle)] text-[11px] text-[var(--rf-text-muted)] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-[var(--rf-text-secondary)]">bash • terminal_prompt.sh</span>
                  </div>
                  <span className="text-[10px] text-[var(--rf-accent-primary)]">QUIC/SECURE</span>
                </div>

                {/* Log outputs */}
                <div className="space-y-2 text-xs font-mono min-h-[90px] max-h-[140px] overflow-y-auto">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log.type === "system" && (
                        <span className="text-[var(--rf-text-muted)]">&gt; {log.text}</span>
                      )}
                      {log.type === "prompt" && (
                        <div>
                          <div className="text-[var(--rf-accent-primary)]">
                            <span className="text-[var(--rf-text-muted)]">$ </span>
                            {log.cmd}
                          </div>
                          <div className="text-[var(--rf-text-secondary)] pl-3 border-l border-[var(--rf-border-subtle)] mt-0.5">
                            {log.res}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Interactive Command Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeCommand();
                  }}
                  className="mt-3 pt-2 border-t border-[var(--rf-border-subtle)] flex items-center gap-2"
                >
                  <span className="text-[var(--rf-accent-primary)] font-mono text-xs">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type 'help', 'status', 'stack', 'contact'..."
                    className="flex-1 bg-transparent text-xs font-mono text-[var(--rf-text-primary)] focus:outline-none placeholder:text-[var(--rf-text-muted)]"
                  />
                  <button
                    type="submit"
                    className="text-[10px] font-mono px-2 py-0.5 bg-[var(--rf-accent-dim)] border border-[var(--rf-border-primary)] text-[var(--rf-accent-primary)] rounded hover:bg-[var(--rf-accent-primary)] hover:text-black transition-colors"
                  >
                    EXEC
                  </button>
                </form>

                {/* Quick Command Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[var(--rf-border-subtle)] text-[10px] font-mono">
                  <span className="text-[var(--rf-text-muted)] self-center mr-1">RUN:</span>
                  {["whoami", "status", "skills", "projects", "contact", "help"].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => executeCommand(cmd)}
                      className="px-2 py-0.5 bg-[var(--rf-bg-inset)] hover:bg-[var(--rf-accent-dim)] border border-[var(--rf-border-secondary)] hover:border-[var(--rf-accent-primary)] text-[var(--rf-text-secondary)] hover:text-[var(--rf-accent-primary)] rounded transition-colors"
                    >
                      ${cmd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware CTA Button Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#work"
                  onClick={() => sfx.click()}
                  className="rf-btn rf-btn-primary"
                >
                  <span>[ ACCESS ARCHIVE ↓ ]</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#contact"
                  onClick={() => sfx.click()}
                  className="rf-btn rf-btn-amber"
                >
                  <Radio className="w-3.5 h-3.5 text-[var(--rf-accent-secondary)]" />
                  <span>OPEN TRANSMISSION →</span>
                </a>

                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sfx.click()}
                    className="rf-btn"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--rf-text-muted)]" />
                    <span>CAT RESUME.PDF</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Premium Retro CRT Monitor Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md">
                {/* Physical Monitor Housing */}
                <div className="rf-monitor-frame">
                  {/* Top Monitor Bezel with Brand / Model */}
                  <div className="flex items-center justify-between px-2 pb-2 text-[10px] font-mono text-[var(--rf-text-muted)]">
                    <span className="tracking-widest font-bold text-[var(--rf-text-secondary)]">
                      SMARTNSHINE CRT-95
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px]">1024×768</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        <span className="text-[8px] text-emerald-400">PWR</span>
                      </div>
                    </div>
                  </div>

                  {/* The Curved CRT Screen */}
                  <div className="rf-monitor-screen aspect-square relative flex items-center justify-center p-2">
                    <div className="rf-screen-glare" />

                    {/* Background Phosphor HUD grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.08)_0,transparent_75%)] pointer-events-none" />

                    {/* Corner Crosshairs */}
                    <div className="rf-crosshair top-2 left-2" />
                    <div className="rf-crosshair top-2 right-2" />
                    <div className="rf-crosshair bottom-2 left-2" />
                    <div className="rf-crosshair bottom-2 right-2" />

                    {/* Inside Display: Profile Avatar Image or Retro Geometric Identity */}
                    {profileImage ? (
                      <div className="w-full h-full relative overflow-hidden rounded">
                        <img
                          src={profileImage}
                          alt={name}
                          className="w-full h-full object-cover filter contrast-110 saturate-90"
                        />
                        {/* Phosphor Tint Overlay */}
                        <div className="absolute inset-0 bg-[var(--rf-accent-dim)] mix-blend-color pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 bg-black/85 backdrop-blur-sm border border-[var(--rf-border-primary)] rounded text-[10px] font-mono text-white flex justify-between items-center">
                          <span className="text-[var(--rf-accent-primary)] font-bold">{name}</span>
                          <span className="text-[var(--rf-text-muted)]">{role.slice(0, 24)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-black/60 relative">
                        <div className="w-24 h-24 rounded-full border-2 border-[var(--rf-border-primary)] flex items-center justify-center relative mb-4 shadow-[0_0_20px_var(--rf-accent-glow)]">
                          <Cpu className="w-12 h-12 text-[var(--rf-accent-primary)] animate-pulse" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--rf-accent-secondary)] rounded-full animate-ping" />
                        </div>
                        <div className="text-base font-mono font-bold text-white tracking-wider mb-1">
                          {name}
                        </div>
                        <div className="text-xs font-mono text-[var(--rf-accent-primary)]">
                          {role}
                        </div>
                        <div className="mt-3 text-[10px] font-mono text-[var(--rf-text-muted)]">
                          SYSTEM NODE #8492-SN
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Monitor Control Console */}
                  <div className="pt-2.5 flex items-center justify-between px-2 text-[10px] font-mono text-[var(--rf-text-muted)]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                        <span className="text-[9px]">HDD: R/W</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                        <span className="text-[9px]">NET: 100M</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border border-[var(--rf-border-secondary)] rounded-full inline-block bg-[var(--rf-bg-inset)]" />
                      <span className="w-3 h-3 border border-[var(--rf-border-secondary)] rounded-full inline-block bg-[var(--rf-bg-inset)]" />
                      <span className="text-[9px]">BRT / CON</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Data Box Under Monitor */}
                <div className="mt-3 p-3 bg-[var(--rf-bg-panel)] border border-[var(--rf-border-subtle)] rounded text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--rf-text-muted)]">AVAILABILITY:</span>
                    <span className="text-[var(--rf-accent-primary)] font-bold">{availabilityStatus}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--rf-text-muted)]">LOCATION:</span>
                    <span className="text-[var(--rf-text-secondary)]">{location}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--rf-text-muted)]">SYSTEM_UPTIME:</span>
                    <span className="text-[var(--rf-text-secondary)]">99.98% CONTINUOUS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           3. SYSTEM METRICS / DIGITAL DASHBOARD
           ========================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--rf-border-subtle)] text-xs font-mono text-[var(--rf-text-muted)]">
            <div className="flex items-center gap-2 text-[var(--rf-accent-primary)] font-bold">
              <Activity className="w-4 h-4" />
              <span>[ SYSTEM METRICS • TELEMETRY v2.6 ]</span>
            </div>
            <span>LIVE METRICS STREAM</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "PROJECTS COMPILED",
                val: projects.length >= 10 ? `${projects.length}+` : `0${projects.length || 8}+`,
                desc: "Verified Shipments",
                accent: "var(--rf-accent-primary)",
              },
              {
                label: "SYSTEMS ACTIVE",
                val: experience.length >= 2 ? `0${experience.length * 2}+` : "04+",
                desc: "Production Deployments",
                accent: "var(--rf-accent-secondary)",
              },
              {
                label: "STACK PROFICIENCY",
                val: categorizedSkills.reduce((acc, c) => acc + c.items.length, 0) || "24+",
                desc: "Technologies Mastered",
                accent: "var(--rf-accent-primary)",
              },
              {
                label: "LATENCY EFFICIENCY",
                val: "99.9%",
                desc: "Reliability Standard",
                accent: "var(--rf-accent-gold)",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="rf-panel p-4 sm:p-5 text-center relative overflow-hidden group hover:border-[var(--rf-border-primary)] transition-all"
              >
                <div className="rf-rivet-tl">+</div>
                <div className="rf-rivet-tr">+</div>
                <div className="rf-rivet-bl">+</div>
                <div className="rf-rivet-br">+</div>
                
                <div className="text-[10px] font-mono text-[var(--rf-text-muted)] tracking-wider mb-2">
                  {metric.label}
                </div>
                <div
                  style={{ color: metric.accent, fontFamily: "var(--rf-font-display)" }}
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-1"
                >
                  {metric.val}
                </div>
                <div className="text-[11px] font-mono text-[var(--rf-text-secondary)]">
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
           4. PROJECT SECTION: DIGITAL ARCHIVE / PROJECT DATABASE
           ========================================================================== */}
        <section id="work" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--rf-border-subtle)]">
            <div>
              <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
                02 ARCHIVE
              </div>
              <h2
                style={{ fontFamily: "var(--rf-font-display)" }}
                className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
              >
                [ PROJECT_DATABASE ]
              </h2>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sfx.click();
                    setActiveProjectCategory(cat);
                  }}
                  className={`px-3 py-1 rounded border transition-all ${
                    activeProjectCategory === cat
                      ? "border-[var(--rf-accent-primary)] bg-[var(--rf-accent-dim)] text-[var(--rf-accent-primary)] font-bold shadow-[0_0_10px_var(--rf-accent-glow)]"
                      : "border-[var(--rf-border-secondary)] text-[var(--rf-text-secondary)] hover:border-[var(--rf-border-primary)]"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => {
              const projectLiveUrl = project.liveUrl || project.url || project.links?.live || "";
              const projImg =
                resolveImageUrl(project.image || project.imageUrl || "") ||
                (projectLiveUrl
                  ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(projectLiveUrl)}?w=1280`
                  : "");
              const indexFormatted = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
              const projectYear = project.year || "2026";
              const projectType = project.type || project.category || "WEB_PRODUCT";

              return (
                <div
                  key={project.id || idx}
                  className="rf-panel rounded p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--rf-border-primary)] hover:shadow-[0_10px_35px_var(--rf-accent-dim)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="rf-rivet-tl">+</div>
                  <div className="rf-rivet-tr">+</div>
                  <div className="rf-rivet-bl">+</div>
                  <div className="rf-rivet-br">+</div>
                  <div className="rf-scanline-sweep" />

                  <div className="space-y-4">
                    {/* Top Record Header */}
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--rf-text-muted)] pb-2 border-b border-[var(--rf-border-subtle)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--rf-accent-primary)] font-bold">
                          REC_ID #{indexFormatted}
                        </span>
                        <span>•</span>
                        <span className="text-[var(--rf-text-secondary)]">{projectType.toUpperCase()}</span>
                      </div>
                      <span>YEAR: [{projectYear}]</span>
                    </div>

                    {/* Screenshot framed inside retro hardware screen */}
                    <div
                      onClick={() => {
                        sfx.click();
                        setSelectedProject(project);
                      }}
                      className="aspect-video w-full bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] rounded overflow-hidden relative cursor-pointer group-hover:border-[var(--rf-border-primary)] transition-colors flex flex-col"
                    >
                      {/* Browser frame titlebar if liveUrl is present */}
                      {projectLiveUrl && (
                        <div className="px-2.5 py-1 bg-black/70 border-b border-[var(--rf-border-subtle)] flex items-center justify-between text-[9px] font-mono text-[var(--rf-text-muted)] z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          </div>
                          <span className="truncate max-w-[180px] text-[var(--rf-accent-primary)]">
                            {projectLiveUrl.replace(/^https?:\/\//, "")}
                          </span>
                          <span className="text-emerald-400 font-bold">● LIVE</span>
                        </div>
                      )}

                      <div className="relative flex-1 w-full h-full overflow-hidden">
                        {projImg ? (
                          <img
                            src={projImg}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                            onError={(e) => {
                              // If image fails, fallback to styled module
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black/80 to-[var(--rf-bg-panel)] text-center">
                            <Code2 className="w-10 h-10 text-[var(--rf-accent-primary)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-mono text-[var(--rf-text-secondary)]">
                              PREVIEW MODULE • {project.title}
                            </span>
                          </div>
                        )}

                        {/* Display Glare & Reticle */}
                        <div className="rf-screen-glare" />
                        <div className="rf-crosshair top-2 left-2" />
                        <div className="rf-crosshair top-2 right-2" />
                        <div className="rf-crosshair bottom-2 left-2" />
                        <div className="rf-crosshair bottom-2 right-2" />

                        {/* Hover Pill */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-3 py-1.5 bg-[var(--rf-accent-primary)] text-black font-mono font-bold text-xs rounded tracking-wider shadow-lg flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>ACCESS_RECORD</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Title & Description */}
                    <div>
                      <h3
                        style={{ fontFamily: "var(--rf-font-display)" }}
                        className="text-xl sm:text-2xl font-bold text-[var(--rf-text-primary)] group-hover:text-[var(--rf-accent-primary)] transition-colors"
                      >
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[var(--rf-text-secondary)] line-clamp-2 leading-relaxed">
                        {project.description || project.summary || "High-performance architecture with integrated modern user flow."}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(project.tags || project.technologies || ["TypeScript", "React", "Node"]).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] text-[var(--rf-accent-primary)] rounded"
                        >
                          &lt;{tech}&gt;
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hardware Controls / Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-[var(--rf-border-subtle)] flex items-center justify-between gap-3 text-xs font-mono">
                    <button
                      onClick={() => {
                        sfx.click();
                        setSelectedProject(project);
                      }}
                      className="text-[var(--rf-accent-primary)] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>[ INSPECT_DETAILS ]</span>
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => sfx.click()}
                          className="p-1.5 border border-[var(--rf-border-secondary)] hover:border-[var(--rf-border-primary)] rounded text-[var(--rf-text-secondary)] hover:text-white transition-colors"
                          title="View Source Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {(project.liveUrl || project.url) && (
                        <a
                          href={project.liveUrl || project.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => sfx.click()}
                          className="rf-btn py-1 px-2.5 text-[11px] flex items-center gap-1"
                        >
                          <span>LIVE_DEMO</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================================================
           5. ABOUT USER: SYSTEM PROFILE INSPECTOR
           ========================================================================== */}
        <section id="about" className="space-y-6">
          <div className="pb-3 border-b border-[var(--rf-border-subtle)]">
            <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
              01 IDENTITY
            </div>
            <h2
              style={{ fontFamily: "var(--rf-font-display)" }}
              className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
            >
              &gt; ACCESSING USER PROFILE...
            </h2>
          </div>

          <div className="rf-panel p-6 sm:p-8 rounded relative">
            <div className="rf-rivet-tl">+</div>
            <div className="rf-rivet-tr">+</div>
            <div className="rf-rivet-bl">+</div>
            <div className="rf-rivet-br">+</div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Core Editorial Statement */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block text-xs font-mono px-2 py-0.5 bg-[var(--rf-accent-dim)] text-[var(--rf-accent-primary)] border border-[var(--rf-border-primary)] rounded">
                  OPERATOR_DIRECTIVE
                </div>
                <h3
                  style={{ fontFamily: "var(--rf-font-display)" }}
                  className="text-2xl sm:text-3xl font-bold text-[var(--rf-text-primary)] leading-snug uppercase"
                >
                  “I build useful things at the intersection of technology, design, and ideas.”
                </h3>
                <p className="text-sm sm:text-base text-[var(--rf-text-secondary)] leading-relaxed">
                  {bio}
                </p>
                <div className="p-4 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] rounded font-mono text-xs text-[var(--rf-text-secondary)] space-y-1">
                  <div>// ENGINEERING_PHILOSOPHY:</div>
                  <div className="text-[var(--rf-accent-primary)]">
                    &gt; Zero-fluff architectures • Sub-millisecond latency • Intentional ergonomics
                  </div>
                </div>
              </div>

              {/* Right Column: Identity Parameters */}
              <div className="lg:col-span-5 bg-[var(--rf-bg-inset)] p-5 border border-[var(--rf-border-secondary)] rounded font-mono text-xs space-y-3">
                <div className="text-[11px] text-[var(--rf-accent-primary)] font-bold pb-2 border-b border-[var(--rf-border-subtle)] flex items-center justify-between">
                  <span>IDENTITY_SPECIFICATIONS</span>
                  <span>SYS: OK</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--rf-text-muted)]">[01] OPERATOR:</span>
                    <span className="text-[var(--rf-text-primary)] font-bold">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--rf-text-muted)]">[02] ROLE_DISCIPLINE:</span>
                    <span className="text-[var(--rf-text-secondary)]">{role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--rf-text-muted)]">[03] BASE_SECTOR:</span>
                    <span className="text-[var(--rf-text-secondary)]">{location}</span>
                  </div>
                  {email && (
                    <div className="flex justify-between">
                      <span className="text-[var(--rf-text-muted)]">[04] COMM_CHANNEL:</span>
                      <span className="text-[var(--rf-accent-primary)] truncate max-w-[180px]">{email}</span>
                    </div>
                  )}
                  {education.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--rf-text-muted)]">[05] CREDENTIALS:</span>
                      <span className="text-[var(--rf-text-secondary)] truncate max-w-[180px]">
                        {education[0]?.degree || education[0]?.institution}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--rf-text-muted)]">[06] DEPLOY_STATUS:</span>
                    <span className="text-[var(--rf-accent-primary)] font-bold">READY_FOR_DEPLOYMENT</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--rf-border-subtle)] flex gap-2">
                  {email && (
                    <button
                      onClick={() => copyToBuffer(email, "email")}
                      className="rf-btn flex-1 justify-center text-[10px]"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? "BUFFER_OK" : "COPY_EMAIL"}</span>
                    </button>
                  )}
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.click()}
                      className="rf-btn rf-btn-primary flex-1 justify-center text-[10px]"
                    >
                      <Download className="w-3 h-3" />
                      <span>VIEW_CV</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           6. EXPERIENCE SECTION: SYSTEM ACTIVITY LOG
           ========================================================================== */}
        {experience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="pb-3 border-b border-[var(--rf-border-subtle)]">
              <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
                03 TIMELINE
              </div>
              <h2
                style={{ fontFamily: "var(--rf-font-display)" }}
                className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
              >
                [ EXPERIENCE_LOG ]
              </h2>
            </div>

            <div className="space-y-4">
              {experience.map((exp, idx) => {
                const isCurrent = exp.current || exp.isCurrent || idx === 0;
                const datePeriod =
                  exp.period ||
                  exp.duration ||
                  (exp.startDate ? `${exp.startDate} - ${exp.endDate || "PRESENT"}` : "2024 - PRESENT");

                return (
                  <div
                    key={exp.id || idx}
                    className="rf-panel p-5 sm:p-6 rounded relative group hover:border-[var(--rf-border-primary)] transition-colors"
                  >
                    <div className="rf-rivet-tl">+</div>
                    <div className="rf-rivet-tr">+</div>
                    <div className="rf-rivet-bl">+</div>
                    <div className="rf-rivet-br">+</div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--rf-border-subtle)] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`rf-led ${isCurrent ? "rf-led-green animate-pulse" : "rf-led-amber"}`} />
                        <span className="text-[var(--rf-accent-primary)] font-bold">
                          [{datePeriod.toUpperCase()}]
                        </span>
                        <span>•</span>
                        <span className="text-[var(--rf-text-secondary)]">EVENT #{idx + 1}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 border border-[var(--rf-border-subtle)] rounded bg-[var(--rf-bg-inset)]">
                        STATUS: {isCurrent ? "ACTIVE" : "ARCHIVED"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3
                          style={{ fontFamily: "var(--rf-font-display)" }}
                          className="text-lg sm:text-xl font-bold text-[var(--rf-text-primary)]"
                        >
                          &gt; ROLE: {exp.role || exp.title || exp.position}
                        </h3>
                        <span className="text-xs font-mono text-[var(--rf-accent-secondary)]">
                          @ {exp.company || exp.organization}
                        </span>
                      </div>

                      {exp.location && (
                        <div className="text-xs font-mono text-[var(--rf-text-muted)] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>LOC: {exp.location}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-[var(--rf-text-secondary)] leading-relaxed pt-1">
                        {exp.description || exp.summary}
                      </p>

                      {/* Accomplishments Bullets */}
                      {Array.isArray(exp.accomplishments) && exp.accomplishments.length > 0 && (
                        <ul className="space-y-1.5 pt-2 text-xs font-mono text-[var(--rf-text-secondary)]">
                          {exp.accomplishments.map((acc, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2">
                              <span className="text-[var(--rf-accent-primary)] font-bold">&gt;</span>
                              <span>{acc}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Tech Used */}
                      {(exp.skills || exp.technologies) && (
                        <div className="flex flex-wrap gap-1.5 pt-3">
                          {(Array.isArray(exp.skills)
                            ? exp.skills
                            : typeof exp.skills === "string"
                            ? exp.skills.split(",")
                            : []
                          ).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] text-[var(--rf-text-secondary)] rounded"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ==========================================================================
           7. SKILLS SECTION: SYSTEM DIAGNOSTICS PANEL
           ========================================================================== */}
        {categorizedSkills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[var(--rf-border-subtle)]">
              <div>
                <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
                  04 CAPABILITIES
                </div>
                <h2
                  style={{ fontFamily: "var(--rf-font-display)" }}
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
                >
                  [ SYSTEM_DIAGNOSTICS ]
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {allSkillCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sfx.click();
                      setActiveSkillCategory(cat);
                    }}
                    className={`px-3 py-1 rounded border transition-all ${
                      activeSkillCategory === cat
                        ? "border-[var(--rf-accent-primary)] bg-[var(--rf-accent-dim)] text-[var(--rf-accent-primary)] font-bold shadow-[0_0_10px_var(--rf-accent-glow)]"
                        : "border-[var(--rf-border-secondary)] text-[var(--rf-text-secondary)] hover:border-[var(--rf-border-primary)]"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSkills.map((group, gIdx) => (
                <div
                  key={group.id || gIdx}
                  className="rf-panel p-5 sm:p-6 rounded relative space-y-4 hover:border-[var(--rf-border-primary)] transition-colors"
                >
                  <div className="rf-rivet-tl">+</div>
                  <div className="rf-rivet-tr">+</div>
                  <div className="rf-rivet-bl">+</div>
                  <div className="rf-rivet-br">+</div>

                  {/* Panel Header */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--rf-text-muted)] pb-2 border-b border-[var(--rf-border-subtle)]">
                    <span className="text-[var(--rf-accent-primary)] font-bold">
                      &lt;{group.category.toUpperCase()}&gt;
                    </span>
                    <span>ACTIVE</span>
                  </div>

                  {/* Skills Segment Bars */}
                  <div className="space-y-3 font-mono text-xs">
                    {group.items.map((skill, sIdx) => {
                      // Decorative pseudo-bars
                      const meterLevels = [
                        "[██████████] 100%",
                        "[█████████░] 92%",
                        "[█████████░] 88%",
                        "[████████░░] 84%",
                        "[████████░░] 80%",
                      ];
                      const level = meterLevels[sIdx % meterLevels.length];

                      return (
                        <div
                          key={sIdx}
                          className="p-2 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:border-[var(--rf-border-primary)] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="rf-led rf-led-green" />
                            <span className="text-[var(--rf-text-primary)] font-semibold">{skill}</span>
                          </div>
                          <span className="text-[var(--rf-accent-primary)] text-[11px] tracking-wider">
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================================
           8. ACHIEVEMENTS & CERTIFICATIONS
           ========================================================================== */}
        {(achievements.length > 0 || certifications.length > 0 || education.length > 0) && (
          <section className="space-y-6">
            <div className="pb-3 border-b border-[var(--rf-border-subtle)]">
              <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
                05 CREDENTIALS
              </div>
              <h2
                style={{ fontFamily: "var(--rf-font-display)" }}
                className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
              >
                [ ACHIEVEMENT_LOG ]
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="rf-panel p-4 rounded relative space-y-2 hover:border-[var(--rf-border-primary)] transition-colors"
                >
                  <div className="rf-rivet-tl">+</div>
                  <div className="rf-rivet-tr">+</div>
                  <div className="text-[10px] font-mono text-[var(--rf-accent-secondary)]">
                    [0{idx + 1}] MILESTONE
                  </div>
                  <h4
                    style={{ fontFamily: "var(--rf-font-display)" }}
                    className="text-base font-bold text-[var(--rf-text-primary)]"
                  >
                    {item.title || item.name}
                  </h4>
                  <p className="text-xs text-[var(--rf-text-secondary)]">
                    {item.description || item.summary || item.date}
                  </p>
                </div>
              ))}

              {certifications.map((cert, idx) => (
                <div
                  key={`cert-${idx}`}
                  className="rf-panel p-4 rounded relative space-y-2 hover:border-[var(--rf-border-primary)] transition-colors"
                >
                  <div className="rf-rivet-tl">+</div>
                  <div className="rf-rivet-tr">+</div>
                  <div className="text-[10px] font-mono text-[var(--rf-accent-primary)]">
                    CERTIFICATION
                  </div>
                  <h4
                    style={{ fontFamily: "var(--rf-font-display)" }}
                    className="text-base font-bold text-[var(--rf-text-primary)]"
                  >
                    {cert.name || cert.title}
                  </h4>
                  <div className="text-xs font-mono text-[var(--rf-text-muted)]">
                    ISSUER: {cert.issuer || cert.organization}
                  </div>
                </div>
              ))}

              {education.map((edu, idx) => (
                <div
                  key={`edu-${idx}`}
                  className="rf-panel p-4 rounded relative space-y-2 hover:border-[var(--rf-border-primary)] transition-colors"
                >
                  <div className="rf-rivet-tl">+</div>
                  <div className="rf-rivet-tr">+</div>
                  <div className="text-[10px] font-mono text-[var(--rf-accent-gold)]">
                    EDUCATION
                  </div>
                  <h4
                    style={{ fontFamily: "var(--rf-font-display)" }}
                    className="text-base font-bold text-[var(--rf-text-primary)]"
                  >
                    {edu.degree || edu.degreeName}
                  </h4>
                  <div className="text-xs font-mono text-[var(--rf-text-secondary)]">
                    {edu.institution || edu.school}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--rf-text-muted)]">
                    YEAR: {edu.year || edu.period || "VERIFIED"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================================
           9. CONTACT SECTION: OPEN A COMMUNICATION CHANNEL
           ========================================================================== */}
        <section id="contact" className="space-y-6 pt-4">
          <div className="pb-3 border-b border-[var(--rf-border-subtle)]">
            <div className="text-xs font-mono text-[var(--rf-accent-primary)] tracking-widest uppercase mb-1">
              06 TRANSMISSION
            </div>
            <h2
              style={{ fontFamily: "var(--rf-font-display)" }}
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--rf-text-primary)] uppercase"
            >
              “OPEN A CHANNEL.”
            </h2>
            <p className="text-sm sm:text-base font-mono text-[var(--rf-text-secondary)] mt-1">
              Have a project, idea, or interesting problem? Transmit a packet directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Direct Transmission Form */}
            <div className="lg:col-span-7 rf-panel p-6 sm:p-8 rounded relative">
              <div className="rf-rivet-tl">+</div>
              <div className="rf-rivet-tr">+</div>
              <div className="rf-rivet-bl">+</div>
              <div className="rf-rivet-br">+</div>

              <div className="text-xs font-mono text-[var(--rf-accent-primary)] pb-3 mb-4 border-b border-[var(--rf-border-subtle)] flex items-center justify-between">
                <span>&gt; TRANSMISSION_PACKET_BUILDER</span>
                <span className="text-[10px] text-[var(--rf-text-muted)]">TLS 1.3 ENCRYPTED</span>
              </div>

              <form onSubmit={handleTransmitMessage} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[var(--rf-text-muted)] block">SENDER_NAME:</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Commander Sarah"
                      className="w-full bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] focus:border-[var(--rf-accent-primary)] rounded px-3 py-2 text-[var(--rf-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[var(--rf-text-muted)] block">RETURN_COMM_EMAIL:</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="sarah@orbital.io"
                      className="w-full bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] focus:border-[var(--rf-accent-primary)] rounded px-3 py-2 text-[var(--rf-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--rf-text-muted)] block">PACKET_SUBJECT:</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Engineering Inquiry // Full-Stack Project"
                    className="w-full bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] focus:border-[var(--rf-accent-primary)] rounded px-3 py-2 text-[var(--rf-text-primary)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--rf-text-muted)] block">TRANSMISSION_PAYLOAD:</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Detail the scope, specifications, or inquiry..."
                    className="w-full bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] focus:border-[var(--rf-accent-primary)] rounded px-3 py-2 text-[var(--rf-text-primary)] focus:outline-none resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={transmitting}
                  className="rf-btn rf-btn-primary w-full justify-center py-3 text-sm mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{transmitting ? "INITIALIZING CONNECTION..." : "[ START TRANSMISSION → ]"}</span>
                </button>
              </form>
            </div>

            {/* Quick Links & Hardware Channel Information */}
            <div className="lg:col-span-5 space-y-4 font-mono">
              <div className="rf-panel p-5 rounded space-y-3">
                <div className="text-xs text-[var(--rf-accent-primary)] font-bold pb-2 border-b border-[var(--rf-border-subtle)]">
                  DIRECT_CHANNELS
                </div>

                {email && (
                  <div className="p-3 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] rounded flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[var(--rf-text-muted)]">EMAIL_ADDRESS:</div>
                      <div className="text-xs text-[var(--rf-text-primary)] font-bold truncate max-w-[200px]">
                        {email}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToBuffer(email, "email")}
                      className="rf-btn py-1 px-2 text-[10px]"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? "COPIED" : "COPY"}</span>
                    </button>
                  </div>
                )}

                {phone && (
                  <div className="p-3 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] rounded flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[var(--rf-text-muted)]">CONTACT_NUMBER:</div>
                      <div className="text-xs text-[var(--rf-text-primary)] font-bold">{phone}</div>
                    </div>
                    <button
                      onClick={() => copyToBuffer(phone, "phone")}
                      className="rf-btn py-1 px-2 text-[10px]"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? "COPIED" : "COPY"}</span>
                    </button>
                  </div>
                )}

                <div className="p-3 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-subtle)] rounded">
                  <div className="text-[10px] text-[var(--rf-text-muted)]">LOCATION:</div>
                  <div className="text-xs text-[var(--rf-text-primary)] font-bold">{location}</div>
                </div>
              </div>

              {/* Social Channels Network */}
              <div className="rf-panel p-5 rounded space-y-3">
                <div className="text-xs text-[var(--rf-text-muted)] font-bold pb-2 border-b border-[var(--rf-border-subtle)]">
                  EXTERNAL_NODES
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {links.length > 0 ? (
                    links.map((link, idx) => {
                      const Icon = resolveSocialIcon(link.type || link.platform, link.name || link.title);
                      return (
                        <a
                          key={idx}
                          href={link.url || link.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => sfx.click()}
                          className="p-2.5 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] hover:border-[var(--rf-accent-primary)] rounded flex items-center gap-2 hover:text-[var(--rf-accent-primary)] transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="truncate">{link.name || link.title || "Network"}</span>
                        </a>
                      );
                    })
                  ) : (
                    <>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sfx.click()}
                        className="p-2.5 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] hover:border-[var(--rf-accent-primary)] rounded flex items-center gap-2 hover:text-[var(--rf-accent-primary)] transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GITHUB</span>
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sfx.click()}
                        className="p-2.5 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-secondary)] hover:border-[var(--rf-accent-primary)] rounded flex items-center gap-2 hover:text-[var(--rf-accent-primary)] transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LINKEDIN</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Footer */}
        <footer className="pt-8 border-t border-[var(--rf-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--rf-text-muted)] pb-12">
          <div className="flex items-center gap-2">
            <span className="rf-led rf-led-green" />
            <span>SMARTNSHINE_OS // RETRO-FUTURISTIC ENGINE v2.026</span>
          </div>
          <div>
            OPERATED BY [{name.toUpperCase()}] • ALL RIGHTS SECURED
          </div>
        </footer>
      </main>

      {/* ==========================================================================
         PROJECT DETAILS INSPECTOR MODAL
         ========================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rf-panel rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border-[var(--rf-border-primary)]"
            >
              <div className="rf-rivet-tl">+</div>
              <div className="rf-rivet-tr">+</div>
              <div className="rf-rivet-bl">+</div>
              <div className="rf-rivet-br">+</div>

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--rf-border-subtle)] text-xs font-mono">
                <div className="flex items-center gap-2 text-[var(--rf-accent-primary)] font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>[ INSPECTING_RECORD // {selectedProject.title.toUpperCase()} ]</span>
                </div>
                <button
                  onClick={() => {
                    sfx.click();
                    setSelectedProject(null);
                  }}
                  className="p-1.5 border border-[var(--rf-border-secondary)] hover:border-[var(--rf-border-primary)] rounded text-[var(--rf-text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Project Preview Image / Live Website Frame */}
              {(() => {
                const modalLiveUrl = selectedProject.liveUrl || selectedProject.url || selectedProject.links?.live || "";
                const modalImg =
                  resolveImageUrl(selectedProject.image || selectedProject.imageUrl || "") ||
                  (modalLiveUrl
                    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(modalLiveUrl)}?w=1280`
                    : "");

                return modalImg ? (
                  <div className="aspect-video w-full rounded overflow-hidden border border-[var(--rf-border-secondary)] relative flex flex-col bg-[var(--rf-bg-inset)]">
                    {modalLiveUrl && (
                      <div className="px-3 py-1.5 bg-black/85 border-b border-[var(--rf-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--rf-text-muted)] z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                        </div>
                        <div className="px-3 py-0.5 bg-[var(--rf-bg-panel)] border border-[var(--rf-border-subtle)] rounded text-[11px] text-[var(--rf-accent-primary)] truncate max-w-[280px]">
                          {modalLiveUrl}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">LIVE PREVIEW</span>
                      </div>
                    )}
                    <div className="relative flex-1 w-full h-full overflow-hidden">
                      <img
                        src={modalImg}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="rf-screen-glare" />
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Details & Specs */}
              <div className="space-y-3">
                <h3
                  style={{ fontFamily: "var(--rf-font-display)" }}
                  className="text-2xl font-bold text-[var(--rf-text-primary)]"
                >
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-[var(--rf-text-secondary)] leading-relaxed">
                  {selectedProject.description || selectedProject.summary}
                </p>

                {/* Tech Specs */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-[var(--rf-text-muted)] mb-2">SYSTEM_DEPENDENCIES:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProject.tags || selectedProject.technologies || ["TypeScript", "React"]).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-2.5 py-1 bg-[var(--rf-bg-inset)] border border-[var(--rf-border-primary)] text-[var(--rf-accent-primary)] rounded"
                      >
                        &lt;{tech}&gt;
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--rf-border-subtle)] flex flex-wrap gap-3 font-mono text-xs">
                {(selectedProject.liveUrl || selectedProject.url) && (
                  <a
                    href={selectedProject.liveUrl || selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rf-btn rf-btn-primary flex-1 justify-center py-2.5"
                  >
                    <span>LAUNCH_LIVE_ENVIRONMENT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rf-btn flex-1 justify-center py-2.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>VIEW_SOURCE_CODE</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
