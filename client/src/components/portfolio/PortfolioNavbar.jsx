import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
  Mail,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

/* ─── Magnetic Nav Item Helper ─── */
const MagneticNavItem = ({ children, className = "", strength = 0.28, ...props }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 15, mass: 0.1 }}
      className={`inline-flex ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default function PortfolioNavbar({
  data,
  isDarkMode,
  toggleDarkMode,
  accentColor,
}) {
  const { profile, sections, actions, settings } = data || {};
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Available sections based on user data
  const navItems = [
    { id: "about", label: "About", show: sections?.showAbout && profile?.about },
    { id: "skills", label: "Skills", show: sections?.showSkills && data?.skills?.length > 0 },
    { id: "experience", label: "Experience", show: sections?.showExperience && data?.experience?.length > 0 },
    { id: "projects", label: "Projects", show: sections?.showProjects && data?.projects?.length > 0 },
    { id: "education", label: "Education", show: sections?.showEducation && data?.education?.length > 0 },
    { id: "contact", label: "Contact", show: profile?.email || profile?.phone },
  ].filter((item) => item.show);

  // Scroll listener for glassmorphism & scrollspy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy
      const scrollPos = window.scrollY + 120;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (profile?.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const displayName = profile?.name || "Portfolio";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 px-3 sm:px-6 pt-3">
      <div
        className={`max-w-6xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300 border ${
          isScrolled
            ? "bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-gray-200/90 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/40 py-2.5 px-4 sm:px-6"
            : "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-gray-200/60 dark:border-white/5 shadow-xs py-3 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand / Name Anchor */}
          <MagneticNavItem strength={0.2}>
            <button
              onClick={() => scrollTo("hero")}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-xs transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: accentColor || "#3b82f6",
                }}
              >
                {userInitials}
              </div>
              <div className="min-w-0">
                <span className="block font-black text-xs sm:text-sm tracking-tight text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {displayName}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available</span>
                </span>
              </div>
            </button>
          </MagneticNavItem>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <MagneticNavItem key={item.id} strength={0.18}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-gray-950 dark:text-white"
                        : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePortfolioPill"
                        className="absolute inset-0 rounded-full bg-gray-100 dark:bg-white/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                </MagneticNavItem>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Email Copy / Contact */}
            {profile?.email && (
              <MagneticNavItem strength={0.25}>
                <button
                  onClick={handleCopyEmail}
                  title="Copy Email Address"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>Contact</span>
                    </>
                  )}
                </button>
              </MagneticNavItem>
            )}

            {/* Resume Download CTA */}
            {settings?.showResumeDownload !== false && (
              <MagneticNavItem strength={0.25}>
                {actions?.resumeDownloadUrl ? (
                  <a
                    href={actions.resumeDownloadUrl}
                    download
                    onClick={actions?.onResumeClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: accentColor || "#2563eb",
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Resume</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={actions?.onResumeClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: accentColor || "#2563eb",
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Resume</span>
                  </button>
                )}
              </MagneticNavItem>
            )}

            {/* Theme Dark/Light Toggle */}
            <MagneticNavItem strength={0.3}>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700" />
                )}
              </button>
            </MagneticNavItem>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden pt-3 border-t border-gray-100 dark:border-white/5 mt-3 space-y-1.5"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors text-left"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
              {profile?.email && (
                <button
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Copy Email: {profile.email}</span>
                  </span>
                  {copiedEmail && <Check className="w-4 h-4 text-emerald-500" />}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
