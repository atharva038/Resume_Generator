import {useState} from "react";
import {calculateResumeScore} from "@/utils/resumeScoring";
import {resumeAPI} from "@/api/api";
import {
  BriefcaseBusiness,
  Circle,
  FileText,
  GraduationCap,
  KeyRound,
  Lightbulb,
  Loader2,
  Mail,
  Rocket,
  Sparkles,
  Star,
  Target,
  Wrench,
  X,
  ChevronDown,
  CircleCheck,
  Check,
  Plus,
  ScanText,
} from "lucide-react";

const RecommendationsPanel = ({
  resumeData,
  onApplySuggestion,
  aiSuggestions,
  onSuggestionsChange,
  compact = true,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAdvancedEnhancer, setShowAdvancedEnhancer] = useState(false);
  const [localSuggestions, setLocalSuggestions] = useState([]);
  const [suggestionError, setSuggestionError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  if (!resumeData) return null;

  // Editor-level storage keeps AI responses visible while the user edits the
  // resume or closes and reopens the analysis sidebar. The local fallback
  // keeps this panel reusable in isolation.
  const suggestions = aiSuggestions ?? localSuggestions;
  const setSuggestions = onSuggestionsChange || setLocalSuggestions;

  const {totalScore, breakdown, recommendations} =
    calculateResumeScore(resumeData);

  const groupedRecs = {};
  recommendations.forEach((rec) => {
    const match = rec.match(/^\[([^\]]+)\]\s*(.+)$/);
    if (!match) return;
    const [, category, text] = match;
    if (!groupedRecs[category]) groupedRecs[category] = [];
    groupedRecs[category].push(text);
  });

  const getPriorityIcon = (category) => {
    const icons = {
      Experience: BriefcaseBusiness,
      Summary: FileText,
      Skills: Target,
      Contact: Mail,
      Education: GraduationCap,
      Extras: Star,
      Formatting: Wrench,
      Keywords: KeyRound,
    };
    return icons[category] || Circle;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Experience:
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
      Summary:
        "border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-900/20",
      Skills:
        "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
      Contact:
        "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
      Education:
        "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20",
      Extras:
        "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20",
      Formatting:
        "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
      Keywords:
        "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
    };
    return (
      colors[category] ||
      "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
    );
  };

  const prioritizedCategories = Object.entries(groupedRecs)
    .map(([category, items]) => {
      const key = category.toLowerCase();
      const scoreEntry = breakdown[key];
      const score = scoreEntry?.score || 0;
      const maxScore = scoreEntry?.maxScore || 10;
      const percent = Math.round((score / maxScore) * 100);

      return {
        category,
        items,
        score,
        maxScore,
        percent,
        gap: Math.max(0, maxScore - score),
      };
    })
    .sort((a, b) => a.percent - b.percent);

  const quickWins = prioritizedCategories
    .slice(0, 3)
    .flatMap((category) =>
      category.items.slice(0, 2).map((item) => ({
        category: category.category,
        text: item,
      }))
    )
    .slice(0, compact ? 4 : 6);

  const visibleCategories = showAllCategories
    ? prioritizedCategories
    : prioritizedCategories.slice(0, compact ? 3 : 6);

  const getStarterSuggestions = () => {
    const contact = resumeData.contact || {};
    const starters = [];
    const contactFields = [
      ["email", "Email address", "your.email@example.com"],
      ["phone", "Phone number", "+00 000 000 0000"],
      ["location", "Location", "City, Country"],
      ["linkedin", "LinkedIn profile", "linkedin.com/in/your-name"],
      ["github", "GitHub profile", "github.com/your-username"],
    ];

    contactFields.forEach(([field, label, value]) => {
      if (!contact[field]?.trim()) {
        starters.push({
          id: `contact-${field}`,
          section: "contact",
          targetSection: "personal",
          label,
          value: {[field]: value},
          isStarter: true,
        });
      }
    });

    if (!resumeData.name?.trim()) {
      starters.push({
        id: "name",
        section: "name",
        targetSection: "personal",
        label: "Your full name",
        value: "Your Full Name",
        isStarter: true,
      });
    }
    if (!resumeData.summary?.trim()) {
      starters.push({
        id: "summary-starter",
        section: "summary",
        label: "Professional summary starter",
        value: "[Target role] with strengths in [key skill 1], [key skill 2], and [key skill 3]. Ready to contribute to [type of team or company] by delivering [measurable outcome].",
        isStarter: true,
      });
    }
    if (!resumeData.skills?.length) {
      starters.push({
        id: "skills-starter",
        section: "skills",
        label: "Skills section starter",
        value: [
          {category: "Technical Skills", items: ["[Add your core tools]", "[Add your programming languages]", "[Add your platforms]"]},
          {category: "Professional Skills", items: ["Communication", "Problem solving", "Teamwork"]},
        ],
        isStarter: true,
      });
    }
    if (!resumeData.experience?.length) {
      starters.push({
        id: "experience-starter",
        section: "experience",
        label: "Experience entry starter",
        value: {
          company: "Your Company",
          title: "Your Job Title",
          location: "City, Country",
          startDate: "Month YYYY",
          endDate: "Present",
          current: true,
          bullets: ["[Describe a responsibility or achievement with a measurable result]"],
        },
        isStarter: true,
      });
    } else {
      resumeData.experience.forEach((experience, index) => {
        const value = {};
        if (!experience.company?.trim()) value.company = "Your Company";
        if (!experience.title?.trim()) value.title = "Your Job Title";
        if (!experience.location?.trim()) value.location = "City, Country";
        if (!experience.startDate?.trim()) value.startDate = "Month YYYY";
        if (!experience.endDate?.trim() && !experience.current) value.endDate = "Month YYYY";
        if (!experience.bullets?.filter(Boolean).length) {
          value.bullets = ["[Describe a responsibility or achievement with a measurable result]"];
        }
        if (Object.keys(value).length) {
          starters.push({
            id: `experience-details-${index}`,
            section: "experience",
            index,
            label: `Complete ${experience.title || `experience ${index + 1}`}`,
            value,
            fieldPatch: true,
            isStarter: true,
          });
        }
      });
    }
    if (!resumeData.education?.length) {
      starters.push({
        id: "education-starter",
        section: "education",
        label: "Education entry starter",
        value: {
          institution: "Your University or College",
          degree: "Your Degree",
          field: "Your Field of Study",
          location: "City, Country",
          startDate: "Month YYYY",
          endDate: "Month YYYY",
          gpa: "",
          bullets: [],
        },
        isStarter: true,
      });
    } else {
      resumeData.education.forEach((education, index) => {
        const value = {};
        if (!education.institution?.trim()) value.institution = "Your University or College";
        if (!education.degree?.trim()) value.degree = "Your Degree";
        if (!education.field?.trim()) value.field = "Your Field of Study";
        if (!education.location?.trim()) value.location = "City, Country";
        if (!education.startDate?.trim()) value.startDate = "Month YYYY";
        if (!education.endDate?.trim()) value.endDate = "Month YYYY";
        if (Object.keys(value).length) {
          starters.push({
            id: `education-details-${index}`,
            section: "education",
            index,
            label: `Complete ${education.degree || `education ${index + 1}`}`,
            value,
            fieldPatch: true,
            isStarter: true,
          });
        }
      });
    }
    if (!resumeData.projects?.length) {
      starters.push({
        id: "project-starter",
        section: "projects",
        label: "Project entry starter",
        value: {
          name: "Your Project Name",
          description: "[Briefly describe the problem your project solved]",
          technologies: ["[Technology]"],
          link: "",
          bullets: ["[Describe what you built and the result it achieved]"],
        },
        isStarter: true,
      });
    } else {
      resumeData.projects.forEach((project, index) => {
        const value = {};
        if (!project.name?.trim()) value.name = "Your Project Name";
        if (!project.description?.trim()) value.description = "[Briefly describe the problem your project solved]";
        if (!project.technologies?.length) value.technologies = ["[Technology]"];
        if (!project.bullets?.filter(Boolean).length) {
          value.bullets = ["[Describe what you built and the result it achieved]"];
        }
        if (Object.keys(value).length) {
          starters.push({
            id: `project-details-${index}`,
            section: "projects",
            index,
            label: `Complete ${project.name || `project ${index + 1}`}`,
            value,
            fieldPatch: true,
            isStarter: true,
          });
        }
      });
    }

    return starters;
  };

  const scanForSuggestions = async () => {
    const requests = [];

    if (resumeData.summary?.trim()) {
      requests.push({
        id: "summary",
        section: "summary",
        sectionType: "summary",
        label: "Professional summary",
        content: resumeData.summary,
      });
    }

    (resumeData.experience || []).forEach((experience, index) => {
      if (experience.bullets?.length) {
        requests.push({
          id: `experience-${index}`,
          section: "experience",
          index,
          sectionType: "experience",
          label: experience.company || experience.title || `Experience ${index + 1}`,
          content: experience.bullets,
        });
      }
    });

    (resumeData.projects || []).forEach((project, index) => {
      if (project.bullets?.length) {
        requests.push({
          id: `projects-${index}`,
          section: "projects",
          index,
          sectionType: "project",
          label: project.name || project.title || `Project ${index + 1}`,
          content: project.bullets,
        });
      }
    });

    const starterSuggestions = getStarterSuggestions();

    setEnhancing(true);
    setSuggestionError("");
    setAddedIds([]);
    try {
      const results = await Promise.allSettled(
        requests.map(async (request) => {
          const response = await resumeAPI.enhance(
            request.content,
            request.sectionType,
            resumeData,
            customPrompt
          );
          const enhanced = response.data.enhanced;
          return {
            ...request,
            value:
              request.section === "summary"
                ? String(enhanced || "")
                : (Array.isArray(enhanced) ? enhanced : [enhanced])
                    .filter(Boolean)
                    .map((item) => String(item)),
          };
        })
      );
      const generated = results
        .filter((result) => result.status === "fulfilled" && result.value.value.length)
        .map((result) => result.value);

      setSuggestions([...starterSuggestions, ...generated]);
      if (!starterSuggestions.length && !generated.length) {
        setSuggestionError("We couldn't create suggestions right now. Please try again.");
      }
    } catch {
      setSuggestionError("We couldn't scan your resume right now. Please try again.");
    } finally {
      setEnhancing(false);
    }
  };

  const applySuggestion = async (suggestion) => {
    if (!onApplySuggestion || addedIds.includes(suggestion.id)) return;

    setAddingId(suggestion.id);
    const wasApplied = await onApplySuggestion(suggestion);
    setAddingId(null);
    if (wasApplied !== false) {
      setAddedIds((ids) => [...ids, suggestion.id]);
    }
  };

  const getSuggestionPreview = (suggestion) => {
    if (typeof suggestion.value === "string") return suggestion.value;
    if (Array.isArray(suggestion.value)) {
      return suggestion.value
        .map((item) =>
          typeof item === "string"
            ? `• ${item}`
            : `${item.category}: ${item.items.join(", ")}`
        )
        .join("\n");
    }
    return Object.entries(suggestion.value)
      .filter(([, value]) => value !== "" && value !== false)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join("\n");
  };

  if (!expanded) {
    return (
      <div
        className="card p-4 cursor-pointer hover:shadow-md transition"
        onClick={() => setExpanded(true)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Improvement Recommendations
            </span>
            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full font-medium">
              {recommendations.length} tips
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "card p-4" : "card p-6"}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`${compact ? "text-base" : "text-lg"} font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2`}
          >
            <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            {compact ? "Priority Recommendations" : "How to Improve Your Score"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {compact
              ? `Focus on high-impact changes to push ATS ${totalScore} toward 90+.`
              : `Follow these recommendations to increase your ATS score from ${totalScore} to 90+.`}
          </p>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Priority chips */}
      {prioritizedCategories.length > 0 && (
        <div className={`${compact ? "mb-4" : "mb-6"}`}>
          <div className="flex flex-wrap gap-2">
            {prioritizedCategories.slice(0, 3).map((item) => (
              <span
                key={item.category}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
              >
                {(() => {
                  const Icon = getPriorityIcon(item.category);
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                <span>{item.category}</span>
                <span className="text-primary-600 dark:text-primary-400">
                  +{item.gap} pts
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && totalScore < 90 && (
        <div
          className={`${compact ? "mb-4 p-3" : "mb-6 p-4"} bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg`}
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Quick Wins to Gain {Math.min(90 - totalScore, 20)} Points
          </h4>
          <ul className="space-y-2">
            {quickWins.map((rec, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
              >
                <span className="text-primary-600 dark:text-primary-400 font-bold mt-0.5">
                  {index + 1}.
                </span>
                <span>
                  <span className="font-medium">[{rec.category}] </span>
                  {rec.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score diagnostics: supporting context for the tailored AI cards below. */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Resume checks
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              These explain your score. Generate AI suggestions below for addable content.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 px-2 py-1 text-[11px] font-semibold text-primary-700 dark:text-primary-300">
            {recommendations.length} checks
          </span>
        </div>
        {visibleCategories.map((entry) => (
          <details
            key={entry.category}
            className={`border rounded-lg ${compact ? "p-3" : "p-4"} ${getCategoryColor(entry.category)}`}
            open={!compact}
          >
            <summary className="list-none cursor-pointer group">
              <div className="flex justify-between items-center gap-3">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                  {(() => {
                    const Icon = getPriorityIcon(entry.category);
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                  {entry.category}
                </h5>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {entry.score}/{entry.maxScore} ({entry.percent}%)
                </span>
              </div>
              <p className="mt-1 pl-5 text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300">
                View {entry.items.length} check{entry.items.length === 1 ? "" : "s"}
              </p>
            </summary>
            <ul className="space-y-1.5 mt-3">
              {entry.items.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <Circle className="w-2.5 h-2.5 mt-1.5 text-gray-400 dark:text-gray-500 fill-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}

        {prioritizedCategories.length > (compact ? 3 : 6) && (
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="text-xs font-medium text-primary-600 dark:text-primary-400"
          >
            {showAllCategories ? "Show fewer categories" : "Show all categories"}
          </button>
        )}
      </div>

      {/* Bottom Tips */}
      <div className={`${compact ? "mt-4 pt-3" : "mt-6 pt-4"} border-t dark:border-gray-700`}>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          General ATS Best Practices
        </h4>
        <div className={`grid ${compact ? "grid-cols-1" : "md:grid-cols-2"} gap-4`}>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Content
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Use action verbs (Led, Developed, Achieved)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Quantify everything (%, $, #, time saved)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Tailor to job description keywords</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Show results, not just responsibilities</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Format
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Keep to 1 page (for &lt;10 years exp)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Use standard section headers</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Simple fonts (Arial, Calibri, Times)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />No images, tables, or columns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI suggestion review flow */}
      {onApplySuggestion && (
        <div className={`${compact ? "mt-4" : "mt-6"}`}>
          {compact && (
            <button
              type="button"
              onClick={() => setShowAdvancedEnhancer((prev) => !prev)}
              className="mb-3 text-xs font-medium text-primary-600 dark:text-primary-400"
            >
              {showAdvancedEnhancer
                ? "Hide advanced AI instructions"
                : "Add advanced AI instructions"}
            </button>
          )}

          {/* Custom Prompt Input */}
          {(!compact || showAdvancedEnhancer) && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Custom AI Instructions (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., Focus on technical skills, add more metrics, emphasize leadership experience, target software engineering roles..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="3"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Tip: Give specific instructions like "target data science roles"
                or "emphasize cloud technologies"
              </p>
            </div>
          )}

          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={scanForSuggestions}
            disabled={enhancing}
          >
            {enhancing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning your resume...
              </>
            ) : (
              <>
                <ScanText className="w-4 h-4" />
                Generate AI Suggestions
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Review each AI rewrite before it is added to your resume.
          </p>

          {suggestionError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{suggestionError}</p>
          )}

          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  AI suggestions ready
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {addedIds.length}/{suggestions.length} added
                </span>
              </div>
              {suggestions.map((suggestion) => {
                const added = addedIds.includes(suggestion.id);
                const adding = addingId === suggestion.id;
                const preview = getSuggestionPreview(suggestion);

                return (
                  <article
                    key={suggestion.id}
                    className={`rounded-xl border p-3 transition-all duration-500 ${
                      added
                        ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30 animate-scale-in"
                        : "border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
                          {suggestion.section === "summary" ? "Summary" : suggestion.section}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{suggestion.label}</p>
                        {suggestion.isStarter && (
                          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">Starter content — edit the bracketed details after adding.</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        disabled={adding || added}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:cursor-default ${
                          added
                            ? "bg-emerald-600 text-white"
                            : "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
                        }`}
                      >
                        {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {adding ? "Adding..." : added ? "Added to resume" : "Add to resume"}
                      </button>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {preview}
                    </p>
                    {added && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-fade-in">
                        <Check className="w-3.5 h-3.5" /> This suggestion is now in your resume.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
