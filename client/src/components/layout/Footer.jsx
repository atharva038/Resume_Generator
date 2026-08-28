import { Link } from "react-router-dom";
import {
  Mail,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useToggle } from "@/hooks";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, , setIsVisibleTrue] = useToggle(false);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleTrue();
        }
      },
      { threshold: 0.05 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [setIsVisibleTrue]);

  const productLinks = [
    { name: "ATS Resume Analyzer", path: "/ats-analyzer" },
    { name: "AI Resume Enhancer", path: "/upload" },
    { name: "Resume Templates (11)", path: "/templates" },
    { name: "Career Profile Hub", path: "/career-profile" },
    { name: "Career Q&A Studio", path: "/career-qa" },
    { name: "Portfolios Builder", path: "/portfolio", pulse: true },
    { name: "Pricing & Plans", path: "/pricing" },
  ];

  const policyLinks = [
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Refund Policy", path: "/refund-policy" },
    { name: "Shipping Policy", path: "/shipping-policy" },
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <Twitter className="w-4 h-4" />, label: "Twitter", href: "https://twitter.com" },
    { icon: <Github className="w-4 h-4" />, label: "GitHub", href: "https://github.com" },
    { icon: <Globe className="w-4 h-4" />, label: "Status", href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className={`relative w-full border-t border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#070709] transition-all duration-700 no-print overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 sm:pt-16 pb-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-10">
          {/* Brand section matching Sidebar typography and colors */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center text-2xl font-bold group">
              <img
                src="/orb-logo.png"
                alt="SmartNShine"
                className="h-14 w-auto object-contain group-hover:scale-105 transition-all duration-300 -mr-1 dark:brightness-100 dark:saturate-100 brightness-50 contrast-125 saturate-200"
              />
              <span className="bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent tracking-tight font-bold">
                SmartNShine
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-sm font-medium">
              The AI career operating system engineered to diagnose ATS compatibility, enhance achievement bullets with real metrics, and deploy live portfolio websites.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All ATS Engines Operational
              </span>
            </div>
          </div>

          {/* Core Tools Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Core Platform
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 group font-medium"
                  >
                    <span>{link.name}</span>
                    {link.pulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    )}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Legal & Security
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Help Desk */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Support Desk
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium inline-flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span>Contact Support</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@smartnshine.app"
                  className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">support@smartnshine.app</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-200/70 dark:border-white/[0.08] my-6" />

        {/* Footer bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-zinc-400 gap-4">
          <div className="flex items-center space-x-3">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800/80 border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all"
              >
                {icon}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 text-center sm:text-right">
            <span>© {new Date().getFullYear()} SmartNShine. Powered by Next-Gen AI.</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
        </div>

        {/* Large Animated Full-Width Vector Text Banner */}
        <div className="w-full pt-10 pb-2 overflow-hidden relative z-10 opacity-80 hover:opacity-100 transition-opacity">
          <TextHoverEffect text="SMARTNSHINE" />
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
};

export default Footer;
