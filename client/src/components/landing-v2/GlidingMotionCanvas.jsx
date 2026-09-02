import React from "react";
import { Link } from "react-router-dom";
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

export default function GlidingMotionCanvas({ activeMode = "resumes", isDarkMode = true }) {
  const isResumes = activeMode === "resumes";

  return (
    <div className="relative w-full h-[740px] lg:h-[790px] overflow-hidden rounded-3xl select-none">
      {/* Top & Bottom Soft Fading Masks */}
      <div
        className={`absolute top-0 inset-x-0 h-10 z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-b from-[#07080c] to-transparent"
            : "bg-gradient-to-b from-[#fbfbfa] to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-0 inset-x-0 h-10 z-20 pointer-events-none transition-colors duration-300 ${
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
        {/* STAGE 1: REAL ATS RESUMES (Continuous Horizontal Glide)   */}
        {/* ========================================================= */}
        <div className="w-1/2 h-full overflow-hidden flex items-center">
          <div className="animate-glide-horizontal flex items-center gap-7 h-full py-4 px-2">
            {/* 1. Real ClassicTemplate (Royal Navy & Indigo Theme) */}
            <div
              className={`w-[450px] shrink-0 h-[670px] rounded-3xl border p-3.5 shadow-2xl flex flex-col justify-between transition-all overflow-hidden text-left ${
                isDarkMode
                  ? "border-blue-500/30 bg-[#0d121c] hover:border-blue-400 shadow-blue-500/10"
                  : "border-blue-200 bg-white hover:border-blue-500 shadow-xl shadow-blue-500/5"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
                  isDarkMode ? "border-blue-900/40 text-blue-300" : "border-blue-100 text-blue-900 font-bold"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className="text-blue-500">⸎</span> Classic ATS Template
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30 text-[10px]">
                  98% Workday Match
                </span>
              </div>

              {/* Scaled Real Resume Container - Fully Packed Top to Bottom */}
              <div className="w-full flex-1 overflow-hidden rounded-xl bg-white relative shadow-sm border border-zinc-200">
                <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.56] pointer-events-none select-none text-zinc-900">
                  <ClassicTemplate resumeData={fullResumeData1} isDarkMode={false} />
                </div>
              </div>

              <div
                className={`pt-2.5 flex items-center justify-between text-xs border-t ${
                  isDarkMode ? "border-zinc-800 text-zinc-400" : "border-zinc-100 text-zinc-600"
                }`}
              >
                <span className="font-mono text-[10px]">Classic Single-Column ATS</span>
                <Link to="/templates?template=classic" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Real TechTemplate (Vivid Cyan Code Theme) */}
            <div
              className={`w-[450px] shrink-0 h-[670px] rounded-3xl border p-3.5 shadow-2xl flex flex-col justify-between transition-all overflow-hidden text-left ${
                isDarkMode
                  ? "border-cyan-500/30 bg-[#09131a] hover:border-cyan-400 shadow-cyan-500/10"
                  : "border-cyan-200 bg-white hover:border-cyan-500 shadow-xl shadow-cyan-500/5"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
                  isDarkMode ? "border-cyan-900/40 text-cyan-300" : "border-cyan-100 text-cyan-900 font-bold"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className="text-cyan-500">⸎</span> Tech Developer Format
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30 text-[10px]">
                  99% ATS Pass Rate
                </span>
              </div>

              {/* Scaled Real Tech Template - Fully Packed Top to Bottom */}
              <div className="w-full flex-1 overflow-hidden rounded-xl bg-white relative shadow-sm border border-zinc-200">
                <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.56] pointer-events-none select-none text-zinc-900">
                  <TechTemplate resumeData={fullResumeData2} isDarkMode={false} />
                </div>
              </div>

              <div
                className={`pt-2.5 flex items-center justify-between text-xs border-t ${
                  isDarkMode ? "border-zinc-800 text-zinc-400" : "border-zinc-100 text-zinc-600"
                }`}
              >
                <span className="font-mono text-[10px]">Technical Engineering Format</span>
                <Link to="/templates?template=tech" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Real ImpactProTemplate (Vibrant Emerald Theme) */}
            <div
              className={`w-[450px] shrink-0 h-[670px] rounded-3xl border p-3.5 shadow-2xl flex flex-col justify-between transition-all overflow-hidden text-left ${
                isDarkMode
                  ? "border-emerald-500/30 bg-[#091712] hover:border-emerald-400 shadow-emerald-500/10"
                  : "border-emerald-200 bg-white hover:border-emerald-500 shadow-xl shadow-emerald-500/5"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
                  isDarkMode ? "border-emerald-900/40 text-emerald-300" : "border-emerald-100 text-emerald-900 font-bold"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className="text-emerald-500">⸎</span> Impact Pro Results
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                  98% Lever / Greenhouse
                </span>
              </div>

              {/* Scaled Real Impact Template - Fully Packed Top to Bottom */}
              <div className="w-full flex-1 overflow-hidden rounded-xl bg-white relative shadow-sm border border-zinc-200">
                <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.56] pointer-events-none select-none text-zinc-900">
                  <ImpactProTemplate resumeData={fullResumeData3} isDarkMode={false} />
                </div>
              </div>

              <div
                className={`pt-2.5 flex items-center justify-between text-xs border-t ${
                  isDarkMode ? "border-zinc-800 text-zinc-400" : "border-zinc-100 text-zinc-600"
                }`}
              >
                <span className="font-mono text-[10px]">Executive STAR Metrics Format</span>
                <Link to="/templates?template=impact-pro" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4. Real ModernTemplate (Royal Purple / Violet Theme) */}
            <div
              className={`w-[450px] shrink-0 h-[670px] rounded-3xl border p-3.5 shadow-2xl flex flex-col justify-between transition-all overflow-hidden text-left ${
                isDarkMode
                  ? "border-purple-500/30 bg-[#130d1c] hover:border-purple-400 shadow-purple-500/10"
                  : "border-purple-200 bg-white hover:border-purple-500 shadow-xl shadow-purple-500/5"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
                  isDarkMode ? "border-purple-900/40 text-purple-300" : "border-purple-100 text-purple-900 font-bold"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className="text-purple-500">⸎</span> Modern Executive
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 text-[10px]">
                  Executive ATS Format
                </span>
              </div>

              {/* Scaled Real Modern Template - Fully Packed Top to Bottom */}
              <div className="w-full flex-1 overflow-hidden rounded-xl bg-white relative shadow-sm border border-zinc-200">
                <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.56] pointer-events-none select-none text-zinc-900">
                  <ModernTemplate resumeData={fullResumeData4} isDarkMode={false} />
                </div>
              </div>

              <div
                className={`pt-2.5 flex items-center justify-between text-xs border-t ${
                  isDarkMode ? "border-zinc-800 text-zinc-400" : "border-zinc-100 text-zinc-600"
                }`}
              >
                <span className="font-mono text-[10px]">Two-Column Hierarchy</span>
                <Link to="/templates?template=modern" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* DUPLICATE FOR INFINITE LOOP */}
            <div
              className={`w-[450px] shrink-0 h-[670px] rounded-3xl border p-3.5 shadow-2xl flex flex-col justify-between overflow-hidden text-left ${
                isDarkMode
                  ? "border-blue-500/30 bg-[#0d121c]"
                  : "border-blue-200 bg-white shadow-xl"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
                  isDarkMode ? "border-blue-900/40 text-blue-300" : "border-blue-100 text-blue-900 font-bold"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className="text-blue-500">⸎</span> Classic ATS Template
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30 text-[10px]">
                  98% Workday Match
                </span>
              </div>
              <div className="w-full flex-1 overflow-hidden rounded-xl bg-white relative shadow-sm border border-zinc-200">
                <div className="absolute top-0 left-0 w-[794px] origin-top-left transform scale-[0.56] pointer-events-none select-none text-zinc-900">
                  <ClassicTemplate resumeData={fullResumeData1} isDarkMode={false} />
                </div>
              </div>
              <div
                className={`pt-2.5 flex items-center justify-between text-xs border-t ${
                  isDarkMode ? "border-zinc-800 text-zinc-400" : "border-zinc-100 text-zinc-600"
                }`}
              >
                <span className="font-mono text-[10px]">Official Codebase Template</span>
                <Link to="/templates?template=classic" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
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
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold shadow-lg shadow-blue-500/25"
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
                  <div className="w-full rounded-2xl border-2 border-blue-500/40 bg-[#090d16] p-4 shadow-2xl shadow-blue-500/10 font-mono text-left space-y-2 text-white">
                    <div className="flex items-center gap-1.5 border-b border-blue-900/40 pb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[10px] text-emerald-400 leading-relaxed pt-1 space-y-1">
                      <div><span className="text-blue-400">const</span> developer = &#123;</div>
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
                <Link to="/tech-portfolio" target="_blank" className="text-blue-500 font-bold hover:underline">
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
