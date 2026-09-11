import { useState } from "react";
import {
  User,
  FileText,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Sliders,
} from "lucide-react";
import {
  PersonalInfoSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  CertificationsSection,
  AchievementsSection,
} from "./sections/EditorSections";
import { EditableSection } from "./sections";

const STEP_TIPS = {
  personal:
    "Include an active professional email and your LinkedIn or GitHub profile URL to make it easy for recruiters to reach out.",
  summary:
    "Write 2-3 concise sentences summarizing your expertise, key strengths, and what you bring to target roles.",
  experience:
    "Lead bullet points with strong action verbs (e.g., Developed, Optimized, Spearheaded) and quantify achievements where possible. Freshers or students can skip this step.",
  education:
    "List your highest or current degree, institution name, graduation year, and any honors or relevant coursework.",
  skills:
    "Include 6 to 12 relevant hard skills and technical tools that match the keywords in job descriptions you are targeting.",
  projects:
    "Highlight 1 to 3 projects demonstrating hands-on problem solving, your primary tech stack, and verifiable outcomes.",
  certifications:
    "List industry-recognized credentials, licenses, or certifications along with issuing bodies.",
  achievements:
    "Mention scholarships, hackathon rankings, publications, or competitive recognitions that set you apart.",
};

export default function ResumeWizard({
  resumeData,
  updateField,
  updateContact,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  moveItem,
  onComplete,
  onSwitchToFullEditor,
  onGoBack,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationNotice, setValidationNotice] = useState("");

  const isStepComplete = (id) => {
    switch (id) {
      case "personal":
        return Boolean(
          resumeData.name?.trim() &&
            (resumeData.contact?.email?.trim() || resumeData.contact?.phone?.trim())
        );
      case "summary": {
        const text = (resumeData.summary || "").replace(/<[^>]*>/g, "").trim();
        return text.length > 0;
      }
      case "experience":
        return Boolean(
          resumeData.experience?.length > 0 &&
            resumeData.experience.some(
              (exp) => exp.company?.trim() || exp.title?.trim()
            )
        );
      case "education":
        return Boolean(
          resumeData.education?.length > 0 &&
            resumeData.education.some(
              (edu) => edu.institution?.trim() || edu.degree?.trim()
            )
        );
      case "skills":
        return Boolean(resumeData.skills?.length > 0);
      case "projects":
        return Boolean(resumeData.projects?.length > 0);
      case "certifications":
        return Boolean(resumeData.certifications?.length > 0);
      case "achievements":
        return Boolean(resumeData.achievements?.length > 0);
      default:
        return false;
    }
  };

  const steps = [
    {
      id: "personal",
      title: "Contact Info",
      shortTitle: "Contact",
      icon: User,
      description: "Basic contact details and professional links",
      optional: false,
      component: (
        <PersonalInfoSection
          resumeData={resumeData}
          updateField={updateField}
          updateContact={updateContact}
        />
      ),
    },
    {
      id: "summary",
      title: "Professional Summary",
      shortTitle: "Summary",
      icon: FileText,
      description: "Brief overview of your professional profile and strengths",
      optional: true,
      component: (
        <EditableSection
          title=""
          content={resumeData.summary}
          onUpdate={(value) => updateField("summary", value)}
          sectionType="summary"
          resumeData={resumeData}
        />
      ),
    },
    {
      id: "experience",
      title: "Work Experience",
      shortTitle: "Experience",
      icon: Briefcase,
      description: "Work history and roles (skippable for students and freshers)",
      optional: true,
      component: (
        <ExperienceSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
    },
    {
      id: "education",
      title: "Education",
      shortTitle: "Education",
      icon: GraduationCap,
      description: "Degrees, institutions, and academic achievements",
      optional: false,
      component: (
        <EducationSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
    },
    {
      id: "skills",
      title: "Skills & Proficiencies",
      shortTitle: "Skills",
      icon: Sparkles,
      description: "Key technical abilities, software, and domain expertise",
      optional: false,
      component: (
        <SkillsSection resumeData={resumeData} updateField={updateField} />
      ),
    },
    {
      id: "projects",
      title: "Projects",
      shortTitle: "Projects",
      icon: FolderGit2,
      description: "Notable personal, academic, or professional projects",
      optional: true,
      component: (
        <ProjectsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
    },
    {
      id: "certifications",
      title: "Certifications",
      shortTitle: "Certs",
      icon: Award,
      description: "Professional licenses, certifications, and credentials",
      optional: true,
      component: (
        <CertificationsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
    },
    {
      id: "achievements",
      title: "Achievements & Honors",
      shortTitle: "Honors",
      icon: Trophy,
      description: "Awards, recognitions, and competitive milestones",
      optional: true,
      component: (
        <AchievementsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const completedCount = steps.filter((s) => isStepComplete(s.id)).length;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleNext = () => {
    setValidationNotice("");

    // Gentle advisory if personal info name is empty on step 0
    if (currentStep === 0 && !resumeData.name?.trim()) {
      setValidationNotice("Please enter your full name so your resume is properly labeled.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    setValidationNotice("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onGoBack) {
      onGoBack();
    }
  };

  const handleSelectStep = (index) => {
    setValidationNotice("");
    setCurrentStep(index);
  };

  return (
    <div className="space-y-4">
      {/* Header & Progress Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-white/10 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-1.5">
              <span>Guided Setup</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Build Your Resume
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Step-by-step assistant. You can jump between sections or switch to the full editor anytime.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onSwitchToFullEditor && (
              <button
                type="button"
                onClick={onSwitchToFullEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
                title="Switch to full editor mode"
              >
                <Sliders className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
                <span className="hidden sm:inline">Full Editor</span>
              </button>
            )}
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-zinc-400">
            <span>
              Step {currentStep + 1} of {steps.length}:{" "}
              <strong className="text-gray-900 dark:text-zinc-200 font-semibold">
                {currentStepData.title}
              </strong>
            </span>
            <span className="text-[11px] text-gray-500 dark:text-zinc-500">
              {completedCount} of {steps.length} sections populated ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = index === currentStep;
            const completed = isStepComplete(step.id);

            return (
              <button
                key={step.id}
                onClick={() => handleSelectStep(index)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer border ${
                  isCurrent
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/60 dark:border-blue-500/50 text-blue-700 dark:text-blue-300 shadow-2xs"
                    : completed
                      ? "bg-gray-50/80 dark:bg-zinc-800/50 border-gray-200/70 dark:border-white/[0.06] text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-white/20"
                      : "bg-transparent border-transparent text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
                }`}
                title={step.title}
              >
                <div className="relative mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? "text-blue-600 dark:text-blue-400"
                        : completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-zinc-500"
                    }`}
                  />
                  {completed && !isCurrent && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <span className="text-[11px] font-medium leading-tight truncate w-full">
                  {step.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section Content Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-white/10 p-5 sm:p-6 shadow-xs">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-3 pb-4 mb-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h3>
                {currentStepData.optional && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Section Form Component */}
        <div className="min-h-[260px]">{currentStepData.component}</div>

        {/* Validation Notice Alert */}
        {validationNotice && (
          <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                {validationNotice}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    setValidationNotice("");
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      onComplete?.();
                    }
                  }}
                  className="text-amber-800 dark:text-amber-300 underline font-semibold cursor-pointer hover:text-amber-950"
                >
                  Continue anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Navigation */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-white/10 p-3.5 sm:p-4 shadow-xs">
        <button
          onClick={handlePrevious}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer shadow-2xs active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isFirstStep ? "Back" : "Previous"}</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStepData.optional && !isLastStep && (
            <button
              onClick={() => {
                setValidationNotice("");
                setCurrentStep(currentStep + 1);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                <span>Finish & Open Editor</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pro Tip Box */}
      {STEP_TIPS[currentStepData.id] && (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <span className="font-semibold text-blue-950 dark:text-blue-100">
              Pro Tip:{" "}
            </span>
            {STEP_TIPS[currentStepData.id]}
          </div>
        </div>
      )}
    </div>
  );
}
