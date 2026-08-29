import { motion } from "framer-motion";
import {
  Code,
  Server,
  Zap,
  Cloud,
  Database,
  Layout,
  Lightbulb,
  Settings,
} from "lucide-react";

/**
 * Reusable Portfolio Template Components
 * Glassmorphism design with smooth animations
 */

export const GlassCard = ({
  children,
  className = "",
  delay = 0,
  hover = true,
  ...props
}) => {
  return (
    <motion.div
      initial={false}
      whileInView={{ y: [0, -5, 0] }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`
        tech-glass-card relative rounded-2xl border border-white/10 
        bg-white/[0.08] backdrop-blur-md
        hover:bg-white/[0.12] hover:border-white/20
        transition-all duration-300
        shadow-lg hover:shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SectionHeading = ({
  title,
  subtitle,
  highlight,
  centered = true,
}) => {
  return (
    <motion.div
      initial={false}
      whileInView={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {subtitle && (
        <p className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
        {highlight && (
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {" "}
            {highlight}
          </span>
        )}
      </h2>
    </motion.div>
  );
};

export const AnimatedButton = ({
  children,
  variant = "primary",
  icon: Icon,
  href,
  onClick,
  className = "",
  target,
  rel,
  accentColor,
  style,
  ...props
}) => {
  const baseStyles =
    "relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 inline-flex";

  const variants = {
    primary: "text-white hover:shadow-lg hover:scale-105",
    secondary:
      "border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  };

  const Component = href ? "a" : "button";
  const buttonStyle =
    variant === "primary"
      ? { ...style, backgroundColor: accentColor || "var(--tech-accent, #2563eb)" }
      : style;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Component
        href={href}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        style={buttonStyle}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
        {Icon && <Icon className="w-4 h-4" />}
      </Component>
    </motion.div>
  );
};

export const StatCard = ({ number, label, suffix = "" }) => {
  return (
    <GlassCard className="p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          {number}
          {suffix}
        </div>
        <p className="text-gray-400 text-sm md:text-base">{label}</p>
      </motion.div>
    </GlassCard>
  );
};

export const TechBadge = ({ name, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium hover:border-blue-400/60 transition-all duration-300"
    >
      {name}
    </motion.div>
  );
};

export const ProjectCard = ({
  title,
  description,
  technologies,
  github,
  live,
  delay = 0,
}) => {
  return (
    <GlassCard
      className="p-6 group overflow-hidden"
      delay={delay}
      hover={true}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {technologies?.map((tech, idx) => (
            <TechBadge key={idx} name={tech} delay={idx * 0.1} />
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          {github && (
            <AnimatedButton
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="text-sm px-4 py-2"
            >
              GitHub
            </AnimatedButton>
          )}
          {live && (
            <AnimatedButton
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="text-sm px-4 py-2"
            >
              Live Demo
            </AnimatedButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export const SkillBar = ({ name, level, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">{name}</span>
        <span className="text-blue-400 text-sm font-semibold">{level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};

export const TimelineItem = ({
  company,
  role,
  duration,
  description,
  technologies,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-black -top-2" />

      <GlassCard
        className={`p-6 ${index % 2 === 0 ? "mr-auto" : "ml-auto"} w-full md:w-[calc(50%-2rem)]`}
      >
        <div className="text-blue-400 text-sm font-semibold mb-1">
          {company}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{role}</h3>
        <p className="text-gray-400 text-sm mb-3">{duration}</p>
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        {technologies && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, idx) => (
              <TechBadge key={idx} name={tech} delay={idx * 0.1} />
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export const ServiceCard = ({ title, description, icon: Icon, color, delay = 0 }) => {
  return (
    <GlassCard className="p-8 group" delay={delay}>
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {Icon && <Icon className="w-full h-full text-white" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </GlassCard>
  );
};

export const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Get icon component by name
 */
export const getIconByName = (iconName) => {
  const iconMap = {
    code: Code,
    server: Server,
    zap: Zap,
    cloud: Cloud,
    database: Database,
    layout: Layout,
    lightbulb: Lightbulb,
    settings: Settings,
  };
  return iconMap[iconName] || Code;
};
