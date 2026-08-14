import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "@/components/common/SEO";
import { DarkModeToggle } from "@/components/common";
import {
  MessageSquare,
  Sparkles,
  Star,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Briefcase,
  Layers,
  Copy,
  Check,
  Send,
  HelpCircle,
  Clock,
  Volume2,
  ChevronRight,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Target,
  ArrowRight,
  ArrowLeft,
  Flame,
  BookOpen,
} from "lucide-react";
import careerAPI from "@/api/career.api";
import { handleApiError } from "@/utils/errorHandler";

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: Layers },
  { id: "hr", label: "HR & Culture", icon: MessageSquare },
  { id: "behavioral", label: "Behavioral (STAR)", icon: Target },
  { id: "project", label: "Project & Tech", icon: Briefcase },
  { id: "application", label: "Application & Fit", icon: HelpCircle },
  { id: "job-specific", label: "Job-Specific", icon: Flame },
  { id: "saved", label: "Saved ⭐", icon: Star },
];

export default function CareerQA() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0);

  // Selected Active Question in Studio
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [talkingPoints, setTalkingPoints] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [missingInfoTip, setMissingInfoTip] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generation Controls
  const [answerLength, setAnswerLength] = useState("standard"); // short, standard, detailed
  const [answerTone, setAnswerTone] = useState("conversational"); // conversational, professional, concise

  // Job Specific Preparation Modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [jobAnalysisResult, setJobAnalysisResult] = useState(null);

  // Project Question Generator Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [generatingProjectQ, setGeneratingProjectQ] = useState(false);
  const [projectQuestionsResult, setProjectQuestionsResult] = useState(null);

  // Custom Question Modal
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState("");
  const [customQuestionCategory, setCustomQuestionCategory] = useState("hr");

  useEffect(() => {
    loadQuestions();
    loadProfileForProjects();
  }, [activeCategory, searchQuery]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory === "saved") {
        params.status = "saved";
      } else if (activeCategory !== "all") {
        params.category = activeCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await careerAPI.getQAItems(params);
      const list = res.data?.items || [];
      setItems(list);
      setTotalSaved(res.data?.totalSaved || 0);

      // Default select first item if none selected or not in current list
      if (list.length > 0 && (!selectedItem || !list.some((it) => it.question === selectedItem.question))) {
        selectQuestion(list[0]);
      }
    } catch (err) {
      handleApiError(err, "Failed to load question bank", toast);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileForProjects = async () => {
    try {
      const res = await careerAPI.getProfile();
      if (res.data?.profile) {
        setUserProfile(res.data.profile);
        if (res.data.profile.projects?.length > 0) {
          setSelectedProjectId(res.data.profile.projects[0]._id);
        }
      }
    } catch (err) {
      console.warn("Could not load profile for project questions:", err);
    }
  };

  const selectQuestion = (item) => {
    setSelectedItem(item);
    setEditedAnswer(item.savedAnswer || item.aiDraft || "");
    setAiDraft(item.aiDraft || "");
    setTalkingPoints([]);
    setMissingInfoTip("");
    setRelatedProjects(item.relatedProjects || []);
    setAnswerLength(item.answerLength || "standard");
    setAnswerTone(item.answerTone || "conversational");
  };

  const handleGenerateAnswer = async () => {
    if (!selectedItem) return;
    try {
      setGenerating(true);
      const res = await careerAPI.generateAnswer({
        question: selectedItem.question,
        category: selectedItem.category,
        answerLength,
        answerTone,
      });

      const draft = res.data?.aiDraft || "";
      setAiDraft(draft);
      setEditedAnswer(draft);
      setTalkingPoints(res.data?.talkingPoints || []);
      setRelatedProjects(res.data?.relatedProjects || []);
      setMissingInfoTip(res.data?.missingInfoTip || "");

      // Update local item state
      setSelectedItem((prev) => ({
        ...prev,
        aiDraft: draft,
        status: prev?.savedAnswer ? "saved" : "drafted",
      }));

      toast.success("Personalized answer generated from your Career Profile!");
    } catch (err) {
      handleApiError(err, "Failed to generate answer", toast);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToAnswerBank = async () => {
    if (!selectedItem) return;
    if (!editedAnswer.trim()) {
      toast.error("Please enter or generate an answer first");
      return;
    }

    try {
      setSavingAnswer(true);
      const res = await careerAPI.saveAnswer({
        qaId: selectedItem._id,
        question: selectedItem.question,
        category: selectedItem.category,
        aiDraft: aiDraft || selectedItem.aiDraft,
        savedAnswer: editedAnswer.trim(),
        answerLength,
        answerTone,
        relatedProjects,
      });

      if (res.data?.item) {
        setSelectedItem(res.data.item);
        loadQuestions();
      }
      toast.success("Answer saved to your Career Q&A Bank ⭐");
    } catch (err) {
      handleApiError(err, "Failed to save answer", toast);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleToggleStar = async (item, e) => {
    e?.stopPropagation();
    try {
      await careerAPI.toggleStar({
        qaId: item._id,
        question: item.question,
        category: item.category,
      });
      loadQuestions();
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  const handleCopy = () => {
    if (!editedAnswer) return;
    navigator.clipboard.writeText(editedAnswer);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Job Specific Analysis
  const handleAnalyzeJobDescription = async () => {
    if (!jobDescriptionInput.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    try {
      setAnalyzingJob(true);
      const res = await careerAPI.generateJobQuestions(jobDescriptionInput.trim());
      setJobAnalysisResult(res.data);
      toast.success("Generated tailored interview questions based on the JD!");
    } catch (err) {
      handleApiError(err, "Failed to analyze job description", toast);
    } finally {
      setAnalyzingJob(false);
    }
  };

  const handleAddJobQuestionToBank = async (qObj) => {
    try {
      await careerAPI.saveAnswer({
        question: qObj.question,
        category: "job-specific",
        jobContext: {
          jobDescription: jobDescriptionInput,
        },
      });
      toast.success("Question added to your Q&A bank!");
      loadQuestions();
    } catch (err) {
      toast.error("Failed to add question");
    }
  };

  // Project Questions Generation
  const handleGenerateProjectQuestions = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    const proj = userProfile?.projects?.find((p) => p._id === selectedProjectId);
    if (!proj) {
      toast.error("Project not found");
      return;
    }

    try {
      setGeneratingProjectQ(true);
      const res = await careerAPI.generateProjectQuestions(proj);
      setProjectQuestionsResult(res.data);
      toast.success("Generated architectural questions for your project!");
    } catch (err) {
      handleApiError(err, "Failed to generate project questions", toast);
    } finally {
      setGeneratingProjectQ(false);
    }
  };

  // Custom Question Add
  const handleAddCustomQuestion = async () => {
    if (!customQuestionText.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      await careerAPI.saveAnswer({
        question: customQuestionText.trim(),
        category: customQuestionCategory,
      });
      toast.success("Custom question created!");
      setCustomModalOpen(false);
      setCustomQuestionText("");
      loadQuestions();
    } catch (err) {
      toast.error("Failed to create question");
    }
  };

  const handleGoBack = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col">
      <SEO
        title="Personalized Career & Interview Q&A | SmartNShine"
        description="Smart, personalized answer bank grounded in your real Career Profile. Prepare HR, behavioral, project architecture, and job-specific interview questions."
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

          <div className="h-4 w-[1px] bg-gray-200 dark:border-white/10" />

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
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md">
              Career Q&A Bank
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Fullscreen Body */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black mb-1 text-gray-900 dark:text-white tracking-tight">
                Career Q&A Bank
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {totalSaved} Saved ⭐
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-light text-sm">
              Personalized interview answers grounded in your verified Career Profile. Zero hallucination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setJobModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium text-xs transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Prepare for a Job</span>
            </button>

            <button
              onClick={() => setProjectModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-medium text-xs transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Project Architecture Q&A</span>
            </button>

            <button
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 font-medium text-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Interface: Left Questions Bank, Right Answer Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Categories & Question List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-xs"
                        : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
              />
            </div>

            {/* Questions List Card */}
            <div className="bg-white dark:bg-black rounded-2xl p-3 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none max-h-[640px] overflow-y-auto space-y-2">
              {items.map((item, idx) => {
                const isSelected = selectedItem?.question === item.question;
                const hasSaved = Boolean(item.savedAnswer?.trim());
                const hasDraft = Boolean(item.aiDraft?.trim());

                return (
                  <div
                    key={item._id || `${item.category}-${item.question}-${idx}`}
                    onClick={() => selectQuestion(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-purple-50/70 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 shadow-xs"
                        : "bg-gray-50/50 dark:bg-zinc-900/30 border-gray-150 dark:border-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {hasSaved ? (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Saved
                          </span>
                        ) : hasDraft ? (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                            Draft Ready
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100 leading-snug line-clamp-2">
                        {item.question}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleToggleStar(item, e)}
                      className={`p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors ${
                        item.isStarred ? "text-amber-500" : "text-gray-300 dark:text-zinc-600"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                );
              })}

              {items.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No questions match your filter.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Answer Studio (7 cols) */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <div className="bg-white dark:bg-black rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-6">
                {/* Active Question Title & Controls */}
                <div className="pb-4 border-b border-gray-100 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                      Category: {selectedItem.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        disabled={!editedAnswer}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all disabled:opacity-40"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy Answer"}</span>
                      </button>
                      <button
                        onClick={(e) => handleToggleStar(selectedItem, e)}
                        className={`p-1.5 rounded-full border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          selectedItem.isStarred ? "text-amber-500" : "text-gray-400"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    "{selectedItem.question}"
                  </h2>

                  {selectedItem.hint && (
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Interviewer Tip:</span> {selectedItem.hint}
                      </div>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {selectedItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Length and Style Selector Strip */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Duration:</span>
                    <div className="flex bg-white dark:bg-black rounded-full p-0.5 border border-gray-200 dark:border-zinc-800">
                      {[
                        { id: "short", label: "Short (30-45s)" },
                        { id: "standard", label: "Standard (60-90s)" },
                        { id: "detailed", label: "Detailed (2-3m)" },
                      ].map((len) => (
                        <button
                          key={len.id}
                          onClick={() => setAnswerLength(len.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                            answerLength === len.id
                              ? "bg-gray-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                          }`}
                        >
                          {len.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Tone:</span>
                    <div className="flex bg-white dark:bg-black rounded-full p-0.5 border border-gray-200 dark:border-zinc-800">
                      {[
                        { id: "conversational", label: "Conversational" },
                        { id: "professional", label: "Professional" },
                        { id: "concise", label: "Concise" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setAnswerTone(t.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                            answerTone === t.id
                              ? "bg-gray-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate Action Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateAnswer}
                    disabled={generating}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white rounded-full text-xs font-semibold shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all"
                  >
                    {generating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>
                      {generating
                        ? "Generating from Career Profile..."
                        : editedAnswer
                        ? "Regenerate Answer with AI"
                        : "✨ Generate Personalized Answer"}
                    </span>
                  </button>
                </div>

                {/* Missing Info Feedback / Coach Tip */}
                {missingInfoTip && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Coach Feedback:</span> {missingInfoTip}
                    </div>
                  </div>
                )}

                {/* Talking Points */}
                {talkingPoints && talkingPoints.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-2 text-xs text-gray-800 dark:text-gray-200">
                    <div className="font-semibold flex items-center gap-1.5 text-gray-900 dark:text-white">
                      <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Key Strategy & Talking Points:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
                      {talkingPoints.map((tp, idx) => (
                        <li key={idx}>{tp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Editable Final Answer Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Your Custom / Final Saved Answer</span>
                    </label>
                    <span className="text-[11px] text-gray-400">
                      {editedAnswer.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                    <textarea
                    rows={8}
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    placeholder="Click 'Generate Personalized Answer' or type your custom answer here..."
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-sm leading-relaxed text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans"
                  />
                </div>

                {/* Save Final Answer Button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleSaveToAnswerBank}
                    disabled={savingAnswer || !editedAnswer.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 font-semibold rounded-full text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    {savingAnswer ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>Save to My Answer Bank ⭐</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-black rounded-2xl p-16 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none text-center text-gray-400 space-y-3">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700" />
                <h3 className="text-base font-semibold text-gray-700 dark:text-zinc-300">
                  Select a question from the left bank
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  Choose any HR, behavioral, or project question to generate grounded answers or tweak your saved versions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Prepare for Specific Job Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Prepare Answers for a Target Job
                </h3>
              </div>
              <button onClick={() => setJobModalOpen(false)} className="text-gray-400 text-sm">✕</button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste the target Job Description. SmartNShine will cross-reference it with your Career Profile to generate 5-7 highest-probability questions with specific rationale.
            </p>

            <div>
              <textarea
                rows={5}
                value={jobDescriptionInput}
                onChange={(e) => setJobDescriptionInput(e.target.value)}
                placeholder="Paste Job Description / Requirements here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setJobModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyzeJobDescription}
                disabled={analyzingJob || !jobDescriptionInput.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {analyzingJob ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
                <span>{analyzingJob ? "Analyzing..." : "Identify Interview Questions"}</span>
              </button>
            </div>

            {jobAnalysisResult && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Target Role: {jobAnalysisResult.targetRole || "Position"}
                </div>
                <div className="space-y-2">
                  {(jobAnalysisResult.questions || []).map((qObj, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          "{qObj.question}"
                        </span>
                        <button
                          onClick={() => handleAddJobQuestionToBank(qObj)}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Bank
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Why this matters:</span> {qObj.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project-Aware Architecture Questions Modal */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Project Deep-Dive Questions
                </h3>
              </div>
              <button onClick={() => setProjectModalOpen(false)} className="text-gray-400 text-sm">✕</button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select one of your projects from your Career Profile to generate architectural, scaling, and tech-choice questions.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Select Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-xs text-gray-900 dark:text-white focus:outline-none"
              >
                {(userProfile?.projects || []).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({(p.technologies || []).join(", ")})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setProjectModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateProjectQuestions}
                disabled={generatingProjectQ || !selectedProjectId}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {generatingProjectQ ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{generatingProjectQ ? "Generating..." : "Generate Questions"}</span>
              </button>
            </div>

            {projectQuestionsResult && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Questions for: {projectQuestionsResult.projectName}
                </div>
                <div className="space-y-2">
                  {(projectQuestionsResult.questions || []).map((qObj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          "{qObj.question}"
                        </span>
                        <button
                          onClick={async () => {
                            await careerAPI.saveAnswer({
                              question: qObj.question,
                              category: "project",
                              relatedProjects: [projectQuestionsResult.projectName],
                            });
                            toast.success("Added to Q&A bank!");
                            loadQuestions();
                          }}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded">
                        Focus: {qObj.focusArea}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Question Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Custom Question
              </h3>
              <button onClick={() => setCustomModalOpen(false)} className="text-gray-400 text-sm">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Category
              </label>
              <select
                value={customQuestionCategory}
                onChange={(e) => setCustomQuestionCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-xs text-gray-900 dark:text-white focus:outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== "all" && c.id !== "saved").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Question Text
              </label>
              <textarea
                rows={3}
                value={customQuestionText}
                onChange={(e) => setCustomQuestionText(e.target.value)}
                placeholder="e.g. How do you approach code reviews in an agile team?"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCustomModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomQuestion}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-full text-xs font-semibold shadow-sm"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
