import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Download,
  ArrowRight,
  Sparkles,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Terminal,
  Cpu,
  Layers,
  Zap,
  Code2,
  Compass,
  BookOpen,
  Sliders,
  Radio,
  Eye,
  Star,
  GitBranch,
  Activity,
  Check
} from "lucide-react";
import ClassicTemplate from "../templates/ClassicTemplate";
import TechTemplate from "../templates/TechTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import ImpactProTemplate from "../templates/ImpactProTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import SiliconValleyTemplate from "../templates/SiliconValleyTemplate";
import LatexAcademicTemplate from "../templates/LatexAcademicTemplate";
import NordicSplitTemplate from "../templates/NordicSplitTemplate";
import GitHubStyleTemplate from "../templates/GitHubStyleTemplate";
import Creative2Template from "../templates/Creative2Template";
import StrategicLeadershipTemplate from "../templates/StrategicLeadershipTemplate";
import Professional2Template from "../templates/Professional2Template";
import ProfessionalV2Template from "../templates/ProfessionalV2Template";
import StructuredPhotoTemplate from "../templates/StructuredPhotoTemplate";

// ============================================================================
// REAL ATS RESUME DATA
// ============================================================================
const fullResumeData1 = {
  name: "Alex Morgan",
  contact: {
    email: "alex.morgan@techmail.io",
    phone: "+1 (555) 349-2810",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan-eng",
    github: "github.com/alexmorgan-dev",
    website: "alexmorgan.dev",
  },
  summary:
    "High-impact Senior Full Stack Engineer with 6+ years of specialized experience in distributed microservices, React 19 architecture, and ultra-high-throughput PostgreSQL databases. Proven track record of scaling high-availability enterprise applications handling over 10M daily transactions with 99.999% uptime.",
  experience: [
    {
      title: "Staff Software Engineer & Tech Lead",
      company: "CloudScale Technologies",
      location: "San Francisco, CA",
      startDate: "03/2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected distributed event-driven microservices processing 4.2M daily API requests with 99.99% uptime SLA.",
        "Optimized PostgreSQL queries, indexing, and Redis cluster caching, slashing p99 latency from 340ms to 48ms.",
        "Led a cross-functional squad of 9 engineers and spearheaded zero-downtime migration to Kubernetes & AWS ECS.",
        "Engineered automated CI/CD deployment pipelines cutting staging-to-production deployment cycles by 65%.",
      ],
    },
    {
      title: "Senior Backend Systems Engineer",
      company: "Stripe Infrastructure",
      location: "San Francisco, CA",
      startDate: "06/2019",
      endDate: "02/2022",
      current: false,
      bullets: [
        "Built mission-critical payment webhook pipelines handling $14M monthly transactional throughput with zero data loss.",
        "Resolved connection concurrency bottlenecks using connection poolers and resilient asynchronous queue workers.",
        "Designed and published standardized internal REST & gRPC API schemas adopted across 14 internal product squads.",
      ],
    },
    {
      title: "Full Stack Software Developer",
      company: "Nexus Labs",
      location: "San Jose, CA",
      startDate: "08/2017",
      endDate: "05/2019",
      current: false,
      bullets: [
        "Developed responsive React and Node.js dashboards utilized by 85,000+ active enterprise business users.",
        "Implemented end-to-end OAuth2 authentication, RBAC authorization, and automated regression test coverage.",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of California, Berkeley",
      graduationDate: "2017",
      gpa: "3.88 / 4.0",
    },
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript (ES6+)", "Go", "Python", "React 19", "Next.js", "Node.js", "GraphQL"],
    },
    {
      category: "Cloud, DB & DevOps",
      items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS (ECS, S3, RDS)", "Terraform", "Kafka", "Prometheus"],
    },
    {
      category: "Architecture & Practices",
      items: ["Distributed Systems", "Microservices", "CI/CD Pipelines", "System Design", "Agile Leadership"],
    },
  ],
  projects: [
    {
      name: "Distributed Raft Consensus Key-Value Store",
      bullets: ["Engineered fault-tolerant distributed key-value storage engine in Go with Raft consensus protocol and gRPC."],
      technologies: "Go, gRPC, Protobuf, Docker, Raft",
    },
    {
      name: "Real-Time Collaborative Code Editor",
      bullets: ["Built real-time web editor supporting multi-user simultaneous code synchronization using WebSockets and CRDTs."],
      technologies: "React 19, Node.js, WebSockets, Redis, PostgreSQL",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Linux Foundation / CNCF",
      date: "2022",
    },
  ],
  achievements: [
    "Published peer-reviewed paper on high-throughput distributed consensus architectures (IEEE 2023).",
    "1st Place Winner at Silicon Valley Hackathon 2022 out of 350+ competing developer teams.",
  ],
  customSections: [],
  selectedTheme: "navy",
  sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications"],
};

const fullResumeData2 = {
  name: "David Kumar",
  contact: {
    email: "david.kumar@cloudscale.net",
    phone: "+1 (555) 892-1049",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/davidkumar-sre",
    github: "github.com/davidkumar",
    website: "davidkumar.io",
  },
  summary:
    "Senior Cloud & DevOps Architect with 5+ years of experience in multi-cloud Kubernetes governance, infrastructure as code (IaC) with Terraform, and enterprise Prometheus/Grafana observability platforms. Specialized in building zero-trust cloud infrastructure and high-resilience GitOps deployment pipelines.",
  experience: [
    {
      title: "Staff SRE & Infrastructure Lead",
      company: "Enterprise Cloud Systems",
      location: "Austin, TX",
      startDate: "01/2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected multi-region Kubernetes clusters across AWS and GCP, maintaining 99.999% uptime across 450+ microservices.",
        "Automated Terraform infrastructure provisioning reducing cloud environment rollout from 3 days to 18 minutes.",
        "Implemented Datadog and Grafana alerting suites that cut mean time to resolution (MTTR) by 54% company-wide.",
        "Enforced zero-trust network policies and secrets rotation with HashiCorp Vault across all Kubernetes workloads.",
      ],
    },
    {
      title: "DevOps & Cloud Engineer",
      company: "Apex Fintech Solutions",
      location: "Austin, TX",
      startDate: "06/2018",
      endDate: "12/2020",
      current: false,
      bullets: [
        "Led containerization initiative for 30+ monolithic Java/Node services to Docker and orchestrated migration to EKS.",
        "Reduced monthly AWS cloud infrastructure spend by $38,000 through auto-scaling groups and Spot instance scheduling.",
      ],
    },
    {
      title: "Junior Cloud Engineer",
      company: "Austin Tech Works",
      location: "Austin, TX",
      startDate: "05/2017",
      endDate: "05/2018",
      current: false,
      bullets: [
        "Configured Linux bastion hosts, VPC subnets, and automated weekly backup retention workflows.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Information Technology",
      institution: "University of Texas, Austin",
      graduationDate: "2017",
      gpa: "3.92 / 4.0",
    },
  ],
  skills: [
    {
      category: "Cloud & Container Platforms",
      items: ["Kubernetes", "Docker", "AWS (EKS, VPC, IAM)", "GCP (GKE)", "Terraform", "ArgoCD", "Helm", "Linux Kernel"],
    },
    {
      category: "Observability & Security",
      items: ["Prometheus", "Grafana", "Datadog", "HashiCorp Vault", "Istio Service Mesh", "OpenTelemetry"],
    },
    {
      category: "Automation & Languages",
      items: ["Python", "Go", "Bash / Shell", "GitHub Actions", "GitLab CI", "Ansible"],
    },
  ],
  projects: [
    {
      name: "Multi-Cloud Kubernetes GitOps Mesh",
      bullets: ["Automated zero-downtime GitOps pipeline across 450+ microservices with automated canary rollbacks."],
      technologies: "Kubernetes, Go, ArgoCD, Terraform, Helm",
    },
    {
      name: "Automated Cloud Cost Optimizer Bot",
      bullets: ["Developed an open-source Slack bot that scans underutilized cloud resources and triggers automated right-sizing."],
      technologies: "Python, AWS Lambda, Boto3, Slack API",
    },
  ],
  certifications: [
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "2023",
    },
    {
      name: "HashiCorp Certified: Terraform Associate",
      issuer: "HashiCorp",
      date: "2022",
    },
  ],
  achievements: [
    "Keynote speaker at Austin Cloud & DevOps Summit 2023 on resilient multi-region infrastructure.",
  ],
  customSections: [],
  selectedTheme: "cyan",
  sectionOrder: ["summary", "skills", "experience", "education", "projects", "certifications"],
};

const fullResumeData3 = { ...fullResumeData1, selectedTheme: "emerald" };
const fullResumeData4 = {
  ...fullResumeData1,
  name: "Sarah Chen",
  contact: { ...fullResumeData1.contact, email: "sarah.chen@leadtech.org", linkedin: "linkedin.com/in/sarahchen-exec" },
  selectedTheme: "purple",
};
const fullResumeData5 = {
  ...fullResumeData1,
  name: "Marcus Vance",
  contact: { ...fullResumeData1.contact, email: "marcus.vance@enterprise-lead.com", location: "New York, NY", linkedin: "linkedin.com/in/marcusvance-cto" },
  summary: "Distinguished Enterprise Technology Executive with 14+ years of cross-functional leadership spanning FinTech, distributed cloud scale, and AI enablement. Oversaw engineering organizations of 120+ developers with $80M annual P&L oversight.",
  selectedTheme: "charcoal",
};
const fullResumeData6 = {
  ...fullResumeData1,
  name: "Priya Sharma",
  contact: { ...fullResumeData1.contact, email: "priya.sharma@productlab.dev", location: "Seattle, WA", linkedin: "linkedin.com/in/priyasharma-dev" },
  summary: "Staff Product Frontend Engineer specializing in high-performance browser rendering, accessible design systems, and WebAssembly tooling. Shipped consumer experiences enjoyed by 22M+ monthly active users across mobile and web platforms.",
  selectedTheme: "slate",
};

// 15 Comprehensive Resume Configurations
const allResumeTemplates = {
  siliconValley: {
    templateTitle: "Silicon Valley Tech Lead",
    badgeText: "99% ATS Pass",
    badgeColor: "cyan",
    formatText: "FAANG / Staff Engineer",
    templateSlug: "silicon-valley",
    template: SiliconValleyTemplate,
    data: fullResumeData1,
  },
  latexAcademic: {
    templateTitle: "Stanford LaTeX Academic",
    badgeText: "100% Parsing",
    badgeColor: "indigo",
    formatText: "LaTeX Typographic Pro",
    templateSlug: "latex-academic",
    template: LatexAcademicTemplate,
    data: fullResumeData2,
  },
  nordicSplit: {
    templateTitle: "Nordic Split Architect",
    badgeText: "99% Workday",
    badgeColor: "blue",
    formatText: "Two-Column Executive",
    templateSlug: "nordic-split",
    template: NordicSplitTemplate,
    data: fullResumeData4,
  },
  executive: {
    templateTitle: "Wall Street / Ivy League",
    badgeText: "Top 1% C-Suite",
    badgeColor: "amber",
    formatText: "Strategic Executive",
    templateSlug: "executive",
    template: ExecutiveTemplate,
    data: fullResumeData5,
  },
  impactPro: {
    templateTitle: "Impact Pro STAR Layout",
    badgeText: "98% Lever / Green",
    badgeColor: "emerald",
    formatText: "STAR Metrics Layout",
    templateSlug: "impact-pro",
    template: ImpactProTemplate,
    data: fullResumeData3,
  },
  modern: {
    templateTitle: "Linear / Vercel Modern",
    badgeText: "Modern ATS",
    badgeColor: "purple",
    formatText: "Modern Tech Layout",
    templateSlug: "modern",
    template: ModernTemplate,
    data: fullResumeData4,
  },
  minimal: {
    templateTitle: "The Swiss Minimalist",
    badgeText: "100% Parsing",
    badgeColor: "indigo",
    formatText: "Swiss Precision Grid",
    templateSlug: "minimal",
    template: MinimalTemplate,
    data: fullResumeData6,
  },
  classic: {
    templateTitle: "The Open-Source Standard",
    badgeText: "99% Workday",
    badgeColor: "blue",
    formatText: "Single-Column Standard",
    templateSlug: "classic",
    template: ClassicTemplate,
    data: fullResumeData1,
  },
  tech: {
    templateTitle: "Tech Developer Pro",
    badgeText: "99% ATS Pass",
    badgeColor: "cyan",
    formatText: "Technical Engineering",
    templateSlug: "tech",
    template: TechTemplate,
    data: fullResumeData2,
  },
  githubStyle: {
    templateTitle: "Metro Grid Narrative",
    badgeText: "96% ATS Pass",
    badgeColor: "emerald",
    formatText: "GitHub / Developer Grid",
    templateSlug: "GitHubStyle",
    template: GitHubStyleTemplate,
    data: fullResumeData1,
  },
  creative2: {
    templateTitle: "Studio & Editorial",
    badgeText: "98% ATS Pass",
    badgeColor: "purple",
    formatText: "Editorial Portfolio",
    templateSlug: "creative2",
    template: Creative2Template,
    data: fullResumeData4,
  },
  strategicLeader: {
    templateTitle: "Strategic Leadership",
    badgeText: "97% ATS Pass",
    badgeColor: "amber",
    formatText: "Leadership & Impact",
    templateSlug: "strategic-leader",
    template: StrategicLeadershipTemplate,
    data: fullResumeData5,
  },
  professional2: {
    templateTitle: "Professional Elite",
    badgeText: "98% ATS Pass",
    badgeColor: "blue",
    formatText: "Executive Standard",
    templateSlug: "professional2",
    template: Professional2Template,
    data: fullResumeData5,
  },
  professionalV2: {
    templateTitle: "Professional V2",
    badgeText: "96% ATS Pass",
    badgeColor: "emerald",
    formatText: "Corporate Layout",
    templateSlug: "professional-v2",
    template: ProfessionalV2Template,
    data: fullResumeData1,
  },
  structuredPhoto: {
    templateTitle: "Structured Photo Pro",
    badgeText: "95% ATS Pass",
    badgeColor: "purple",
    formatText: "Visual Structured",
    templateSlug: "structured-photo",
    template: StructuredPhotoTemplate,
    data: fullResumeData4,
  },
};

const colAItems = [
  allResumeTemplates.executive,
  allResumeTemplates.latexAcademic,
  allResumeTemplates.siliconValley,
  allResumeTemplates.minimal,
  allResumeTemplates.modern,
];

const col1Items = [
  allResumeTemplates.siliconValley,
  allResumeTemplates.latexAcademic,
  allResumeTemplates.strategicLeader,
  allResumeTemplates.classic,
  allResumeTemplates.impactPro,
];

const col2Items = [
  allResumeTemplates.nordicSplit,
  allResumeTemplates.siliconValley,
  allResumeTemplates.executive,
  allResumeTemplates.professional2,
  allResumeTemplates.minimal,
];

const col3Items = [
  allResumeTemplates.latexAcademic,
  allResumeTemplates.modern,
  allResumeTemplates.classic,
  allResumeTemplates.tech,
  allResumeTemplates.githubStyle,
];

const colBItems = [
  allResumeTemplates.minimal,
  allResumeTemplates.classic,
  allResumeTemplates.impactPro,
  allResumeTemplates.tech,
  allResumeTemplates.executive,
];

// Target 8 flagship resume templates in sequential spotlight flight
const RESUME_FOCUS_TARGETS = [
  { cardId: "c2-1", slug: "silicon-valley" },   // 0: Silicon Valley Tech Lead (Col 2, Row 1)
  { cardId: "c1-1", slug: "latex-academic" },    // 1: Stanford LaTeX Academic (Col 1, Row 1)
  { cardId: "c2-0", slug: "nordic-split" },     // 2: Nordic Split Architect (Col 2, Row 0)
  { cardId: "c3-1", slug: "modern" },           // 3: Linear / Vercel Modern (Col 3, Row 1)
  { cardId: "c2-2", slug: "executive" },        // 4: Executive Leadership (Col 2, Row 2)
  { cardId: "c1-3", slug: "classic" },          // 5: Classic ATS Standard (Col 1, Row 3)
  { cardId: "c3-3", slug: "tech" },             // 6: Tech Developer Pro (Col 3, Row 3)
  { cardId: "c1-2", slug: "strategic-leader" }, // 7: Strategic Leadership (Col 1, Row 2)
];

// ============================================================================
// NEW RICH PORTFOLIO CONFIGURATIONS (High-Fidelity Widescreen Themes)
// ============================================================================
const portfolioThemesCatalog = {
  kinetic: {
    id: "kinetic",
    title: "SmartNShine Kinetic",
    category: "Interactive Motion",
    badgeText: "New Flagship",
    badgeColor: "blue",
    accent: "#2563eb",
    slug: "kinetic",
    domain: "alexmorgan.studio",
    subtitle: "Scroll × 3D Spatial Transformation × Generative Shaders",
    themeType: "kinetic",
  },
  swissArchitectural: {
    id: "swissArchitectural",
    title: "Swiss Architectural",
    category: "Swiss Minimal",
    badgeText: "New Minimal II",
    badgeColor: "indigo",
    accent: "#2251ff",
    slug: "swissArchitectural",
    domain: "alex.architect.dev",
    subtitle: "Architectural Grid × Monumental Typography × Cobalt Blue",
    themeType: "swissArchitectural",
  },
  magazine: {
    id: "magazine",
    title: "Magazine Editorial",
    category: "Monograph Editorial",
    badgeText: "New Signature",
    badgeColor: "amber",
    accent: "#b8943f",
    slug: "magazine",
    domain: "journal.alexvance.io",
    subtitle: "High-Fashion Editorial × 12-Column Grid × Day & Night",
    themeType: "magazine",
  },
  retroFuturistic: {
    id: "retroFuturistic",
    title: "Retro-Futuristic OS",
    category: "Retro-Futurism",
    badgeText: "CRT Cyber HUD",
    badgeColor: "emerald",
    accent: "#00ff66",
    slug: "retroFuturistic",
    domain: "telemetry.alex-sys.net",
    subtitle: "80s/90s Computing × Phosphor CRT × Telemetry Matrix",
    themeType: "retroFuturistic",
  },
  liquidGlass: {
    id: "liquidGlass",
    title: "Liquid Glass Spatial",
    category: "Spatial UI",
    badgeText: "Spatial 3D",
    badgeColor: "cyan",
    accent: "#38bdf8",
    slug: "liquidGlass",
    domain: "glass.alexmorgan.dev",
    subtitle: "Translucent Refraction × Spatial UI Cards × Fluid Aurora",
    themeType: "liquidGlass",
  },
  neomorphic: {
    id: "neomorphic",
    title: "Tactile Neomorphic",
    category: "Neumorphic 3D",
    badgeText: "Tactile Precision",
    badgeColor: "amber",
    accent: "#d4af37",
    slug: "neomorphic",
    domain: "hardware.alexvance.design",
    subtitle: "Soft 3D Physical Surfaces × Tactile Dials & Hardware Precision",
    themeType: "neomorphic",
  },
  cyberDev: {
    id: "cyberDev",
    title: "Cyber Dev Terminal",
    category: "Cyberpunk Terminal",
    badgeText: "Cyberpunk",
    badgeColor: "emerald",
    accent: "#00ff88",
    slug: "cyberDev",
    domain: "terminal.alex.root",
    subtitle: "Neon Terminal Dark Mode × Glitch Accents × Live GitHub Sync",
    themeType: "cyberDev",
  },
  smartnshine: {
    id: "smartnshine",
    title: "SmartNShine Minimal",
    category: "Quiet Luxury",
    badgeText: "Signature",
    badgeColor: "amber",
    accent: "#b8943f",
    slug: "smartnshine",
    domain: "alex.smartnshine.studio",
    subtitle: "Quiet Luxury × Swiss Typography × Curated Storytelling",
    themeType: "smartnshine",
  },
  glassmorphism: {
    id: "glassmorphism",
    title: "Aura Glass",
    category: "Glassmorphism",
    badgeText: "Popular",
    badgeColor: "cyan",
    accent: "#06b6d4",
    slug: "glassmorphism",
    domain: "aura.alexmorgan.dev",
    subtitle: "Translucent Frosted Glass × Ambient Glowing Aurora",
    themeType: "glassmorphism",
  },
  creative: {
    id: "creative",
    title: "Creative Canvas",
    category: "Design Studio",
    badgeText: "Design",
    badgeColor: "purple",
    accent: "#7c3aed",
    slug: "creative",
    domain: "creative.alexmorgan.art",
    subtitle: "Asymmetric Grid × Expressive Typography × Bold Accents",
    themeType: "creative",
  },
  minimalDeveloper: {
    id: "minimalDeveloper",
    title: "Minimal Developer",
    category: "Developer",
    badgeText: "High Signal",
    badgeColor: "emerald",
    accent: "#10b981",
    slug: "minimalDeveloper",
    domain: "code.alexmorgan.dev",
    subtitle: "High-Signal Monospace Accents × Zero Fluff × Instant GitHub",
    themeType: "minimalDeveloper",
  },
  techPortfolio: {
    id: "techPortfolio",
    title: "Tech Portfolio",
    category: "Developer",
    badgeText: "Tech Clean",
    badgeColor: "blue",
    accent: "#3b82f6",
    slug: "techPortfolio",
    domain: "tech.alexmorgan.net",
    subtitle: "Futuristic Glassmorphism × 3D Vectors × Interactive Stack",
    themeType: "techPortfolio",
  },
};

const pColAItems = [
  portfolioThemesCatalog.creative,
  portfolioThemesCatalog.minimalDeveloper,
  portfolioThemesCatalog.neomorphic,
  portfolioThemesCatalog.smartnshine,
];
const pCol1Items = [
  portfolioThemesCatalog.swissArchitectural,
  portfolioThemesCatalog.liquidGlass,
  portfolioThemesCatalog.glassmorphism,
  portfolioThemesCatalog.techPortfolio,
];
const pCol2Items = [
  portfolioThemesCatalog.kinetic,
  portfolioThemesCatalog.magazine,
  portfolioThemesCatalog.neomorphic,
  portfolioThemesCatalog.smartnshine,
];
const pCol3Items = [
  portfolioThemesCatalog.retroFuturistic,
  portfolioThemesCatalog.cyberDev,
  portfolioThemesCatalog.swissArchitectural,
  portfolioThemesCatalog.liquidGlass,
];
const pColBItems = [
  portfolioThemesCatalog.magazine,
  portfolioThemesCatalog.kinetic,
  portfolioThemesCatalog.cyberDev,
  portfolioThemesCatalog.retroFuturistic,
];

// Target 7 flagship portfolio templates in sequential spotlight flight
const PORTFOLIO_FOCUS_TARGETS = [
  { cardId: "pc2-0", slug: "kinetic" },
  { cardId: "pc1-0", slug: "swissArchitectural" },
  { cardId: "pc2-1", slug: "magazine" },
  { cardId: "pc3-0", slug: "retroFuturistic" },
  { cardId: "pc1-1", slug: "liquidGlass" },
  { cardId: "pc2-2", slug: "neomorphic" },
  { cardId: "pc3-1", slug: "cyberDev" },
];

// ============================================================================
// RESUME CARD COMPONENT
// ============================================================================
const ScaledResumeCard = React.memo(function ScaledResumeCard({
  item,
  isDarkMode,
  cardId,
  activeFocusIndex,
  shouldReduceMotion,
  onSelectCard,
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const {
    templateTitle,
    badgeText,
    badgeColor,
    formatText,
    templateSlug,
    template: Template,
    data,
  } = item;

  const badgeColors = {
    blue: "text-zinc-700 dark:text-zinc-300 bg-zinc-500/15 border-zinc-500/30",
    zinc: "text-zinc-700 dark:text-zinc-300 bg-zinc-500/15 border-zinc-500/30",
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-500/15 border-purple-500/30",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
  };

  const dotColors = {
    blue: "text-zinc-500",
    zinc: "text-zinc-500",
    cyan: "text-cyan-500",
    emerald: "text-emerald-500",
    purple: "text-purple-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
  };

  const targetIndex = RESUME_FOCUS_TARGETS.findIndex((t) => t.cardId === cardId);
  const isInCycle = targetIndex !== -1;

  let distance = 99;
  if (isInCycle) {
    const rawDiff = Math.abs(targetIndex - activeFocusIndex);
    distance = Math.min(rawDiff, RESUME_FOCUS_TARGETS.length - rawDiff);
  }

  const isFocused = distance === 0;

  let animOpacity = 0.24;
  let animScale = 0.96;
  let animY = 0;

  if (shouldReduceMotion) {
    animOpacity = isFocused ? 1 : 0.4;
    animScale = 1;
    animY = 0;
  } else if (isFocused) {
    animOpacity = 1;
    animScale = 1.02;
    animY = -4;
  } else if (distance === 1) {
    animOpacity = 0.44;
    animScale = 0.98;
    animY = 0;
  } else if (distance === 2) {
    animOpacity = 0.28;
    animScale = 0.96;
    animY = 0;
  }

  const targetOpacity = isCardHovered ? 1 : animOpacity;
  const targetScale = isCardHovered ? 1.03 : animScale;
  const targetY = isCardHovered ? -5 : animY;

  const transitionConfig = shouldReduceMotion
    ? { duration: 0.1 }
    : {
        duration: isCardHovered ? 0.3 : 1.8,
        ease: [0.45, 0, 0.2, 1],
      };

  const shadowClasses = isFocused || isCardHovered
    ? isDarkMode
      ? "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/20 border-white/30"
      : "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.16)] ring-1 ring-black/10 border-zinc-400"
    : distance === 1
    ? isDarkMode
      ? "shadow-lg shadow-black/40 border-white/10"
      : "shadow-md shadow-zinc-200/60 border-zinc-200/90"
    : isDarkMode
    ? "border-white/5"
    : "border-zinc-200/70";

  return (
    <motion.div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={() => {
        if (isInCycle && onSelectCard) {
          onSelectCard(targetIndex);
        }
      }}
      animate={{
        opacity: targetOpacity,
        scale: targetScale,
        y: targetY,
      }}
      transition={transitionConfig}
      style={{
        zIndex: isFocused ? 25 : isCardHovered ? 20 : distance === 1 ? 8 : 1,
        willChange: "transform, opacity",
      }}
      className={`w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 h-[365px] rounded-2xl border p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden text-left select-none group/card cursor-pointer transition-[box-shadow,border-color,background-color] duration-300 ${
        isDarkMode
          ? "bg-[#0b1018]/95 hover:border-white/25"
          : "bg-white hover:border-zinc-400"
      } ${shadowClasses}`}
    >
      <div
        className={`flex items-center justify-between pb-1.5 mb-1.5 border-b text-[10px] sm:text-[11px] font-mono ${
          isDarkMode ? "border-white/5 text-zinc-300" : "border-zinc-100 text-zinc-800 font-semibold"
        }`}
      >
        <span className="font-bold flex items-center gap-1.5 truncate max-w-[155px]">
          <span className={dotColors[badgeColor] || "text-zinc-500"}>⸎</span> {templateTitle}
        </span>
        <span
          className={`font-bold px-1.5 sm:px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] whitespace-nowrap ${
            badgeColors[badgeColor] || badgeColors.zinc
          }`}
        >
          {badgeText}
        </span>
      </div>

      <div className="w-full flex-1 overflow-hidden rounded-lg bg-white relative shadow-2xs border border-zinc-200/80">
        <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.33] sm:scale-[0.35] pointer-events-none select-none text-zinc-900">
          <Template resumeData={data} isDarkMode={false} />
        </div>
      </div>

      <div
        className={`pt-1.5 mt-1.5 flex items-center justify-between text-[10px] border-t ${
          isDarkMode ? "border-white/5 text-zinc-400" : "border-zinc-100 text-zinc-500"
        }`}
      >
        <span className="font-mono truncate max-w-[140px] text-[9px] sm:text-[10px]">{formatText}</span>
        <Link
          to={`/templates?template=${templateSlug}`}
          onClick={(e) => e.stopPropagation()}
          className="font-bold flex items-center gap-1 shrink-0 text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors group/link py-1 px-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
});

// ============================================================================
// HIGH-DENSITY SCALED WIDESCREEN PORTFOLIO CARD (FULL WEBPAGE VIEWPORT)
// ============================================================================
const ScaledPortfolioCard = React.memo(function ScaledPortfolioCard({
  item,
  isDarkMode,
  cardId,
  activeFocusIndex,
  shouldReduceMotion,
  onSelectCard,
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const {
    id,
    title,
    category,
    badgeText,
    badgeColor,
    accent,
    slug,
    domain,
    subtitle,
    themeType,
  } = item;

  const targetIndex = PORTFOLIO_FOCUS_TARGETS.findIndex((t) => t.cardId === cardId);
  const isInCycle = targetIndex !== -1;

  let distance = 99;
  if (isInCycle) {
    const rawDiff = Math.abs(targetIndex - activeFocusIndex);
    distance = Math.min(rawDiff, PORTFOLIO_FOCUS_TARGETS.length - rawDiff);
  }

  const isFocused = distance === 0;

  let animOpacity = 0.28;
  let animScale = 0.96;
  let animY = 0;

  if (shouldReduceMotion) {
    animOpacity = isFocused ? 1 : 0.45;
    animScale = 1;
    animY = 0;
  } else if (isFocused) {
    animOpacity = 1;
    animScale = 1.02;
    animY = -4;
  } else if (distance === 1) {
    animOpacity = 0.48;
    animScale = 0.98;
    animY = 0;
  } else if (distance === 2) {
    animOpacity = 0.32;
    animScale = 0.96;
    animY = 0;
  }

  const targetOpacity = isCardHovered ? 1 : animOpacity;
  const targetScale = isCardHovered ? 1.03 : animScale;
  const targetY = isCardHovered ? -5 : animY;

  const transitionConfig = shouldReduceMotion
    ? { duration: 0.1 }
    : {
        duration: isCardHovered ? 0.3 : 1.8,
        ease: [0.45, 0, 0.2, 1],
      };

  const badgeStyles = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  const shadowClasses = isFocused || isCardHovered
    ? isDarkMode
      ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/25 border-white/40"
      : "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] ring-1 ring-black/10 border-zinc-400"
    : distance === 1
    ? isDarkMode
      ? "shadow-xl shadow-black/50 border-white/10"
      : "shadow-md shadow-zinc-200/70 border-zinc-200/90"
    : isDarkMode
    ? "border-white/5"
    : "border-zinc-200/70";

  return (
    <motion.div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={() => {
        if (isInCycle && onSelectCard) {
          onSelectCard(targetIndex);
        }
      }}
      animate={{
        opacity: targetOpacity,
        scale: targetScale,
        y: targetY,
      }}
      transition={transitionConfig}
      style={{
        zIndex: isFocused ? 25 : isCardHovered ? 20 : distance === 1 ? 8 : 1,
        willChange: "transform, opacity",
      }}
      className={`w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 h-[360px] sm:h-[385px] rounded-2xl border p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden text-left select-none group/card cursor-pointer transition-[box-shadow,border-color,background-color] duration-300 ${
        isDarkMode
          ? "bg-[#080c14]/95 hover:border-white/30"
          : "bg-white hover:border-zinc-400"
      } ${shadowClasses}`}
    >
      {/* 1. TOP BROWSER WINDOW HEADER / URL BAR */}
      <div
        className={`flex items-center justify-between pb-1.5 mb-1.5 border-b text-[10px] sm:text-[11px] font-mono ${
          isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-100 text-zinc-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/90 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/90 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/90 inline-block" />
          </div>

          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] ${
              isDarkMode ? "bg-white/5 border-white/10 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
            }`}
          >
            <Lock className="w-2.5 h-2.5 text-emerald-500" />
            <span className="truncate max-w-[160px] font-medium">{domain}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badgeStyles[badgeColor] || badgeStyles.blue}`}>
            {badgeText}
          </span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            {category}
          </span>
        </div>
      </div>

      {/* 2. AUTHENTIC SCALED-DOWN FULL WEBPAGE VIEWPORT */}
      <div className="w-full flex-1 overflow-hidden rounded-xl relative border border-white/10 shadow-inner bg-[#07090f] text-white">
        {/* Virtual Desktop Canvas: 960px x 600px scaled down smoothly to fit viewport */}
        <div className="absolute top-0 left-0 w-[960px] h-[600px] origin-top-left transform scale-[0.49] sm:scale-[0.53] xl:scale-[0.57] pointer-events-none select-none text-white">
          
          {/* THEME 1: SmartNShine Kinetic */}
          {themeType === "kinetic" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#060814] via-[#0a1024] to-[#04060c] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />

              {/* Kinetic Top Nav */}
              <div className="relative z-10 flex items-center justify-between px-5 py-3 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-500/30">
                    AM
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">Alex Morgan</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AVAILABLE FOR CONTRACT
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-zinc-300 font-medium text-xs">
                  <span className="text-white font-bold">Spatial Works</span>
                  <span>Shader Lab</span>
                  <span>Distributed Mesh</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md">
                    Resume PDF ↗
                  </span>
                </div>
              </div>

              {/* Hero Section with 3D Ring & Live Stats */}
              <div className="relative z-10 grid grid-cols-12 gap-6 items-center my-auto py-2">
                <div className="col-span-8 space-y-3 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scroll × 3D Transformation × Generative Shaders</span>
                  </div>
                  <h1 className="text-3xl font-black text-white leading-tight">
                    Architecting Scalable Microservices & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
                      3D Spatial Web Experiences
                    </span>
                  </h1>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                    Staff Full Stack Engineer with 6+ years specializing in distributed systems, React 19 architecture, and high-throughput databases handling 10M+ daily events.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">View Projects (12)</span>
                    <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-xs">GitHub 2.4k ★</span>
                  </div>
                </div>

                {/* 4 Metrics Box */}
                <div className="col-span-4 grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-blue-400 font-mono">4.2M</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Daily Events</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-cyan-400 font-mono">48ms</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">p99 Latency</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-emerald-400 font-mono">99.99%</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Uptime SLA</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-amber-400 font-mono">12+</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Projects</div>
                  </div>
                </div>
              </div>

              {/* 2 Featured Projects Row */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-mono">
                    <span>01 / DISTRIBUTED RAFT ENGINE</span>
                    <span>Go • gRPC • Docker</span>
                  </div>
                  <div className="text-xs font-bold text-white">Fault-Tolerant Distributed Key-Value Store</div>
                  <div className="text-[11px] text-zinc-400">Raft consensus protocol with sub-millisecond leader election & log replication.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                    <span>02 / SPATIAL CANVAS ENGINE</span>
                    <span>React 19 • WebSockets • Redis</span>
                  </div>
                  <div className="text-xs font-bold text-white">Real-Time Collaborative Code Studio</div>
                  <div className="text-[11px] text-zinc-400">Multi-user CRDT synchronization handling 50,000+ concurrent sessions.</div>
                </div>
              </div>

              {/* Bottom Skills Strip */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-zinc-400">
                <span>TECH STACK: TypeScript • Go • React 19 • Next.js 15 • PostgreSQL • Kubernetes • AWS • Kafka</span>
                <span className="text-blue-400 font-bold">SmartNShine Kinetic 3D</span>
              </div>
            </div>
          )}

          {/* THEME 2: Swiss Architectural */}
          {themeType === "swissArchitectural" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#0b0d13] text-zinc-100 font-mono relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(#2251ff 1px, transparent 1px), linear-gradient(90deg, #2251ff 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Swiss Header */}
              <div className="relative z-10 flex items-center justify-between border-b-2 border-zinc-800 pb-2 text-xs">
                <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#2251ff]" /> SWISS // ARCHITECTURAL 2026
                </span>
                <span className="text-zinc-400">LAT 37°46'N // LONG 122°25'W</span>
                <span className="text-[#2251ff] font-bold">01 ABOUT • 02 WORKS • 03 SPECS • 04 CONTACT</span>
              </div>

              {/* Monumental Headline */}
              <div className="relative z-10 space-y-1.5 text-left py-1">
                <div className="text-[11px] text-[#2251ff] font-bold tracking-widest uppercase">
                  PRECISION × ARCHITECTURE × RIGID STRUCTURE
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans">
                  ALEX MORGAN // STAFF ARCHITECT
                </h1>
                <div className="text-xs font-sans text-zinc-300 max-w-2xl leading-relaxed">
                  Eliminating redundant abstractions. Translating distributed systems complexity into monumental, deterministic digital tools.
                </div>
              </div>

              {/* Specs & Metrics Matrix */}
              <div className="relative z-10 grid grid-cols-4 gap-3 border-y border-zinc-800 py-3 text-left">
                <div>
                  <div className="text-lg font-black text-white">12</div>
                  <div className="text-[10px] text-[#2251ff]">PRODUCTION SYSTEMS</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">6+ YRS</div>
                  <div className="text-[10px] text-[#2251ff]">DISTRIBUTED SRE</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">99.999%</div>
                  <div className="text-[10px] text-[#2251ff]">UPTIME RECORD</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">48MS</div>
                  <div className="text-[10px] text-[#2251ff]">P99 DB LATENCY</div>
                </div>
              </div>

              {/* Architectural Index Table */}
              <div className="relative z-10 space-y-2 text-left text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-white font-bold">01 / DISTRIBUTED RAFT CONSENSUS ENGINE</span>
                  <span className="text-[#2251ff]">GO • GRPC • DISTRIBUTED KV</span>
                  <span className="text-zinc-400">2026 // PRODUCTION</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-white font-bold">02 / KINETIC TELEMETRY MESH & SHADERS</span>
                  <span className="text-[#2251ff]">RUST • WEBGL • 10M REQ/S</span>
                  <span className="text-zinc-400">2025 // ACTIVE</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-white font-bold">03 / PAYMENT WEBHOOK CONCURRENCY PIPELINE</span>
                  <span className="text-[#2251ff]">POSTGRESQL • REDIS • STRIPE</span>
                  <span className="text-zinc-400">2024 // VERIFIED</span>
                </div>
              </div>

              {/* Blueprint Footer */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800">
                <span>INDEXED REPOSITORY // 48 REPOS • 2.4K STARS</span>
                <span className="text-[#2251ff] font-bold">SWISS MONUMENTAL GRID</span>
              </div>
            </div>
          )}

          {/* THEME 3: Magazine Editorial */}
          {themeType === "magazine" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#0e0f14] text-zinc-100 font-serif relative overflow-hidden">
              {/* Magazine Masthead */}
              <div className="relative z-10 flex items-center justify-between border-b border-amber-500/30 pb-2 text-[11px] font-sans tracking-widest uppercase text-amber-400">
                <span>VOL. XXIV — MONOGRAPH / ISSUE 04</span>
                <span>PARIS • SAN FRANCISCO • TOKYO</span>
                <span>SPRING 2026 EDITION</span>
              </div>

              {/* Editorial Hero Spread */}
              <div className="relative z-10 grid grid-cols-12 gap-6 items-center my-auto py-2">
                <div className="col-span-8 space-y-2.5 text-left">
                  <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans tracking-wider uppercase">
                    FEATURED MONOGRAPH
                  </div>
                  <h1 className="text-3xl font-serif italic text-amber-100 leading-tight">
                    "The Architecture of Scalable Software & Quiet Luxury"
                  </h1>
                  <div className="text-xs font-sans font-bold text-zinc-200">
                    A Monograph by Alex Vance • Lead Design Engineer & Architect
                  </div>
                  <p className="text-xs font-serif text-zinc-300 leading-relaxed italic max-w-xl">
                    "Simplicity is about subtracting the obvious and adding the meaningful. Engineering digital systems that eliminate cognitive friction while preserving absolute technical rigor."
                  </p>
                </div>

                {/* Editorial Pullquote Box */}
                <div className="col-span-4 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-left space-y-2">
                  <div className="text-[10px] font-sans font-bold text-amber-400 uppercase tracking-widest">CHAPTER OVERVIEW</div>
                  <div className="text-xs font-serif text-amber-100 italic">"Engineering tools that respect human attention."</div>
                  <div className="text-[10px] font-sans text-zinc-400 space-y-1 pt-1 border-t border-amber-500/20">
                    <div>• 12+ Delivered Projects</div>
                    <div>• Distributed Microservices</div>
                    <div>• Swiss Precision Design</div>
                  </div>
                </div>
              </div>

              {/* 2 Monograph Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-4 font-sans text-left">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-amber-500/20 space-y-1">
                  <div className="text-[10px] text-amber-400 font-mono">ESSAY 01 / ARTIFACTS</div>
                  <div className="text-xs font-bold text-white">Aura Intelligence: Autonomous Orchestration Graph</div>
                  <div className="text-[10px] text-zinc-400 font-serif italic">Sub-100ms streaming responses connecting generative models.</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-amber-500/20 space-y-1">
                  <div className="text-[10px] text-amber-400 font-mono">ESSAY 02 / INFRASTRUCTURE</div>
                  <div className="text-xs font-bold text-white">Distributed Raft Consensus Engine</div>
                  <div className="text-[10px] text-zinc-400 font-serif italic">Peer-reviewed distributed fault tolerance published at IEEE 2023.</div>
                </div>
              </div>

              {/* Colophon */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-sans text-amber-400/80 pt-2 border-t border-amber-500/20">
                <span>CURATED BY SMARTNSHINE STUDIO</span>
                <span className="font-serif italic text-amber-200">Monocle × Kinfolk Digital Typography</span>
              </div>
            </div>
          )}

          {/* THEME 4: Retro-Futuristic OS */}
          {themeType === "retroFuturistic" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#030804] text-[#00ff66] font-mono relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 255, 102, 0.15) 0px, transparent 2px, transparent 4px)",
                }}
              />

              {/* CRT HUD Bar */}
              <div className="relative z-10 flex items-center justify-between border-b-2 border-[#00ff66]/40 pb-2 text-xs">
                <span className="flex items-center gap-2 font-bold">
                  <Terminal className="w-4 h-4 text-[#00ff66]" /> SYSTEM v4.2 // TELEMETRY HUD [TTY_01]
                </span>
                <span className="text-[#ffb000]">BAUD: 57600 // PORT: 8080</span>
                <span className="text-[#00ff66] font-bold">[ONLINE / 99.999% HEALTH]</span>
              </div>

              {/* Terminal Logs & Console */}
              <div className="relative z-10 space-y-2 text-left py-1 text-xs">
                <div className="p-3 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 space-y-1">
                  <div><span className="text-[#ffb000]">$</span> init-developer --operator=alex-morgan --level=staff-sre</div>
                  <div className="text-zinc-300">&gt; Loading modules: [RAFT_CONSENSUS_OK] [K8S_MESH_OK] [POSTGRES_INDEXED]</div>
                  <div className="text-zinc-300">&gt; Active deployment: 450+ microservices // 4.2M daily API transactions</div>
                </div>
              </div>

              {/* Telemetry 4-Metric Grid */}
              <div className="relative z-10 grid grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded border border-[#00ff66]/30 bg-[#00ff66]/5">
                  <div className="text-base font-black text-white">99.8%</div>
                  <div className="text-[9px] text-[#00ff66]">CPU TELEMETRY</div>
                </div>
                <div className="p-2.5 rounded border border-[#00ff66]/30 bg-[#00ff66]/5">
                  <div className="text-base font-black text-[#ffb000]">64MB</div>
                  <div className="text-[9px] text-[#ffb000]">RAM BUFFER</div>
                </div>
                <div className="p-2.5 rounded border border-[#00ff66]/30 bg-[#00ff66]/5">
                  <div className="text-base font-black text-white">10Gbps</div>
                  <div className="text-[9px] text-[#00ff66]">OPTICAL LINK</div>
                </div>
                <div className="p-2.5 rounded border border-[#00ff66]/30 bg-[#00ff66]/5">
                  <div className="text-base font-black text-[#00ff66]">12 SHIPPED</div>
                  <div className="text-[9px] text-[#00ff66]">SYSTEM TASKS</div>
                </div>
              </div>

              {/* Active Manifest Rows */}
              <div className="relative z-10 space-y-1.5 text-left text-xs">
                <div className="flex items-center justify-between border-t border-[#00ff66]/30 pt-1">
                  <span className="text-white font-bold">[PRJ_01] RAFT_KV_STORE.GO</span>
                  <span className="text-[#ffb000]">GO • GRPC • DISTRIBUTED</span>
                  <span className="text-[#00ff66]">100% HEALTH</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#00ff66]/30 pt-1">
                  <span className="text-white font-bold">[PRJ_02] COLLAB_EDITOR.TSX</span>
                  <span className="text-[#ffb000]">REACT 19 • REDIS • WEBSOCKETS</span>
                  <span className="text-[#00ff66]">100% HEALTH</span>
                </div>
              </div>

              {/* Prompt Cursor */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 border-t border-[#00ff66]/30 pt-1">
                <span>root@alex-sys:~$ <span className="text-[#00ff66] animate-pulse font-bold">_</span></span>
                <span className="text-[#00ff66]">80s/90s CRT PHOSPHOR MONITOR</span>
              </div>
            </div>
          )}

          {/* THEME 5: Liquid Glass Spatial */}
          {themeType === "liquidGlass" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#060814] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl" />

              {/* Frosted Glass Navbar */}
              <div className="relative z-10 flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-md">
                    AM
                  </div>
                  <span className="font-bold text-white text-sm">Alex Morgan</span>
                </div>
                <div className="flex items-center gap-6 text-zinc-300 text-xs">
                  <span className="text-cyan-300 font-bold">Spatial Works</span>
                  <span>Case Studies</span>
                  <span>Infrastructure</span>
                  <span>About</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                  REFRACTIVE 3D
                </span>
              </div>

              {/* Spatial Hero + 3 Glass Cards */}
              <div className="relative z-10 grid grid-cols-12 gap-6 items-center my-auto py-2">
                <div className="col-span-7 space-y-2.5 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Layered Translucent Glass Surfaces</span>
                  </div>
                  <h1 className="text-3xl font-black text-white leading-tight">
                    Designing & Scaling <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400">
                      Distributed Spatial Systems
                    </span>
                  </h1>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
                    Building next-generation enterprise interfaces with WebGL shaders, real-time WebSockets state, and high-throughput backend pipelines.
                  </p>
                </div>

                {/* 3 Floating Glass Cards */}
                <div className="col-span-5 space-y-2">
                  <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 flex items-center justify-between text-left">
                    <div>
                      <div className="text-xs font-bold text-white">Enterprise SLA</div>
                      <div className="text-[10px] text-zinc-400">Multi-region clusters</div>
                    </div>
                    <div className="text-base font-black text-cyan-400 font-mono">99.999%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 flex items-center justify-between text-left">
                    <div>
                      <div className="text-xs font-bold text-white">Daily Throughput</div>
                      <div className="text-[10px] text-zinc-400">Kafka & gRPC pipelines</div>
                    </div>
                    <div className="text-base font-black text-sky-400 font-mono">4.2M reqs</div>
                  </div>
                </div>
              </div>

              {/* 2 Spatial Project Showcase */}
              <div className="relative z-10 grid grid-cols-2 gap-4 text-left">
                <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 space-y-1">
                  <div className="text-xs font-bold text-white">Aura Spatial Engine</div>
                  <div className="text-[11px] text-zinc-300">Next.js 15 • WebGL Canvas • GraphQL • Tailored Shaders</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 space-y-1">
                  <div className="text-xs font-bold text-white">CloudScale Multi-Region Mesh</div>
                  <div className="text-[11px] text-zinc-300">Kubernetes • AWS ECS • Terraform • ArgoCD GitOps</div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-zinc-400">
                <span>Spatial UI • Ambient Fluid Shaders • Refraction Highlights</span>
                <span className="text-cyan-400 font-mono font-bold">14+ Systems Deployed</span>
              </div>
            </div>
          )}

          {/* THEME 6: Tactile Neomorphic */}
          {themeType === "neomorphic" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#181c24] text-zinc-200 relative overflow-hidden">
              {/* Neomorphic Nav */}
              <div className="relative z-10 flex items-center justify-between border-b border-zinc-700/60 pb-2 text-xs">
                <span className="font-bold text-white flex items-center gap-2 text-sm">
                  <Sliders className="w-4 h-4 text-amber-400" /> TACTILE NEOMORPHIC CONTROL BOARD
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#14171e] text-amber-400 border border-zinc-700 shadow-inner text-xs font-mono">
                    ● ACTIVE SYSTEM
                  </span>
                </div>
              </div>

              {/* Hardware Board Hero */}
              <div className="relative z-10 grid grid-cols-12 gap-6 items-center my-auto py-2">
                <div className="col-span-7 space-y-2 text-left">
                  <div className="text-xs font-bold text-amber-400 font-mono">PHYSICAL 3D PRECISION</div>
                  <h1 className="text-3xl font-black text-white leading-tight">
                    Alex Morgan — Hardware & <br />
                    Software Engineering Craft
                  </h1>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
                    Tactile control surfaces with physical extruded push buttons, dual drop shadows, and precision hardware dials.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="px-4 py-2 rounded-xl bg-[#1e232d] shadow-[4px_4px_8px_#0e1014,-4px_-4px_8px_#262c38] text-xs font-bold text-white">
                      Inspect Code [>]
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-[#14171e] shadow-inner text-xs font-bold text-amber-400">
                      Download CV [↓]
                    </div>
                  </div>
                </div>

                {/* 4 Tactile Dial Counters */}
                <div className="col-span-5 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[#1e232d] shadow-[4px_4px_8px_#0e1014,-4px_-4px_8px_#262c38] text-center">
                    <div className="text-xl font-black text-white font-mono">12+</div>
                    <div className="text-[9px] text-zinc-400 uppercase">PROJECTS</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1e232d] shadow-[4px_4px_8px_#0e1014,-4px_-4px_8px_#262c38] text-center">
                    <div className="text-xl font-black text-amber-400 font-mono">6+ YRS</div>
                    <div className="text-[9px] text-zinc-400 uppercase">EXPERIENCE</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1e232d] shadow-[4px_4px_8px_#0e1014,-4px_-4px_8px_#262c38] text-center">
                    <div className="text-xl font-black text-white font-mono">99.9%</div>
                    <div className="text-[9px] text-zinc-400 uppercase">UPTIME</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1e232d] shadow-[4px_4px_8px_#0e1014,-4px_-4px_8px_#262c38] text-center">
                    <div className="text-xl font-black text-amber-400 font-mono">4.2M</div>
                    <div className="text-[9px] text-zinc-400 uppercase">DAILY CALLS</div>
                  </div>
                </div>
              </div>

              {/* 2 Tactile Modules */}
              <div className="relative z-10 grid grid-cols-2 gap-4 text-left">
                <div className="p-3 rounded-xl bg-[#1e232d] shadow-[3px_3px_6px_#0e1014,-3px_-3px_6px_#262c38] space-y-1">
                  <div className="text-xs font-bold text-white">Distributed Raft Consensus Engine</div>
                  <div className="text-[10px] text-zinc-400">Go • gRPC • Protobuf • Docker Raft Cluster</div>
                </div>
                <div className="p-3 rounded-xl bg-[#1e232d] shadow-[3px_3px_6px_#0e1014,-3px_-3px_6px_#262c38] space-y-1">
                  <div className="text-xs font-bold text-white">Real-Time Telemetry Dashboard</div>
                  <div className="text-[10px] text-zinc-400">React 19 • Redux Toolkit • Redis Stream API</div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-700/60 text-[11px] font-mono text-zinc-400">
                <span>Soft 3D Physical Extrusions • Champagne Gold Accents</span>
                <span className="text-amber-400">Dual Shadows</span>
              </div>
            </div>
          )}

          {/* THEME 7: Cyber Dev Terminal */}
          {themeType === "cyberDev" && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#04060a] text-[#00ff88] font-mono relative overflow-hidden">
              {/* Cyber Nav */}
              <div className="relative z-10 flex items-center justify-between border-b-2 border-[#00ff88]/40 pb-2 text-xs">
                <span className="font-bold text-white flex items-center gap-2 text-sm">
                  <Radio className="w-4 h-4 text-[#00ff88]" /> [CYBER_DEV_v2.0 // TERMINAL ROOT]
                </span>
                <span className="text-cyan-400">GITHUB: 2.4k ★ • 48 REPOSITORIES</span>
                <span className="px-3 py-1 rounded bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] text-xs font-bold">
                  CYBERPUNK TERMINAL
                </span>
              </div>

              {/* Code Console & Repos Grid */}
              <div className="relative z-10 grid grid-cols-12 gap-5 items-center my-auto py-2">
                <div className="col-span-7 p-3.5 rounded-xl bg-[#090d14] border border-[#00ff88]/40 text-left space-y-1 text-xs leading-relaxed">
                  <div><span className="text-cyan-400">const</span> developer = &#123;</div>
                  <div className="pl-4 text-zinc-300">name: <span className="text-[#00ff88]">"Alex Morgan"</span>,</div>
                  <div className="pl-4 text-zinc-300">title: <span className="text-amber-400">"Staff Full Stack Hacker"</span>,</div>
                  <div className="pl-4 text-zinc-300">stack: [<span className="text-cyan-400">'Go'</span>, <span className="text-cyan-400">'React 19'</span>, <span className="text-cyan-400">'K8s'</span>, <span className="text-cyan-400">'Postgres'</span>],</div>
                  <div className="pl-4 text-zinc-300">stats: &#123; stars: <span className="text-amber-400">"2.4k"</span>, commits: <span className="text-[#00ff88]">"1,240"</span> &#125;</div>
                  <div>&#125;;</div>
                </div>

                <div className="col-span-5 space-y-2 text-left text-xs">
                  <div className="p-3 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>raft-consensus-engine</span>
                      <span className="text-amber-400">★ 1.8k</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Distributed consensus engine in Go.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>collab-code-studio</span>
                      <span className="text-amber-400">★ 640</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Real-time CRDT code canvas.</div>
                  </div>
                </div>
              </div>

              {/* Repos Strip */}
              <div className="relative z-10 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/30">48 REPOSITORIES</div>
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">LIVE GITHUB SYNC</div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-400/30 text-amber-300">CI/CD ARMED</div>
              </div>

              {/* Cyber Footer */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#00ff88]/40 text-[11px] text-zinc-400">
                <span>High Contrast Neon Dark Mode • Glitch Accents</span>
                <span className="text-[#00ff88]">STATUS: READY TO DEPLOY</span>
              </div>
            </div>
          )}

          {/* FALLBACK / OTHER THEMES (SmartNShine, Aura Glass, Minimal Developer, Tech, Creative) */}
          {!["kinetic", "swissArchitectural", "magazine", "retroFuturistic", "liquidGlass", "neomorphic", "cyberDev"].includes(themeType) && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#0a0f1d] via-[#070b14] to-[#04060b] text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                <span className="font-bold flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-blue-400" /> {title}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono">
                  {badgeText}
                </span>
              </div>

              <div className="relative z-10 space-y-2 text-left my-auto py-2">
                <div className="text-xs text-blue-400 font-mono uppercase">{category}</div>
                <h1 className="text-3xl font-black text-white leading-tight">
                  Alex Morgan — Staff Systems Architect
                </h1>
                <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                  {subtitle}
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-base font-black text-white">12+</div>
                    <div className="text-[10px] text-zinc-400">PROJECTS</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-base font-black text-blue-400">99.9%</div>
                    <div className="text-[10px] text-zinc-400">UPTIME</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-base font-black text-emerald-400">2.4k ★</div>
                    <div className="text-[10px] text-zinc-400">GITHUB STARS</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-zinc-400">
                <span>{category} • Precision Portfolio</span>
                <span className="text-blue-400 font-mono">Live Website</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. CARD FOOTER BAR */}
      <div
        className={`pt-2 mt-1.5 flex items-center justify-between text-[10px] border-t ${
          isDarkMode ? "border-white/10 text-zinc-400" : "border-zinc-100 text-zinc-600"
        }`}
      >
        <span className="font-mono truncate max-w-[240px] text-[9px] sm:text-[10px]">
          {title} • {category}
        </span>
        <div className="flex items-center gap-1.5">
          <Link
            to="/portfolio/create"
            onClick={(e) => e.stopPropagation()}
            className="font-bold flex items-center gap-1 shrink-0 text-[10px] text-zinc-900 dark:text-zinc-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group/link py-1 px-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <span>Launch Theme</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN DUAL-MODE CONTINUOUS GLIDING MOTION CANVAS COMPONENT
// ============================================================================
export default function GlidingMotionCanvas({ activeMode = "resumes", isDarkMode = true }) {
  const isResumes = activeMode === "resumes";

  // State for Resume Spotlight
  const [activeResumeIndex, setActiveResumeIndex] = useState(0);

  // State for Portfolio Spotlight
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [resumeColStep, setResumeColStep] = useState(335);
  const [portfolioColStep, setPortfolioColStep] = useState(596);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive column step calculation
  useEffect(() => {
    const updateSteps = () => {
      if (typeof window === "undefined") return;
      // Resumes Step
      if (window.innerWidth >= 1280) setResumeColStep(345);
      else if (window.innerWidth >= 640) setResumeColStep(322);
      else setResumeColStep(299);

      // Portfolios Step (Larger cards: 560px + 36px)
      if (window.innerWidth >= 1280) setPortfolioColStep(596);
      else if (window.innerWidth >= 640) setPortfolioColStep(548);
      else setPortfolioColStep(500);
    };
    updateSteps();
    window.addEventListener("resize", updateSteps);
    return () => window.removeEventListener("resize", updateSteps);
  }, []);

  // IntersectionObserver: automatically pause animation timer when canvas is out of viewport
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Automatic infinite spotlight focus cycle for RESUMES (every 4.8s)
  useEffect(() => {
    if (!isResumes || isHovered || !isVisible) return;
    const interval = setInterval(() => {
      setActiveResumeIndex((prev) => (prev + 1) % RESUME_FOCUS_TARGETS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isResumes, isHovered, isVisible]);

  // Automatic infinite spotlight focus cycle for PORTFOLIOS (every 4.8s)
  useEffect(() => {
    if (isResumes || isHovered || !isVisible) return;
    const interval = setInterval(() => {
      setActivePortfolioIndex((prev) => (prev + 1) % PORTFOLIO_FOCUS_TARGETS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isResumes, isHovered, isVisible]);

  // 2D Camera / Stage Offsets for RESUMES
  const getResumeStageOffset = (index, step) => {
    switch (index) {
      case 0: return { x: 0, y: -200 };       // Silicon Valley (Col 2, Row 1)
      case 1: return { x: step, y: -200 };    // Stanford LaTeX (Col 1, Row 1)
      case 2: return { x: 0, y: 190 };        // Nordic Split (Col 2, Row 0)
      case 3: return { x: -step, y: -200 };   // Modern (Col 3, Row 1)
      case 4: return { x: 0, y: -590 };       // Executive (Col 2, Row 2)
      case 5: return { x: step, y: -980 };    // Classic (Col 1, Row 3)
      case 6: return { x: -step, y: -980 };   // Tech (Col 3, Row 3)
      case 7: return { x: step, y: -590 };    // Strategic Leadership (Col 1, Row 2)
      default: return { x: 0, y: -200 };
    }
  };

  // 2D Camera / Stage Offsets for PORTFOLIOS
  const getPortfolioStageOffset = (index, step) => {
    switch (index) {
      case 0: return { x: 0, y: -30 };        // SmartNShine Kinetic (Col 2, Row 0)
      case 1: return { x: step, y: -30 };     // Swiss Architectural (Col 1, Row 0)
      case 2: return { x: 0, y: -425 };       // Magazine Editorial (Col 2, Row 1)
      case 3: return { x: -step, y: -30 };    // Retro-Futuristic OS (Col 3, Row 0)
      case 4: return { x: step, y: -425 };    // Liquid Glass Spatial (Col 1, Row 1)
      case 5: return { x: 0, y: -820 };       // Tactile Neomorphic (Col 2, Row 2)
      case 6: return { x: -step, y: -425 };   // Cyber Dev (Col 3, Row 1)
      default: return { x: 0, y: -30 };
    }
  };

  const currentResumeOffset = getResumeStageOffset(activeResumeIndex, resumeColStep);
  const currentPortfolioOffset = getPortfolioStageOffset(activePortfolioIndex, portfolioColStep);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[760px] lg:h-[820px] overflow-hidden rounded-3xl select-none group/canvas"
    >
      {/* Top & Bottom Soft Fading Masks */}
      <div
        className={`absolute top-0 inset-x-0 h-14 z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode ? "bg-gradient-to-b from-[#07080c] to-transparent" : "bg-gradient-to-b from-[#fbfbfa] to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-0 inset-x-0 h-14 z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode ? "bg-gradient-to-t from-[#07080c] to-transparent" : "bg-gradient-to-t from-[#fbfbfa] to-transparent"
        }`}
      />

      {/* CONTINUOUS PHYSICAL HORIZONTAL GLIDING TRACK (200% Width) */}
      <div
        className="w-[200%] h-full flex transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isResumes ? "translateX(0%)" : "translateX(-50%)",
        }}
      >
        {/* ========================================================= */}
        {/* STAGE 1: REAL ATS RESUMES (Full-Density 5-Column Canvas) */}
        {/* ========================================================= */}
        <div className="w-1/2 h-full overflow-hidden relative flex items-start justify-center">
          <motion.div
            animate={{
              x: shouldReduceMotion ? 0 : currentResumeOffset.x,
              y: shouldReduceMotion ? 0 : currentResumeOffset.y,
              scale: shouldReduceMotion ? 1 : [1, 0.88, 1],
            }}
            transition={{
              x: { duration: shouldReduceMotion ? 0.1 : 2.2, ease: [0.45, 0, 0.2, 1] },
              y: { duration: shouldReduceMotion ? 0.1 : 2.2, ease: [0.45, 0, 0.2, 1] },
              scale: { duration: shouldReduceMotion ? 0.1 : 2.2, times: [0, 0.35, 1], ease: [0.45, 0, 0.2, 1] },
            }}
            style={{ transformOrigin: "center center" }}
            className="flex items-start justify-center gap-6 sm:gap-8 lg:gap-10 px-2 lg:px-6 pt-3 will-change-transform shrink-0"
          >
            {/* Column A: Far Left Outer Buffer */}
            <div className="overflow-visible h-full flex flex-col w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 pt-4">
              <div className="flex flex-col gap-[26px] pb-[26px]">
                {colAItems.map((item, idx) => (
                  <ScaledResumeCard
                    key={`cA-${idx}`}
                    cardId={`cA-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activeResumeIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveResumeIndex}
                  />
                ))}
              </div>
            </div>

            {/* Column 1: Left */}
            <div className="overflow-visible h-full flex flex-col w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 pt-0">
              <div className="flex flex-col gap-[26px] pb-[26px]">
                {col1Items.map((item, idx) => (
                  <ScaledResumeCard
                    key={`c1-${idx}`}
                    cardId={`c1-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activeResumeIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveResumeIndex}
                  />
                ))}
              </div>
            </div>

            {/* Column 2: Center */}
            <div className="overflow-visible h-full flex flex-col w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 pt-8 sm:pt-10">
              <div className="flex flex-col gap-[26px] pb-[26px]">
                {col2Items.map((item, idx) => (
                  <ScaledResumeCard
                    key={`c2-${idx}`}
                    cardId={`c2-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activeResumeIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveResumeIndex}
                  />
                ))}
              </div>
            </div>

            {/* Column 3: Right */}
            <div className="overflow-visible h-full flex flex-col w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 pt-4 sm:pt-6">
              <div className="flex flex-col gap-[26px] pb-[26px]">
                {col3Items.map((item, idx) => (
                  <ScaledResumeCard
                    key={`c3-${idx}`}
                    cardId={`c3-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activeResumeIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveResumeIndex}
                  />
                ))}
              </div>
            </div>

            {/* Column B: Far Right Outer Buffer */}
            <div className="overflow-visible h-full flex flex-col w-[275px] sm:w-[290px] xl:w-[305px] shrink-0 pt-10 sm:pt-12">
              <div className="flex flex-col gap-[26px] pb-[26px]">
                {colBItems.map((item, idx) => (
                  <ScaledResumeCard
                    key={`cB-${idx}`}
                    cardId={`cB-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activeResumeIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveResumeIndex}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 2: REAL WIDESCREEN WEB PORTFOLIOS (2D Camera Flight) */}
        {/* ========================================================= */}
        <div className="w-1/2 h-full overflow-hidden relative flex items-start justify-center">
          <motion.div
            animate={{
              x: shouldReduceMotion ? 0 : currentPortfolioOffset.x,
              y: shouldReduceMotion ? 0 : currentPortfolioOffset.y,
              scale: shouldReduceMotion ? 1 : [1, 0.90, 1],
            }}
            transition={{
              x: { duration: shouldReduceMotion ? 0.1 : 2.2, ease: [0.45, 0, 0.2, 1] },
              y: { duration: shouldReduceMotion ? 0.1 : 2.2, ease: [0.45, 0, 0.2, 1] },
              scale: { duration: shouldReduceMotion ? 0.1 : 2.2, times: [0, 0.35, 1], ease: [0.45, 0, 0.2, 1] },
            }}
            style={{ transformOrigin: "center center" }}
            className="flex items-start justify-center gap-7 sm:gap-9 lg:gap-11 px-2 lg:px-6 pt-3 will-change-transform shrink-0"
          >
            {/* Portfolio Column A: Far Left Outer Buffer */}
            <div className="overflow-visible h-full flex flex-col w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 pt-6">
              <div className="flex flex-col gap-[28px] pb-[28px]">
                {pColAItems.map((item, idx) => (
                  <ScaledPortfolioCard
                    key={`pcA-${idx}`}
                    cardId={`pcA-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activePortfolioIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActivePortfolioIndex}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Column 1: Left */}
            <div className="overflow-visible h-full flex flex-col w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 pt-0">
              <div className="flex flex-col gap-[28px] pb-[28px]">
                {pCol1Items.map((item, idx) => (
                  <ScaledPortfolioCard
                    key={`pc1-${idx}`}
                    cardId={`pc1-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activePortfolioIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActivePortfolioIndex}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Column 2: Center */}
            <div className="overflow-visible h-full flex flex-col w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 pt-8 sm:pt-10">
              <div className="flex flex-col gap-[28px] pb-[28px]">
                {pCol2Items.map((item, idx) => (
                  <ScaledPortfolioCard
                    key={`pc2-${idx}`}
                    cardId={`pc2-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activePortfolioIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActivePortfolioIndex}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Column 3: Right */}
            <div className="overflow-visible h-full flex flex-col w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 pt-4 sm:pt-6">
              <div className="flex flex-col gap-[28px] pb-[28px]">
                {pCol3Items.map((item, idx) => (
                  <ScaledPortfolioCard
                    key={`pc3-${idx}`}
                    cardId={`pc3-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activePortfolioIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActivePortfolioIndex}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Column B: Far Right Outer Buffer */}
            <div className="overflow-visible h-full flex flex-col w-[480px] sm:w-[520px] xl:w-[560px] shrink-0 pt-10 sm:pt-12">
              <div className="flex flex-col gap-[28px] pb-[28px]">
                {pColBItems.map((item, idx) => (
                  <ScaledPortfolioCard
                    key={`pcB-${idx}`}
                    cardId={`pcB-${idx}`}
                    item={item}
                    isDarkMode={isDarkMode}
                    activeFocusIndex={activePortfolioIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActivePortfolioIndex}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
