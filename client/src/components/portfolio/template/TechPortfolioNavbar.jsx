import { useEffect, useState } from "react";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const TechPortfolioNavbar = ({ data, isDarkMode, toggleDarkMode, accentColor }) => {
  const { profile, sections, actions, settings } = data || {};
  const [activeSection, setActiveSection] = useState("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accent = accentColor || "#3b82f6";
  const name = profile?.name || "Portfolio";
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const items = [
    ["about", "About", sections?.showAbout && profile?.about],
    ["skills", "Skills", sections?.showSkills && data?.skills?.length],
    ["experience", "Experience", sections?.showExperience && data?.experience?.length],
    ["projects", "Projects", sections?.showProjects && data?.projects?.length],
    ["education", "Education", sections?.showEducation && data?.education?.length],
    ["contact", "Contact", profile?.email || profile?.phone],
  ].filter(([, , visible]) => visible);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      const position = window.scrollY + 120;
      const current = [...items].reverse().find(([id]) => document.getElementById(id)?.offsetTop <= position);
      setActiveSection(current?.[0] || "hero");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollTo = (id) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (id === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
    else element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className={`mx-auto max-w-6xl rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all sm:rounded-full sm:px-6 ${scrolled ? "border-white/15 bg-slate-950/90 shadow-2xl shadow-black/25" : "border-white/10 bg-slate-950/70"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => scrollTo("hero")} className="group flex items-center gap-3 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-xs font-black text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: accent }}>{initials}</span>
            <span className="hidden min-w-0 sm:block"><span className="block max-w-40 truncate text-sm font-bold text-white">{name}</span><span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Available</span></span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className={`relative rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${activeSection === id ? "text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}>
                {activeSection === id && <motion.span layoutId="tech-nav-active" className="absolute inset-0 -z-10 rounded-lg" style={{ backgroundColor: `${accent}33`, border: `1px solid ${accent}66` }} transition={{ type: "spring", stiffness: 360, damping: 28 }} />}
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {settings?.showResumeDownload !== false && <a href={actions?.resumeDownloadUrl} onClick={actions?.onResumeClick} className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-white transition-transform hover:scale-105 sm:inline-flex" style={{ backgroundColor: accent }}><Download className="h-3.5 w-3.5" />Resume</a>}
            <button onClick={toggleDarkMode} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10" aria-label="Toggle theme">{isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}</button>
            <button onClick={() => setOpen(!open)} className="rounded-xl p-2 text-white lg:hidden" aria-label="Toggle navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 grid gap-1 border-t border-white/10 pt-3 lg:hidden">{items.map(([id, label]) => <button key={id} onClick={() => scrollTo(id)} className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-200 hover:bg-white/10">{label}</button>)}</motion.nav>}</AnimatePresence>
      </motion.div>
    </header>
  );
};

export default TechPortfolioNavbar;
