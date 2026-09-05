import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { 
  AnimatedButton, 
  StatCard, 
  FloatingParticles,
  GlassCard 
} from "./PortfolioTemplateComponents";
import { 
  stats 
} from "@/data/techPortfolioData";

const HeroSection = ({ portfolioContext }) => {
  const {
    title = "Full Stack Developer",
    bio = "Building digital experiences",
    accentColor,
    socialLinks: contextSocialLinks = [],
  } = portfolioContext || {};

  const getSocialIcon = (linkName) => {
    switch (linkName?.toLowerCase()) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "email":
      case "mail":
        return Mail;
      default:
        return Github;
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background elements */}
      <FloatingParticles />

      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <GlassCard className="px-4 py-2">
                <span className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  {title}
                </span>
              </GlassCard>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                <span className="text-white">
                  I Build
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Scalable Digital Experiences
                </span>
                <br />
                That{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Make Impact.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-300 max-w-lg leading-relaxed"
            >
              {bio || "Transforming ideas into exceptional web applications with clean code, modern technologies and creative solutions."}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <AnimatedButton
                variant="primary"
                accentColor={accentColor}
                onClick={() => {
                  const element = document.querySelector("#projects");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View My Work
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                onClick={() => {
                  const element = document.querySelector("#contact");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get In Touch
              </AnimatedButton>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-4"
            >
              {contextSocialLinks
                ?.filter((link) => link.name?.toLowerCase() !== "email")
                .map((link, idx) => {
                  const IconComponent = getSocialIcon(link.name);
                  return (
                    <motion.a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300"
                      title={link.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
            </motion.div>
          </motion.div>

          {/* Right Side - Laptop Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-96 md:min-h-full flex items-center justify-center"
          >
            {/* Floating Laptop Illustration */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 0.8, 0, -0.8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-lg"
              style={{ transformOrigin: "50% 65%" }}
            >
              <motion.div
                aria-hidden="true"
                animate={{ opacity: [0.25, 0.65, 0.25], scale: [0.9, 1.06, 0.9] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-16 top-16 h-44 rounded-full bg-blue-500/20 blur-3xl"
              />
              {/* Laptop SVG */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto drop-shadow-2xl"
                role="img"
                aria-label="Animated laptop displaying developer code"
                style={{
                  filter: "drop-shadow(0 0 60px rgba(59, 130, 246, 0.5))",
                }}
              >
                {/* Screen */}
                <motion.g
                  animate={{ opacity: [0.84, 1, 0.84] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect
                    x="38"
                    y="18"
                    width="324"
                    height="204"
                    rx="14"
                    fill="#111827"
                    stroke="#60a5fa"
                    strokeWidth="3"
                  />
                  <rect
                    x="50"
                    y="30"
                    width="300"
                    height="180"
                    rx="8"
                    fill="#0f172a"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <circle cx="66" cy="45" r="3" fill="#f87171" />
                  <circle cx="78" cy="45" r="3" fill="#fbbf24" />
                  <circle cx="90" cy="45" r="3" fill="#34d399" />
                  <circle cx="200" cy="24" r="2.5" fill="#64748b" />
                  {/* Code on screen */}
                  <text
                    x="80"
                    y="70"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#22c55e"
                  >
                    const developer
                  </text>
                  <text
                    x="80"
                    y="90"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#22c55e"
                  >
                    = {"{"} skills: [...]
                  </text>
                  <text
                    x="80"
                    y="110"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#60a5fa"
                  >
                    experience: 2+ years
                  </text>
                  <text
                    x="80"
                    y="130"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#a78bfa"
                  >
                    passion: {"∞"}
                  </text>
                  <text
                    x="80"
                    y="150"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#22c55e"
                  >
                    {"}"}
                  </text>

                  {/* Cursor blink */}
                  <motion.line
                    x1="190"
                    y1="150"
                    x2="190"
                    y2="165"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.g>

                {/* Hinge and angled keyboard deck make the illustration read as a laptop. */}
                <rect x="62" y="214" width="276" height="12" rx="5" fill="#334155" />
                <path
                  d="M62 222 H338 L382 282 H18 Z"
                  fill="#1e293b"
                  stroke="#60a5fa"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M30 282 H370 L359 294 H41 Z" fill="#64748b" />

                {/* Minimal keyboard well and trackpad: intentionally clean at small sizes. */}
                <path d="M80 231 H320 L309 256 H91 Z" fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
                <path d="M151 260 H249 L241 278 H159 Z" fill="#162235" stroke="#475569" strokeWidth="1.5" />

              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Row - Below Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
