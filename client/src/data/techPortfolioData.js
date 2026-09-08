/**
 * Tech Portfolio - Data Configuration
 * Centralized data for easy customization and rebranding
 */

export const personalInfo = {
  name: "Tech",
  title: "Full Stack Developer",
  initials: "T",
  bio: "Building scalable digital experiences that make impact.",
  tagline: "Transforming ideas into exceptional web applications with clean code, modern technologies and creative solutions.",
  email: "hello@techdev.com",
  location: "San Francisco, CA",
  cvUrl: "#", // Link to CV download
};

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com",
    icon: "github",
    label: "GitHub Profile",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: "linkedin",
    label: "LinkedIn Profile",
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: "twitter",
    label: "Twitter Profile",
  },
  {
    name: "Email",
    url: "mailto:hello@techdev.com",
    icon: "email",
    label: "Send Email",
  },
];

export const navigationLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const heroHighlights = [
  "Scalable",
  "Digital Experiences",
  "Make Impact",
];

export const stats = [
  { number: 20, label: "Projects Completed", suffix: "+" },
  { number: 450, label: "DSA Problems Solved", suffix: "+" },
  { number: 2, label: "Years Coding Experience", suffix: "+" },
  { number: 100, label: "Commitment & Dedication", suffix: "%" },
];

export const technologies = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "Git",
  "Docker",
];

export const aboutText = {
  title: "About Me",
  intro:
    "Passionate about creating solutions through code.",
  description:
    "I'm a final year Computer Science student and Full Stack Developer who loves building scalable, efficient and user-friendly web applications. I enjoy solving problems and constantly learning new technologies.",
  cta: "Know More About Me",
};

export const capabilities = [
  {
    title: "Web Development",
    description: "Building responsive and performant websites.",
    icon: "code",
  },
  {
    title: "Backend Development",
    description: "Creating robust APIs and backend systems.",
    icon: "server",
  },
  {
    title: "Problem Solving",
    description: "Solving complex problems with efficient algorithms.",
    icon: "zap",
  },
  {
    title: "Cloud & DevOps",
    description: "Deploying applications with modern DevOps.",
    icon: "cloud",
  },
];

export const services = [
  {
    title: "Full Stack Development",
    description:
      "Build complete production-ready web applications with modern technologies and best practices.",
    icon: "layout",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Backend & APIs",
    description:
      "REST APIs, authentication, databases and scalable architecture for your applications.",
    icon: "database",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "DevOps & Deployment",
    description:
      "Docker, Linux, VPS, CI/CD and production deployment for reliable applications.",
    icon: "settings",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Problem Solving",
    description:
      "Data structures, algorithms and system-oriented thinking for complex challenges.",
    icon: "lightbulb",
    color: "from-orange-500 to-red-500",
  },
];

export const experience = [
  {
    company: "Solutions Touch",
    role: "Web Developer Intern",
    duration: "Jan 2024 - Present",
    description:
      "Developing and maintaining web applications using modern technologies.",
    technologies: ["React", "Node.js", "MongoDB"],
    type: "Internship",
  },
  {
    company: "Elevate Labs",
    role: "Web Development Intern",
    duration: "Jun 2023 - Dec 2023",
    description:
      "Built responsive web interfaces and contributed to backend services.",
    technologies: ["React", "Express", "MySQL"],
    type: "Internship",
  },
];

export const projects = [
  {
    title: "College Management System",
    description:
      "Complete management system for college operations with dashboard and analytics.",
    image: "placeholder-1",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "Full Stack",
  },
  {
    title: "Budget Management Application",
    description:
      "Track and manage expenses with real-time analytics and reporting features.",
    image: "placeholder-2",
    technologies: ["React", "Express", "MongoDB"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "Web App",
  },
  {
    title: "Quiz Platform",
    description:
      "Interactive online quiz platform with scoring and progress tracking.",
    image: "placeholder-3",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "Educational",
  },
  {
    title: "Food Delivery Platform",
    description:
      "Complete food delivery solution with order management and payment integration.",
    image: "placeholder-4",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "E-commerce",
  },
  {
    title: "Weather Application",
    description:
      "Real-time weather app with forecasts and location-based services.",
    image: "placeholder-5",
    technologies: ["React", "API Integration"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "Utility",
  },
  {
    title: "College Website",
    description:
      "Full-featured college website with student portal and management tools.",
    image: "placeholder-6",
    technologies: ["React", "Node.js", "Express", "MySQL"],
    github: "https://github.com/techdev",
    live: "https://example.com",
    category: "Web App",
  },
];

export const skillsCategories = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Next.js", level: 80 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 87 },
      { name: "Python", level: 82 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "MySQL", level: 85 },
      { name: "Firebase", level: 75 },
    ],
  },
  {
    category: "DevOps",
    skills: [
      { name: "Docker", level: 75 },
      { name: "Git", level: 90 },
      { name: "Linux", level: 80 },
      { name: "CI/CD", level: 75 },
    ],
  },
  {
    category: "Problem Solving",
    skills: [
      { name: "Data Structures", level: 88 },
      { name: "Algorithms", level: 85 },
      { name: "System Design", level: 80 },
    ],
  },
];

export const achievements = {
  problemsSolved: 450,
  leetcodeProfile: "https://leetcode.com",
  githubProfile: "https://github.com",
  linkedinProfile: "https://linkedin.com",
  portfolioUrl: "https://techdev.com",
};

export const seoConfig = {
  title: "Tech - Full Stack Developer | Portfolio",
  description:
    "Passionate Full Stack Developer creating scalable digital experiences with modern technologies.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Node.js",
    "Web Development",
    "Portfolio",
  ],
  ogImage: "https://techdev.com/og-image.jpg",
  twitterHandle: "@techdev",
};

export const contactFormFields = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "subject", label: "Subject", type: "text", required: true },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    rows: 5,
  },
];

export const footerText = {
  tagline: "Building digital experiences with code and creativity.",
  copyright: `© ${new Date().getFullYear()} Tech. All rights reserved.`,
};
