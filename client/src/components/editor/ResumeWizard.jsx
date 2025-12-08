import {useState} from "react";
import {ChevronLeft, ChevronRight, Check} from "lucide-react";
import {
  PersonalInfoSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  CertificationsSection,
  AchievementsSection,
} from "./sections/EditorSections";
import {EditableSection} from "./sections";

const ResumeWizard = ({
  resumeData,
  updateField,
  updateContact,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  moveItem,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highestReachedStep, setHighestReachedStep] = useState(0);
  const [validationError, setValidationError] = useState("");

  // Validation function for each step
  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];

    // Skip validation for optional steps
    if (step.optional) {
      return true;
    }

    switch (step.id) {
      case "personal":
        // Check if name and at least email or phone is filled
        if (!resumeData.name || resumeData.name.trim() === "") {
          setValidationError("Please enter your full name");
          return false;
        }
        if (
          (!resumeData.contact?.email ||
            resumeData.contact.email.trim() === "") &&
          (!resumeData.contact?.phone || resumeData.contact.phone.trim() === "")
        ) {
          setValidationError("Please enter at least email or phone number");
          return false;
        }
        break;

      case "summary":
        // Check if summary has content
        if (
          !resumeData.summary ||
          resumeData.summary.trim() === "" ||
          resumeData.summary === "<p></p>" ||
          resumeData.summary === "<p><br></p>"
        ) {
          setValidationError("Please add a professional summary");
          return false;
        }
        // Remove HTML tags to check actual text content
        const summaryText = resumeData.summary.replace(/<[^>]*>/g, "").trim();
        if (summaryText.length === 0) {
          setValidationError("Please add a professional summary");
          return false;
        }
        break;

      case "skills":
        // No validation for skills - allow proceeding regardless
        break;

      case "experience":
        // Check if at least one experience is added
        if (!resumeData.experience || resumeData.experience.length === 0) {
          setValidationError("Please add at least one work experience");
          return false;
        }
        // Check if experience has required fields
        const hasValidExperience = resumeData.experience.some(
          (exp) =>
            exp.company &&
            exp.company.trim() !== "" &&
            exp.title &&
            exp.title.trim() !== ""
        );
        if (!hasValidExperience) {
          setValidationError(
            "Please fill in company name and job title for at least one experience"
          );
          return false;
        }
        break;

      case "education":
        // Check if at least one education entry is added
        if (!resumeData.education || resumeData.education.length === 0) {
          setValidationError("Please add at least one education entry");
          return false;
        }
        // Check if education has required fields
        const hasValidEducation = resumeData.education.some(
          (edu) =>
            edu.institution &&
            edu.institution.trim() !== "" &&
            edu.degree &&
            edu.degree.trim() !== ""
        );
        if (!hasValidEducation) {
          setValidationError(
            "Please fill in institution and degree for at least one education entry"
          );
          return false;
        }
        break;

      default:
        return true;
    }

    return true;
  };

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      icon: "👤",
      description: "Your basic contact details",
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
      icon: "📝",
      description: "Brief overview of your professional profile",
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
      id: "skills",
      title: "Skills",
      icon: "🎯",
      description: "Your technical and professional skills",
      component: (
        <SkillsSection resumeData={resumeData} updateField={updateField} />
      ),
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: "💼",
      description: "Your professional work history",
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
      icon: "🎓",
      description: "Your academic background",
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
      id: "projects",
      title: "Projects",
      icon: "🚀",
      description: "Your notable projects (optional)",
      component: (
        <ProjectsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
      optional: true,
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: "📜",
      description: "Your professional certifications (optional)",
      component: (
        <CertificationsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
      optional: true,
    },
    {
      id: "achievements",
      title: "Achievements",
      icon: "🏆",
      description: "Your notable achievements (optional)",
      component: (
        <AchievementsSection
          resumeData={resumeData}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          moveItem={moveItem}
        />
      ),
      optional: true,
    },
  ];

  const handleNext = () => {
    // Clear any previous validation errors
    setValidationError("");

    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return; // Don't proceed if validation fails
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Update highest reached step
      if (nextStep > highestReachedStep) {
        setHighestReachedStep(nextStep);
      }
    } else {
      // Wizard completed
      onComplete();
    }
  };

  const handlePrevious = () => {
    setValidationError(""); // Clear validation error
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index) => {
    // Only allow clicking on steps that have been reached
    if (index <= highestReachedStep) {
      setValidationError(""); // Clear validation error
      setCurrentStep(index);
    }
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Step Progress Indicator */}
      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-900 dark:bg-white rounded-xl p-3">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create Your Resume
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Step-by-step guide to building your professional resume
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Step {currentStep + 1}/{steps.length}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-3">
            <div
              className="bg-gray-900 dark:bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {steps.map((step, index) => {
            const isAccessible = index <= highestReachedStep;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLocked = index > highestReachedStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={isLocked}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[110px] ${
                  isCurrent
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-zinc-900"
                    : isCompleted
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 cursor-pointer hover:border-green-600"
                    : isLocked
                    ? "border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900 cursor-not-allowed opacity-60"
                    : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-600"
                }`}
                title={isLocked ? `Complete previous steps first` : step.title}
              >
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute -top-2 -right-2 bg-gray-400 dark:bg-gray-600 rounded-full p-1 shadow-md">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <span className="text-3xl mb-2">{step.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight px-1 text-gray-700 dark:text-gray-300">
                  {step.title}
                </span>
                {step.optional && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    (Optional)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-indigo-900/20 rounded-xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 shadow-md">
              <span className="text-3xl">{currentStepData.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentStepData.description}
              </p>
            </div>
            {currentStepData.optional && (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-300 dark:border-amber-700">
                Optional
              </span>
            )}
          </div>
        </div>

        {/* Step Component */}
        <div className="min-h-[300px]">{currentStepData.component}</div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl flex items-start gap-3 animate-shake">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                ⚠️ {validationError}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Please fill in the required information to continue.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
            isFirstStep
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md hover:shadow-lg hover:scale-105 border border-gray-300 dark:border-gray-600"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3">
          {currentStepData.optional && (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-300 dark:border-gray-600"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLastStep ? (
              <>
                <Check className="w-5 h-5" />
                <span>Complete</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-5 shadow-md">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-2 shadow-md flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-bold mb-1.5">
              💪 Pro Tip: Fill in required information!
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed mb-2">
              Fill in the required details to unlock the next step. Required
              steps must have at least basic information filled. You can always
              go back to edit any completed step by clicking on it above.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4 rounded border-2 border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-600" />
                </span>
                Completed
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"></span>
                Current
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4 rounded border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Locked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizard;
