import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
  ExternalLink,
  Download,
  Trash2,
  FileText,
  Share2,
  MessageSquare,
  ChevronRight,
  X,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Star,
  Globe,
  Linkedin,
  Github,
  Award,
  Flame,
  Send,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";
import { OPEN_ROLES } from "@/components/careers/careersData";
import { careerApplicationAPI } from "@/api";

// Enriched initial seed mock applications if database is fresh
const SAMPLE_APPLICATIONS = [
  {
    _id: "app-1",
    name: "Sarah Jenkins",
    email: "sarah.j.growth@gmail.com",
    phone: "+1 (415) 890-4421",
    role: "Founding Growth & Viral Marketing Lead",
    roleId: "founding-growth-marketing-lead",
    department: "Marketing & Growth",
    experience: "3-5 years",
    availability: "Part-Time (10-20 hrs/week)",
    startDate: "Immediate",
    workingStyle: "Async-First with Weekly Sprints",
    location: "San Francisco, CA (PST)",
    timezone: "PST (UTC-8)",
    portfolioUrl: "https://sarahjenkins.growth.design",
    linkedinUrl: "https://linkedin.com/in/sarahjenkins-growth",
    githubUrl: "",
    otherUrl: "@sarahgrowthsf (TikTok & X)",
    bestProjectUrl: "https://tiktok.com/@sarah_resumetips/video/7391823",
    bestProjectDesc:
      "Grew an educational resume critique TikTok account from 0 to 250,000 organic views in 90 days with zero paid ad spend.",
    whyJoin:
      "ATS algorithms have become ruthless black boxes that reject top-tier candidates before human eyes ever see their achievements. SmartNShine's live diagnostic engine and instant bullet rewriting solves a massive, painful problem. I want to build our organic acquisition engine from zero to one.",
    scrappyStory:
      "At my university, I ran a guerilla resume clinic. With zero budget, I set up a whiteboard in the engineering quad with a QR code to free templates. In 4 weeks we reviewed 1,400+ student resumes and built an active community of 3,200 job seekers.",
    first30DaysPlan:
      "1. Launch weekly 'ATS Teardown' short-form video series on TikTok and YouTube Shorts.\n2. Execute our Product Hunt and Hacker News Show HN launch.\n3. Partner with 20 top career creators on LinkedIn for organic co-marketing.\n4. Build an automated referral loop giving job seekers bonus AI scans for inviting friends.",
    marketInsight:
      "Most resume tools focus merely on visual formatting. Job seekers don't just want pretty layouts—they need actionable keyword parity scores and recruiter psychological triggers that guarantee callbacks.",
    resumeName: "Sarah_Jenkins_Marketing_CV.pdf",
    resumeSize: 1450000,
    resumeData: "",
    additionalNotes: "Excited to meet the dev founders! Happy to start with a 1-week trial sprint.",
    status: "interviewing",
    rating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    founderNotes: [
      {
        text: "Exceptional short-form video loops. Scheduling intro chat for Friday 4 PM PST.",
        author: "Founder",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    _id: "app-2",
    name: "Priya Sharma",
    email: "priya.sharma.campus@gmail.com",
    phone: "+91 91234 56789",
    role: "Founding Campus Ambassador & Community Lead",
    roleId: "founding-campus-community-lead",
    department: "Marketing & Growth",
    experience: "Student / Community Lead",
    availability: "Part-Time (10-15 hrs/week)",
    startDate: "Immediate",
    workingStyle: "Async-First with Weekly Sprints",
    location: "Bengaluru, India (IST)",
    timezone: "IST (UTC+5:30)",
    portfolioUrl: "",
    linkedinUrl: "https://linkedin.com/in/priyasharma-community",
    githubUrl: "https://github.com/priyasharma-campus",
    otherUrl: "Discord: @priya_comm#001",
    bestProjectUrl: "https://discord.gg/campus-tech-prep",
    bestProjectDesc:
      "Founded and grew a 4,500+ student Discord community for tech internship preparation with daily resume roasting channels.",
    whyJoin:
      "Engineering students on campus are desperate for reliable tools to navigate campus placement season. SmartNShine's ATS scanner is leagues ahead of outdated college templates.",
    scrappyStory:
      "Organized a nationwide virtual hackathon across 18 universities with $0 budget by partnering with tech clubs and securing free SaaS API credits for prizes. 1,200+ students participated.",
    first30DaysPlan:
      "1. Build a network of 30 Campus Ambassadors across top engineering universities.\n2. Run weekly live Discord resume roast sessions with SmartNShine scoring.\n3. Distribute exclusive college placement promo links.\n4. Host monthly virtual portfolio teardowns with industry guest speakers.",
    marketInsight:
      "Students don't understand why their resumes get rejected. Giving them actionable diagnostic scores bridges the anxiety gap instantly.",
    resumeName: "Priya_Sharma_Resume.pdf",
    resumeSize: 980000,
    resumeData: "",
    additionalNotes: "Final year CS student with plenty of time for campus growth loops.",
    status: "reviewed",
    rating: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    founderNotes: [
      {
        text: "Strong student community reach across tier-1 colleges. Great fit for Campus Lead.",
        author: "Founder",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
    ],
  },
  {
    _id: "app-3",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@iitb.ac.in",
    phone: "+91 98201 44512",
    role: "Founding Business Development & Operations Partner",
    roleId: "founding-business-operations-lead",
    department: "Business & Strategy",
    experience: "1-2 years",
    availability: "Full-Time (30-40 hrs/week)",
    startDate: "Within 1-2 Weeks",
    workingStyle: "Daily Quick Syncs",
    location: "Mumbai, India (IST)",
    timezone: "IST (UTC+5:30)",
    portfolioUrl: "",
    linkedinUrl: "https://linkedin.com/in/rohankulkarni-ops",
    githubUrl: "",
    otherUrl: "",
    bestProjectUrl: "https://placement.iitb.ac.in",
    bestProjectDesc:
      "Negotiated corporate recruitment partnerships with 45+ tech companies and structured bulk student training packages.",
    whyJoin:
      "I see huge institutional potential in B2B college licenses, coding bootcamp packages, and recruiter partnerships alongside the direct-to-consumer platform.",
    scrappyStory:
      "Closed 8 sponsorship deals in 2 weeks for our university entrepreneurship summit via cold outreach on LinkedIn with a 38% response rate.",
    first30DaysPlan:
      "1. Pitch bulk SmartNShine access to 25 coding bootcamps and placement departments.\n2. Structure affiliate partnerships with career consultants.\n3. Validate enterprise recruiter pricing for talent discovery.",
    marketInsight:
      "Bootcamps and placement cells spend thousands of hours manually reviewing resumes. Providing them a bulk dashboard is an untapped enterprise goldmine.",
    resumeName: "Rohan_Kulkarni_Resume.pdf",
    resumeSize: 1120000,
    resumeData: "",
    additionalNotes: "Ready for full-time commitment and strategic business operations.",
    status: "pending",
    rating: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    founderNotes: [],
  },
  {
    _id: "app-4",
    name: "Liam O'Connor",
    email: "liam.ai.systems@gmail.com",
    phone: "+353 87 234 5678",
    role: "Founding Full-Stack & AI Co-Engineer",
    roleId: "founding-fullstack-ai-partner",
    department: "Engineering",
    experience: "3-5 years",
    availability: "Moonlighting (Evenings & Weekends)",
    startDate: "Immediate",
    workingStyle: "Weekend Deep Work Sessions",
    location: "Dublin, Ireland (GMT)",
    timezone: "GMT (UTC+0)",
    portfolioUrl: "https://liamoconnor.dev",
    linkedinUrl: "https://linkedin.com/in/liam-oconnor-ai",
    githubUrl: "https://github.com/liamoconnor",
    otherUrl: "",
    bestProjectUrl: "https://github.com/liamoconnor/puppeteer-pdf-vector",
    bestProjectDesc:
      "Built an open-source high-speed headless Puppeteer PDF rendering engine with custom font embedding and SVG export.",
    whyJoin:
      "The engineering challenges in pixel-perfect ATS-compliant vector PDF rendering and streaming LLM optimizations are super exciting. I want to build world-class tech with fellow founders.",
    scrappyStory:
      "Engineered an automated job scraper and resume matcher in Node.js that processed 10k postings daily with zero cloud costs using serverless cron pipelines.",
    first30DaysPlan:
      "1. Optimize Puppeteer PDF generation time from 2.5s to under 600ms.\n2. Implement OpenAI / Claude streaming response hooks for real-time bullet rewrites.\n3. Add Automated LinkedIn PDF profile importer.",
    marketInsight:
      "Most online PDF generators produce blurry canvas snapshots that ATS parsers fail to read. True vector PDF generation with text layer compliance is our biggest moat.",
    resumeName: "Liam_OConnor_FullStack.pdf",
    resumeSize: 1840000,
    resumeData: "",
    additionalNotes: "Love the codebase architecture. Ready to pair on weekend sprints.",
    status: "shortlisted",
    rating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    founderNotes: [
      {
        text: "Very strong GitHub repos with React & Puppeteer automation. Top candidate for tech co-lead.",
        author: "Founder",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
    ],
  },
];

export default function CareerApplications() {
  const [activeTab, setActiveTab] = useState("applications"); // 'applications' | 'roles'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [detailTab, setDetailTab] = useState("answers"); // 'answers' | 'profile' | 'evaluation'

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let remoteApps = [];
      try {
        const res = await careerApplicationAPI.getAllApplications();
        if (res.data?.success && res.data?.applications) {
          remoteApps = res.data.applications;
        }
      } catch (e) {
        console.warn("Could not fetch remote career applications:", e);
      }

      const localSaved = JSON.parse(
        localStorage.getItem("smartnshine_admin_career_apps") || "[]"
      );

      // Merge remote and local saved cache uniquely
      const combined = [...remoteApps, ...localSaved];
      const existingIds = new Set(combined.map((a) => a._id || a.email));

      // Include seed samples only if no other applications exist yet
      const merged = combined.length > 0
        ? Array.from(new Map(combined.map((item) => [item._id || item.email, item])).values())
        : SAMPLE_APPLICATIONS;

      setApplications(merged);
      localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(merged));
    } catch (err) {
      console.error("Error loading career applications:", err);
      setApplications(SAMPLE_APPLICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await careerApplicationAPI.updateStatus(appId, newStatus);
    } catch (err) {
      console.warn("Status update server sync:", err);
    }

    const updated = applications.map((app) =>
      app._id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(updated));
    if (selectedApplication && selectedApplication._id === appId) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
    }
    toast.success(`Application status updated to ${newStatus}`);
  };

  const updateApplicationRating = async (appId, newRating) => {
    try {
      await careerApplicationAPI.updateRating(appId, newRating);
    } catch (err) {
      console.warn("Rating update server sync:", err);
    }

    const updated = applications.map((app) =>
      app._id === appId ? { ...app, rating: newRating } : app
    );
    setApplications(updated);
    localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(updated));
    if (selectedApplication && selectedApplication._id === appId) {
      setSelectedApplication({ ...selectedApplication, rating: newRating });
    }
    toast.success(`Candidate rating set to ${newRating} stars`);
  };

  const handleAddFounderNote = async () => {
    if (!newNoteText.trim() || !selectedApplication) return;

    const newNote = {
      text: newNoteText.trim(),
      author: "Founder",
      createdAt: new Date().toISOString(),
    };

    try {
      await careerApplicationAPI.addFounderNote(selectedApplication._id, {
        text: newNoteText.trim(),
        author: "Founder",
      });
    } catch (err) {
      console.warn("Add note server sync:", err);
    }

    const updatedNotes = [...(selectedApplication.founderNotes || []), newNote];
    const updatedApp = { ...selectedApplication, founderNotes: updatedNotes };
    setSelectedApplication(updatedApp);

    const updatedList = applications.map((app) =>
      app._id === selectedApplication._id ? updatedApp : app
    );
    setApplications(updatedList);
    localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(updatedList));

    setNewNoteText("");
    toast.success("Founder note added");
  };

  const deleteApplication = async (appId) => {
    try {
      await careerApplicationAPI.deleteApplication(appId);
    } catch (err) {
      console.warn("Delete application server sync:", err);
    }

    const updated = applications.filter((app) => app._id !== appId);
    setApplications(updated);
    localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(updated));
    if (selectedApplication && selectedApplication._id === appId) {
      setIsDetailModalOpen(false);
      setSelectedApplication(null);
    }
    toast.success("Application removed from console");
  };

  const copyToClipboard = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`Copied ${fieldName} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Export all applications to CSV
  const exportToCSV = () => {
    if (applications.length === 0) {
      toast.error("No applications to export.");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Role",
      "Department",
      "Pitched Role / Title",
      "University / Campus",
      "Location",
      "Availability",
      "Start Date",
      "LinkedIn",
      "Portfolio",
      "GitHub",
      "Best Project URL",
      "Why Join Answer",
      "Scrappy Story",
      "30-Day Game Plan",
      "Role-Specific Strategy",
      "Market Insight",
      "Status",
      "Rating",
      "Applied Date",
    ];

    const rows = applications.map((app) => [
      `"${app._id || ""}"`,
      `"${(app.name || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${(app.phone || "").replace(/"/g, '""')}"`,
      `"${(app.role || app.roleTitle || "").replace(/"/g, '""')}"`,
      `"${(app.department || "").replace(/"/g, '""')}"`,
      `"${(app.customRolePitch || "").replace(/"/g, '""')}"`,
      `"${(app.universityOrOrg || "").replace(/"/g, '""')}"`,
      `"${(app.location || "").replace(/"/g, '""')}"`,
      `"${(app.availability || "").replace(/"/g, '""')}"`,
      `"${(app.startDate || "").replace(/"/g, '""')}"`,
      `"${(app.linkedinUrl || "").replace(/"/g, '""')}"`,
      `"${(app.portfolioUrl || "").replace(/"/g, '""')}"`,
      `"${(app.githubUrl || "").replace(/"/g, '""')}"`,
      `"${(app.bestProjectUrl || "").replace(/"/g, '""')}"`,
      `"${(app.whyJoin || "").replace(/"/g, '""')}"`,
      `"${(app.scrappyStory || "").replace(/"/g, '""')}"`,
      `"${(app.first30DaysPlan || "").replace(/"/g, '""')}"`,
      `"${(app.roleSpecificAnswer || "").replace(/"/g, '""')}"`,
      `"${(app.marketInsight || "").replace(/"/g, '""')}"`,
      `"${app.status || "pending"}"`,
      `"${app.rating || 0}"`,
      `"${new Date(app.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartNShine_Career_Applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported all applications to CSV!");
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      // Department / Role filter
      if (
        departmentFilter !== "all" &&
        !`${app.role || app.roleTitle || ""} ${app.department || ""}`
          .toLowerCase()
          .includes(departmentFilter.toLowerCase())
      ) {
        return false;
      }
      // Search query across ALL response fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.name?.toLowerCase().includes(q);
        const matchEmail = app.email?.toLowerCase().includes(q);
        const matchRole = (app.role || app.roleTitle)?.toLowerCase().includes(q);
        const matchWhy = app.whyJoin?.toLowerCase().includes(q);
        const matchStory = app.scrappyStory?.toLowerCase().includes(q);
        const matchPlan = app.first30DaysPlan?.toLowerCase().includes(q);
        const matchLocation = app.location?.toLowerCase().includes(q);
        return matchName || matchEmail || matchRole || matchWhy || matchStory || matchPlan || matchLocation;
      }
      return true;
    });
  }, [applications, statusFilter, departmentFilter, searchQuery]);

  // Statistics counters
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      reviewed: applications.filter((a) => a.status === "reviewed").length,
      interviewing: applications.filter((a) => a.status === "interviewing").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    };
  }, [applications]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock3 className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Eye className="w-3 h-3" />
            Reviewed
          </span>
        );
      case "interviewing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Calendar className="w-3 h-3" />
            Chat Scheduled
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Shortlisted
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            <XCircle className="w-3 h-3" />
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Founding Applications Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20">
              Day 0 Recruitment
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review detailed founding responses, written strategy deep dives, candidate portfolios, and manage candidate workflows.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export to CSV</span>
          </button>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors shadow-2xs cursor-pointer"
            title="Refresh Applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Submissions</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.total}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">All founding inquiries</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending Review</span>
            <Clock3 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.pending}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Requires founder review</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Intro Chats</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.interviewing}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">In discussions / scheduled</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.shortlisted}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Core candidates</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "applications"
              ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "roles"
              ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Active Open Positions ({OPEN_ROLES.length})
        </button>
      </div>

      {activeTab === "applications" ? (
        /* Applications Table Tab */
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidates by name, email, role, answers, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewing">Chat Scheduled</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="archived">Archived</option>
              </select>

              {/* Department Dropdown Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="marketing">Marketing & Growth</option>
                <option value="business">Business & Ops</option>
                <option value="campus">Campus & Community</option>
                <option value="engineer">Engineering</option>
              </select>
            </div>
          </div>

          {/* Applications List Table */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-2xs">
            {loading ? (
              <div className="py-20 text-center text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-400" />
                <p className="text-sm">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                <Users className="w-10 h-10 mx-auto mb-3 text-zinc-400 opacity-60" />
                <p className="text-base font-medium text-zinc-900 dark:text-white">
                  No applications found
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try adjusting your search query or filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                      <th className="py-3.5 px-4">Role Applied</th>
                      <th className="py-3.5 px-4">Availability</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Applied</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app._id}
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsDetailModalOpen(true);
                        }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                      >
                        {/* Candidate Name & Contact */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-xs flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                              {app.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {app.name}
                              </div>
                              <div className="text-xs text-zinc-400 truncate">
                                {app.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Applied */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                            {app.role || app.roleTitle}
                          </div>
                          <div className="text-[11px] text-zinc-400">{app.department}</div>
                        </td>

                        {/* Availability */}
                        <td className="py-4 px-4">
                          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-light">
                            {app.availability || "Part-Time"}
                          </span>
                        </td>

                        {/* Rating (1-5 stars) */}
                        <td
                          className="py-4 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateApplicationRating(app._id, star)}
                                className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    (app.rating || 0) >= star
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-zinc-300 dark:text-zinc-700"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {getStatusBadge(app.status)}
                        </td>

                        {/* Applied Date */}
                        <td className="py-4 px-4 text-xs text-zinc-400 font-light">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td
                          className="py-4 px-4 sm:px-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsDetailModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>

                            <button
                              onClick={() => deleteApplication(app._id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Open Roles Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPEN_ROLES.map((role) => (
            <div
              key={role.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {role.department}
                  </span>
                  <span className="text-xs text-zinc-400 font-light">{role.type}</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {role.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                  {role.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {role.location}
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Active Open Position
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Full Application Inspection Drawer / Modal */}
      {isDetailModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden">
          <div className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                  {selectedApplication.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {selectedApplication.name}
                    </h2>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Applying for{" "}
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      {selectedApplication.role || selectedApplication.roleTitle}
                    </strong>{" "}
                    • {selectedApplication.department}
                  </p>
                </div>
              </div>

              {/* Status & Close Control */}
              <div className="flex items-center gap-2.5">
                <select
                  value={selectedApplication.status}
                  onChange={(e) =>
                    updateApplicationStatus(selectedApplication._id, e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Under Review</option>
                  <option value="interviewing">Chat Scheduled</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Contact & Action Ribbon */}
            <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                {/* Email Action */}
                <a
                  href={`mailto:${selectedApplication.email}?subject=SmartNShine%20Founding%20Team%20-%20Intro%20Chat&body=Hi%20${encodeURIComponent(
                    selectedApplication.name.split(" ")[0]
                  )},%0D%0A%0D%0AThank%20you%20for%20applying%20for%20the%20${encodeURIComponent(
                    selectedApplication.role || selectedApplication.roleTitle
                  )}%20founding%20role%20at%20SmartNShine!%20We%20loved%20your%20answers%20and%20would%20like%20to%20invite%20you%20for%20a%2030-minute%20intro%20chat%20with%20our%20dev%20founders.`}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedApplication.email}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>

                {/* Phone */}
                {selectedApplication.phone && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{selectedApplication.phone}</span>
                  </div>
                )}

                {/* Location */}
                {selectedApplication.location && (
                  <div className="flex items-center gap-1 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{selectedApplication.location}</span>
                  </div>
                )}
              </div>

              {/* Star Rating control in ribbon */}
              <div className="flex items-center gap-1 text-amber-400">
                <span className="text-zinc-400 text-[11px] mr-1">Founder Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateApplicationRating(selectedApplication._id, star)}
                    className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        (selectedApplication.rating || 0) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tabs for Deep Inspection */}
            <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4 text-xs font-medium shrink-0">
              <button
                onClick={() => setDetailTab("answers")}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === "answers"
                    ? "border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                Founding Deep Dive Answers
              </button>
              <button
                onClick={() => setDetailTab("profile")}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === "profile"
                    ? "border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                Proof of Work & Links
              </button>
              <button
                onClick={() => setDetailTab("evaluation")}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === "evaluation"
                    ? "border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                Founder Evaluation & Notes (
                {selectedApplication.founderNotes?.length || 0})
              </button>
            </div>

            {/* Scrollable Inspection Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {detailTab === "answers" && (
                <div className="space-y-6">
                  {/* Custom Role Pitch / University if present */}
                  {(selectedApplication.customRolePitch || selectedApplication.universityOrOrg) && (
                    <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedApplication.customRolePitch && (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold block">
                            Pitched Founding Role
                          </span>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5 block">
                            {selectedApplication.customRolePitch}
                          </span>
                        </div>
                      )}
                      {selectedApplication.universityOrOrg && (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold block">
                            University / Campus / Network
                          </span>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5 block">
                            {selectedApplication.universityOrOrg}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 1. Why SmartNShine */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. Why SmartNShine & Why Now?</span>
                    </div>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 font-light leading-relaxed whitespace-pre-line">
                      {selectedApplication.whyJoin ||
                        selectedApplication.coverNote ||
                        "No written answer provided."}
                    </p>
                  </div>

                  {/* 2. Scrappy 0-to-1 Story */}
                  {selectedApplication.scrappyStory && (
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        <Flame className="w-3.5 h-3.5" />
                        <span>2. Scrappy 0-to-1 Hustle Story</span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-light leading-relaxed whitespace-pre-line">
                        {selectedApplication.scrappyStory}
                      </p>
                    </div>
                  )}

                  {/* 3. First 30 Days Game Plan */}
                  {selectedApplication.first30DaysPlan && (
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>3. First 30 Days Game Plan</span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-light leading-relaxed whitespace-pre-line">
                        {selectedApplication.first30DaysPlan}
                      </p>
                    </div>
                  )}

                  {/* 4. Role-Specific Tailored Question Focus */}
                  {selectedApplication.roleSpecificAnswer && (
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>4. Role-Specific Strategy & Execution Focus</span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-light leading-relaxed whitespace-pre-line">
                        {selectedApplication.roleSpecificAnswer}
                      </p>
                    </div>
                  )}

                  {/* 5. Market Insight */}
                  {selectedApplication.marketInsight && (
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>5. Market Perspective & What's Broken in ATS</span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-light leading-relaxed whitespace-pre-line">
                        {selectedApplication.marketInsight}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "profile" && (
                <div className="space-y-6">
                  {/* Working Cadence & Availability */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                        Availability
                      </span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white mt-1 block">
                        {selectedApplication.availability || "Part-Time"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                        Earliest Start Date
                      </span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white mt-1 block">
                        {selectedApplication.startDate || "Immediate"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                        Working Rhythm
                      </span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white mt-1 block">
                        {selectedApplication.workingStyle || "Async-First"}
                      </span>
                    </div>
                  </div>

                  {/* Proof of Work Links Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* LinkedIn */}
                    {selectedApplication.linkedinUrl && (
                      <a
                        href={selectedApplication.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                              LinkedIn Profile
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              {selectedApplication.linkedinUrl}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 shrink-0" />
                      </a>
                    )}

                    {/* Portfolio */}
                    {selectedApplication.portfolioUrl && (
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                              Portfolio / Website
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              {selectedApplication.portfolioUrl}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 shrink-0" />
                      </a>
                    )}

                    {/* GitHub */}
                    {selectedApplication.githubUrl && (
                      <a
                        href={selectedApplication.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Github className="w-4 h-4 text-zinc-800 dark:text-zinc-200 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                              GitHub Profile
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              {selectedApplication.githubUrl}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white shrink-0" />
                      </a>
                    )}

                    {/* Other link */}
                    {selectedApplication.otherUrl && (
                      <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Share2 className="w-4 h-4 text-purple-500 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                              Social Footprint
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              {selectedApplication.otherUrl}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Best Single Project */}
                  {selectedApplication.bestProjectUrl && (
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                        #1 Best Project / Growth Campaign Link
                      </span>
                      <a
                        href={selectedApplication.bestProjectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{selectedApplication.bestProjectUrl}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      {selectedApplication.bestProjectDesc && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light mt-1">
                          {selectedApplication.bestProjectDesc}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Resume File */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {selectedApplication.resumeName || "Attached_Resume.pdf"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {selectedApplication.resumeSize
                            ? `${(selectedApplication.resumeSize / 1024 / 1024).toFixed(2)} MB`
                            : "Ready for review"}
                        </p>
                      </div>
                    </div>

                    {selectedApplication.resumeData ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedApplication.resumeData}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                        <a
                          href={selectedApplication.resumeData}
                          download={selectedApplication.resumeName || "Resume.pdf"}
                          className="px-3.5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:opacity-90 transition-opacity"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download CV</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 font-light">
                        PDF on File
                      </span>
                    )}
                  </div>
                </div>
              )}

              {detailTab === "evaluation" && (
                <div className="space-y-6">
                  {/* Append new note */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Add Founder Evaluation Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add interview impressions, trial sprint ideas, or candidate evaluation notes..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddFounderNote}
                        disabled={!newNoteText.trim()}
                        className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save Founder Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Evaluation History
                    </h4>

                    {selectedApplication.founderNotes &&
                    selectedApplication.founderNotes.length > 0 ? (
                      selectedApplication.founderNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              {note.author || "Founder"}
                            </span>
                            <span className="text-zinc-400 font-light">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        No founder notes recorded yet. Add your first note above.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
              <button
                onClick={() => deleteApplication(selectedApplication._id)}
                className="px-3.5 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </button>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
