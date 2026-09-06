import { memo, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { resumeAPI } from "@/api/api";
import { careerAPI } from "@/api";
import { parseValidationErrors } from "@/utils/errorHandler";
import logger from "@/utils/logger";
import toast from "react-hot-toast";
import { CheckCircle2, Lock, PencilLine, Eye } from "lucide-react";
import {
  ResumePreview,
  ResumeWizard,
  TemplateSelectorModal,
  EditorHeader,
} from "@/components/editor";
import SEO from "@/components/common/SEO";
import { GitHubImportModal } from "@/components/common/modals";
import UpgradeRequiredModal from "@/components/common/modals/UpgradeRequiredModal";
import { calculateResumeScore } from "@/utils/resumeScoring";
import { TEMPLATES, TEMPLATE_COLOR_THEMES } from "@/components/editor/templateConfig";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_META,
} from "@/components/editor/constants/editorConstants";
import MobileActionBar from "@/components/editor/navigation/MobileActionBar";
import DesktopFloatingSectionNav from "@/components/editor/navigation/DesktopFloatingSectionNav";
import EditorFloatingActionRail from "@/components/editor/navigation/EditorFloatingActionRail";
import EditorMiniScoreBar from "@/components/editor/navigation/EditorMiniScoreBar";
import AnalysisDrawer from "@/components/editor/panels/AnalysisDrawer";
import UnsavedChangesModal from "@/components/editor/modals/UnsavedChangesModal";
import EditorSectionRenderer from "@/components/editor/sections/EditorSectionRenderer";
import useResumeDataOperations from "@/components/editor/hooks/useResumeDataOperations";
import { mergeGitHubImportData } from "@/components/editor/utils/githubResumeImporter";
import { normalizeResumeData } from "@/components/editor/utils/resumeInitializer";

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const resumePreviewRef = useRef(null);
  const previewSectionRef = useRef(null);
  const colorDropdownRef = useRef(null);
  const sectionElementRefs = useRef({});

  // Helper function to check if subscription is expired
  const isSubscriptionExpired = () => {
    if (!user || !user.subscription) return false;
    const { status, endDate, tier } = user.subscription;
    if (tier === "free") return false;
    if (status === "expired") return true;
    if (endDate && new Date(endDate) < new Date()) return true;
    return false;
  };

  const [resumeData, setResumeData] = useState(null);
  const [aiUpdatedSection, setAiUpdatedSection] = useState(null);
  const [aiAddedMessage, setAiAddedMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [originalResumeData, setOriginalResumeData] = useState(null);
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

  // Older saved resumes predate the layout section. Add it once and keep it at
  // the top so styling controls are available before content editing.
  useEffect(() => {
    if (!sectionOrder.includes("layout") || sectionOrder[0] !== "layout") {
      setSectionOrder((currentOrder) => [
        "layout",
        ...currentOrder.filter((section) => section !== "layout"),
      ]);
    }
  }, [sectionOrder, setSectionOrder]);

  const [activeSectionId, setActiveSectionId] = useState(
    DEFAULT_SECTION_ORDER[0]
  );
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
  } = useFloatingSectionNav({ isWizardMode });
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
    window.addEventListener("scroll", onScroll, { passive: true });
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
      const stateData = location.state?.resumeData;
      const isNewResume = location.state?.isNewResume || false;

      if (stateData) {
        if (isNewResume) {
          setIsWizardModeTrue();
        } else {
          setIsWizardModeFalse();
        }

        if (isNewResume && !isMobile) {
          setShowPreviewTrue();
        }

        initializeResumeData(stateData);

        if (stateData._id) {
          localStorage.setItem("currentResumeId", stateData._id);
        }
        return;
      }

      const savedResumeId = localStorage.getItem("currentResumeId");

      if (savedResumeId && user) {
        try {
          const response = await resumeAPI.getById(savedResumeId);
          const loadedData = response.data;
          setIsWizardModeFalse();
          initializeResumeData(loadedData);
        } catch (err) {
          logger.error("❌ Error loading resume:", err);
          localStorage.removeItem("currentResumeId");
          navigate("/upload");
        }
      } else {
        navigate("/upload");
      }
    };

    const initializeResumeData = (data) => {
      const normalized = normalizeResumeData(data);
      setResumeData(normalized);
      setOriginalResumeData(JSON.parse(JSON.stringify(normalized)));
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

  // Extracted encapsulated data operations
  const {
    updateField,
    updateContact,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    moveItem,
  } = useResumeDataOperations({ setResumeData, isReadOnlyResume });

  const guardedHandleSave = async () => {
    if (isReadOnlyResume) {
      setUpgradeMessage(lockedResumeMessage);
      showUpgradeModalTrue();
      return false;
    }
    return handleSave();
  };

  const handleDownloadPDF = async () => {
    if (!user) {
      toast.error("Please login to download your resume", { duration: 3000 });
      navigate("/login");
      return;
    }

    if (isPaidActionLocked || resumeAccess.canDownload === false) {
      setUpgradeMessage(lockedResumeMessage);
      showUpgradeModalTrue();
      return;
    }

    if (isSubscriptionExpired()) {
      setUpgradeMessage(
        "Your subscription has expired. Please renew or upgrade to download your resume."
      );
      showUpgradeModalTrue();
      return;
    }

    try {
      await resumeAPI.trackDownload(resumeData?._id);
      if (resumePreviewRef.current) {
        resumePreviewRef.current.downloadPDF();
        toast.success("Resume download started!", { duration: 2000 });
      } else {
        toast.error("Could not trigger browser print. Please try again.");
      }
    } catch (err) {
      logger.error("Download tracking error:", err);
      let errorData = err.response?.data;

      if (errorData instanceof Blob) {
        try {
          errorData = JSON.parse(await errorData.text());
        } catch {
          errorData = {};
        }
      }

      if (err.response?.status === 403) {
        setUpgradeMessage(
          errorData.message ||
            errorData.error ||
            "You need an active subscription to download your resume!"
        );
        showUpgradeModalTrue();
      } else {
        if (resumePreviewRef.current) {
          resumePreviewRef.current.downloadPDF();
        } else {
          toast.error(
            "Failed to download resume: " +
              (errorData?.message || parseValidationErrors(err)),
            { duration: 4000 }
          );
        }
      }
    }
  };

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

  const handleWizardComplete = () => {
    setIsWizardModeFalse();
    toast.success("Resume setup complete! You can now edit all sections.", {
      duration: 3000,
    });
  };

  // AI suggestions application handler
  const handleApplyAiSuggestion = async (suggestion) => {
    if (isReadOnlyResume) return false;

    if (suggestion.section === "contact") {
      setResumeData((prev) => ({
        ...prev,
        contact: { ...(prev.contact || {}), ...suggestion.value },
      }));
    } else if (suggestion.section === "name") {
      updateField("name", suggestion.value);
    } else if (suggestion.section === "summary") {
      updateField("summary", suggestion.value);
    } else if (suggestion.section === "skills") {
      updateField("skills", suggestion.value);
    } else if (suggestion.fieldPatch) {
      setResumeData((prev) => {
        const items = [...(prev[suggestion.section] || [])];
        items[suggestion.index] = { ...items[suggestion.index], ...suggestion.value };
        return { ...prev, [suggestion.section]: items };
      });
    } else if (
      ["experience", "education", "projects"].includes(suggestion.section) &&
      suggestion.isStarter
    ) {
      addArrayItem(suggestion.section, suggestion.value);
    } else if (["experience", "projects"].includes(suggestion.section)) {
      updateArrayItem(suggestion.section, suggestion.index, "bullets", suggestion.value);
    } else {
      return false;
    }

    const targetSection = suggestion.targetSection || suggestion.section;
    setAiUpdatedSection(targetSection);
    setAiAddedMessage(`${suggestion.label} added`);
    setTimeout(() => {
      sectionElementRefs.current[targetSection]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
    setTimeout(() => {
      setAiUpdatedSection(null);
      setAiAddedMessage("");
    }, 1800);
    return true;
  };

  // Drag and drop handlers for section reordering
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

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedSection);

      setSectionOrder(newOrder);
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
      const updated = mergeGitHubImportData(prev, importedData);
      updatedResumeData = updated;
      return updated;
    });

    showGitHubImportModalFalse();
    setGithubImportSuccessTrue();
    setTimeout(() => setGithubImportSuccessFalse(), 3000);

    setTimeout(async () => {
      if (updatedResumeData && user) {
        logger.log("💾 Auto-saving imported data...", updatedResumeData);
        await saveResumeAction({
          dataToSave: updatedResumeData,
          showSuccessToast: false,
          requireAuthRedirect: false,
          errorMessagePrefix: "Failed to auto-save imported data: ",
        });
      }
    }, 1000);
  };

  // Reset section order to default
  const handleResetOrder = () => {
    if (window.confirm("Reset section order to default? This cannot be undone.")) {
      setSectionOrder(DEFAULT_SECTION_ORDER);
      setResumeData((prev) => ({
        ...prev,
        sectionOrder: DEFAULT_SECTION_ORDER,
      }));
      toast.success("Section order reset to default!", { duration: 2000 });
    }
  };

  // Import from Career Profile master data
  const handleImportFromCareerProfile = async () => {
    try {
      const toastId = toast.loading("Fetching Career Profile data...");
      const res = await careerAPI.getExportResumeFormat();
      if (!res.data?.resumeData) {
        toast.dismiss(toastId);
        toast.error("No Career Profile data found. Please set up your Career Profile first.");
        return;
      }
      const imported = res.data.resumeData;
      setResumeData((prev) => ({
        ...prev,
        name: imported.name || prev?.name,
        contact: { ...prev?.contact, ...imported.contact },
        summary: imported.summary || prev?.summary,
        skills: imported.skills?.length > 0 ? imported.skills : prev?.skills,
        experience: imported.experience?.length > 0 ? imported.experience : prev?.experience,
        education: imported.education?.length > 0 ? imported.education : prev?.education,
        projects: imported.projects?.length > 0 ? imported.projects : prev?.projects,
        certifications: imported.certifications?.length > 0 ? imported.certifications : prev?.certifications,
        achievements: imported.achievements?.length > 0 ? imported.achievements : prev?.achievements,
      }));
      toast.dismiss(toastId);
      toast.success("Resume populated from your master Career Profile! ✨");
    } catch (err) {
      toast.error("Failed to load Career Profile data");
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
    (sectionId) => sectionId !== "layout" && Boolean(SECTION_META[sectionId]),
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
            sectionId !== "layout" &&
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
        element.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const scrollToSection = (sectionId) => {
    const element = sectionElementRefs.current[sectionId];
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleGoBack = () => {
    if (!hasUnsavedChanges || window.confirm("You have unsaved resume changes. Leave anyway?")) {
      navigate("/my-resumes");
    }
  };

  const isExportLocked = isSubscriptionExpired() || isReadOnlyResume;
  const expandAllSections = () => setForceSectionExpand(true);
  const collapseAllSections = () => setForceSectionExpand(false);

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:zinc-100 flex flex-col font-sans transition-colors duration-200 xl:h-screen xl:overflow-hidden">
      <SEO
        title={`Editing: ${resumeData.resumeTitle || resumeData.name || "Resume"} | SmartNShine`}
        description="Craft, tailor, and design your ATS-optimized resume with AI assistance and live preview."
        noindex={true}
      />

      {/* Standalone Fullscreen Header */}
      <EditorHeader
        onGoBack={handleGoBack}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        autoSaving={autoSaving}
        isWizardMode={isWizardMode}
        onSwitchToFullEditor={handleWizardComplete}
        onImportCareerProfile={handleImportFromCareerProfile}
        onResetOrder={handleResetOrder}
        onShowTemplateSelector={showTemplateSelectorTrue}
        colorDropdownRef={colorDropdownRef}
        showColorThemeSelector={showColorThemeSelector}
        onToggleColorThemeSelector={toggleColorThemeSelector}
        availableColorThemes={availableColorThemes}
        activeColorTheme={activeColorTheme}
        onSelectColorTheme={(theme) => {
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
        onSave={guardedHandleSave}
        onExport={handleDownloadPDF}
        isExportLocked={isExportLocked}
        showPreview={showPreview}
        onTogglePreview={togglePreview}
      />

      <div className="flex-1 w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1700px] mx-auto xl:min-h-0 xl:overflow-hidden">
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
        <EditorFloatingActionRail
          showPreview={showPreview}
          togglePreview={togglePreview}
          guardedHandleSave={guardedHandleSave}
          saving={saving}
          autoSaving={autoSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          handleDownloadPDF={handleDownloadPDF}
          isSubscriptionExpired={isSubscriptionExpired}
          showScrollTop={showScrollTop}
        />

        {/* Sticky Mini Score Bar */}
        <EditorMiniScoreBar
          atsScore={atsScore}
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
        />

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
        <div className="relative mb-5 sm:mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-zinc-700 shadow-xs">
              <span className="inline-flex items-center gap-1.5">
                <PencilLine className="w-3.5 h-3.5 text-blue-600" /> Resume Content Editor
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
            onExpandAll={expandAllSections}
            onCollapseAll={collapseAllSections}
            trackableSectionIds={trackableSectionIds}
            activeSectionId={activeSectionId}
            sectionCompletionMap={sectionCompletionMap}
            onSelectSection={scrollToSection}
          />
        )}

        {/* Conditional: Wizard vs Normal Editor */}
        {isWizardMode ? (
          <div
            className={`grid ${
              showPreview ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1"
            } min-w-0 max-w-full gap-4 sm:gap-6 xl:h-[calc(100vh-15rem)]`}
          >
            <div className={`min-w-0 max-w-full order-2 xl:order-1 ${showPreview ? "xl:col-span-5" : ""} xl:h-full xl:overflow-y-auto xl:overscroll-contain xl:pr-2`}>
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

            {showPreview && (
              <div
                ref={previewSectionRef}
                className="order-1 min-w-0 max-w-full xl:order-2 xl:col-span-7 xl:h-full xl:flex xl:flex-col xl:overflow-hidden"
              >
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-3.5 sm:p-5 xl:h-full xl:flex xl:flex-col xl:overflow-hidden shadow-xs">
                  <div className="xl:flex-1 xl:min-h-0 xl:overflow-hidden flex flex-col h-full">
                    <ResumePreview
                      ref={resumePreviewRef}
                      resumeData={resumeData}
                      template={selectedTemplate}
                      onDownload={handleDownloadPDF}
                      onUpdateField={updateField}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`grid ${
              showPreview ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1"
            } min-w-0 max-w-full gap-4 sm:gap-6 xl:h-[calc(100vh-15rem)]`}
          >
            {/* Editor Panel - Dynamic Sections */}
            <div
              className={`min-w-0 max-w-full space-y-3 order-2 xl:order-1 ${
                showPreview ? "xl:col-span-5" : ""
              } xl:h-full xl:overflow-y-auto xl:overscroll-contain xl:pr-2 scrollbar-thin ${
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
                  className={`relative scroll-mt-28 ${
                    aiUpdatedSection === sectionId ? "animate-ai-section-added" : ""
                  }`}
                >
                  {aiUpdatedSection === sectionId && (
                    <div className="ai-added-float" role="status">
                      <CheckCircle2 className="w-4 h-4" /> {aiAddedMessage}
                    </div>
                  )}
                  <EditorSectionRenderer
                    sectionId={sectionId}
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    updateField={updateField}
                    updateContact={updateContact}
                    addArrayItem={addArrayItem}
                    updateArrayItem={updateArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveItem={moveItem}
                    draggedSection={draggedSection}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    forceSectionExpand={forceSectionExpand}
                    handleApplyAiSuggestion={handleApplyAiSuggestion}
                    aiSuggestions={aiSuggestions}
                    setAiSuggestions={setAiSuggestions}
                  />
                </div>
              ))}
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div
                ref={previewSectionRef}
                className="order-1 min-w-0 max-w-full xl:order-2 xl:col-span-7 xl:h-full xl:flex xl:flex-col xl:overflow-hidden"
              >
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-3.5 sm:p-5 xl:h-full xl:flex xl:flex-col xl:overflow-hidden shadow-xs">
                  {/* Mobile Preview Header */}
                  <div className="flex justify-between items-center mb-3 xl:hidden">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Resume Preview</span>
                    </h3>
                    <button
                      onClick={setShowPreviewFalse}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="xl:flex-1 xl:min-h-0 xl:overflow-hidden flex flex-col h-full">
                    <ResumePreview
                      ref={resumePreviewRef}
                      resumeData={resumeData}
                      template={selectedTemplate}
                      onDownload={handleDownloadPDF}
                      onUpdateField={updateField}
                    />
                  </div>
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

        {/* Slide-in Analysis Drawer */}
        <AnalysisDrawer
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          resumeData={resumeData}
          updateField={updateField}
          handleApplyAiSuggestion={handleApplyAiSuggestion}
          aiSuggestions={aiSuggestions}
          setAiSuggestions={setAiSuggestions}
        />

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
            <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-bold text-sm">Successfully Updated!</p>
                <p className="text-xs text-green-100">
                  GitHub data added to your resume
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Confirmation Modal */}
        <UnsavedChangesModal
          isOpen={showUnsavedModal}
          saving={saving}
          onSaveAndNavigate={handleSaveAndNavigate}
          onDiscardAndNavigate={handleDiscardAndNavigate}
          onCancelNavigation={handleCancelNavigation}
        />

        {/* Hidden ResumePreview instance for printing when preview panel is closed */}
        {!showPreview && (
          <div className="absolute pointer-events-none invisible -left-[9999px] w-0 h-0 overflow-hidden" aria-hidden="true">
            <ResumePreview
              ref={resumePreviewRef}
              resumeData={resumeData}
              template={selectedTemplate}
              onDownload={handleDownloadPDF}
              onUpdateField={updateField}
            />
          </div>
        )}

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
