import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {resumeAPI} from "../services/api";
import ResumePreview from "../components/ResumePreview";
import EditableSection from "../components/EditableSection";
import ScoreCard from "../components/ScoreCard";
import RecommendationsPanel from "../components/RecommendationsPanel";
import CollapsibleSection from "../components/CollapsibleSection";
import * as EditorSections from "../components/EditorSections";

// Default section order
const DEFAULT_SECTION_ORDER = [
  "score",
  "personal",
  "summary",
  "recommendations",
  "skills",
  "experience",
  "education",
  "projects",
  "certifications",
];

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [sectionOrder, setSectionOrder] = useState(() => {
    // Load section order from localStorage or use default
    const saved = localStorage.getItem("resumeSectionOrder");
    return saved ? JSON.parse(saved) : DEFAULT_SECTION_ORDER;
  });
  const [draggedSection, setDraggedSection] = useState(null);

  useEffect(() => {
    const data = location.state?.resumeData;
    if (!data) {
      navigate("/upload");
      return;
    }
    setResumeData(data);
  }, [location, navigate]);

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your resume");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      if (resumeData._id) {
        await resumeAPI.update(resumeData._id, resumeData);
        alert("Resume updated successfully!");
      } else {
        await resumeAPI.save(resumeData);
        alert("Resume saved successfully!");
      }
    } catch (err) {
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
      score: (
        <CollapsibleSection
          key="score"
          sectionId="score"
          title="ATS Score"
          icon="📊"
          defaultExpanded={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedSection === "score"}
        >
          <div className="-m-6">
            <ScoreCard resumeData={resumeData} expanded={false} />
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
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
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
    };

    return sections[sectionId] || null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-3xl font-bold">Resume Editor</h1>
          <div className="flex gap-3 items-center">
            {/* Reset Order Button */}
            <button
              onClick={handleResetOrder}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium hover:border-orange-500 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              title="Reset section order to default"
            >
              🔄 Reset Order
            </button>
            {/* Template Selector */}
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="classic">📋 Classic</option>
              <option value="modern">🎨 Modern</option>
              <option value="minimal">✨ Minimal</option>
              <option value="professional">💼 Professional</option>
            </select>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary"
            >
              {showPreview ? "Hide" : "Show"} Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Saving..." : "Save Resume"}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-lg">💡</span>
            <span>
              <strong>Tip:</strong> Click section headers to collapse/expand.
              Drag sections to reorder them. Your resume preview will update
              automatically!
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
            <div
              className="lg:sticky lg:top-4"
              style={{height: "calc(100vh - 6rem)"}}
            >
              <ResumePreview
                resumeData={resumeData}
                template={selectedTemplate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
