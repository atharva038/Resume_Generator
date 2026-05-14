import {memo, useState, useEffect, useRef, useMemo, useCallback} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {
  useLocalStorage,
  useToggle,
  useMediaQuery,
  useSectionCompletion,
  isSectionCompleteForResume,
  useFloatingSectionNav,
  useEditorPersistence,
  useResumeSaveActions,
} from "@/hooks";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import logger from "@/utils/logger";
import toast, {Toaster} from "react-hot-toast";
import {
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Lightbulb,
  Loader2,
  Lock,
  List,
  PenSquare,
  PencilLine,
  Rocket,
  RotateCcw,
  ScrollText,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
} from "lucide-react";
import {
  ResumePreview,
  EditableSection,
  CollapsibleSection,
  RecommendationsPanel,
  PersonalInfoSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  CertificationsSection,
  AchievementsSection,
  CustomSectionsManager,
  ResumeWizard,
  TemplateSelectorModal,
} from "@/components/editor";
import {ScoreCard, JobSpecificScoreCard} from "@/components/common/cards";
import {GitHubImportModal} from "@/components/common/modals";
import UpgradeRequiredModal from "@/components/common/modals/UpgradeRequiredModal";
import {getJobCategories, getJobsByCategory} from "@/utils/jobProfiles";
import {calculateResumeScore} from "@/utils/resumeScoring";
import {PageUtilizationIndicator} from "@/components/common/LimitedInputs";
import {TEMPLATES, TEMPLATE_COLOR_THEMES} from "@/components/editor/templateConfig";

// Default section order (only editable resume sections)
const DEFAULT_SECTION_ORDER = [
  "personal",
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
  "certifications",
  "achievements",
  "customSections",
];

const SECTION_META = {
  personal: {label: "Personal Info", icon: User},
  summary: {label: "Summary", icon: FileText},
  skills: {label: "Skills", icon: Target},
  experience: {label: "Experience", icon: BriefcaseBusiness},
  education: {label: "Education", icon: GraduationCap},
  projects: {label: "Projects", icon: Rocket},
  certifications: {label: "Certifications", icon: ScrollText},
  achievements: {label: "Achievements", icon: Trophy},
  customSections: {label: "Custom Sections", icon: PenSquare},
};

const SectionOutlineList = memo(
  ({sectionIds, activeSectionId, sectionCompletionMap, onSelectSection}) => (
    <>
      {sectionIds.map((sectionId) => {
        const section = SECTION_META[sectionId];
        if (!section) return null;

        const Icon = section.icon;
        const isActive = activeSectionId === sectionId;
        const complete = sectionCompletionMap[sectionId];

        return (
          <button
            key={sectionId}
            onClick={() => onSelectSection(sectionId)}
            className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                : "hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span
              className={`text-sm flex-1 ${
                isActive
                  ? "text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                complete ? "bg-emerald-500" : "bg-gray-300 dark:bg-zinc-600"
              }`}
            />
          </button>
        );
      })}
    </>
  )
);

// Memoized to avoid re-rendering this large mobile-only tree when unrelated editor state changes.
const MobileActionBar = memo(
  ({
    showFloatingNav,
    onToggleSections,
    showPreview,
    onTogglePreview,
    onSave,
    saving,
    autoSaving,
    hasUnsavedChanges,
    onExport,
    isExportLocked,
    isWizardMode,
    completedSectionsCount,
    totalTrackableSections,
    completionPercentage,
    onJumpToFirstIncomplete,
    onExpandAll,
    onCollapseAll,
    trackableSectionIds,
    activeSectionId,
    sectionCompletionMap,
    onSelectSection,
  }) => (
    <div
      className="lg:hidden sticky z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 shadow-sm -mx-2 sm:-mx-4 px-2 sm:px-4 pt-2.5 mb-4 no-print"
      style={{
        top: "calc(4rem + env(safe-area-inset-top, 0px))",
        paddingBottom: "max(0.625rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onToggleSections}
          className={`h-11 rounded-xl border transition-colors flex flex-col items-center justify-center gap-0.5 ${
            showFloatingNav
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {showFloatingNav ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
          <span className="text-[10px] font-semibold">Sections</span>
        </button>

        <button
          onClick={onTogglePreview}
          className={`h-11 rounded-xl border transition-colors flex flex-col items-center justify-center gap-0.5 ${
            showPreview
              ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300"
              : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="text-[10px] font-semibold">Preview</span>
        </button>

        <button
          onClick={onSave}
          disabled={saving || autoSaving}
          className={`h-11 rounded-xl border transition-colors relative flex flex-col items-center justify-center gap-0.5 ${
            saving || autoSaving
              ? "bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : hasUnsavedChanges
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300"
                : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {hasUnsavedChanges && !saving && !autoSaving && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
          )}
          {saving || autoSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : hasUnsavedChanges ? (
            <Download className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span className="text-[10px] font-semibold">
            {saving || autoSaving ? "Saving" : hasUnsavedChanges ? "Save" : "Saved"}
          </span>
        </button>

        <button
          onClick={onExport}
          disabled={isExportLocked}
          className={`h-11 rounded-xl border transition-colors flex flex-col items-center justify-center gap-0.5 ${
            isExportLocked
              ? "bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300"
          }`}
        >
          {isExportLocked ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span className="text-[10px] font-semibold">Export</span>
        </button>
      </div>

      {!isWizardMode && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {completedSectionsCount}/{totalTrackableSections} complete
            </span>
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </span>
          </div>
          <button
            onClick={onJumpToFirstIncomplete}
            className="h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {showFloatingNav && !isWizardMode && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 pb-1">
            <span>Section Outline</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <button
              onClick={onExpandAll}
              className="px-2 py-1 rounded-md border border-gray-200 dark:border-zinc-700 text-[10px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Expand all
            </button>
            <button
              onClick={onCollapseAll}
              className="px-2 py-1 rounded-md border border-gray-200 dark:border-zinc-700 text-[10px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Collapse all
            </button>
          </div>
          <div className="space-y-1 max-h-60 overflow-auto">
            <SectionOutlineList
              sectionIds={trackableSectionIds}
              activeSectionId={activeSectionId}
              sectionCompletionMap={sectionCompletionMap}
              onSelectSection={onSelectSection}
            />
          </div>
        </div>
      )}
    </div>
  )
);

// Memoized desktop floating nav to keep editor re-renders from repainting the full outline panel.
const DesktopFloatingSectionNav = memo(
  ({
    floatingNavContainerRef,
    floatingNavOffset,
    showFloatingNav,
    onDragStart,
    onToggleFloatingNav,
    completionPercentage,
    onJumpToFirstIncomplete,
    onExpandAll,
    onCollapseAll,
    trackableSectionIds,
    activeSectionId,
    sectionCompletionMap,
    onSelectSection,
  }) => (
    <div
      ref={floatingNavContainerRef}
      className="hidden xl:block fixed right-6 bottom-20 z-50 no-print"
      style={{
        transform: `translate(${floatingNavOffset?.x || 0}px, ${floatingNavOffset?.y || 0}px)`,
      }}
    >
      <button
        onMouseDown={onDragStart}
        onClick={onToggleFloatingNav}
        className="w-11 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg border border-gray-700 dark:border-gray-300 hover:shadow-xl transition-all flex items-center justify-center cursor-grab active:cursor-grabbing"
        title="Drag or toggle section navigation"
      >
        {showFloatingNav ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
      </button>

      {showFloatingNav && (
        <div className="mt-3 w-64 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Section Outline
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </span>
          </div>
          <button
            onClick={onJumpToFirstIncomplete}
            className="w-full mb-2 px-2.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Jump to first incomplete
          </button>
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={onExpandAll}
              className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Expand all
            </button>
            <button
              onClick={onCollapseAll}
              className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Collapse all
            </button>
          </div>
          <div className="h-px bg-gray-200 dark:bg-zinc-800 mb-2" />
          <div className="space-y-1">
            <SectionOutlineList
              sectionIds={trackableSectionIds}
              activeSectionId={activeSectionId}
              sectionCompletionMap={sectionCompletionMap}
              onSelectSection={onSelectSection}
            />
          </div>
        </div>
      )}
    </div>
  )
);

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const resumePreviewRef = useRef(null);
  const previewSectionRef = useRef(null);
  const colorDropdownRef = useRef(null);
  const sectionElementRefs = useRef({});

  // Helper function to check if subscription is expired
  const isSubscriptionExpired = () => {
    if (!user || !user.subscription) return false;

    const {status, endDate, tier} = user.subscription;

    // Free users don't have expiration
    if (tier === "free") return false;

    // Check if status is expired
    if (status === "expired") return true;

    // Check if endDate has passed
    if (endDate && new Date(endDate) < new Date()) return true;

    return false;
  };
  const [resumeData, setResumeData] = useState(null);
  const [originalResumeData, setOriginalResumeData] = useState(null); // Track original data
  const [showPreview, togglePreview, setShowPreviewTrue, setShowPreviewFalse] =
    useToggle(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [selectedTemplate, setSelectedTemplate] = useLocalStorage(
    "selectedTemplate",
    "classic"
  );
  const [
    showTemplateSelector,
    toggleTemplateSelector,
    showTemplateSelectorTrue,
    showTemplateSelectorFalse,
  ] = useToggle(false);
  const [
    showColorThemeSelector,
    toggleColorThemeSelector,
    showColorThemeSelectorTrue,
    showColorThemeSelectorFalse,
  ] = useToggle(false);
  const [sectionOrder, setSectionOrder] = useLocalStorage(
    "resumeSectionOrder",
    DEFAULT_SECTION_ORDER
  );
  const [activeSectionId, setActiveSectionId] = useState(
    DEFAULT_SECTION_ORDER[0]
  );
  // Wizard mode for new resumes
  const [
    isWizardMode,
    toggleWizardMode,
    setIsWizardModeTrue,
    setIsWizardModeFalse,
  ] = useToggle(false);
  const {
    showFloatingNav,
    floatingNavOffset,
    floatingNavContainerRef,
    toggleFloatingNav,
    closeFloatingNav,
    handleFloatingNavDragStart,
  } = useFloatingSectionNav({isWizardMode});
  const [draggedSection, setDraggedSection] = useState(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [forceSectionExpand, setForceSectionExpand] = useState(null);

  const atsScore = useMemo(() => {
    if (!resumeData) return null;
    return calculateResumeScore(resumeData);
  }, [resumeData]);
  const [
    showGitHubImportModal,
    toggleGitHubImportModal,
    showGitHubImportModalTrue,
    showGitHubImportModalFalse,
  ] = useToggle(false);
  const [
    githubImportSuccess,
    toggleGithubImportSuccess,
    setGithubImportSuccessTrue,
    setGithubImportSuccessFalse,
  ] = useToggle(false);

  // Upgrade modal states
  const [
    showUpgradeModal,
    toggleUpgradeModal,
    showUpgradeModalTrue,
    showUpgradeModalFalse,
  ] = useToggle(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const {
    saving,
    saveResume: saveResumeAction,
    handleSave,
  } = useResumeSaveActions({
    user,
    navigate,
    resumeData,
    setResumeData,
    setOriginalResumeData,
    setUpgradeMessage,
    showUpgradeModalTrue,
  });

  const {
    hasUnsavedChanges,
    autoSaving,
    showUnsavedModal,
    commitPendingNavigation,
    cancelPendingNavigation,
  } = useEditorPersistence({
    resumeData,
    originalResumeData,
    setResumeData,
    setOriginalResumeData,
    user,
    saving,
  });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showColorThemeSelector) return;

    const handleClickOutside = (event) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target)
      ) {
        showColorThemeSelectorFalse();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorThemeSelector, showColorThemeSelectorFalse]);

  // Load resume data on mount
  useEffect(() => {
    const loadResumeData = async () => {
      // First, try to get data from location state (when navigating from upload)
      const stateData = location.state?.resumeData;
      const isNewResume = location.state?.isNewResume || false;

      if (stateData) {
        // Set wizard mode for new resumes
        if (isNewResume) {
          setIsWizardModeTrue();
        } else {
          setIsWizardModeFalse();
        }

        // Auto-enable preview for wizard mode
        if (isNewResume && !isMobile) {
          setShowPreviewTrue();
        }

        // Initialize data from location state
        initializeResumeData(stateData);

        // If it has an ID, store it for future refreshes
        if (stateData._id) {
          localStorage.setItem("currentResumeId", stateData._id);
        }
        return;
      }

      // If no state data, check if we have a saved resume ID
      const savedResumeId = localStorage.getItem("currentResumeId");

      if (savedResumeId && user) {
        // Fetch the resume from the database
        try {
          const response = await resumeAPI.getById(savedResumeId);
          const loadedData = response.data;
          // Existing resumes should not show wizard
          setIsWizardModeFalse();
          initializeResumeData(loadedData);
        } catch (err) {
          logger.error("❌ Error loading resume:", err);
          // If error loading, clear the saved ID and redirect to upload
          localStorage.removeItem("currentResumeId");
          navigate("/upload");
        }
      } else {
        // No data available, redirect to upload
        navigate("/upload");
      }
    };

    const initializeResumeData = (data) => {
      // Initialize targetJobRole if it doesn't exist
      if (!data.targetJobRole) {
        data.targetJobRole = "software-engineer";
      }

      // Initialize colorTheme if it doesn't exist
      // First check if there's a saved color theme from Templates page
      if (!data.colorTheme) {
        const savedColorTheme = localStorage.getItem("selectedColorTheme");
        if (savedColorTheme) {
          data.colorTheme = savedColorTheme;
          // Clear the saved color theme after using it
          localStorage.removeItem("selectedColorTheme");
        }
      }

      // Ensure contact object exists with all fields
      if (!data.contact || typeof data.contact !== "object") {
        data.contact = {
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          portfolio: "",
        };
      } else {
        // Merge with defaults to ensure all fields exist
        data.contact = {
          email: data.contact.email || "",
          phone: data.contact.phone || "",
          location: data.contact.location || "",
          linkedin: data.contact.linkedin || "",
          github: data.contact.github || "",
          portfolio: data.contact.portfolio || "",
        };
      }

      // Initialize sectionTitles if it doesn't exist (for custom section names)
      if (!data.sectionTitles) {
        data.sectionTitles = {
          summary: "Professional Summary",
          skills: "Skills",
          experience: "Experience",
          education: "Education",
          projects: "Projects",
          certifications: "Certifications",
          achievements: "Achievements",
        };
      }

      // Ensure all array fields are properly initialized to prevent reduce errors
      if (!Array.isArray(data.skills)) {
        data.skills = [];
      }
      if (!Array.isArray(data.experience)) {
        data.experience = [];
      }
      if (!Array.isArray(data.education)) {
        data.education = [];
      }
      if (!Array.isArray(data.projects)) {
        data.projects = [];
      }
      if (!Array.isArray(data.certifications)) {
        data.certifications = [];
      }
      if (!Array.isArray(data.achievements)) {
        data.achievements = [];
      }
      if (!Array.isArray(data.customSections)) {
        data.customSections = [];
      }

      // Initialize summary as empty string if not present
      if (!data.summary) {
        data.summary = "";
      }

      setResumeData(data);
      // Store a deep copy as original data for change detection
      setOriginalResumeData(JSON.parse(JSON.stringify(data)));
    };

    loadResumeData();
  }, [location, navigate, user]);

  const resumeAccess = resumeData?.access || {};
  const isPaidActionLocked = Boolean(
    resumeData?._id &&
      (resumeAccess.upgradeRequired ||
        resumeAccess.canDownload === false ||
        resumeAccess.canUseAI === false)
  );
  const isReadOnlyResume = Boolean(resumeData?._id && resumeAccess.canEdit === false);
  const lockedResumeMessage =
    resumeAccess.lockReason ||
    "Paid actions are locked for your current subscription. You can still edit this resume manually.";

  const guardedHandleSave = async () => {
    if (isReadOnlyResume) {
      setUpgradeMessage(lockedResumeMessage);
      showUpgradeModalTrue();
      return false;
    }

    return handleSave();
  };

  // Handle PDF download with subscription and limit validation
  const handleDownloadPDF = async () => {
    if (!user) {
      toast.error("Please login to download your resume", {
        duration: 3000,
      });
      navigate("/login");
      return;
    }

    if (isPaidActionLocked || resumeAccess.canDownload === false) {
      setUpgradeMessage(lockedResumeMessage);
      showUpgradeModalTrue();
      return;
    }

    // Check if subscription is expired
    if (isSubscriptionExpired()) {
      setUpgradeMessage(
        "Your subscription has expired. Please renew or upgrade to download your resume."
      );
      showUpgradeModalTrue();
      return;
    }

    try {
      const response = await resumeAPI.exportPDF({
        resumeId: resumeData?._id,
        resumeData,
        template: selectedTemplate,
      });

      const blob = new Blob([response.data], {type: "application/pdf"});
      const url = URL.createObjectURL(blob);
      const safeName = (resumeData?.name || "Resume")
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName || "Resume"}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Resume download started!", {
        duration: 2000,
      });
    } catch (err) {
      logger.error("Download error:", err);
      logger.error("Download error response:", err.response?.data);

      let errorData = err.response?.data;

      if (errorData instanceof Blob) {
        try {
          errorData = JSON.parse(await errorData.text());
        } catch {
          errorData = {};
        }
      }

      // Check if it's a subscription/upgrade error (403 with upgradeRequired)
      if (err.response?.status === 403) {
        // Show upgrade modal for any 403 error
        setUpgradeMessage(
          errorData.message ||
            errorData.error ||
            "You need an active subscription to download your resume!"
        );
        showUpgradeModalTrue();
      } else {
        toast.error(
          "Failed to download resume: " +
            (errorData?.message || parseValidationErrors(err)),
          {
            duration: 4000,
          }
        );
      }
    }
  };

  // Handle unsaved changes modal actions
  const handleSaveAndNavigate = async () => {
    const wasSaved = await guardedHandleSave();
    if (wasSaved) {
      commitPendingNavigation(navigate);
    }
  };

  const handleDiscardAndNavigate = () => {
    commitPendingNavigation(navigate);
  };

  const handleCancelNavigation = () => {
    cancelPendingNavigation();
  };

  // Handle wizard completion
  const handleWizardComplete = () => {
    setIsWizardModeFalse();
    toast.success("Resume setup complete! You can now edit all sections.", {
      duration: 3000,
    });
  };

  const updateField = (field, value, skipTracking = false) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => ({...prev, [field]: value}));
  };

  const updateContact = (field, value) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => ({
      ...prev,
      contact: {...prev.contact, [field]: value},
    }));
  };

  const updateArrayItem = (
    section,
    index,
    field,
    value,
    skipTracking = false
  ) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray[index] = {...newArray[index], [field]: value};
      return {...prev, [section]: newArray};
    });
  };

  const addArrayItem = (section, template) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), template],
    }));
  };

  const removeArrayItem = (section, index) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const moveItem = (section, fromIndex, toIndex) => {
    if (isReadOnlyResume) return;
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      const [moved] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, moved);
      return {...prev, [section]: newArray};
    });
  };

  // Drag and drop handlers for sections
  const handleDragStart = (e, sectionId) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetSectionId) => {
    e.preventDefault();

    if (draggedSection && draggedSection !== targetSectionId) {
      const newOrder = [...sectionOrder];
      const draggedIndex = newOrder.indexOf(draggedSection);
      const targetIndex = newOrder.indexOf(targetSectionId);

      // Remove dragged item and insert at target position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedSection);

      setSectionOrder(newOrder);

      // Also update resumeData with section order for templates
      setResumeData((prev) => ({
        ...prev,
        sectionOrder: newOrder,
      }));
    }

    setDraggedSection(null);
  };

  // GitHub Import Handler
  const handleGitHubImport = async (importedData) => {
    let updatedResumeData = null;

    setResumeData((prev) => {
      // Create a deep copy to ensure React detects the change
      const updated = JSON.parse(JSON.stringify(prev));

      // Import Profile Data
      if (importedData.profile) {
        updated.contact = {
          ...updated.contact,
          github: importedData.profile.githubUrl,
          location: importedData.profile.location || updated.contact.location,
        };
        if (importedData.profile.bio) {
          updated.summary = importedData.profile.bio;
        }
      }

      // Import Projects
      if (importedData.projects && importedData.projects.length > 0) {
        const githubProjects = importedData.projects.map((repo) => ({
          name: repo.name, // Use 'name' instead of 'title'
          title: repo.name, // Also keep 'title' for compatibility
          description: repo.description || "No description provided",
          technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
          link: repo.url,
          bullets: [`${repo.stars} stars`, `${repo.forks} forks`],
          highlights: [`${repo.stars} stars`, `${repo.forks} forks`],
        }));

        if (importedData.mergeOptions.projects === "replace") {
          updated.projects = githubProjects;
        } else {
          // Add new projects
          updated.projects = [...(updated.projects || []), ...githubProjects];
        }
      }

      // Import Skills
      if (importedData.skills && importedData.skills.length > 0) {
        // Check if skills are categorized (array of objects with category/items)
        const isCategorized =
          Array.isArray(updated.skills) &&
          updated.skills.length > 0 &&
          updated.skills[0]?.category;

        if (importedData.mergeOptions.skills === "replace") {
          // If replacing, convert to same format as existing
          if (isCategorized) {
            updated.skills = [
              {
                category: "GitHub Skills",
                items: importedData.skills,
              },
            ];
          } else {
            updated.skills = importedData.skills;
          }
        } else {
          // Add new skills based on format
          if (isCategorized) {
            // Find or create "GitHub Skills" category
            let githubCategory = updated.skills.find(
              (cat) => cat.category === "GitHub Skills"
            );

            if (githubCategory) {
              // Get existing items in lowercase for comparison
              const existingItems = new Set(
                githubCategory.items.map((item) => item.toLowerCase())
              );
              const newSkills = importedData.skills.filter(
                (skill) => !existingItems.has(skill.toLowerCase())
              );
              githubCategory.items = [...githubCategory.items, ...newSkills];
            } else {
              // Create new category
              updated.skills.push({
                category: "GitHub Skills",
                items: importedData.skills,
              });
            }
          } else {
            // Plain array format
            const existingSkills = new Set(
              (updated.skills || []).map((s) =>
                typeof s === "string"
                  ? s.toLowerCase()
                  : s.name?.toLowerCase() || ""
              )
            );
            const newSkills = importedData.skills.filter(
              (skill) =>
                !existingSkills.has(
                  typeof skill === "string"
                    ? skill.toLowerCase()
                    : skill.name?.toLowerCase() || ""
                )
            );
            updated.skills = [...(updated.skills || []), ...newSkills];
          }
        }
        logger.log("✅ Skills imported:", updated.skills);
      }

      // Import Experience
      if (importedData.experience && importedData.experience.length > 0) {
        const githubExperience = importedData.experience.map((exp) => ({
          company: exp.company,
          title: exp.position, // Map 'position' to 'title'
          position: exp.position,
          location: "",
          startDate: exp.period || "Present",
          endDate: "Present",
          current: true,
          bullets: exp.highlights || [],
          description: exp.description,
        }));

        logger.log("💼 Experience to import:", githubExperience);

        if (importedData.mergeOptions.experience === "replace") {
          updated.experience = githubExperience;
        } else {
          // Add new experience
          updated.experience = [
            ...(updated.experience || []),
            ...githubExperience,
          ];
        }
        logger.log("✅ Experience imported:", updated.experience);
      }

      // Import Certifications/Achievements
      if (
        importedData.certifications &&
        importedData.certifications.length > 0
      ) {
        const githubCertifications = importedData.certifications.map(
          (cert) => ({
            title: cert.title,
            issuer: "GitHub",
            date: cert.date,
            description: cert.description,
          })
        );

        logger.log("🏆 Certifications to import:", githubCertifications);

        if (importedData.mergeOptions.certifications === "replace") {
          updated.certifications = githubCertifications;
        } else {
          // Add new certifications
          updated.certifications = [
            ...(updated.certifications || []),
            ...githubCertifications,
          ];
        }
        logger.log("✅ Certifications imported:", updated.certifications);
      }

      logger.log("🎉 Final updated resume data:", updated);

      // Store the updated data to save later
      updatedResumeData = updated;

      return updated;
    });

    // Close modal
    showGitHubImportModalFalse();

    // Show success message
    setGithubImportSuccessTrue();
    setTimeout(() => setGithubImportSuccessFalse(), 3000);

    // Auto-save with the updated data (wait for state to settle)
    setTimeout(async () => {
      if (updatedResumeData && user) {
        logger.log("💾 Auto-saving imported data...", updatedResumeData);
        const result = await saveResumeAction({
          dataToSave: updatedResumeData,
          showSuccessToast: false,
          requireAuthRedirect: false,
          errorMessagePrefix: "Failed to auto-save imported data: ",
        });

        if (result.ok) {
          logger.log("✅ Resume auto-saved successfully!");
        }
      }
    }, 1000);
  };

  // Reset section order to default
  const handleResetOrder = () => {
    if (
      window.confirm("Reset section order to default? This cannot be undone.")
    ) {
      setSectionOrder(DEFAULT_SECTION_ORDER);
      setResumeData((prev) => ({
        ...prev,
        sectionOrder: DEFAULT_SECTION_ORDER,
      }));
      toast.success("Section order reset to default!", {
        duration: 2000,
      });
    }
  };

  // Enhance all sections with AI
  const handleEnhanceAll = async (customPrompt = "") => {
    const confirmMessage = customPrompt
      ? `Apply AI enhancement with your custom instructions?\n\n"${customPrompt}"\n\nThis will improve your summary, experience bullets, and project descriptions.`
      : "Apply AI enhancement to all sections? This will improve your summary, experience bullets, and project descriptions with action verbs and metrics.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const enhancements = [];
    let successCount = 0;
    let failCount = 0;

    try {
      // Enhance summary
      if (resumeData.summary) {
        const oldSummary = resumeData.summary;
        enhancements.push(
          resumeAPI
            .enhance(oldSummary, "summary", resumeData, customPrompt)
            .then((response) => {
              const enhanced = response.data.enhanced;
              updateField("summary", enhanced);
              successCount++;
              return {section: "summary", success: true};
            })
            .catch((err) => {
              failCount++;
              return {section: "summary", success: false, error: err.message};
            })
        );
      }

      // Enhance experience bullets
      if (resumeData.experience && resumeData.experience.length > 0) {
        resumeData.experience.forEach((exp, index) => {
          if (exp.bullets && exp.bullets.length > 0) {
            const oldBullets = [...exp.bullets];
            enhancements.push(
              resumeAPI
                .enhance(oldBullets, "experience", resumeData, customPrompt)
                .then((response) => {
                  const enhanced = response.data.enhanced;
                  const bullets = Array.isArray(enhanced)
                    ? enhanced
                    : [enhanced];
                  updateArrayItem("experience", index, "bullets", bullets);
                  successCount++;
                  return {section: `experience-${index}`, success: true};
                })
                .catch((err) => {
                  failCount++;
                  return {
                    section: `experience-${index}`,
                    success: false,
                    error: err.message,
                  };
                })
            );
          }
        });
      }

      // Enhance project bullets
      if (resumeData.projects && resumeData.projects.length > 0) {
        resumeData.projects.forEach((project, index) => {
          if (project.bullets && project.bullets.length > 0) {
            const oldBullets = [...project.bullets];
            enhancements.push(
              resumeAPI
                .enhance(oldBullets, "project", resumeData, customPrompt)
                .then((response) => {
                  const enhanced = response.data.enhanced;
                  const bullets = Array.isArray(enhanced)
                    ? enhanced
                    : [enhanced];
                  updateArrayItem("projects", index, "bullets", bullets);
                  successCount++;
                  return {section: `project-${index}`, success: true};
                })
                .catch((err) => {
                  failCount++;
                  return {
                    section: `project-${index}`,
                    success: false,
                    error: err.message,
                  };
                })
            );
          }
        });
      }

      // Wait for all enhancements to complete
      await Promise.all(enhancements);

      if (failCount === 0) {
        toast.success(
          `All sections enhanced successfully! (${successCount} sections improved)`,
          {
            duration: 3000,
          }
        );
      } else {
        // react-hot-toast doesn't have toast.warning, use toast with custom styling
        toast(
          `Enhancement completed with some issues: ${successCount} enhanced, ${failCount} failed`,
          {
            duration: 4000,
            style: {
              background: "#FEF3C7",
              color: "#92400E",
              border: "1px solid #F59E0B",
            },
          }
        );
      }
    } catch (err) {
      toast.error(
        "Enhancement failed: " + (err.response?.data?.error || err.message),
        {
          duration: 4000,
        }
      );
    }
  };

  useEffect(() => {
    if (isWizardMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const id = visible[0].target.getAttribute("data-section-id");
        if (id) setActiveSectionId(id);
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sectionOrder.forEach((sectionId) => {
      const element = sectionElementRefs.current[sectionId];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isWizardMode, sectionOrder]);

  const isTrackableSection = useCallback(
    (sectionId) => Boolean(SECTION_META[sectionId]),
    []
  );

  const {
    trackableSectionIds,
    sectionCompletionMap,
    completedSectionsCount,
    completionPercentage,
    firstIncompleteSectionId,
  } = useSectionCompletion({
    sectionOrder,
    resumeData,
    isTrackableSection,
  });

  useEffect(() => {
    const handleSectionShortcuts = (event) => {
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTypingTarget || isWizardMode) return;

      const hasLegacyChord = event.altKey && event.shiftKey;
      const hasMacChord = event.metaKey && event.shiftKey;
      if (!hasLegacyChord && !hasMacChord) return;

      const key = event.key.toLowerCase();

      if (key === "e") {
        event.preventDefault();
        setForceSectionExpand(true);
      }

      if (key === "c") {
        event.preventDefault();
        setForceSectionExpand(false);
      }

      if (key === "n") {
        event.preventDefault();

        const firstIncompleteSectionId = sectionOrder.find(
          (sectionId) =>
            SECTION_META[sectionId] &&
            !isSectionCompleteForResume(sectionId, resumeData)
        );

        if (!firstIncompleteSectionId) {
          toast.success("All sections look complete.", {
            duration: 2000,
            position: "bottom-right",
          });
          return;
        }

        const element = sectionElementRefs.current[firstIncompleteSectionId];
        if (!element) return;
        element.scrollIntoView({behavior: "smooth", block: "start"});
        setActiveSectionId(firstIncompleteSectionId);
        closeFloatingNav();
      }
    };

    window.addEventListener("keydown", handleSectionShortcuts);
    return () => window.removeEventListener("keydown", handleSectionShortcuts);
  }, [isWizardMode, resumeData, sectionOrder, closeFloatingNav]);
  const availableColorThemes = useMemo(
    () => TEMPLATE_COLOR_THEMES[selectedTemplate] || [],
    [selectedTemplate]
  );
  const activeColorTheme = useMemo(
    () =>
      availableColorThemes.find((theme) => theme.id === resumeData?.colorTheme) ||
      availableColorThemes[0],
    [availableColorThemes, resumeData?.colorTheme]
  );

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Render section based on section ID
  const renderSection = (sectionId) => {
    const sections = {
      combinedScore: (
        <CollapsibleSection
          key="combinedScore"
          sectionId="combinedScore"
          title="ATS Score" // TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE - "& Job Match" removed
          icon={<BarChart3 className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "combinedScore"}
          forceExpanded={forceSectionExpand}
        >
          <div className="space-y-6">
            {/* Overall ATS Score */}
            <div className="-mx-6 -mt-6">
              <ScoreCard resumeData={resumeData} expanded={false} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Job-Specific Score */}
            <div className="-mx-6 -mb-6">
              <JobSpecificScoreCard
                resumeData={resumeData}
                onUpdateField={updateField}
              />
            </div>
          </div>
        </CollapsibleSection>
      ),

      personal: (
        <CollapsibleSection
          key="personal"
          sectionId="personal"
          title="Personal Information"
          icon={<User className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "personal"}
          forceExpanded={forceSectionExpand}
        >
          <div className="space-y-3">
            <input
              type="text"
              value={resumeData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Full Name"
              className="input-field font-semibold text-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                value={resumeData.contact?.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="Email"
                className="input-field"
              />
              <input
                type="tel"
                value={resumeData.contact?.phone || ""}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="Phone"
                className="input-field"
              />
            </div>
            <input
              type="text"
              value={resumeData.contact?.location || ""}
              onChange={(e) => updateContact("location", e.target.value)}
              placeholder="Location"
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="url"
                value={resumeData.contact?.linkedin || ""}
                onChange={(e) => updateContact("linkedin", e.target.value)}
                placeholder="LinkedIn URL"
                className="input-field"
              />
              <input
                type="url"
                value={resumeData.contact?.github || ""}
                onChange={(e) => updateContact("github", e.target.value)}
                placeholder="GitHub URL"
                className="input-field"
              />
            </div>
          </div>
        </CollapsibleSection>
      ),

      summary: (
        <CollapsibleSection
          key="summary"
          sectionId="summary"
          title="Professional Summary"
          icon={<FileText className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "summary"}
          forceExpanded={forceSectionExpand}
        >
          <div className="-m-6">
            <EditableSection
              title=""
              content={resumeData.summary}
              onUpdate={(value) => updateField("summary", value)}
              sectionType="summary"
              resumeData={resumeData}
            />
          </div>
        </CollapsibleSection>
      ),

      recommendations: (
        <CollapsibleSection
          key="recommendations"
          sectionId="recommendations"
          title="Improvement Recommendations"
          icon={<Lightbulb className="w-5 h-5" />}
          defaultExpanded={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "recommendations"}
          forceExpanded={forceSectionExpand}
        >
          <div className="-m-6">
            <RecommendationsPanel
              resumeData={resumeData}
              onEnhanceAll={handleEnhanceAll}
              compact={true}
            />
          </div>
        </CollapsibleSection>
      ),

      skills: (
        <CollapsibleSection
          key="skills"
          sectionId="skills"
          title="Skills"
          icon={<Target className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "skills"}
          forceExpanded={forceSectionExpand}
        >
          <SkillsSection resumeData={resumeData} updateField={updateField} />
        </CollapsibleSection>
      ),

      experience: (
        <CollapsibleSection
          key="experience"
          sectionId="experience"
          title="Experience"
          icon={<BriefcaseBusiness className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "experience"}
          forceExpanded={forceSectionExpand}
        >
          <ExperienceSection
            resumeData={resumeData}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
            moveItem={moveItem}
            updateField={updateField}
          />
        </CollapsibleSection>
      ),

      education: (
        <CollapsibleSection
          key="education"
          sectionId="education"
          title="Education"
          icon={<GraduationCap className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "education"}
          forceExpanded={forceSectionExpand}
        >
          <EducationSection
            resumeData={resumeData}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
            moveItem={moveItem}
          />
        </CollapsibleSection>
      ),

      projects: (
        <CollapsibleSection
          key="projects"
          sectionId="projects"
          title="Projects"
          icon={<Rocket className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "projects"}
          forceExpanded={forceSectionExpand}
        >
          <ProjectsSection
            resumeData={resumeData}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
            moveItem={moveItem}
          />
        </CollapsibleSection>
      ),

      certifications: (
        <CollapsibleSection
          key="certifications"
          sectionId="certifications"
          title="Certifications"
          icon={<ScrollText className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "certifications"}
          forceExpanded={forceSectionExpand}
        >
          <CertificationsSection
            resumeData={resumeData}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
          />
        </CollapsibleSection>
      ),

      achievements: (
        <CollapsibleSection
          key="achievements"
          sectionId="achievements"
          title="Achievements"
          icon={<Trophy className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "achievements"}
          forceExpanded={forceSectionExpand}
        >
          <AchievementsSection
            resumeData={resumeData}
            updateField={updateField}
          />
        </CollapsibleSection>
      ),

      customSections: (
        <CollapsibleSection
          key="customSections"
          sectionId="customSections"
          title="Custom Sections"
          icon={<PenSquare className="w-5 h-5" />}
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "customSections"}
          forceExpanded={forceSectionExpand}
        >
          <CustomSectionsManager
            resumeData={resumeData}
            updateField={updateField}
          />
        </CollapsibleSection>
      ),
    };

    return sections[sectionId] || null;
  };

  const scrollToSection = (sectionId) => {
    const element = sectionElementRefs.current[sectionId];
    if (!element) return;
    element.scrollIntoView({behavior: "smooth", block: "start"});
    setActiveSectionId(sectionId);
    closeFloatingNav();
  };

  const jumpToFirstIncompleteSection = () => {
    if (!firstIncompleteSectionId) {
      toast.success("All sections look complete.", {
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }

    scrollToSection(firstIncompleteSectionId);
  };

  const isExportLocked = isSubscriptionExpired() || isReadOnlyResume;
  const expandAllSections = () => setForceSectionExpand(true);
  const collapseAllSections = () => setForceSectionExpand(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">
            Resume Editor{" "}
            {isWizardMode && (
              <span className="text-base font-normal text-blue-600 dark:text-blue-400">
                (Step-by-Step Mode)
              </span>
            )}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-stretch">
            {/* Switch to Full Editor Button - Only show in wizard mode */}
            {isWizardMode && (
              <button
                onClick={handleWizardComplete}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-blue-600 dark:border-blue-500 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                title="Switch to full editor mode"
              >
                <PenSquare className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  Switch to Full Editor
                </span>
              </button>
            )}
            {/* GitHub Import Button */}
            {/* <button
              onClick={() => showGitHubImportModalTrue()}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-300 text-xs sm:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-all flex items-center justify-center gap-2"
              title="Import from GitHub"
            >
              <span className="hidden sm:inline">💻</span>
              <span className="text-xs sm:text-sm">Import GitHub</span>
            </button> */}
            {/* Reset Order Button - Hide in wizard mode */}
            {!isWizardMode && (
              <button
                onClick={handleResetOrder}
                className="flex-1 sm:flex-none h-12 px-3 sm:px-4 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-300 text-xs sm:text-sm font-semibold hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors flex items-center justify-center gap-1"
                title="Reset section order to default"
              >
                <RotateCcw className="hidden sm:inline w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
            {/* Template Selector Button */}
            <button
              onClick={() => showTemplateSelectorTrue()}
              className="flex-1 sm:flex-none h-12 px-3 sm:px-4 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-300 transition-all flex items-center justify-center gap-1.5"
              title="Change template"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">Change Template</span>
              <span className="sm:hidden whitespace-nowrap">Template</span>
            </button>
            {/* Color Theme Selector Button - Only show for templates with color themes */}
            {availableColorThemes.length > 0 && (
              <div ref={colorDropdownRef} className="relative flex-none z-40">
                <button
                  onClick={toggleColorThemeSelector}
                  className="w-12 h-12 px-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600 transition-all duration-200 flex items-center justify-between gap-2"
                  title="Change color theme"
                  aria-haspopup="listbox"
                  aria-expanded={showColorThemeSelector}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 dark:border-zinc-600 flex-shrink-0"
                      style={{backgroundColor: activeColorTheme?.primary || "#374151"}}
                    />
                  </span>
                  {showColorThemeSelector ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>

                {showColorThemeSelector && (
                  <div className="absolute top-full right-0 mt-1.5 w-44 sm:w-52 max-w-[calc(100vw-1rem)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-40 overflow-hidden">
                    <div className="max-h-56 overflow-auto py-1">
                      {availableColorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setResumeData((prev) => ({
                              ...prev,
                              colorTheme: theme.id,
                            }));
                            showColorThemeSelectorFalse();
                            toast.success(`${theme.name} theme applied!`, {
                              duration: 2000,
                              position: "bottom-right",
                            });
                          }}
                          className={`w-full px-2.5 py-2 text-left flex items-center gap-2.5 transition-colors ${
                            resumeData?.colorTheme === theme.id
                              ? "bg-gray-100 dark:bg-zinc-800"
                              : "hover:bg-gray-50 dark:hover:bg-zinc-800/70"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-zinc-600 flex-shrink-0"
                            style={{backgroundColor: theme.primary}}
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {theme.name}
                            </span>
                            <span className="block text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                              {theme.primary}
                            </span>
                          </span>
                          {resumeData?.colorTheme === theme.id && (
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                              Active
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <MobileActionBar
          showFloatingNav={showFloatingNav}
          onToggleSections={toggleFloatingNav}
          showPreview={showPreview}
          onTogglePreview={togglePreview}
          onSave={guardedHandleSave}
          saving={saving}
          autoSaving={autoSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          onExport={handleDownloadPDF}
          isExportLocked={isExportLocked}
          isWizardMode={isWizardMode}
          completedSectionsCount={completedSectionsCount}
          totalTrackableSections={trackableSectionIds.length}
          completionPercentage={completionPercentage}
          onJumpToFirstIncomplete={jumpToFirstIncompleteSection}
          onExpandAll={expandAllSections}
          onCollapseAll={collapseAllSections}
          trackableSectionIds={trackableSectionIds}
          activeSectionId={activeSectionId}
          sectionCompletionMap={sectionCompletionMap}
          onSelectSection={scrollToSection}
        />

        {/* Compact Floating Action Rail - Desktop Only */}
        <div className="hidden lg:block fixed right-5 top-1/2 -translate-y-1/2 z-50 no-print">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg p-1.5 flex flex-col gap-0.5">

            {/* Preview Toggle */}
            <button
              onClick={togglePreview}
              className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                showPreview
                  ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              {showPreview ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {showPreview ? "Hide preview" : "Show preview"}
              </span>
            </button>

            <div className="h-px bg-gray-200 dark:bg-zinc-700 mx-1.5 my-0.5" />

            {/* Save */}
            <button
              onClick={guardedHandleSave}
              disabled={saving || autoSaving}
              className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                saving || autoSaving
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : hasUnsavedChanges
                    ? "text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              {hasUnsavedChanges && !saving && !autoSaving && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              )}
              {saving || autoSaving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : hasUnsavedChanges ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {saving || autoSaving
                  ? "Saving…"
                  : hasUnsavedChanges
                    ? "Save changes"
                    : "All changes saved"}
              </span>
            </button>

            {/* Export PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isSubscriptionExpired()}
              className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                isSubscriptionExpired()
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
              }`}
            >
              {isSubscriptionExpired() ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isSubscriptionExpired() ? "Subscription required" : "Export as PDF"}
              </span>
            </button>

            {/* GitHub Import */}
            {/* <button
              onClick={() => showGitHubImportModalTrue()}
              className="group relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Import from GitHub
              </span>
            </button> */}

            {/* Scroll to Top — only when scrolled */}
            {showScrollTop && (
              <>
                <div className="h-px bg-gray-200 dark:bg-zinc-700 mx-1.5 my-0.5" />
                <button
                  onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                  className="group relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Back to top
                  </span>
                </button>
              </>
            )}

          </div>
        </div>

        {/* Sticky Mini Score Bar */}
        {atsScore && (
          <div className="sticky top-0 z-20 mb-6 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              {/* Left: score pills */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" /> Resume Score
                  </span>
                </span>
                {/* ATS pill */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor:
                      atsScore.totalScore >= 80
                        ? "#dcfce7" // green-100
                        : atsScore.totalScore >= 60
                          ? "#fef9c3" // yellow-100
                          : "#fee2e2", // red-100
                    color:
                      atsScore.totalScore >= 80
                        ? "#15803d" // green-700
                        : atsScore.totalScore >= 60
                          ? "#854d0e" // yellow-800
                          : "#b91c1c", // red-700
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        atsScore.totalScore >= 80
                          ? "#16a34a"
                          : atsScore.totalScore >= 60
                            ? "#ca8a04"
                            : "#dc2626",
                    }}
                  />
                  ATS {atsScore.totalScore}/100
                </div>
                {/* Mini progress bar — hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${atsScore.totalScore}%`,
                        backgroundColor:
                          atsScore.totalScore >= 80
                            ? "#16a34a"
                            : atsScore.totalScore >= 60
                              ? "#ca8a04"
                              : "#dc2626",
                      }}
                    />
                  </div>
                </div>
                {/* Level label */}
                <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400 truncate">
                  {atsScore.level?.label}
                </span>
              </div>

              {/* Right: CTA button */}
              <button
                onClick={() => setIsAnalysisOpen(true)}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Full Analysis
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}


        {isPaidActionLocked && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Paid actions locked</p>
                  <p className="text-sm opacity-90">{lockedResumeMessage}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Unlock Access
              </button>
            </div>
          </div>
        )}

        {/* Divider with Label */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-full border-2 border-gray-300 dark:border-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <PencilLine className="w-4 h-4" /> Resume Content Editor
              </span>
            </span>
          </div>
        </div>

        {/* Floating Section Navigation - Desktop */}
        {!isWizardMode && (
          <DesktopFloatingSectionNav
            floatingNavContainerRef={floatingNavContainerRef}
            floatingNavOffset={floatingNavOffset}
            showFloatingNav={showFloatingNav}
            onDragStart={handleFloatingNavDragStart}
            onToggleFloatingNav={toggleFloatingNav}
            completionPercentage={completionPercentage}
            onJumpToFirstIncomplete={jumpToFirstIncompleteSection}
            onExpandAll={() => setForceSectionExpand(true)}
            onCollapseAll={() => setForceSectionExpand(false)}
            trackableSectionIds={trackableSectionIds}
            activeSectionId={activeSectionId}
            sectionCompletionMap={sectionCompletionMap}
            onSelectSection={scrollToSection}
          />
        )}

        {/* Conditional: Show Wizard for New Resumes, Normal Editor for Existing */}
        {isWizardMode ? (
          // Step-by-Step Wizard for New Resumes
          <div
            className={`grid ${
              showPreview ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
            } gap-4 sm:gap-6`}
          >
            <div className="order-2 xl:order-1">
              <ResumeWizard
                resumeData={resumeData}
                updateField={updateField}
                updateContact={updateContact}
                addArrayItem={addArrayItem}
                updateArrayItem={updateArrayItem}
                removeArrayItem={removeArrayItem}
                moveItem={moveItem}
                onComplete={handleWizardComplete}
              />
            </div>

            {/* Preview Panel for Wizard */}
            {showPreview && (
              <div
                ref={previewSectionRef}
                className="xl:sticky xl:top-2 xl:h-[calc(100vh-3rem)] xl:overflow-auto order-1 xl:order-2"
              >
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                  <ResumePreview
                    ref={resumePreviewRef}
                    resumeData={resumeData}
                    template={selectedTemplate}
                    onDownload={handleDownloadPDF}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Normal Editor for Existing Resumes
          <div
            className={`grid ${
              showPreview ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
            } gap-4 sm:gap-6`}
          >
            {/* Editor Panel - Dynamic Sections */}
            <div
              className={`space-y-4 sm:space-y-6 order-2 xl:order-1 ${
                isReadOnlyResume ? "pointer-events-none opacity-75" : ""
              }`}
            >
              {sectionOrder.map((sectionId) => (
                <div
                  key={sectionId}
                  data-section-id={sectionId}
                  ref={(el) => {
                    if (el) sectionElementRefs.current[sectionId] = el;
                  }}
                  className="scroll-mt-28"
                >
                  {renderSection(sectionId)}
                </div>
              ))}
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div
                ref={previewSectionRef}
                className="xl:sticky xl:top-2 xl:h-[calc(100vh-3rem)] xl:overflow-auto order-1 xl:order-2"
              >
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                  {/* Stylish Header */}
                  <div className="flex justify-between items-center mb-4 xl:hidden">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>Resume Preview</span>
                    </h3>
                    <button
                      onClick={setShowPreviewFalse}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <ResumePreview
                    ref={resumePreviewRef}
                    resumeData={resumeData}
                    template={selectedTemplate}
                    onDownload={handleDownloadPDF}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <TemplateSelectorModal
          isOpen={showTemplateSelector}
          onClose={showTemplateSelectorFalse}
          templates={TEMPLATES}
          resumeData={resumeData}
          selectedTemplate={selectedTemplate}
          onApplyTemplate={setSelectedTemplate}
        />

        {/* Analysis Drawer */}
        {isAnalysisOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={() => setIsAnalysisOpen(false)}
            />
            {/* Slide-in panel from right */}
            <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-zinc-950 z-50 shadow-2xl flex flex-col overflow-hidden">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resume Analysis & Scoring
                </h2>
                <button
                  onClick={() => setIsAnalysisOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Drawer scrollable content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-zinc-900">
                {/* ATS Score + Job Match side by side */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
                    <ScoreCard resumeData={resumeData} expanded={false} />
                  </div>
                  <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
                    <JobSpecificScoreCard
                      resumeData={resumeData}
                      onUpdateField={updateField}
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div className="p-4 sm:p-6">
                    <details>
                      <summary className="list-none cursor-pointer">
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Improvement Recommendations
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                            Expand
                          </span>
                        </div>
                      </summary>
                      <div className="mt-4">
                        <RecommendationsPanel
                          resumeData={resumeData}
                          onEnhanceAll={handleEnhanceAll}
                          compact={true}
                        />
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* GitHub Import Modal */}
        <GitHubImportModal
          isOpen={showGitHubImportModal}
          onClose={() => showGitHubImportModalFalse()}
          onImport={handleGitHubImport}
          currentResume={resumeData}
        />

        {/* GitHub Import Success Notification */}
        {githubImportSuccess && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="bg-green-600 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="font-bold">Successfully Updated!</p>
                <p className="text-sm text-green-100">
                  GitHub data added to your resume
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Modal */}
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCancelNavigation}
              />

              {/* Modal */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Unsaved Changes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have unsaved changes to your resume. What would you like
                    to do?
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleSaveAndNavigate}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={handleDiscardAndNavigate}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Discard Changes
                  </button>

                  <button
                    onClick={handleCancelNavigation}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradeRequiredModal
            isOpen={showUpgradeModal}
            onClose={() => showUpgradeModalFalse()}
            message={upgradeMessage}
            title="Upgrade Required"
            feature="AI-Powered Features"
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
