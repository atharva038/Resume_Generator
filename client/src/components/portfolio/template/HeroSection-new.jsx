import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
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
    name = "Developer",
    title = "Full Stack Developer",
    bio = "Building digital experiences",
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
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
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

            {/* Main Heading - with extracted name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                  {name}
                </motion.span>
                <br />
                <span className="text-white">
                  I Build
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Scalable Digital Experiences
                </span>
                <br />
                That{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
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
                onClick={() => {
                  const element = document.querySelector("#projects");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                icon={ArrowRight}
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
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative w-full max-w-md"
            >
              {/* Laptop SVG */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 60px rgba(59, 130, 246, 0.2))",
                }}
              >
                {/* Screen */}
                <g>
                  <rect
                    x="50"
                    y="30"
                    width="300"
                    height="180"
                    rx="8"
                    fill="url(#screenGradient)"
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="2"
                  />
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
                </g>

                {/* Keyboard base */}
                <rect
                  x="40"
                  y="205"
                  width="320"
                  height="60"
                  rx="4"
                  fill="rgba(30, 30, 30, 0.8)"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                />

                {/* Keyboard details */}
                <g fill="rgba(100, 100, 100, 0.5)" opacity="0.6">
                  <rect x="55" y="215" width="40" height="12" rx="2" />
                  <rect x="105" y="215" width="40" height="12" rx="2" />
                  <rect x="155" y="215" width="40" height="12" rx="2" />
                  <rect x="205" y="215" width="40" height="12" rx="2" />
                  <rect x="255" y="215" width="40" height="12" rx="2" />
                  <rect x="305" y="215" width="40" height="12" rx="2" />

                  <rect x="55" y="235" width="40" height="12" rx="2" />
                  <rect x="105" y="235" width="120" height="12" rx="2" />
                  <rect x="235" y="235" width="110" height="12" rx="2" />
                </g>

                {/* Gradients */}
                <defs>
                  <linearGradient
                    id="screenGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(15, 23, 42, 0.9)" />
                    <stop offset="100%" stopColor="rgba(30, 41, 59, 0.9)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating tech cards around laptop */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Tech cards in orbit */}
                {["React", "Node.js", "MongoDB", "TypeScript", "Docker", "Git"].map(
                  (tech, idx) => {
                    const angle = (idx / 6) * Math.PI * 2;
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          position: "absolute",
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className="pointer-events-auto"
                      >
                        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold whitespace-nowrap">
                          {tech}
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </motion.div>

              {/* Orbital glow */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="w-full h-full rounded-full border border-blue-400/20 border-dashed" />
              </motion.div>
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
