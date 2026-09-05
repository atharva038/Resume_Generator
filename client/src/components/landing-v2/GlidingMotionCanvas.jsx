import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Download,
  Copy,
  ArrowRight,
  Sparkles,
  Sun,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import ClassicTemplate from "../templates/ClassicTemplate";
import TechTemplate from "../templates/TechTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import ImpactProTemplate from "../templates/ImpactProTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

// Comprehensive, Rich, Fully-Packed Sample Resume Data (No Empty White Space)
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

const fullResumeData3 = {
  ...fullResumeData1,
  selectedTheme: "emerald",
};

const fullResumeData4 = {
  ...fullResumeData1,
  name: "Sarah Chen",
  contact: {
    ...fullResumeData1.contact,
    email: "sarah.chen@leadtech.org",
    linkedin: "linkedin.com/in/sarahchen-exec",
  },
  selectedTheme: "purple",
};

const fullResumeData5 = {
  ...fullResumeData1,
  name: "Marcus Vance",
  contact: {
    ...fullResumeData1.contact,
    email: "marcus.vance@enterprise-lead.com",
    location: "New York, NY",
    linkedin: "linkedin.com/in/marcusvance-cto",
  },
  summary:
    "Distinguished Enterprise Technology Executive with 14+ years of cross-functional leadership spanning FinTech, distributed cloud scale, and AI enablement. Oversaw engineering organizations of 120+ developers with $80M annual P&L oversight.",
  selectedTheme: "charcoal",
};

const fullResumeData6 = {
  ...fullResumeData1,
  name: "Priya Sharma",
  contact: {
    ...fullResumeData1.contact,
    email: "priya.sharma@productlab.dev",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/priyasharma-dev",
  },
  summary:
    "Staff Product Frontend Engineer specializing in high-performance browser rendering, accessible design systems, and WebAssembly tooling. Shipped consumer experiences enjoyed by 22M+ monthly active users across mobile and web platforms.",
  selectedTheme: "slate",
};

// 6 Diverse Real Resume Configurations
const row1Resumes = [
  {
    templateTitle: "Classic ATS Format",
    badgeText: "99% Workday",
    badgeColor: "blue",
    formatText: "Single-Column Standard",
    templateSlug: "classic",
    template: ClassicTemplate,
    data: fullResumeData1,
  },
  {
    templateTitle: "Tech Developer",
    badgeText: "99% ATS Pass",
    badgeColor: "cyan",
    formatText: "Technical Engineering",
    templateSlug: "tech",
    template: TechTemplate,
    data: fullResumeData2,
  },
  {
    templateTitle: "Impact Pro",
    badgeText: "98% Lever / Green",
    badgeColor: "emerald",
    formatText: "STAR Metrics Layout",
    templateSlug: "impact-pro",
    template: ImpactProTemplate,
    data: fullResumeData3,
  },
  {
    templateTitle: "Modern Executive",
    badgeText: "Executive ATS",
    badgeColor: "purple",
    formatText: "Two-Column Structure",
    templateSlug: "modern",
    template: ModernTemplate,
    data: fullResumeData4,
  },
  {
    templateTitle: "Executive Lead",
    badgeText: "Top 1% C-Suite",
    badgeColor: "amber",
    formatText: "Strategic Executive",
    templateSlug: "executive",
    template: ExecutiveTemplate,
    data: fullResumeData5,
  },
  {
    templateTitle: "Minimal Clean",
    badgeText: "100% Parsing",
    badgeColor: "indigo",
    formatText: "Minimalist Typo",
    templateSlug: "minimal",
    template: MinimalTemplate,
    data: fullResumeData6,
  },
];

const colAItems = [
  row1Resumes[4], // Row 0 (Exec Lead)
  row1Resumes[2], // Row 1 (Impact Pro)
  row1Resumes[1], // Row 2 (Tech Dev)
  row1Resumes[5], // Row 3 (Minimal)
  row1Resumes[3], // Row 4 (Modern Exec)
]; // Far Left Buffer

const col1Items = [
  row1Resumes[3], // Row 0 (Modern Exec)
  row1Resumes[5], // Row 1 (**Minimal Clean** - target `c1-1`)
  row1Resumes[4], // Row 2 (Exec Lead)
  row1Resumes[0], // Row 3 (Classic ATS)
  row1Resumes[2], // Row 4 (Impact Pro)
]; // Left Column

const col2Items = [
  row1Resumes[0], // Row 0 (Classic ATS)
  row1Resumes[1], // Row 1 (**Tech Developer** - target `c2-1`)
  row1Resumes[3], // Row 2 (Modern Exec)
  row1Resumes[4], // Row 3 (**Executive Lead** - target `c2-3`)
  row1Resumes[5], // Row 4 (Minimal Clean)
]; // Center Column

const col3Items = [
  row1Resumes[1], // Row 0 (Tech Dev)
  row1Resumes[4], // Row 1 (Exec Lead)
  row1Resumes[0], // Row 2 (**ATS Resume / Standard** - target `c3-2`)
  row1Resumes[2], // Row 3 (**Impact Pro** - target `c3-3`)
  row1Resumes[3], // Row 4 (Modern Exec)
]; // Right Column

const colBItems = [
  row1Resumes[5], // Row 0 (Minimal)
  row1Resumes[0], // Row 1 (Classic ATS)
  row1Resumes[2], // Row 2 (Impact Pro)
  row1Resumes[1], // Row 3 (Tech Dev)
  row1Resumes[4], // Row 4 (Exec Lead)
]; // Far Right Buffer

// Target 5 cards in the exact requested sequence, placed diagonally across the grid:
// Tech Developer (Col 2, Row 1) -> Impact Pro (Col 3, Row 3) -> Minimal Clean (Col 1, Row 1) -> Executive Lead (Col 2, Row 3) -> ATS Resume/Standard (Col 3, Row 2) -> repeat
const FOCUS_TARGETS = [
  { cardId: "c2-1", slug: "tech" },        // 0: Tech Developer (Col 2, Row 1)
  { cardId: "c3-3", slug: "impact-pro" },  // 1: Impact Pro (Col 3, Row 3)
  { cardId: "c1-1", slug: "minimal" },     // 2: Minimal Clean (Col 1, Row 1)
  { cardId: "c2-3", slug: "executive" },   // 3: Executive Lead (Col 2, Row 3)
  { cardId: "c3-2", slug: "classic" },     // 4: ATS Resume / Standard (Col 3, Row 2)
];

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

  // Determine cyclic distance from the currently focused card in the 5-target cycle
  const targetIndex = FOCUS_TARGETS.findIndex((t) => t.cardId === cardId);
  const isInCycle = targetIndex !== -1;

  let distance = 99;
  if (isInCycle) {
    const rawDiff = Math.abs(targetIndex - activeFocusIndex);
    distance = Math.min(rawDiff, FOCUS_TARGETS.length - rawDiff);
  }

  const isFocused = distance === 0;

  // Animation targets: Compositor-only opacity & transform (Zero GPU rasterization blur penalties)
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

  // Hardware-accelerated CSS shadow class based on focus state
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
      {/* Top Badge & Template Label */}
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

      {/* Scaled Real Resume Container */}
      <div className="w-full flex-1 overflow-hidden rounded-lg bg-white relative shadow-2xs border border-zinc-200/80">
        <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.33] sm:scale-[0.35] pointer-events-none select-none text-zinc-900">
          <Template resumeData={data} isDarkMode={false} />
        </div>
      </div>

      {/* Footer Bar */}
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

export default function GlidingMotionCanvas({ activeMode = "resumes", isDarkMode = true }) {
  const isResumes = activeMode === "resumes";
  const [activeFocusIndex, setActiveFocusIndex] = useState(0); // 0 corresponds to Tech Developer
  const [isHovered, setIsHovered] = useState(false);
  const [colStep, setColStep] = useState(335);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive column step calculation for smooth centering
  useEffect(() => {
    const updateColStep = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1280) setColStep(345); // 305px card + 40px gap
      else if (window.innerWidth >= 640) setColStep(322); // 290px card + 32px gap
      else setColStep(299); // 275px card + 24px gap
    };
    updateColStep();
    window.addEventListener("resize", updateColStep);
    return () => window.removeEventListener("resize", updateColStep);
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

  // Automatic infinite spotlight focus cycle:
  // Tech Developer (0) -> Impact Pro (1) -> Minimal Clean (2) -> Executive Lead (3) -> ATS Resume/Standard (4) -> repeat
  // Smoothly advances every 4.8 seconds when visible in viewport
  useEffect(() => {
    if (!isResumes || isHovered || !isVisible) return;

    const interval = setInterval(() => {
      setActiveFocusIndex((prev) => (prev + 1) % FOCUS_TARGETS.length);
    }, 4800);

    return () => clearInterval(interval);
  }, [isResumes, isHovered, isVisible]);

  // Dynamic 2D camera / center-stage offsets for sweeping diagonal flight:
  const getStageOffset = (index, step) => {
    switch (index) {
      case 0: // Tech Developer (Col 2, Row 1)
        return { x: 0, y: -200 };
      case 1: // Impact Pro (Col 3, Row 3)
        return { x: -step, y: -970 };
      case 2: // Minimal Clean (Col 1, Row 1)
        return { x: step, y: -175 };
      case 3: // Executive Lead (Col 2, Row 3)
        return { x: 0, y: -980 };
      case 4: // ATS Resume / Standard (Col 3, Row 2)
        return { x: -step, y: -575 };
      default:
        return { x: 0, y: -200 };
    }
  };

  const currentOffset = getStageOffset(activeFocusIndex, colStep);

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
          isDarkMode
            ? "bg-gradient-to-b from-[#07080c] to-transparent"
            : "bg-gradient-to-b from-[#fbfbfa] to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-0 inset-x-0 h-14 z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-t from-[#07080c] to-transparent"
            : "bg-gradient-to-t from-[#fbfbfa] to-transparent"
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
        {/* STAGE 1: REAL ATS RESUMES (Full-Density 5-Column Canvas with 2D Camera Motion) */}
        {/* ========================================================= */}
        <div className="w-1/2 h-full overflow-hidden relative flex items-start justify-center">
          <motion.div
            animate={{
              x: shouldReduceMotion ? 0 : currentOffset.x,
              y: shouldReduceMotion ? 0 : currentOffset.y,
              scale: shouldReduceMotion ? 1 : [1, 0.88, 1],
            }}
            transition={{
              x: {
                duration: shouldReduceMotion ? 0.1 : 2.2,
                ease: [0.45, 0, 0.2, 1], // Slower, gradual takeoff without rapid instant jerk
              },
              y: {
                duration: shouldReduceMotion ? 0.1 : 2.2,
                ease: [0.45, 0, 0.2, 1],
              },
              scale: {
                duration: shouldReduceMotion ? 0.1 : 2.2,
                times: [0, 0.35, 1], // First comes backward (scale down to 0.88), then lands into resume (scale 1.0)
                ease: [0.45, 0, 0.2, 1],
              },
            }}
            style={{
              transformOrigin: "center center",
            }}
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
                    activeFocusIndex={activeFocusIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveFocusIndex}
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
                    activeFocusIndex={activeFocusIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveFocusIndex}
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
                    activeFocusIndex={activeFocusIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveFocusIndex}
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
                    activeFocusIndex={activeFocusIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveFocusIndex}
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
                    activeFocusIndex={activeFocusIndex}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelectCard={setActiveFocusIndex}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 2: REAL WEB PORTFOLIOS (Continuous Horizontal Glide)*/}
        {/* ========================================================= */}
        <div className="w-1/2 h-full overflow-hidden flex items-center">
          <div className="animate-glide-horizontal flex items-center gap-8 h-full py-4 px-2">
            {/* 1. Real Glassmorphism Theme (Screenshot 1) */}
            <div
              className={`w-[820px] shrink-0 h-[670px] rounded-3xl border p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all text-left ${
                isDarkMode
                  ? "border-cyan-500/30 bg-[#07090e] hover:border-cyan-400"
                  : "border-cyan-200 bg-white hover:border-cyan-500 shadow-xl shadow-cyan-500/5"
              }`}
            >
              <div className="absolute -top-16 -left-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Top Pill Navbar */}
              <div
                className={`relative z-10 flex items-center justify-between px-5 py-2.5 rounded-full border shadow-lg backdrop-blur-xl ${
                  isDarkMode
                    ? "border-white/10 bg-[#0c1017]/90"
                    : "border-zinc-200 bg-zinc-50/90 text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center shadow-md">
                    AM
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                      Alex Morgan
                    </span>
                    <span className="text-[9px] text-emerald-500 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                    </span>
                  </div>
                </div>

                <div className={`hidden md:flex items-center gap-5 text-xs font-medium ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  <span className={isDarkMode ? "text-white" : "text-zinc-950 font-bold"}>About</span>
                  <span className="hover:text-blue-500">Skills</span>
                  <span className="hover:text-blue-500">Experience</span>
                  <span className="hover:text-blue-500">Projects</span>
                  <span className="hover:text-blue-500">Contact</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/tech-portfolio"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> Resume
                  </Link>
                  <div className={`p-1 rounded-full ${isDarkMode ? "text-amber-400 bg-white/5" : "text-zinc-700 bg-zinc-200"}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Hero Section Body */}
              <div className="relative z-10 my-auto grid grid-cols-12 gap-6 items-center p-2">
                <div className="col-span-7 space-y-3.5 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Available for high-impact opportunities</span>
                  </div>

                  <h2 className={`text-3xl font-extrabold tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]">Alex Morgan</span>
                  </h2>

                  <div className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                    Full Stack Engineer
                  </div>

                  <p className={`text-xs leading-relaxed font-normal ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Full-stack developer with 3+ years' experience in scalable web applications. Skilled in TypeScript, React.js, Node.js, and PostgreSQL.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Link
                      to="/tech-portfolio"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Get in touch ↗</span>
                    </Link>

                    <button
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border text-xs font-semibold ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-zinc-200"
                          : "bg-zinc-100 border-zinc-200 text-zinc-800"
                      }`}
                    >
                      <Download className="w-3 h-3" />
                      <span>Download CV</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-[11px] ${
                        isDarkMode
                          ? "bg-[#0d121c] border-zinc-800 text-zinc-300"
                          : "bg-zinc-100 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <Linkedin className="w-3 h-3 text-[#0a66c2]" /> LinkedIn
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-[11px] ${
                        isDarkMode
                          ? "bg-[#0d121c] border-zinc-800 text-zinc-300"
                          : "bg-zinc-100 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <Github className="w-3 h-3" /> GitHub
                    </span>
                  </div>
                </div>

                <div className="col-span-5 space-y-3">
                  <div className="rounded-2xl bg-[#090d14] border border-zinc-800 p-3.5 shadow-xl text-left space-y-2 font-mono text-white">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      </div>
                      <span className="text-zinc-500">engineer.config.ts</span>
                    </div>

                    <div className="text-[10px] leading-relaxed space-y-0.5">
                      <div>
                        <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = &#123;
                      </div>
                      <div className="pl-3 text-zinc-400">name: <span className="text-emerald-400">"Alex Morgan"</span>,</div>
                      <div className="pl-3 text-zinc-400">role: <span className="text-emerald-400">"Full Stack Intern"</span>,</div>
                      <div className="pl-3 text-zinc-400">status: <span className="text-emerald-400">"Open to collaborate"</span></div>
                      <div>&#125;;</div>
                    </div>
                  </div>

                  <div
                    className={`grid grid-cols-3 gap-2 rounded-2xl border p-2.5 text-center ${
                      isDarkMode
                        ? "bg-[#090d14]/80 border-white/10"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className={`border-r pr-1 ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                      <div className={`text-base font-extrabold font-mono ${isDarkMode ? "text-white" : "text-zinc-950"}`}>4+</div>
                      <div className="text-[8px] font-mono text-zinc-500 uppercase">PROJECTS</div>
                    </div>
                    <div className={`border-r pr-1 ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                      <div className={`text-base font-extrabold font-mono ${isDarkMode ? "text-white" : "text-zinc-950"}`}>14+</div>
                      <div className="text-[8px] font-mono text-zinc-500 uppercase">SKILLS</div>
                    </div>
                    <div>
                      <div className={`text-base font-extrabold font-mono ${isDarkMode ? "text-white" : "text-zinc-950"}`}>3</div>
                      <div className="text-[8px] font-mono text-zinc-500 uppercase">ROLES</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`relative z-10 pt-2 border-t flex items-center justify-between text-xs font-mono ${
                  isDarkMode ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500"
                }`}
              >
                <span>Glassmorphism Theme • Live Preview</span>
                <Link to="/tech-portfolio" target="_blank" className="text-[#38bdf8] font-bold hover:underline">
                  View Theme →
                </Link>
              </div>
            </div>

            {/* 2. Real Tech 3D Laptop Theme (Screenshot 2) */}
            <div
              className={`w-[820px] shrink-0 h-[670px] rounded-3xl border p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all text-left ${
                isDarkMode
                  ? "border-blue-900/30 bg-[#060810] hover:border-blue-500/40"
                  : "border-blue-200 bg-white hover:border-blue-500 shadow-xl shadow-blue-500/5"
              }`}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Pill Navbar */}
              <div
                className={`relative z-10 flex items-center justify-between px-5 py-2.5 rounded-full border shadow-lg backdrop-blur-xl ${
                  isDarkMode
                    ? "border-white/10 bg-[#0c1017]/90"
                    : "border-zinc-200 bg-zinc-50/90 text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0ea5e9] text-white font-bold text-xs flex items-center justify-center shadow-md">
                    DK
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                      David Kumar
                    </span>
                    <span className="text-[9px] text-emerald-500 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                    </span>
                  </div>
                </div>

                <div className={`hidden md:flex items-center gap-5 text-xs font-medium ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  <span className={isDarkMode ? "text-white" : "text-zinc-950 font-bold"}>About</span>
                  <span className="hover:text-blue-500">Skills</span>
                  <span className="hover:text-blue-500">Experience</span>
                  <span className="hover:text-blue-500">Projects</span>
                  <span className="hover:text-blue-500">Contact</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/tech-portfolio"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0ea5e9] text-white text-xs font-bold shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> Resume
                  </Link>
                  <div className={`p-1 rounded-full ${isDarkMode ? "text-amber-400 bg-white/5" : "text-zinc-700 bg-zinc-200"}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Hero Section with Glowing Laptop */}
              <div className="relative z-10 my-auto grid grid-cols-12 gap-8 items-center p-2">
                <div className="col-span-7 space-y-3.5 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Full Stack Systems Architect</span>
                  </div>

                  <h2 className={`text-3xl font-extrabold tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    I Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Scalable Digital Experiences</span> That Make Impact.
                  </h2>

                  <p className={`text-xs leading-relaxed font-normal ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Transforming complex engineering problems into high-performance web applications with clean code, distributed architectures, and modern technologies.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to="/tech-portfolio"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shadow-lg shadow-zinc-950/20 active:scale-95 transition-all"
                    >
                      <span>View My Work</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold ${
                        isDarkMode
                          ? "bg-[#111624] border-zinc-800 text-zinc-200 hover:border-zinc-600"
                          : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200"
                      }`}
                    >
                      <span>Get In Touch</span>
                    </button>
                  </div>
                </div>

                <div className="col-span-5 flex items-center justify-center">
                  <div className="w-full rounded-2xl border-2 border-zinc-800/40 bg-[#090d16] p-4 shadow-2xl font-mono text-left space-y-2 text-white">
                    <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[10px] text-emerald-400 leading-relaxed pt-1 space-y-1">
                      <div><span className="text-zinc-400">const</span> developer = &#123;</div>
                      <div className="pl-3 text-zinc-300">skills: [<span className="text-amber-400">'React'</span>, <span className="text-amber-400">'Go'</span>, <span className="text-amber-400">'AWS'</span>],</div>
                      <div className="pl-3 text-zinc-300">experience: <span className="text-purple-400">4+ years</span>,</div>
                      <div className="pl-3 text-zinc-300">passion: <span className="text-cyan-400">∞</span></div>
                      <div>&#125;</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`relative z-10 pt-2 border-t flex items-center justify-between text-xs font-mono ${
                  isDarkMode ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500"
                }`}
              >
                <span>Tech Theme • 3D Canvas Vector</span>
                <Link to="/tech-portfolio" target="_blank" className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline">
                  View Theme →
                </Link>
              </div>
            </div>

            {/* DUPLICATE PORTFOLIO 1 FOR SEAMLESS INFINITE LOOP */}
            <div
              className={`w-[820px] shrink-0 h-[670px] rounded-3xl border p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl text-left ${
                isDarkMode
                  ? "border-cyan-500/30 bg-[#07090e]"
                  : "border-cyan-200 bg-white shadow-xl"
              }`}
            >
              <div
                className={`relative z-10 flex items-center justify-between px-5 py-2.5 rounded-full border shadow-lg backdrop-blur-xl ${
                  isDarkMode
                    ? "border-white/10 bg-[#0c1017]/90"
                    : "border-zinc-200 bg-zinc-50/90 text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center shadow-md">
                    AM
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                      Alex Morgan
                    </span>
                    <span className="text-[9px] text-emerald-500 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/tech-portfolio" target="_blank" className="px-3.5 py-1 rounded-full bg-[#0284c7] text-white text-xs font-bold">
                    Resume
                  </Link>
                </div>
              </div>

              <div className="relative z-10 my-auto grid grid-cols-12 gap-6 items-center p-2">
                <div className="col-span-7 space-y-3 text-left">
                  <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0284c7]">Alex Morgan</span>
                  </h2>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Full-stack developer with 3+ years' experience in scalable web applications.
                  </p>
                </div>
                <div className="col-span-5">
                  <div className="rounded-2xl bg-[#090d14] border border-zinc-800 p-3.5 shadow-xl text-left font-mono text-[10px] text-white">
                    <div><span className="text-purple-400">const</span> developer = &#123;</div>
                    <div className="pl-3">name: <span className="text-emerald-400">"Alex Morgan"</span></div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>

              <div
                className={`relative z-10 pt-2 border-t flex items-center justify-between text-xs font-mono ${
                  isDarkMode ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500"
                }`}
              >
                <span>Glassmorphism Theme</span>
                <Link to="/tech-portfolio" target="_blank" className="text-[#38bdf8] font-bold hover:underline">
                  View Theme →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
