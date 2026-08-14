import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "@/components/common/SEO";
import { DarkModeToggle } from "@/components/common";
import {
  User,
  GraduationCap,
  Sparkles,
  Briefcase,
  Rocket,
  Trophy,
  Award,
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  Download,
  Upload,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Flame,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
} from "lucide-react";
import careerAPI from "@/api/career.api";
import { resumeAPI } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frameworks",
  "Libraries",
  "Databases",
  "Cloud",
  "DevOps",
  "Tools",
  "AI/ML",
  "Other",
];

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: User, weight: "15%" },
  { id: "education", label: "Education", icon: GraduationCap, weight: "10%" },
  { id: "skills", label: "Skills", icon: Sparkles, weight: "15%" },
  { id: "experience", label: "Experience", icon: Briefcase, weight: "20%" },
  { id: "projects", label: "Projects", icon: Rocket, weight: "20%" },
  { id: "achievements", label: "Achievements", icon: Trophy, weight: "10%" },
  { id: "certifications", label: "Certifications", icon: Award, weight: "5%" },
  { id: "leadership", label: "Leadership", icon: Users, weight: "5%" },
  { id: "additional", label: "Additional Info", icon: Plus, weight: "Bonus" },
];

export default function CareerProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    personalInfo: {},
    education: [],
    skills: [],
    experience: [],
    projects: [],
    achievements: [],
    certifications: [],
    leadership: [],
    additionalInfo: {
      openSource: [],
      hackathons: [],
      publications: [],
      volunteerWork: [],
      languages: [],
      hobbies: [],
      other: [],
    },
  });
  const [completeness, setCompleteness] = useState({
    totalScore: 0,
    sections: {},
    suggestions: [],
  });

  // Modal States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSection, setAiSection] = useState("projects");
  const [aiInputText, setAiInputText] = useState("");
  const [aiStructuring, setAiStructuring] = useState(false);
  const [aiResultPreview, setAiResultPreview] = useState(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [importSections, setImportSections] = useState({
    personal: true,
    education: true,
    skills: true,
    experience: true,
    projects: true,
    certifications: true,
    achievements: true,
  });
  const [importing, setImporting] = useState(false);

  // Skill Quick Add
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Programming Languages");
  const [newSkillProficiency, setNewSkillProficiency] = useState("Intermediate");
  const [newSkillExp, setNewSkillExp] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await careerAPI.getProfile();
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
      if (res.data?.completeness) {
        setCompleteness(res.data.completeness);
      }
    } catch (err) {
      handleApiError(err, "Failed to load career profile", toast);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (silent = false) => {
    try {
      setSaving(true);
      const res = await careerAPI.updateProfile(profile);
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
      if (res.data?.completeness) {
        setCompleteness(res.data.completeness);
      }
      if (!silent) {
        toast.success("Career profile saved successfully!");
      }
    } catch (err) {
      handleApiError(err, "Failed to save career profile", toast);
    } finally {
      setSaving(false);
    }
  };

  // Open Resume Import
  const handleOpenImportModal = async () => {
    setImportModalOpen(true);
    try {
      const res = await resumeAPI.list();
      const list = res.data?.resumes || [];
      setUserResumes(list);
      if (list.length > 0 && !selectedResumeId) {
        setSelectedResumeId(list[0]._id);
      }
    } catch (err) {
      toast.error("Could not fetch existing resumes.");
    }
  };

  const handleExecuteImport = async () => {
    try {
      setImporting(true);
      const selected = Object.keys(importSections).filter((k) => importSections[k]);
      const res = await careerAPI.importResume(selectedResumeId, selected);
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
      if (res.data?.completeness) {
        setCompleteness(res.data.completeness);
      }
      toast.success("Resume data successfully merged into Career Profile!");
      setImportModalOpen(false);
    } catch (err) {
      handleApiError(err, "Failed to import resume data", toast);
    } finally {
      setImporting(false);
    }
  };

  // Open AI Structure Modal
  const handleOpenAIModal = (sec = activeTab) => {
    setAiSection(sec);
    setAiInputText("");
    setAiResultPreview(null);
    setAiModalOpen(true);
  };

  const handleRunAIStructure = async () => {
    if (!aiInputText.trim()) {
      toast.error("Please paste some text to structure");
      return;
    }
    try {
      setAiStructuring(true);
      const res = await careerAPI.structureWithAI(aiSection, aiInputText);
      setAiResultPreview(res.data?.structuredData);
      toast.success("Structured by AI! Review and confirm below.");
    } catch (err) {
      handleApiError(err, "AI structuring failed", toast);
    } finally {
      setAiStructuring(false);
    }
  };

  const handleApplyAIResult = () => {
    if (!aiResultPreview) return;
    const updated = { ...profile };

    if (aiSection === "personal") {
      updated.personalInfo = { ...updated.personalInfo, ...aiResultPreview };
    } else if (aiSection === "skills") {
      const current = updated.skills || [];
      const newItems = Array.isArray(aiResultPreview) ? aiResultPreview : [aiResultPreview];
      updated.skills = [...current, ...newItems];
    } else if (aiSection === "additional") {
      updated.additionalInfo = { ...updated.additionalInfo, ...aiResultPreview };
    } else {
      const current = updated[aiSection] || [];
      const newItems = Array.isArray(aiResultPreview) ? aiResultPreview : [aiResultPreview];
      updated[aiSection] = [...current, ...newItems];
    }

    setProfile(updated);
    setAiModalOpen(false);
    toast.success(`Added AI structured data to ${aiSection}!`);
  };

  // Open in Resume Builder
  const handleExportToResumeBuilder = async () => {
    try {
      const res = await careerAPI.getExportResumeFormat();
      if (res.data?.resumeData) {
        navigate("/editor", { state: { resumeData: res.data.resumeData } });
      }
    } catch (err) {
      toast.error("Failed to prepare resume format");
    }
  };

  // Add Single Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const current = profile.skills || [];
    const exists = current.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) {
      toast.error("Skill already exists");
      return;
    }
    const updatedSkills = [
      ...current,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
        yearsOfExperience: newSkillExp.trim(),
      },
    ];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkillName("");
    setNewSkillExp("");
  };

  const handleRemoveSkill = (skillName) => {
    const updated = (profile.skills || []).filter((s) => s.name !== skillName);
    setProfile({ ...profile, skills: updated });
  };

  const handleGoBack = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-gray-200 dark:border-zinc-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Loading Career Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col">
      <SEO
        title="Career Profile | SmartNShine"
        description="Your unified professional master profile. Enter your career information once and reuse everywhere across resumes, ATS analysis, and interview prep."
      />

      {/* Standalone Full-Screen Top Bar (No Nav / Sidebar / Footer) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-900 text-xs font-semibold transition-all shadow-xs"
            title="Go back to site"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back to site</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/orb-logo.png"
              alt="SmartNShine"
              className="h-8 w-auto object-contain dark:brightness-100 dark:saturate-100 brightness-50 contrast-125 saturate-200"
            />
            <span className="font-bold text-sm tracking-tight hidden sm:inline text-gray-900 dark:text-white">
              SmartNShine
            </span>
            <span className="text-gray-400 dark:text-zinc-600 text-xs hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
              Career Profile
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />

          <button
            onClick={() => handleSaveProfile(false)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 font-semibold rounded-full text-xs shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </header>

      {/* Main Fullscreen Body */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1 text-gray-900 dark:text-white tracking-tight">
              Career Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light text-sm">
              Your master source of truth. Enter information once and reuse across SmartNShine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenAIModal(activeTab)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 font-medium text-xs transition-all"
              title="Paste raw notes and let AI structure it"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>✨ AI Fast Import</span>
            </button>

            <button
              onClick={handleOpenImportModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 font-medium text-xs transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-gray-500" />
              <span>Import from Resume</span>
            </button>

            <button
              onClick={handleExportToResumeBuilder}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 font-medium text-xs transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>Use in Resume Builder</span>
            </button>
          </div>
        </div>

        {/* Completeness & Recommendation Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Completeness Card */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Profile Completeness
                </p>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {completeness.totalScore}%
                </span>
              </div>

              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500"
                  style={{ width: `${completeness.totalScore}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {SECTIONS.filter((s) => s.id !== "additional").map((s) => {
                  const score = completeness.sections?.[s.id] || 0;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800"
                    >
                      <span className="text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                      <span
                        className={`font-semibold ml-2 ${
                          score >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : score > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {score >= 80 ? "✓" : `${score}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions Card */}
          <div className="lg:col-span-2 bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Actionable Recommendations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {completeness.suggestions && completeness.suggestions.length > 0 ? (
                  completeness.suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 text-xs text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Your career profile is highly complete and ready for AI Q&A generation!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Ready to practice personalized answers?
              </span>
              <a
                href="/career-qa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Open Career Q&A Bank (New Tab)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs & Form Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black rounded-2xl p-3 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none sticky top-20 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Profile Sections
              </div>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                const score = completeness.sections?.[sec.id] || 0;

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-black" : "text-gray-400"}`} />
                      <span>{sec.label}</span>
                    </div>
                    {score >= 80 ? (
                      <span className={`text-xs ${isActive ? "text-white dark:text-black" : "text-emerald-500"}`}>
                        ✓
                      </span>
                    ) : (
                      <span className={`text-[10px] opacity-70 ${isActive ? "text-white dark:text-black" : ""}`}>
                        {sec.weight}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-black rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              {/* Personal Information */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Personal & Contact Information
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Primary details, career objective, and social portfolio links.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAIModal("personal")}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Paste & Structure</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.fullName || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, fullName: e.target.value },
                          })
                        }
                        placeholder="e.g. Atharva Kulkarni"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Preferred Name
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.preferredName || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, preferredName: e.target.value },
                          })
                        }
                        placeholder="e.g. Atharva"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.headline || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, headline: e.target.value },
                          })
                        }
                        placeholder="e.g. Full-Stack Engineer | React, Node.js & Cloud Architectures"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Bio / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={profile.personalInfo?.bio || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, bio: e.target.value },
                          })
                        }
                        placeholder="Concise overview of your professional background, engineering philosophy, and strengths..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Career Objective
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.careerObjective || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, careerObjective: e.target.value },
                          })
                        }
                        placeholder="e.g. Seeking high-impact software engineering roles building scalable distributed systems"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.personalInfo?.email || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, email: e.target.value },
                          })
                        }
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.phone || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, phone: e.target.value },
                          })
                        }
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Location / City, Country
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo?.location || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, location: e.target.value },
                          })
                        }
                        placeholder="e.g. San Francisco, CA"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={profile.personalInfo?.linkedin || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, linkedin: e.target.value },
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={profile.personalInfo?.github || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={profile.personalInfo?.portfolio || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, portfolio: e.target.value },
                          })
                        }
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Categorized Skills */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Categorized Skills Bank
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Add technical skills, frameworks, cloud platforms, and tools.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAIModal("skills")}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Paste & Categorize</span>
                    </button>
                  </div>

                  {/* Quick Add Form */}
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Quick Add New Skill
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Skill Name (e.g. React, Docker, Python)"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                        className="sm:col-span-2 px-3.5 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {SKILL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                    </div>
                  </div>

                  {/* Display Skills */}
                  <div className="space-y-4">
                    {SKILL_CATEGORIES.map((cat) => {
                      const categorySkills = (profile.skills || []).filter((s) => s.category === cat);
                      if (categorySkills.length === 0) return null;

                      return (
                        <div key={cat} className="space-y-2">
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            <span>{cat}</span>
                            <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                              {categorySkills.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categorySkills.map((s, idx) => (
                              <div
                                key={idx}
                                className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-xs"
                              >
                                <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                                {s.proficiency && (
                                  <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.2 rounded">
                                    {s.proficiency}
                                  </span>
                                )}
                                <button
                                  onClick={() => handleRemoveSkill(s.name)}
                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {(!profile.skills || profile.skills.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No skills added yet. Use the quick add box above or click "Paste & Categorize".
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Education & Academics
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Degrees, institutions, GPA, coursework, and academic projects.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("education")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.education || [];
                          setProfile({
                            ...profile,
                            education: [
                              ...updated,
                              {
                                institution: "",
                                degree: "",
                                fieldOfStudy: "",
                                startDate: "",
                                endDate: "",
                                isCurrent: false,
                                gpa: "",
                                percentage: "",
                                relevantCoursework: [],
                                description: "",
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Education</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(profile.education || []).map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Education #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.education.filter((_, i) => i !== idx);
                              setProfile({ ...profile, education: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Institution *
                            </label>
                            <input
                              type="text"
                              value={edu.institution || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].institution = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. Stanford University"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Degree *
                            </label>
                            <input
                              type="text"
                              value={edu.degree || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].degree = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. Bachelor of Science"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].fieldOfStudy = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. Computer Science"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              GPA / Percentage
                            </label>
                            <input
                              type="text"
                              value={edu.gpa || edu.percentage || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].gpa = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. 3.9 / 4.0"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={edu.startDate || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].startDate = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. Aug 2021"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={edu.endDate || ""}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].endDate = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              placeholder="e.g. May 2025"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!profile.education || profile.education.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No education records added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Work Experience
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Full-time, internships, contract roles, and responsibilities.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("experience")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.experience || [];
                          setProfile({
                            ...profile,
                            experience: [
                              ...updated,
                              {
                                company: "",
                                position: "",
                                employmentType: "Full-time",
                                location: "",
                                startDate: "",
                                endDate: "",
                                currentlyWorking: false,
                                description: "",
                                responsibilities: [],
                                achievements: [],
                                technologies: [],
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Role</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(profile.experience || []).map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Experience #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.experience.filter((_, i) => i !== idx);
                              setProfile({ ...profile, experience: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Company *
                            </label>
                            <input
                              type="text"
                              value={exp.company || ""}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].company = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              placeholder="e.g. Google"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={exp.position || ""}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].position = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              placeholder="e.g. Software Engineer"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Type
                            </label>
                            <select
                              value={exp.employmentType || "Full-time"}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].employmentType = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            >
                              {["Full-time", "Internship", "Part-time", "Contract", "Freelance"].map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={exp.startDate || ""}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].startDate = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              placeholder="e.g. May 2023"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={exp.endDate || ""}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].endDate = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              placeholder="e.g. Present"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location || ""}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].location = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              placeholder="e.g. Mountain View, CA"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Responsibilities & Impact (1 per line)
                          </label>
                          <textarea
                            rows={3}
                            value={(exp.responsibilities || []).join("\n")}
                            onChange={(e) => {
                              const copy = [...profile.experience];
                              copy[idx].responsibilities = e.target.value.split("\n").filter((l) => l.trim());
                              setProfile({ ...profile, experience: copy });
                            }}
                            placeholder="• Engineered high-throughput backend services..."
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    ))}

                    {(!profile.experience || profile.experience.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No experience added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Featured Projects
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Problem, architecture, tech stack, and measurable impact metrics.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("projects")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.projects || [];
                          setProfile({
                            ...profile,
                            projects: [
                              ...updated,
                              {
                                name: "",
                                shortDescription: "",
                                detailedDescription: "",
                                problemSolved: "",
                                solution: "",
                                role: "",
                                teamSize: "",
                                status: "Completed",
                                technologies: [],
                                features: [],
                                challenges: [],
                                results: [],
                                metrics: [],
                                achievements: [],
                                githubUrl: "",
                                liveUrl: "",
                                demoUrl: "",
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(profile.projects || []).map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Project #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.projects.filter((_, i) => i !== idx);
                              setProfile({ ...profile, projects: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Project Name *
                            </label>
                            <input
                              type="text"
                              value={proj.name || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].name = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="e.g. KnockNFix Marketplace"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Role
                            </label>
                            <input
                              type="text"
                              value={proj.role || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].role = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="e.g. Full-Stack Lead"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Technologies (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={(proj.technologies || []).join(", ")}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].technologies = e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean);
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="React, Node.js, MongoDB, Redis"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Short Overview
                            </label>
                            <input
                              type="text"
                              value={proj.shortDescription || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].shortDescription = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="High-level description of what the project accomplishes..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                Problem Solved
                              </label>
                              <textarea
                                rows={2}
                                value={proj.problemSolved || ""}
                                onChange={(e) => {
                                  const copy = [...profile.projects];
                                  copy[idx].problemSolved = e.target.value;
                                  setProfile({ ...profile, projects: copy });
                                }}
                                placeholder="What user problem or bottleneck did this address?"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                Solution & Architecture
                              </label>
                              <textarea
                                rows={2}
                                value={proj.solution || ""}
                                onChange={(e) => {
                                  const copy = [...profile.projects];
                                  copy[idx].solution = e.target.value;
                                  setProfile({ ...profile, projects: copy });
                                }}
                                placeholder="How did you architect the solution?"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Measurable Results & Metrics (1 per line)
                            </label>
                            <textarea
                              rows={2}
                              value={(proj.metrics || []).join("\n")}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].metrics = e.target.value.split("\n").filter((l) => l.trim());
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="• 99.9% uptime with 50K monthly users\n• Reduced latency by 40%"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              GitHub URL
                            </label>
                            <input
                              type="url"
                              value={proj.githubUrl || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].githubUrl = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="https://github.com/username/repo"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Live URL
                            </label>
                            <input
                              type="url"
                              value={proj.liveUrl || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].liveUrl = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="https://project.com"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Demo URL
                            </label>
                            <input
                              type="url"
                              value={proj.demoUrl || ""}
                              onChange={(e) => {
                                const copy = [...profile.projects];
                                copy[idx].demoUrl = e.target.value;
                                setProfile({ ...profile, projects: copy });
                              }}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!profile.projects || profile.projects.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No projects added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Honors & Achievements
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Hackathon wins, competitions, awards, and rankings.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("achievements")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.achievements || [];
                          setProfile({
                            ...profile,
                            achievements: [
                              ...updated,
                              {
                                title: "",
                                description: "",
                                organization: "",
                                date: "",
                                category: "Hackathon",
                                evidenceUrl: "",
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Achievement</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(profile.achievements || []).map((ach, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Achievement #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.achievements.filter((_, i) => i !== idx);
                              setProfile({ ...profile, achievements: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={ach.title || ""}
                              onChange={(e) => {
                                const copy = [...profile.achievements];
                                copy[idx].title = e.target.value;
                                setProfile({ ...profile, achievements: copy });
                              }}
                              placeholder="e.g. Winner - Smart India Hackathon"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Organization / Host
                            </label>
                            <input
                              type="text"
                              value={ach.organization || ""}
                              onChange={(e) => {
                                const copy = [...profile.achievements];
                                copy[idx].organization = e.target.value;
                                setProfile({ ...profile, achievements: copy });
                              }}
                              placeholder="e.g. Ministry of Education"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={ach.description || ""}
                              onChange={(e) => {
                                const copy = [...profile.achievements];
                                copy[idx].description = e.target.value;
                                setProfile({ ...profile, achievements: copy });
                              }}
                              placeholder="Brief description of the accomplishment..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!profile.achievements || profile.achievements.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No achievements added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {activeTab === "certifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Certifications & Licenses
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        AWS, Google Cloud, Meta, or industry credentials.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("certifications")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.certifications || [];
                          setProfile({
                            ...profile,
                            certifications: [
                              ...updated,
                              {
                                name: "",
                                issuingOrganization: "",
                                issueDate: "",
                                expiryDate: "",
                                credentialId: "",
                                credentialUrl: "",
                                description: "",
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certification</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(profile.certifications || []).map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Certification #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.certifications.filter((_, i) => i !== idx);
                              setProfile({ ...profile, certifications: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Certification Name *
                            </label>
                            <input
                              type="text"
                              value={cert.name || ""}
                              onChange={(e) => {
                                const copy = [...profile.certifications];
                                copy[idx].name = e.target.value;
                                setProfile({ ...profile, certifications: copy });
                              }}
                              placeholder="e.g. AWS Solutions Architect"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Issuing Organization *
                            </label>
                            <input
                              type="text"
                              value={cert.issuingOrganization || ""}
                              onChange={(e) => {
                                const copy = [...profile.certifications];
                                copy[idx].issuingOrganization = e.target.value;
                                setProfile({ ...profile, certifications: copy });
                              }}
                              placeholder="e.g. Amazon Web Services"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Credential URL / ID
                            </label>
                            <input
                              type="text"
                              value={cert.credentialUrl || cert.credentialId || ""}
                              onChange={(e) => {
                                const copy = [...profile.certifications];
                                copy[idx].credentialUrl = e.target.value;
                                setProfile({ ...profile, certifications: copy });
                              }}
                              placeholder="https://credly.com/..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Issue Date
                            </label>
                            <input
                              type="text"
                              value={cert.issueDate || ""}
                              onChange={(e) => {
                                const copy = [...profile.certifications];
                                copy[idx].issueDate = e.target.value;
                                setProfile({ ...profile, certifications: copy });
                              }}
                              placeholder="e.g. Jan 2024"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!profile.certifications || profile.certifications.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No certifications added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leadership */}
              {activeTab === "leadership" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Leadership & Responsibility
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Club leads, community organizing, student body, mentoring.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAIModal("leadership")}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste & Structure</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = profile.leadership || [];
                          setProfile({
                            ...profile,
                            leadership: [
                              ...updated,
                              {
                                organization: "",
                                position: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                                achievements: [],
                              },
                            ],
                          });
                        }}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Leadership</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(profile.leadership || []).map((lead, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Position #{idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = profile.leadership.filter((_, i) => i !== idx);
                              setProfile({ ...profile, leadership: updated });
                            }}
                            className="text-red-500 hover:text-red-600 p-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Organization *
                            </label>
                            <input
                              type="text"
                              value={lead.organization || ""}
                              onChange={(e) => {
                                const copy = [...profile.leadership];
                                copy[idx].organization = e.target.value;
                                setProfile({ ...profile, leadership: copy });
                              }}
                              placeholder="e.g. Google Developer Student Clubs"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Position *
                            </label>
                            <input
                              type="text"
                              value={lead.position || ""}
                              onChange={(e) => {
                                const copy = [...profile.leadership];
                                copy[idx].position = e.target.value;
                                setProfile({ ...profile, leadership: copy });
                              }}
                              placeholder="e.g. Technical Lead"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                              Initiatives & Key Contributions
                            </label>
                            <textarea
                              rows={2}
                              value={lead.description || ""}
                              onChange={(e) => {
                                const copy = [...profile.leadership];
                                copy[idx].description = e.target.value;
                                setProfile({ ...profile, leadership: copy });
                              }}
                              placeholder="Led tech bootcamps, organized hackathons..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!profile.leadership || profile.leadership.length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        No leadership records added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {activeTab === "additional" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Additional Information
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Spoken languages, hobbies, and other career interests.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Spoken Languages (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(profile.additionalInfo?.languages || [])
                          .map((l) => (typeof l === "string" ? l : l.language))
                          .join(", ")}
                        onChange={(e) => {
                          const langs = e.target.value
                            .split(",")
                            .map((l) => l.trim())
                            .filter(Boolean)
                            .map((l) => ({ language: l, proficiency: "Fluent" }));
                          setProfile({
                            ...profile,
                            additionalInfo: { ...profile.additionalInfo, languages: langs },
                          });
                        }}
                        placeholder="English, Spanish, Hindi"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Hobbies & Interests (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(profile.additionalInfo?.hobbies || []).join(", ")}
                        onChange={(e) => {
                          const hobbies = e.target.value
                            .split(",")
                            .map((h) => h.trim())
                            .filter(Boolean);
                          setProfile({
                            ...profile,
                            additionalInfo: { ...profile.additionalInfo, hobbies },
                          });
                        }}
                        placeholder="Competitive Coding, Open Source, UI Design, Chess"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Fast Import Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ✨ Fast AI Paste & Structure
                </h3>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste your raw notes, project summaries, or LinkedIn snippets. SmartNShine's AI will parse them into structured fields for you to review.
            </p>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Target Section:
              </label>
              <select
                value={aiSection}
                onChange={(e) => setAiSection(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium"
              >
                {SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <textarea
                rows={5}
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                placeholder={`Paste information for ${aiSection} here...\nExample: "KnockNFix is a local services marketplace I built with React, Node.js, and MongoDB. Solved provider discovery latency..."`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAIStructure}
                disabled={aiStructuring || !aiInputText.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-full shadow-md transition-all"
              >
                {aiStructuring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{aiStructuring ? "Structuring..." : "Structure with AI"}</span>
              </button>
            </div>

            {/* Preview of Extracted Data */}
            {aiResultPreview && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Extracted Structure (Review before saving)</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl max-h-56 overflow-y-auto text-xs font-mono text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-800">
                  <pre>{JSON.stringify(aiResultPreview, null, 2)}</pre>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleApplyAIResult}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-md"
                  >
                    Confirm & Merge to Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import from Resume Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Import from Existing Resume
                </h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select an existing resume in your account to merge into your master Career Profile without losing any custom data.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Choose Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 text-sm focus:outline-none"
              >
                {userResumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.resumeTitle || "Untitled Resume"} — {r.name || "Unnamed"} (
                    {new Date(r.updatedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Select Sections to Merge
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(importSections).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 text-xs cursor-pointer capitalize"
                  >
                    <input
                      type="checkbox"
                      checked={importSections[key]}
                      onChange={(e) =>
                        setImportSections({ ...importSections, [key]: e.target.checked })
                      }
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={importing || !selectedResumeId}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 disabled:opacity-50 rounded-full shadow-sm"
              >
                {importing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{importing ? "Importing..." : "Import Selected"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
