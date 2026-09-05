import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import { personalInfo, socialLinks, footerText } from "@/data/techPortfolioData";

const PortfolioFooter = ({ portfolioContext }) => {
  const name = portfolioContext?.name || personalInfo.name;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || personalInfo.initials;
  const tagline = portfolioContext?.bio || personalInfo.tagline || footerText.tagline;
  const dynamicLinks = portfolioContext?.socialLinks?.map((link) => ({
    ...link,
    name: link.label || link.type || "Link",
  }));
  const links = dynamicLinks?.length ? dynamicLinks : socialLinks;
  const copyright = `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="tech-portfolio-footer bg-black border-t border-white/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white">
                {initials}
              </div>
              <span className="text-xl font-bold text-white">
                {name}
              </span>
            </div>
            <p className="text-gray-400">{tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#hero" },
                { name: "Projects", href: "#projects" },
                { name: "Skills", href: "#skills" },
                { name: "Contact", href: "#contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-3 flex-wrap">
              {links.map((link, idx) => {
                const getSocialIcon = (name) => {
                  switch (name.toLowerCase()) {
                    case "github":
                      return Github;
                    case "linkedin":
                      return Linkedin;
                    case "twitter":
                    case "x":
                      return Twitter;
                    case "email":
                    case "mail":
                      return Mail;
                    default:
                      return Github;
                  }
                };

                const IconComponent = getSocialIcon(link.type || link.name);
                return (
                  <motion.a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label || link.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-400 text-sm">
            {copyright}
          </p>

          {/* Scroll to Top Button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-white/20 hover:border-blue-400/50 transition-all duration-300"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
