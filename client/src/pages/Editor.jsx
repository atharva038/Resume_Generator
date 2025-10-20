import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {resumeAPI} from "../services/api";
import ResumePreview from "../components/ResumePreview";
import EditableSection from "../components/EditableSection";
import ScoreCard from "../components/ScoreCard";
import JobSpecificScoreCard from "../components/JobSpecificScoreCard";
import RecommendationsPanel from "../components/RecommendationsPanel";
import CollapsibleSection from "../components/CollapsibleSection";
import GitHubImportModal from "../components/GitHubImportModal";
import * as EditorSections from "../components/EditorSections";
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
];

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const resumePreviewRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Load template from localStorage (set by Templates page) or default to "classic"
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return savedTemplate || "classic";
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
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
    };

    loadResumeData();
  }, [location, navigate, user]);

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your resume");
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
        alert("Resume updated successfully!");
      } else {
        // Save new resume
        const response = await resumeAPI.save(resumeData);
        savedResume = response.data;
        alert("Resume saved successfully!");
      }

      // Update the resumeData with the saved version (includes _id if it's new)
      if (savedResume && savedResume._id) {
        setResumeData(savedResume);
        localStorage.setItem("currentResumeId", savedResume._id);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(
        "Failed to save resume: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setSaving(false);
    }
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
      alert("Section order reset to default!");
    }
  };

  // Enhance all sections with AI
  const handleEnhanceAll = async () => {
    if (
      !window.confirm(
        "Apply AI enhancement to all sections? This will improve your summary, experience bullets, and project descriptions with action verbs and metrics."
      )
    ) {
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
            .enhance(oldSummary, "summary")
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
                .enhance(oldBullets, "experience")
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
                .enhance(oldBullets, "project")
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
        alert(
          `✅ All sections enhanced successfully! (${successCount} sections improved)`
        );
      } else {
        alert(
          `⚠️ Enhancement completed with some issues:\n✓ ${successCount} sections enhanced\n✗ ${failCount} sections failed`
        );
      }
    } catch (err) {
      alert(
        "Enhancement failed: " + (err.response?.data?.error || err.message)
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
          <EditorSections.SkillsSection
            resumeData={resumeData}
            updateField={updateField}
          />
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
          <EditorSections.ExperienceSection
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
          <EditorSections.EducationSection
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
          <EditorSections.ProjectsSection
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
          <EditorSections.CertificationsSection
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
          <EditorSections.AchievementsSection
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
          <EditorSections.CustomSectionsManager
            resumeData={resumeData}
            updateField={updateField}
          />
        </CollapsibleSection>
      ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-3xl font-bold dark:text-gray-100">
            Resume Editor
          </h1>
          <div className="flex gap-3 items-center">
            {/* GitHub Import Button */}
            <button
              onClick={() => setShowGitHubImportModal(true)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              title="Import from GitHub"
            >
              💻 Import GitHub Data
            </button>
            {/* Reset Order Button */}
            <button
              onClick={handleResetOrder}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              title="Reset section order to default"
            >
              🔄 Reset Order
            </button>
            {/* Template Selector Button */}
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-md hover:shadow-lg"
              title="Change template"
            >
              {TEMPLATES.find((t) => t.id === selectedTemplate)?.emoji} Change
              Template
            </button>
          </div>
        </div>

        {/* Floating Action Buttons - Icon Only with Hover Tooltips */}
        <div className="fixed right-6 top-32 z-50 flex flex-col gap-4 no-print">
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
            disabled={saving}
            className={`group relative w-14 h-14 rounded-full shadow-2xl font-medium transition-all duration-300 ${
              saving
                ? "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:scale-110 hover:shadow-3xl hover:-rotate-12"
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl">{saving ? "⏳" : "💾"}</span>
            </div>
            {/* Hover Tooltip */}
            {!saving && (
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Save Resume
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
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
            <span className="text-lg">💡</span>
            <span>
              <strong>Tip:</strong> Your ATS scores and recommendations are
              shown at the top. Scroll down to edit resume sections. Drag
              section headers to reorder them!
            </span>
          </div>
        </div>

        {/* Fixed Scores & Analysis Section - Collapsible */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl overflow-hidden">
            {/* Collapsible Header */}
            <button
              onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Resume Analysis & Scoring
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isAnalysisExpanded ? "Click to collapse" : "Click to expand"}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
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
              <div className="px-6 pb-6 space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
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
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      Improvement Recommendations
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
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-900 px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-full border-2 border-gray-300 dark:border-gray-600">
              ✏️ Resume Content Editor
            </span>
          </div>
        </div>

        <div
          className={`grid ${
            showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"
          } gap-6`}
        >
          {/* Editor Panel - Dynamic Sections */}
          <div className="space-y-6">
            {sectionOrder.map((sectionId) => renderSection(sectionId))}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
              <ResumePreview
                ref={resumePreviewRef}
                resumeData={resumeData}
                template={selectedTemplate}
              />
            </div>
          )}
        </div>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print"
            onClick={() => setShowTemplateSelector(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Choose Resume Template
                  </h2>
                  <p className="text-blue-100">
                    Select a template and see changes instantly
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-8 h-8"
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
              <div className="overflow-auto max-h-[calc(90vh-140px)] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">{template.emoji}</span>
                            {template.name}
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
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Your resume content stays the same, only the design changes
                </div>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
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
      </div>
    </div>
  );
};

export default Editor;
