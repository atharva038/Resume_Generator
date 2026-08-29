import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { navigationLinks, personalInfo } from "@/data/techPortfolioData";
import { AnimatedButton } from "./PortfolioTemplateComponents";

const PortfolioTemplateNavbar = ({ isDarkMode = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active link based on scroll position
      navigationLinks.forEach(({ href }) => {
        const element = document.querySelector(href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(href.substring(1));
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    setActiveLink(href.substring(1));
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/50 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-white font-bold text-xl group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center font-bold">
              {personalInfo.initials}
            </div>
            <span className="hidden sm:inline">{personalInfo.name}</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationLinks.map(({ name, href }) => (
              <motion.button
                key={href}
                onClick={() => handleNavClick(href)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  activeLink === href.substring(1)
                    ? "text-white bg-white/10 border border-white/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {name}
              </motion.button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <AnimatedButton
              variant="primary"
              onClick={() => handleNavClick("#contact")}
              className="hidden sm:flex text-sm"
              icon={ArrowRight}
            >
              Let's Connect
            </AnimatedButton>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/80 backdrop-blur-md border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {navigationLinks.map(({ name, href }) => (
                <motion.button
                  key={href}
                  onClick={() => handleNavClick(href)}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-300 font-medium ${
                    activeLink === href.substring(1)
                      ? "text-white bg-blue-500/20 border border-blue-400/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {name}
                </motion.button>
              ))}
              <AnimatedButton
                variant="primary"
                onClick={() => handleNavClick("#contact")}
                className="w-full justify-center mt-4"
                icon={ArrowRight}
              >
                Let's Connect
              </AnimatedButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default PortfolioTemplateNavbar;
