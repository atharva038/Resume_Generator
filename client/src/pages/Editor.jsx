import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useNavigationBlocker} from "../context/NavigationBlockerContext";
import {resumeAPI} from "../services/api";
import {parseValidationErrors} from "../utils/errorHandler";
import toast, {Toaster} from "react-hot-toast";
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
} from "../components/editor";
import {ScoreCard, JobSpecificScoreCard} from "../components/common/cards";
import {GitHubImportModal} from "../components/common/modals";
import {getJobCategories, getJobsByCategory} from "../utils/jobProfiles";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ProfessionalV2Template from "../components/templates/ProfessionalV2Template";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import TechTemplate from "../components/templates/TechTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";
import AcademicTemplate from "../components/templates/AcademicTemplate";
import CorporateEliteTemplate from "../components/templates/CorporateEliteTemplate";
import StrategicLeaderTemplate from "../components/templates/StrategicLeaderTemplate";
import ImpactProTemplate from "../components/templates/ImpactProTemplate";

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

// Template configurations
const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    category: "Professional",
    emoji: "📋",
    atsScore: 95,
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    category: "Professional",
    emoji: "🎨",
    atsScore: 92,
  },
  {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    category: "Professional",
    emoji: "✨",
    atsScore: 98,
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
    category: "Professional",
    emoji: "💼",
    atsScore: 94,
  },
  {
    id: "professional-v2",
    name: "Professional V2",
    component: ProfessionalV2Template,
    category: "Professional",
    emoji: "📄",
    atsScore: 96,
  },
  {
    id: "executive",
    name: "Executive",
    component: ExecutiveTemplate,
    category: "Leadership",
    emoji: "👔",
    atsScore: 96,
  },
  {
    id: "tech",
    name: "Tech Developer",
    component: TechTemplate,
    category: "Tech",
    emoji: "💻",
    atsScore: 93,
  },
  {
    id: "creative",
    name: "Creative Designer",
    component: CreativeTemplate,
    category: "Creative",
    emoji: "🎨",
    atsScore: 88,
  },
  {
    id: "academic",
    name: "Academic Research",
    component: AcademicTemplate,
    category: "Academic",
    emoji: "🎓",
    atsScore: 97,
  },
  {
    id: "corporate-elite",
    name: "Corporate Elite",
    component: CorporateEliteTemplate,
    category: "Professional",
    emoji: "🏢",
    atsScore: 99,
  },
  {
    id: "strategic-leader",
    name: "Strategic Leader",
    component: StrategicLeaderTemplate,
    category: "Leadership",
    emoji: "🎯",
    atsScore: 97,
  },
  {
    id: "impact-pro",
    name: "Impact Pro",
    component: ImpactProTemplate,
    category: "Professional",
    emoji: "⚡",
    atsScore: 98,
  },
];

// Color theme configurations for templates that support multiple themes
const TEMPLATE_COLOR_THEMES = {
  classic: [
    {id: "navy", name: "Navy Blue", primary: "#0066cc", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#8b1a1a", emoji: "🍷"},
    {id: "forest", name: "Forest Green", primary: "#1b5e20", emoji: "🌲"},
    {id: "charcoal", name: "Charcoal", primary: "#2d3748", emoji: "⚫"},
  ],
  modern: [
    {id: "blue", name: "Blue", primary: "#2563eb", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7c3aed", emoji: "💜"},
    {id: "teal", name: "Teal", primary: "#0d9488", emoji: "🌊"},
    {id: "orange", name: "Orange", primary: "#ea580c", emoji: "🧡"},
  ],
  minimal: [
    {id: "charcoal", name: "Charcoal", primary: "#2d3748", emoji: "⚫"},
    {id: "navy", name: "Navy", primary: "#1e40af", emoji: "💼"},
    {id: "slate", name: "Slate", primary: "#475569", emoji: "🌑"},
    {id: "graphite", name: "Graphite", primary: "#18181b", emoji: "⬛"},
  ],
  professional: [
    {id: "navy", name: "Navy Blue", primary: "#1e3a8a", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#881337", emoji: "🍷"},
    {id: "forest", name: "Forest Green", primary: "#065f46", emoji: "🌲"},
    {id: "gray", name: "Gray", primary: "#374151", emoji: "⚪"},
  ],
  "professional-v2": [
    {id: "blue", name: "Blue", primary: "#1d4ed8", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7e22ce", emoji: "💜"},
    {id: "teal", name: "Teal", primary: "#0f766e", emoji: "🌊"},
    {id: "burgundy", name: "Burgundy", primary: "#9f1239", emoji: "🍷"},
  ],
  executive: [
    {id: "navy", name: "Navy Blue", primary: "#1e40af", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#7f1d1d", emoji: "🍷"},
    {id: "charcoal", name: "Charcoal", primary: "#1f2937", emoji: "⚫"},
    {id: "forest", name: "Forest Green", primary: "#14532d", emoji: "🌲"},
  ],
  tech: [
    {id: "blue", name: "Tech Blue", primary: "#1e3a8a", emoji: "💻"},
    {id: "purple", name: "Purple", primary: "#6d28d9", emoji: "🔮"},
    {id: "teal", name: "Teal", primary: "#0e7490", emoji: "🌊"},
    {id: "green", name: "Green", primary: "#047857", emoji: "💚"},
  ],
  creative: [
    {id: "purple", name: "Purple", primary: "#a21caf", emoji: "💜"},
    {id: "orange", name: "Orange", primary: "#ea580c", emoji: "🧡"},
    {id: "pink", name: "Pink", primary: "#db2777", emoji: "💗"},
    {id: "teal", name: "Teal", primary: "#0891b2", emoji: "🌊"},
  ],
  academic: [
    {id: "navy", name: "Navy Blue", primary: "#1e3a8a", emoji: "📘"},
    {id: "burgundy", name: "Burgundy", primary: "#881337", emoji: "📕"},
    {id: "forest", name: "Forest Green", primary: "#065f46", emoji: "📗"},
    {id: "charcoal", name: "Charcoal", primary: "#1f2937", emoji: "📓"},
  ],
  "corporate-elite": [
    {id: "navy", name: "Navy Blue", primary: "#1e3a5f", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#7c2d41", emoji: "🍷"},
    {id: "forest", name: "Forest Green", primary: "#1e5f4d", emoji: "🌲"},
    {id: "charcoal", name: "Charcoal", primary: "#2d3748", emoji: "⚫"},
  ],
  "strategic-leader": [
    {id: "teal", name: "Teal", primary: "#0d7377", emoji: "🌊"},
    {id: "purple", name: "Purple", primary: "#6b46c1", emoji: "🔮"},
    {id: "burgundy", name: "Burgundy", primary: "#9b2c2c", emoji: "🍷"},
    {id: "navy", name: "Navy Blue", primary: "#2c5282", emoji: "💼"},
  ],
  "impact-pro": [
    {id: "emerald", name: "Emerald", primary: "#047857", emoji: "💚"},
    {id: "blue", name: "Blue", primary: "#1e40af", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7e22ce", emoji: "💜"},
    {id: "orange", name: "Orange", primary: "#c2410c", emoji: "🧡"},
  ],
};

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const {blockNavigation, unblockNavigation} = useNavigationBlocker();
  const resumePreviewRef = useRef(null);
  const previewSectionRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [originalResumeData, setOriginalResumeData] = useState(null); // Track original data
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Load template from localStorage (set by Templates page) or default to "classic"
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return savedTemplate || "classic";
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showColorThemeSelector, setShowColorThemeSelector] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(() => {
    // Load section order from localStorage or use default
    const saved = localStorage.getItem("resumeSectionOrder");
    return saved ? JSON.parse(saved) : DEFAULT_SECTION_ORDER;
  });
  const [draggedSection, setDraggedSection] = useState(null);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(() => {
    // Load analysis section state from localStorage or default to true
    const saved = localStorage.getItem("analysisExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showGitHubImportModal, setShowGitHubImportModal] = useState(false);
  const [githubImportSuccess, setGithubImportSuccess] = useState(false);

  // Save analysis section state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "analysisExpanded",
      JSON.stringify(isAnalysisExpanded)
    );
  }, [isAnalysisExpanded]);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Setup navigation blocker when there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      blockNavigation((to) => {
        // Show modal and store pending navigation
        setShowUnsavedModal(true);
        setPendingNavigation(to);
        return false; // Block navigation
      });
    } else {
      unblockNavigation();
    }

    return () => {
      unblockNavigation();
    };
  }, [hasUnsavedChanges, blockNavigation, unblockNavigation]);

  // Track unsaved changes
  useEffect(() => {
    if (!resumeData || !originalResumeData) return;

    const hasChanges =
      JSON.stringify(resumeData) !== JSON.stringify(originalResumeData);
    setHasUnsavedChanges(hasChanges);
  }, [resumeData, originalResumeData]);

  // Auto-save functionality
  useEffect(() => {
    // Don't auto-save if:
    // - No unsaved changes
    // - No resume ID (new resume not saved yet)
    // - Currently saving manually
    // - Already auto-saving
    if (
      !hasUnsavedChanges ||
      !resumeData?._id ||
      saving ||
      autoSaving ||
      !user
    ) {
      return;
    }

    // Set up auto-save timer (30 seconds after last change)
    const autoSaveTimer = setTimeout(async () => {
      console.log("🔄 Auto-saving resume...");
      setAutoSaving(true);

      try {
        const response = await resumeAPI.update(resumeData._id, resumeData);
        const savedResume = response.data;

        // Update state with saved data
        setResumeData(savedResume);
        setOriginalResumeData(JSON.parse(JSON.stringify(savedResume)));
        setHasUnsavedChanges(false);

        // Show success toast
        toast.success("Auto-saved ✓", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#10b981",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
          },
          icon: "💾",
        });

        console.log("✅ Auto-save successful");
      } catch (error) {
        console.error("❌ Auto-save failed:", error);
        // Don't show error toast for auto-save failures to avoid annoying users
        // They can still manually save if needed
      } finally {
        setAutoSaving(false);
      }
    }, 30000); // 30 seconds

    // Cleanup timer on unmount or when dependencies change
    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [hasUnsavedChanges, resumeData, saving, autoSaving, user]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercept navigation attempts
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = (e) => {
      if (hasUnsavedChanges) {
        // Store the current state before showing modal
        const currentPath = window.location.pathname;

        setShowUnsavedModal(true);
        setPendingNavigation("back");

        // Push a new state to prevent navigation
        window.history.pushState(
          {preventNav: true, originalPath: currentPath},
          "",
          currentPath
        );
      }
    };

    // Add initial state to enable back button interception
    if (!window.history.state?.preventNav) {
      window.history.pushState(
        {preventNav: false},
        "",
        window.location.pathname
      );
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  // Load resume data on mount
  useEffect(() => {
    const loadResumeData = async () => {
      console.log("🚀 Starting resume data load...");
      console.log("📍 Location state:", location.state);
      console.log("👤 User:", user);

      // First, try to get data from location state (when navigating from upload)
      const stateData = location.state?.resumeData;

      if (stateData) {
        console.log("✅ Found data in location state");
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
      console.log("💾 Saved resume ID:", savedResumeId);

      if (savedResumeId && user) {
        // Fetch the resume from the database
        try {
          console.log("📥 Fetching resume from database...");
          const response = await resumeAPI.getById(savedResumeId);
          const loadedData = response.data;
          console.log("✅ Resume loaded from database:", loadedData);
          initializeResumeData(loadedData);
        } catch (err) {
          console.error("❌ Error loading resume:", err);
          // If error loading, clear the saved ID and redirect to upload
          localStorage.removeItem("currentResumeId");
          navigate("/upload");
        }
      } else {
        console.log("⚠️ No data available, redirecting to upload");
        // No data available, redirect to upload
        navigate("/upload");
      }
    };

    const initializeResumeData = (data) => {
      console.log("🔍 Initializing resume data:", data);

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

      console.log("✅ Resume data initialized:", data);
      setResumeData(data);
      // Store a deep copy as original data for change detection
      setOriginalResumeData(JSON.parse(JSON.stringify(data)));
    };

    loadResumeData();
  }, [location, navigate, user]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save your resume", {
        icon: "🔒",
        duration: 3000,
      });
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      let savedResume;
      if (resumeData._id) {
        // Update existing resume
        const response = await resumeAPI.update(resumeData._id, resumeData);
        savedResume = response.data;
        toast.success("Resume updated successfully!", {
          icon: "✅",
          duration: 2500,
        });
      } else {
        // Save new resume
        const response = await resumeAPI.save(resumeData);
        savedResume = response.data;
        toast.success("Resume saved successfully!", {
          icon: "💾",
          duration: 2500,
        });
      }

      // Update the resumeData with the saved version (includes _id if it's new)
      if (savedResume && savedResume._id) {
        setResumeData(savedResume);
        localStorage.setItem("currentResumeId", savedResume._id);
        // Update original data to current state after successful save
        setOriginalResumeData(JSON.parse(JSON.stringify(savedResume)));
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save resume: " + parseValidationErrors(err), {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle unsaved changes modal actions
  const handleSaveAndNavigate = async () => {
    await handleSave();
    // Temporarily unblock navigation
    unblockNavigation();
    setHasUnsavedChanges(false);

    if (pendingNavigation === "back") {
      window.history.back();
    } else if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const handleDiscardAndNavigate = () => {
    // Temporarily unblock navigation
    unblockNavigation();
    setHasUnsavedChanges(false);

    if (pendingNavigation === "back") {
      window.history.back();
    } else if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const updateField = (field, value, skipTracking = false) => {
    setResumeData((prev) => ({...prev, [field]: value}));
  };

  const updateContact = (field, value) => {
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
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray[index] = {...newArray[index], [field]: value};
      return {...prev, [section]: newArray};
    });
  };

  const addArrayItem = (section, template) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), template],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const moveItem = (section, fromIndex, toIndex) => {
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
      // Save to localStorage
      localStorage.setItem("resumeSectionOrder", JSON.stringify(newOrder));

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
    console.log("🔥 GitHub Import Data:", importedData);

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
        console.log("✅ Profile imported:", updated.contact);
      }

      // Import Projects
      if (importedData.projects && importedData.projects.length > 0) {
        const githubProjects = importedData.projects.map((repo) => ({
          name: repo.name, // Use 'name' instead of 'title'
          title: repo.name, // Also keep 'title' for compatibility
          description: repo.description || "No description provided",
          technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
          link: repo.url,
          bullets: [`⭐ ${repo.stars} stars`, `🔱 ${repo.forks} forks`],
          highlights: [`⭐ ${repo.stars} stars`, `🔱 ${repo.forks} forks`],
        }));

        console.log("📦 GitHub Projects to import:", githubProjects);
        console.log("🔀 Merge option:", importedData.mergeOptions.projects);
        console.log("📋 Existing projects:", updated.projects);

        if (importedData.mergeOptions.projects === "replace") {
          updated.projects = githubProjects;
        } else {
          // Add new projects
          updated.projects = [...(updated.projects || []), ...githubProjects];
        }

        console.log("✅ Updated projects:", updated.projects);
      }

      // Import Skills
      if (importedData.skills && importedData.skills.length > 0) {
        console.log("🎯 Importing skills:", importedData.skills);
        console.log("📊 Existing skills structure:", updated.skills);

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
        console.log("✅ Skills imported:", updated.skills);
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

        console.log("💼 Experience to import:", githubExperience);

        if (importedData.mergeOptions.experience === "replace") {
          updated.experience = githubExperience;
        } else {
          // Add new experience
          updated.experience = [
            ...(updated.experience || []),
            ...githubExperience,
          ];
        }
        console.log("✅ Experience imported:", updated.experience);
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

        console.log("🏆 Certifications to import:", githubCertifications);

        if (importedData.mergeOptions.certifications === "replace") {
          updated.certifications = githubCertifications;
        } else {
          // Add new certifications
          updated.certifications = [
            ...(updated.certifications || []),
            ...githubCertifications,
          ];
        }
        console.log("✅ Certifications imported:", updated.certifications);
      }

      console.log("🎉 Final updated resume data:", updated);

      // Store the updated data to save later
      updatedResumeData = updated;

      return updated;
    });

    // Close modal
    setShowGitHubImportModal(false);

    // Show success message
    setGithubImportSuccess(true);
    setTimeout(() => setGithubImportSuccess(false), 3000);

    // Auto-save with the updated data (wait for state to settle)
    setTimeout(async () => {
      if (updatedResumeData && user) {
        console.log("💾 Auto-saving imported data...", updatedResumeData);
        try {
          setSaving(true);
          let savedResume;
          if (updatedResumeData._id) {
            // Update existing resume
            const response = await resumeAPI.update(
              updatedResumeData._id,
              updatedResumeData
            );
            savedResume = response.data;
            console.log("✅ Resume auto-saved successfully!");
          } else {
            // Save new resume
            const response = await resumeAPI.save(updatedResumeData);
            savedResume = response.data;
            console.log("✅ Resume auto-saved successfully!");
          }

          // Update the resumeData with the saved version
          if (savedResume && savedResume._id) {
            setResumeData(savedResume);
            localStorage.setItem("currentResumeId", savedResume._id);
          }
        } catch (err) {
          console.error("❌ Auto-save error:", err);
          toast.error(
            "Failed to auto-save imported data: " + parseValidationErrors(err),
            {
              icon: "❌",
              duration: 4000,
            }
          );
        } finally {
          setSaving(false);
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
      localStorage.removeItem("resumeSectionOrder");
      setResumeData((prev) => ({
        ...prev,
        sectionOrder: DEFAULT_SECTION_ORDER,
      }));
      toast.success("Section order reset to default!", {
        icon: "🔄",
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
            icon: "✨",
            duration: 3000,
          }
        );
      } else {
        toast.warning(
          `Enhancement completed with some issues: ${successCount} enhanced, ${failCount} failed`,
          {
            icon: "⚠️",
            duration: 4000,
          }
        );
      }
    } catch (err) {
      toast.error(
        "Enhancement failed: " + (err.response?.data?.error || err.message),
        {
          icon: "❌",
          duration: 4000,
        }
      );
    }
  };

  if (!resumeData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
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
          title="ATS Score & Job Match"
          icon="📊"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "combinedScore"}
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
          icon="👤"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "personal"}
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
          icon="📝"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "summary"}
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
          icon="💡"
          defaultExpanded={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "recommendations"}
        >
          <div className="-m-6">
            <RecommendationsPanel
              resumeData={resumeData}
              onEnhanceAll={handleEnhanceAll}
            />
          </div>
        </CollapsibleSection>
      ),

      skills: (
        <CollapsibleSection
          key="skills"
          sectionId="skills"
          title="Skills"
          icon="🎯"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "skills"}
        >
          <SkillsSection resumeData={resumeData} updateField={updateField} />
        </CollapsibleSection>
      ),

      experience: (
        <CollapsibleSection
          key="experience"
          sectionId="experience"
          title="Experience"
          icon="💼"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "experience"}
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
          icon="🎓"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "education"}
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
          icon="🚀"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "projects"}
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
          icon="📜"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "certifications"}
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
          icon="🏆"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "achievements"}
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
          icon="✏️"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "customSections"}
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">
            Resume Editor
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-stretch">
            {/* GitHub Import Button */}
            <button
              onClick={() => setShowGitHubImportModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-purple-600 dark:border-purple-500 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              title="Import from GitHub"
            >
              <span className="hidden sm:inline">💻</span>
              <span className="text-xs sm:text-sm">Import GitHub</span>
            </button>
            {/* Reset Order Button */}
            <button
              onClick={handleResetOrder}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors flex items-center justify-center gap-1"
              title="Reset section order to default"
            >
              <span className="hidden sm:inline">🔄</span>
              <span>Reset</span>
            </button>
            {/* Template Selector Button */}
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-blue-600 dark:border-blue-500 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
              title="Change template"
            >
              <span>
                {TEMPLATES.find((t) => t.id === selectedTemplate)?.emoji}
              </span>
              <span>Change Template</span>
            </button>
            {/* Color Theme Selector Button - Only show for templates with color themes */}
            {TEMPLATE_COLOR_THEMES[selectedTemplate] && (
              <button
                onClick={() => setShowColorThemeSelector(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-purple-600 dark:border-purple-500 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                title="Change color theme"
              >
                <span>🎨</span>
                <span>Colors</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile-Friendly Action Bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 -mx-2 sm:-mx-4 px-2 sm:px-4 py-3 mb-4 no-print">
          <div className="flex gap-2 justify-between items-stretch">
            {/* Preview Toggle - Mobile */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 text-xs flex items-center justify-center ${
                showPreview
                  ? "bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              }`}
            >
              <span className="text-base mr-1.5">
                {showPreview ? "👁️" : "👁️‍🗨️"}
              </span>
              <span className="hidden xs:inline">
                {showPreview ? "Hide" : "Show"}{" "}
              </span>
              Preview
            </button>

            {/* Download PDF - Mobile */}
            <button
              onClick={() => {
                if (!showPreview) {
                  setShowPreview(true);
                  setTimeout(() => {
                    if (
                      resumePreviewRef.current &&
                      resumePreviewRef.current.downloadPDF
                    ) {
                      resumePreviewRef.current.downloadPDF();
                    }
                  }, 300);
                } else {
                  if (
                    resumePreviewRef.current &&
                    resumePreviewRef.current.downloadPDF
                  ) {
                    resumePreviewRef.current.downloadPDF();
                  }
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white font-semibold transition-all duration-300 text-xs flex items-center justify-center"
            >
              <span className="text-base mr-1.5">📥</span>
              Download
            </button>

            {/* Save Button - Mobile */}
            <button
              onClick={handleSave}
              disabled={saving || autoSaving}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 text-xs relative flex items-center justify-center ${
                saving || autoSaving
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500"
                  : hasUnsavedChanges
                  ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white"
                  : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white"
              }`}
            >
              {hasUnsavedChanges && !saving && !autoSaving && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
              )}
              <span className="text-base mr-1.5">
                {saving || autoSaving ? "⏳" : hasUnsavedChanges ? "⚠️" : "💾"}
              </span>
              <span className="hidden xs:inline">
                {saving
                  ? "Saving..."
                  : autoSaving
                  ? "Auto-saving..."
                  : hasUnsavedChanges
                  ? "Save*"
                  : "Saved"}
              </span>
              <span className="xs:hidden">
                {saving || autoSaving ? "..." : hasUnsavedChanges ? "*" : "✓"}
              </span>
            </button>
          </div>
        </div>

        {/* Floating Action Buttons - Desktop Only */}
        <div className="hidden lg:flex fixed right-6 top-32 z-50 flex-col gap-4 no-print">
          {/* Preview Toggle Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`group relative w-14 h-14 rounded-full shadow-2xl font-medium transition-all duration-300 hover:scale-110 hover:shadow-3xl ${
              showPreview
                ? "bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 border-2 border-gray-300 dark:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl">{showPreview ? "👁️" : "👁️‍🗨️"}</span>
            </div>
            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {showPreview ? "Hide Preview" : "Show Preview"}
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></span>
            </span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={() => {
              if (!showPreview) {
                setShowPreview(true);
                setTimeout(() => {
                  if (
                    resumePreviewRef.current &&
                    resumePreviewRef.current.downloadPDF
                  ) {
                    resumePreviewRef.current.downloadPDF();
                  }
                }, 300);
              } else {
                if (
                  resumePreviewRef.current &&
                  resumePreviewRef.current.downloadPDF
                ) {
                  resumePreviewRef.current.downloadPDF();
                }
              }
            }}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white shadow-2xl font-medium hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:rotate-12"
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl">📥</span>
            </div>
            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Download PDF
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></span>
            </span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || autoSaving}
            className={`group relative w-14 h-14 rounded-full shadow-2xl font-medium transition-all duration-300 ${
              saving || autoSaving
                ? "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed"
                : hasUnsavedChanges
                ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 hover:scale-110 hover:shadow-3xl hover:-rotate-12"
                : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:scale-110 hover:shadow-3xl hover:-rotate-12"
            }`}
          >
            {hasUnsavedChanges && !saving && !autoSaving && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
            )}
            <div className="flex items-center justify-center">
              <span className="text-2xl">
                {saving || autoSaving ? "⏳" : hasUnsavedChanges ? "⚠️" : "💾"}
              </span>
            </div>
            {/* Hover Tooltip */}
            {!saving && !autoSaving && (
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {hasUnsavedChanges ? "Save Changes*" : "Resume Saved"}
                <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></span>
              </span>
            )}
            {(saving || autoSaving) && (
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {autoSaving ? "Auto-saving..." : "Saving..."}
                <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></span>
              </span>
            )}
          </button>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white shadow-2xl font-medium hover:from-orange-500 hover:via-red-500 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:shadow-3xl"
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl transition-transform duration-300 group-hover:-translate-y-1">
                ⬆️
              </span>
            </div>
            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Scroll to Top
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></span>
            </span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
            <span className="text-base sm:text-lg flex-shrink-0">💡</span>
            <span>
              <strong>Tip:</strong>{" "}
              <span className="hidden sm:inline">
                Your ATS scores and recommendations are shown at the top. Scroll
                down to edit resume sections.
              </span>{" "}
              <span className="sm:hidden">Scroll to edit sections below.</span>{" "}
              Drag section headers to reorder them!
            </span>
          </div>
        </div>

        {/* Fixed Scores & Analysis Section - Collapsible */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl overflow-hidden">
            {/* Collapsible Header */}
            <button
              onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
              className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">📊</span>
                <span className="hidden sm:inline">
                  Resume Analysis & Scoring
                </span>
                <span className="sm:hidden">Analysis</span>
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isAnalysisExpanded ? "Click to collapse" : "Click to expand"}
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                    isAnalysisExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* Collapsible Content */}
            {isAnalysisExpanded && (
              <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* ATS Score Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <ScoreCard resumeData={resumeData} expanded={false} />
                  </div>

                  {/* Job-Specific Score Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <JobSpecificScoreCard
                      resumeData={resumeData}
                      onUpdateField={updateField}
                    />
                  </div>
                </div>

                {/* Recommendations Panel - Full Width */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <span className="text-lg sm:text-xl">💡</span>
                      <span className="hidden sm:inline">
                        Improvement Recommendations
                      </span>
                      <span className="sm:hidden">Recommendations</span>
                    </h3>
                    <RecommendationsPanel
                      resumeData={resumeData}
                      onEnhanceAll={handleEnhanceAll}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider with Label */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-full border-2 border-gray-300 dark:border-gray-600">
              ✏️ Resume Content Editor
            </span>
          </div>
        </div>

        <div
          className={`grid ${
            showPreview ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
          } gap-4 sm:gap-6`}
        >
          {/* Preview Panel - Shows FIRST on mobile for better UX */}
          {showPreview && (
            <div
              ref={previewSectionRef}
              className="xl:sticky xl:top-2 xl:h-[calc(100vh-3rem)] xl:overflow-auto order-1 xl:order-2"
            >
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-2xl border-2 border-indigo-200/50 dark:border-indigo-700/50 backdrop-blur-sm p-6">
                {/* Stylish Header */}
                <div className="flex justify-between items-center mb-4 xl:hidden">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    <span>Resume Preview</span>
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-200"
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
                />
              </div>
            </div>
          )}

          {/* Editor Panel - Dynamic Sections - Shows SECOND on mobile */}
          <div className="space-y-4 sm:space-y-6 order-2 xl:order-1">
            {sectionOrder.map((sectionId) => renderSection(sectionId))}
          </div>
        </div>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 no-print"
            onClick={() => setShowTemplateSelector(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Choose Resume Template
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100">
                    Select a template and see changes instantly
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
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

              {/* Modal Body - Template Grid */}
              <div className="overflow-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        localStorage.setItem("selectedTemplate", template.id);
                        setShowTemplateSelector(false);
                      }}
                      className={`group relative bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border-4 ${
                        selectedTemplate === template.id
                          ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-200 dark:ring-blue-900"
                          : "border-transparent hover:border-blue-300"
                      }`}
                    >
                      {/* Current Selection Badge */}
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          ✓ Current
                        </div>
                      )}

                      {/* Template Preview */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-600">
                        <div
                          className="absolute inset-0 scale-[0.2] origin-top-left pointer-events-none"
                          style={{
                            transformOrigin: "top left",
                            width: "210mm",
                            height: "297mm",
                          }}
                        >
                          <template.component resumeData={resumeData} />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <span className="text-white font-bold text-sm">
                            Click to Apply
                          </span>
                        </div>

                        {/* ATS Score Badge */}
                        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md">
                          <span
                            className={`text-xs font-bold ${
                              template.atsScore >= 95
                                ? "text-green-500"
                                : template.atsScore >= 90
                                ? "text-blue-500"
                                : "text-orange-500"
                            }`}
                          >
                            {template.atsScore}%
                          </span>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">
                              {template.emoji}
                            </span>
                            <span className="text-sm sm:text-base">
                              {template.name}
                            </span>
                          </h3>
                        </div>
                        <span className="inline-block text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                  💡 Your resume content stays the same, only the design changes
                </div>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Import Modal */}
        <GitHubImportModal
          isOpen={showGitHubImportModal}
          onClose={() => setShowGitHubImportModal(false)}
          onImport={handleGitHubImport}
          currentResume={resumeData}
        />

        {/* Color Theme Selector Modal */}
        {showColorThemeSelector && TEMPLATE_COLOR_THEMES[selectedTemplate] && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 no-print"
            onClick={() => setShowColorThemeSelector(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Choose Color Theme
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-100">
                    Pick a professional color palette for your resume
                  </p>
                </div>
                <button
                  onClick={() => setShowColorThemeSelector(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
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

              {/* Modal Body - Color Theme Grid */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TEMPLATE_COLOR_THEMES[selectedTemplate].map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setResumeData((prev) => ({
                          ...prev,
                          colorTheme: theme.id,
                        }));
                        setShowColorThemeSelector(false);
                        toast.success(
                          `${theme.emoji} ${theme.name} theme applied!`,
                          {
                            duration: 2000,
                            position: "bottom-right",
                          }
                        );
                      }}
                      className={`group relative bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border-4 p-6 ${
                        resumeData?.colorTheme === theme.id
                          ? "border-purple-600 dark:border-purple-400 ring-4 ring-purple-200 dark:ring-purple-900"
                          : "border-transparent hover:border-purple-300"
                      }`}
                    >
                      {/* Current Selection Badge */}
                      {resumeData?.colorTheme === theme.id && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ✓ Active
                        </div>
                      )}

                      {/* Color Swatch */}
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-600"
                          style={{backgroundColor: theme.primary}}
                        />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">{theme.emoji}</span>
                            {theme.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {theme.primary}
                          </p>
                        </div>
                      </div>

                      {/* Preview bars showing color in action */}
                      <div className="space-y-2">
                        <div
                          className="h-2 rounded-full"
                          style={{backgroundColor: theme.primary, opacity: 1}}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{backgroundColor: theme.primary, opacity: 0.7}}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{backgroundColor: theme.primary, opacity: 0.4}}
                        />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-300 font-bold text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                          Click to Apply
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  🎨 Choose a color that matches your industry
                </div>
                <button
                  onClick={() => setShowColorThemeSelector(false)}
                  className="px-4 sm:px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Import Success Notification */}
        {githubImportSuccess && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <span className="text-2xl">✨</span>
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
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default Editor;
