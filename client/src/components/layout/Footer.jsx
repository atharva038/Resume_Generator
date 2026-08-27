import { Link } from "react-router-dom";
import { Mail, Heart, Sparkles, Shield, Globe2, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToggle } from "@/hooks";

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
      { threshold: 0.1 }
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
    { name: "Resume Templates", path: "/templates" },
    { name: "Career Profile Hub", path: "/career-profile" },
    { name: "Career Q&A Studio", path: "/career-qa" },
    { name: "Portfolios Builder", path: "/portfolio" },
    { name: "Pricing & Plans", path: "/pricing" },
  ];

  const policyLinks = [
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Refund Policy", path: "/refund-policy" },
    { name: "Shipping Policy", path: "/shipping-policy" },
  ];

  return (
    <footer
      ref={footerRef}
      className={`bg-white dark:bg-[#09090b] border-t border-gray-200/80 dark:border-white/[0.08] text-gray-600 dark:text-zinc-400 transition-all duration-700 no-print ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img
                src="/orb-logo.png"
                alt="SmartNShine"
                className="h-10 w-auto object-contain -mr-1 dark:brightness-100 brightness-75 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-black bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent tracking-tight">
                SmartNShine
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              The AI-powered career workspace designed to help candidates build ATS-optimized resumes, prepare for mock interviews, and launch professional portfolio websites.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Core Tools Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Core Platform
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 group font-medium"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Legal & Compliance
            </h3>
            <ul className="space-y-2">
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

          {/* Support Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Help Desk
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium block"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@smartnshine.app"
                  className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">support@smartnshine.app</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} SmartNShine. Built with precision for job seekers worldwide.</p>
          <p className="flex items-center gap-1">
            <span>Powered by Advanced AI</span>
            <Sparkles className="w-3 h-3 text-blue-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
