/**
 * Resume Content Limits and Validation
 * Defines character limits for each field to ensure single-page resume
 */

// Character limits for single-page resume (A4 size)
export const FIELD_LIMITS = {
  // Personal Information
  name: 100,
  email: 100,
  phone: 20,
  location: 100,
  linkedin: 200,
  github: 200,
  portfolio: 200,

  // Summary Section
  summary: 600, // ~100-120 words

  // Skills Section (per category)
  skillCategory: 50,
  skillsPerCategory: 300, // comma-separated skills

  // Experience Section (per job)
  experienceCompany: 100,
  experienceTitle: 100,
  experienceLocation: 100,
  experienceBullets: 5, // max bullets per job
  experienceBulletLength: 200, // characters per bullet

  // Education Section (per degree)
  educationInstitution: 100,
  educationDegree: 100,
  educationField: 100,
  educationLocation: 100,
  educationGPA: 10,
  educationBullets: 3, // max bullets per degree
  educationBulletLength: 150,

  // Projects Section (per project)
  projectName: 100,
  projectDescription: 150,
  projectTechnologies: 200,
  projectBullets: 4,
  projectBulletLength: 150,

  // Certifications (per certification)
  certificationName: 100,
  certificationIssuer: 100,

  // Achievements (per achievement)
  achievementDescription: 200,

  // Custom Sections
  customSectionTitle: 50,
  customSectionContent: 150,

  // Maximum counts to prevent page overflow
  maxSkillCategories: 6,
  maxExperienceJobs: 5,
  maxEducationEntries: 3,
  maxProjects: 4,
  maxCertifications: 5,
  maxAchievements: 5,
  maxCustomSections: 2,
};

// Total content limits (approximate)
export const PAGE_LIMITS = {
  // Approximate character count that fits on one page
  totalCharacters: 3500,
<<<<<<< HEAD
  
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  // Approximate line count for A4 page (with margins)
  totalLines: 45,
};

/**
 * Calculate approximate content size for a resume
 * @param {Object} resumeData - Resume data object
 * @returns {Object} - Content metrics
 */
export const calculateContentMetrics = (resumeData) => {
<<<<<<< HEAD
  if (!resumeData) return { totalChars: 0, estimatedLines: 0, sections: {} };
=======
  if (!resumeData) return {totalChars: 0, estimatedLines: 0, sections: {}};
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

  let totalChars = 0;
  let estimatedLines = 0;
  const sections = {};

  // Helper to count characters in a string
  const countChars = (str) => (str || "").length;

  // Helper to count lines (roughly 100 chars per line for resume templates)
  // Resume templates use smaller fonts and better spacing, so more chars fit per line
  const charsToLines = (chars) => Math.ceil(chars / 100);

  // Personal Information
  const personalChars =
    countChars(resumeData.name) +
    countChars(resumeData.contact?.email) +
    countChars(resumeData.contact?.phone) +
    countChars(resumeData.contact?.location) +
    countChars(resumeData.contact?.linkedin) +
    countChars(resumeData.contact?.github) +
    countChars(resumeData.contact?.portfolio);
<<<<<<< HEAD
  
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  sections.personal = {
    chars: personalChars,
    lines: Math.max(3, charsToLines(personalChars)), // minimum 3 lines for header
  };

  // Summary
  const summaryChars = countChars(resumeData.summary);
  sections.summary = {
    chars: summaryChars,
    lines: summaryChars > 0 ? 1 + charsToLines(summaryChars) : 0, // +1 for title
  };

  // Skills
  let skillsChars = 0;
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    resumeData.skills.forEach((skillGroup) => {
      skillsChars += countChars(skillGroup.category);
      if (Array.isArray(skillGroup.items)) {
        skillsChars += skillGroup.items.join(", ").length;
      }
    });
  }
  sections.skills = {
    chars: skillsChars,
    lines: skillsChars > 0 ? 1 + Math.max(2, charsToLines(skillsChars)) : 0,
  };

  // Experience
  let experienceChars = 0;
  let experienceLines = 0;
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp) => {
      experienceChars +=
        countChars(exp.company) +
        countChars(exp.title) +
        countChars(exp.location) +
        countChars(exp.startDate) +
        countChars(exp.endDate);
<<<<<<< HEAD
      
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
      if (exp.bullets && Array.isArray(exp.bullets)) {
        exp.bullets.forEach((bullet) => {
          experienceChars += countChars(bullet);
        });
      }
      experienceLines += 2; // Company + title line, date line
      if (exp.bullets) experienceLines += exp.bullets.length;
    });
  }
  sections.experience = {
    chars: experienceChars,
    lines: experienceChars > 0 ? 1 + experienceLines : 0, // +1 for section title
  };

  // Education
  let educationChars = 0;
  let educationLines = 0;
  if (resumeData.education && Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu) => {
      educationChars +=
        countChars(edu.institution) +
        countChars(edu.degree) +
        countChars(edu.field) +
        countChars(edu.location) +
        countChars(edu.gpa);
<<<<<<< HEAD
      
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
      if (edu.bullets && Array.isArray(edu.bullets)) {
        edu.bullets.forEach((bullet) => {
          educationChars += countChars(bullet);
        });
      }
      educationLines += 2; // Institution line, degree/field line
      if (edu.bullets) educationLines += edu.bullets.length;
    });
  }
  sections.education = {
    chars: educationChars,
    lines: educationChars > 0 ? 1 + educationLines : 0,
  };

  // Projects
  let projectsChars = 0;
  let projectsLines = 0;
  if (resumeData.projects && Array.isArray(resumeData.projects)) {
    resumeData.projects.forEach((proj) => {
      projectsChars +=
        countChars(proj.name) +
        countChars(proj.description) +
        countChars(proj.technologies);
<<<<<<< HEAD
      
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
      if (proj.bullets && Array.isArray(proj.bullets)) {
        proj.bullets.forEach((bullet) => {
          projectsChars += countChars(bullet);
        });
      }
      projectsLines += 2; // Project name, description/tech
      if (proj.bullets) projectsLines += proj.bullets.length;
    });
  }
  sections.projects = {
    chars: projectsChars,
    lines: projectsChars > 0 ? 1 + projectsLines : 0,
  };

  // Certifications
  let certificationsChars = 0;
  if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
    resumeData.certifications.forEach((cert) => {
      certificationsChars +=
<<<<<<< HEAD
        countChars(cert.name) +
        countChars(cert.issuer) +
        countChars(cert.date);
=======
        countChars(cert.name) + countChars(cert.issuer) + countChars(cert.date);
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    });
  }
  sections.certifications = {
    chars: certificationsChars,
    lines:
      certificationsChars > 0
        ? 1 + Math.ceil(resumeData.certifications.length * 0.8)
        : 0,
  };

  // Achievements
  let achievementsChars = 0;
  if (resumeData.achievements && Array.isArray(resumeData.achievements)) {
    resumeData.achievements.forEach((ach) => {
      achievementsChars += countChars(ach.description);
    });
  }
  sections.achievements = {
    chars: achievementsChars,
    lines:
      achievementsChars > 0
        ? 1 + Math.ceil(resumeData.achievements.length * 0.8)
        : 0,
  };

  // Custom Sections
  let customChars = 0;
  let customLines = 0;
  if (resumeData.customSections && Array.isArray(resumeData.customSections)) {
    resumeData.customSections.forEach((section) => {
      customChars += countChars(section.title) + countChars(section.content);
      customLines += 1 + charsToLines(countChars(section.content));
    });
  }
  sections.custom = {
    chars: customChars,
    lines: customLines,
  };

  // Calculate totals
  Object.values(sections).forEach((section) => {
    totalChars += section.chars;
    estimatedLines += section.lines;
  });

  return {
    totalChars,
    estimatedLines,
    sections,
    exceedsOnePage: estimatedLines > PAGE_LIMITS.totalLines,
<<<<<<< HEAD
    utilizationPercent: Math.round((estimatedLines / PAGE_LIMITS.totalLines) * 100),
=======
    utilizationPercent: Math.round(
      (estimatedLines / PAGE_LIMITS.totalLines) * 100
    ),
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  };
};

/**
 * Check if adding content would exceed page limit
 * @param {Object} resumeData - Current resume data
 * @param {string} section - Section being modified
 * @param {number} additionalChars - Characters being added
 * @returns {boolean} - True if would exceed limit
 */
<<<<<<< HEAD
export const wouldExceedPageLimit = (resumeData, section, additionalChars = 0) => {
  const currentMetrics = calculateContentMetrics(resumeData);
  const estimatedNewChars = currentMetrics.totalChars + additionalChars;
  const estimatedNewLines = Math.ceil(estimatedNewChars / 80);
  
=======
export const wouldExceedPageLimit = (
  resumeData,
  section,
  additionalChars = 0
) => {
  const currentMetrics = calculateContentMetrics(resumeData);
  const estimatedNewChars = currentMetrics.totalChars + additionalChars;
  const estimatedNewLines = Math.ceil(estimatedNewChars / 80);

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  return estimatedNewLines > PAGE_LIMITS.totalLines;
};

/**
 * Validate field length against limits
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @returns {Object} - Validation result
 */
export const validateFieldLength = (field, value) => {
  const limit = FIELD_LIMITS[field];
<<<<<<< HEAD
  
  if (!limit) {
    return { valid: true, remaining: Infinity };
=======

  if (!limit) {
    return {valid: true, remaining: Infinity};
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  }

  const length = (value || "").length;
  const valid = length <= limit;
  const remaining = limit - length;

  return {
    valid,
    remaining,
    limit,
    current: length,
    exceeded: Math.max(0, length - limit),
  };
};

/**
 * Get suggested content reductions to fit one page
 * @param {Object} resumeData - Resume data
 * @param {Object} metrics - Content metrics
 * @returns {Array} - Suggested reductions
 */
export const getSuggestedReductions = (metrics) => {
  const suggestions = [];
  const excessLines = metrics.estimatedLines - PAGE_LIMITS.totalLines;

  if (excessLines <= 0) return suggestions;

  // Prioritize reductions based on common best practices
  if (metrics.sections.summary?.lines > 5) {
    suggestions.push({
      section: "Summary",
      action: "Reduce summary to 3-4 lines (80-100 words)",
      estimatedSavings: Math.max(0, metrics.sections.summary.lines - 4),
    });
  }

  if (metrics.sections.experience?.lines > 20) {
    suggestions.push({
      section: "Experience",
<<<<<<< HEAD
      action: "Limit to 4-5 bullet points per job, focus on recent/relevant roles",
      estimatedSavings: Math.ceil((metrics.sections.experience.lines - 20) * 0.6),
=======
      action:
        "Limit to 4-5 bullet points per job, focus on recent/relevant roles",
      estimatedSavings: Math.ceil(
        (metrics.sections.experience.lines - 20) * 0.6
      ),
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    });
  }

  if (metrics.sections.skills?.lines > 4) {
    suggestions.push({
      section: "Skills",
      action: "Condense to 3-4 most relevant skill categories",
      estimatedSavings: Math.max(0, metrics.sections.skills.lines - 3),
    });
  }

  if (metrics.sections.projects?.lines > 8) {
    suggestions.push({
      section: "Projects",
      action: "Limit to 2-3 most impressive projects",
      estimatedSavings: Math.ceil((metrics.sections.projects.lines - 6) * 0.5),
    });
  }

  return suggestions;
};
