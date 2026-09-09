/**
 * SmartNShine Minimalist Portfolio Template - Default Clean Config
 * Design Direction: Modern Minimalism × Editorial Precision × Quiet Luxury × Digital Craft
 * Philosophy: "Nothing unnecessary. Nothing unfinished."
 *
 * All content is dynamically supplied by the user through the Portfolio Editor / Profile.
 */

export const personalInfo = {
  name: "Alex Vance",
  initials: "AV",
  role: "Full-Stack Engineer & Product Designer",
  currentPosition: "Lead Design Engineer",
  eyebrow: "PORTFOLIO / 2026",
  location: "San Francisco, CA",
  availabilityStatus: "Available for select opportunities",
  isAvailable: true,
  shortBio: "Building digital products that make complex things feel simple. Focused on high-signal digital craft and scalable architecture.",
  editorialQuote: "I care about the details that make technology feel effortless.",
  detailedBio: [
    "I combine Swiss precision typography with robust full-stack architecture to create tools that feel effortless to use.",
    "My approach prioritizes intention over noise: eliminate the redundant, refine the essential, and build software that respects human attention."
  ],
  education: {
    degree: "B.S. in Computer Science & Interaction",
    institution: "Institute of Technology",
    year: "2020 — 2024"
  },
  focusAreas: ["Minimalist Systems", "AI Tooling", "Digital Typography", "Micro-Interactions"],
  interests: ["Design Engineering", "Distributed Architecture", "Typography Systems"],
  contact: {
    email: "alex@smartnshine.studio",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    ctaHeadline: "Have something worth building?",
    ctaSubtext: "Whether you're looking for end-to-end product development, design systems consulting, or a collaborative engineering partner, my inbox is always open."
  },
  socialLinks: [
    { name: "GitHub", url: "https://github.com", type: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", type: "linkedin" },
    { name: "X / Twitter", url: "https://twitter.com", type: "twitter" }
  ],
  resumeUrl: "",
  accentColor: "#b8943f" // Subtle Champagne Gold
};

export const numbersStats = [
  { number: "12+", label: "Projects Delivered", subtext: "From concept to production" },
  { number: "03", label: "Featured Products", subtext: "Shipped globally" },
  { number: "08", label: "Technologies", subtext: "Deep production expertise" },
  { number: "2026", label: "Current Chapter", subtext: "Available for collaboration" }
];

export const featuredProjects = [
  {
    id: "proj-01",
    number: "01",
    title: "Aura Intelligence",
    category: "PRODUCT / AI",
    year: "2026",
    description: "An autonomous AI orchestration engine designed for high-density engineering workflows.",
    longDescription: "Aura Intelligence eliminates cognitive friction by connecting multiple generative models into a deterministic, observable execution graph with sub-100ms streaming responses.",
    problem: "Developers were losing context jumping across fragmented terminal sessions and disparate AI wrappers without cohesive observability.",
    approach: "Built a reactive graph-based canvas with local-first state, WebSockets telemetry, and a custom minimalist design system.",
    result: "Reduced developer cycle times by 44% with zero reported memory leaks across 50,000+ daily sessions.",
    technologies: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL"],
    featured: true
  }
];

export const experienceTimeline = [
  {
    year: "2024 — Present",
    role: "Lead Design Engineer",
    company: "Apex Studio",
    location: "San Francisco, CA",
    description: "Spearheaded design system architecture and client-facing web application performance optimizations.",
    contributions: [
      "Architected enterprise component system adopted by 12 cross-functional teams",
      "Cut Core Web Vitals LCP by 62% across all primary customer touchpoints"
    ]
  },
  {
    year: "2022 — 2024",
    role: "Frontend Systems Engineer",
    company: "Nexus Labs",
    location: "Remote",
    description: "Engineered real-time data visualization dashboards and developer platform tooling.",
    contributions: [
      "Implemented zero-latency canvas rendering engine with WebGL acceleration",
      "Authored open-source design tokens library with over 10k monthly downloads"
    ]
  }
];

export const categorizedSkills = [
  {
    category: "DEVELOPMENT",
    items: ["React", "Next.js", "TypeScript", "Node.js", "REST & GraphQL APIs", "Tailwind CSS"]
  },
  {
    category: "DESIGN",
    items: ["Figma", "UI/UX Architecture", "Design Systems", "Interactive Prototyping", "Design Engineering"]
  },
  {
    category: "AI & INTELLIGENCE",
    items: ["LLM Integrations", "Autonomous Agents", "Prompt Architecture", "Workflow Automation"]
  },
  {
    category: "TOOLS & INFRASTRUCTURE",
    items: ["Git / GitHub", "Vercel / Cloudflare", "PostgreSQL", "Docker", "Performance Profiling"]
  }
];

export const testimonials = [
  {
    quote: "Working with them was transformative. Complex architectural requirements were translated into an effortless, breathtaking digital product with zero unnecessary friction.",
    author: "Elena Rostova",
    role: "VP of Product, Apex Studio"
  }
];

export const seoConfig = {
  title: "Alex Vance — Portfolio | SmartNShine",
  description: "Modern Minimalism × Editorial Precision × Quiet Luxury × Digital Craft portfolio template powered by SmartNShine.",
  keywords: ["portfolio", "minimalism", "developer", "designer", "SmartNShine", "quiet luxury"],
  ogImage: ""
};
