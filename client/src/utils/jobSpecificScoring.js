import {getJobProfile} from "./jobProfiles";

/**
 * Calculate job-specific resume score
 * @param {Object} resumeData - The resume data
 * @param {string} jobType - The job profile key (e.g., 'software-engineer')
 * @param {Array} customTechStack - Optional custom tech stack to match against
 * @returns {Object} Detailed scoring breakdown
 */
export const calculateJobSpecificScore = (
  resumeData,
  jobType,
  customTechStack = []
) => {
  const jobProfile = getJobProfile(jobType);

  if (!jobProfile) {
    throw new Error(`Invalid job type: ${jobType}`);
  }

  const scores = {
    technical: calculateTechnicalScore(resumeData, jobProfile, customTechStack),
    experience: calculateExperienceScore(resumeData, jobProfile),
    projects: calculateProjectsScore(resumeData, jobProfile),
    education: calculateEducationScore(resumeData, jobProfile),
  };

  // Apply job-specific weights
  const weightedScore =
    scores.technical.score * jobProfile.weights.technical +
    scores.experience.score * jobProfile.weights.experience +
    scores.projects.score * jobProfile.weights.projects +
    scores.education.score * jobProfile.weights.education;

  const totalScore = Math.round(weightedScore);

  return {
    totalScore,
    breakdown: scores,
    jobProfile,
    recommendations: generateJobSpecificRecommendations(
      scores,
      jobProfile,
      resumeData
    ),
    matchedSkills: scores.technical.matched,
    missingSkills: scores.technical.missing,
    level: getScoreLevel(totalScore),
  };
};

/**
 * Calculate technical skills score based on job requirements
 */
const calculateTechnicalScore = (resumeData, jobProfile, customTechStack) => {
  const skills = resumeData?.skills || [];
  const allRequiredSkills = [
    ...(jobProfile.requiredSkills.programming || []),
    ...(jobProfile.requiredSkills.frameworks || []),
    ...(jobProfile.requiredSkills.databases || []),
    ...(jobProfile.requiredSkills.tools || []),
    ...(jobProfile.requiredSkills.concepts || []),
    ...customTechStack,
  ];

  // Flatten skills from resume
  const resumeSkills = skills
    .flatMap((category) =>
      Array.isArray(category.items) ? category.items : []
    )
    .map((skill) => skill.toLowerCase());

  // Match skills
  const matched = [];
  const missing = [];

  allRequiredSkills.forEach((reqSkill) => {
    const isMatched = resumeSkills.some(
      (skill) =>
        skill.includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(skill)
    );

    if (isMatched) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  });

  const matchPercentage =
    allRequiredSkills.length > 0
      ? (matched.length / allRequiredSkills.length) * 100
      : 0;

  let score = 0;
  if (matchPercentage >= 80) score = 100;
  else if (matchPercentage >= 60) score = 85;
  else if (matchPercentage >= 40) score = 70;
  else if (matchPercentage >= 20) score = 50;
  else score = 30;

  return {
    score,
    matched,
    missing: missing.slice(0, 10), // Top 10 missing skills
    matchPercentage: Math.round(matchPercentage),
    details: `Matched ${matched.length}/${
      allRequiredSkills.length
    } required skills (${Math.round(matchPercentage)}%)`,
  };
};

/**
 * Calculate experience score based on job requirements
 */
const calculateExperienceScore = (resumeData, jobProfile) => {
  const experience = resumeData?.experience || [];
  let score = 0;
  const feedback = [];

  // Check if experience exists
  if (experience.length === 0) {
    return {
      score: jobProfile.minExperience > 0 ? 20 : 60,
      details: "No experience listed",
      feedback: ["Add at least 1-2 relevant work experiences"],
    };
  }

  // Base score for having experience
  score = 40;

  // Check for experience quantity
  if (experience.length >= 3) {
    score += 20;
    feedback.push("Good amount of experience entries");
  } else if (experience.length >= 2) {
    score += 15;
  } else {
    feedback.push("Consider adding more experience entries");
  }

  // Check for relevant keywords in experience
  const experienceText = experience
    .map(
      (exp) =>
        `${exp.title || ""} ${exp.company || ""} ${(exp.bullets || []).join(
          " "
        )}`
    )
    .join(" ")
    .toLowerCase();

  const keywordMatches = jobProfile.experienceKeywords.filter((keyword) =>
    experienceText.includes(keyword.toLowerCase())
  );

  const keywordScore = Math.min(
    30,
    (keywordMatches.length / jobProfile.experienceKeywords.length) * 30
  );
  score += keywordScore;

  if (keywordMatches.length < 3) {
    feedback.push("Add more action verbs specific to this role");
  }

  // Check for metrics and quantification
  const hasMetrics = /\d+%|\$\d+|\d+x|\d+ users|\d+ customers/i.test(
    experienceText
  );
  if (hasMetrics) {
    score += 10;
    feedback.push("Great use of metrics!");
  } else {
    feedback.push("Add quantifiable achievements (%, $, numbers)");
  }

  return {
    score: Math.min(100, Math.round(score)),
    matchedKeywords: keywordMatches,
    details: `${keywordMatches.length}/${jobProfile.experienceKeywords.length} relevant keywords found`,
    feedback,
  };
};

/**
 * Calculate projects score
 */
const calculateProjectsScore = (resumeData, jobProfile) => {
  const projects = resumeData?.projects || [];
  let score = 0;
  const feedback = [];

  if (projects.length === 0) {
    return {
      score: 40,
      details: "No projects listed",
      feedback: ["Add 2-3 relevant projects to showcase skills"],
    };
  }

  // Base score for having projects
  score = 50;

  // Score based on project count
  if (projects.length >= 3) {
    score += 25;
    feedback.push("Good variety of projects");
  } else if (projects.length >= 2) {
    score += 20;
  } else {
    feedback.push("Add more projects to strengthen portfolio");
  }

  // Check for project links
  const hasLinks = projects.some((proj) => proj.link);
  if (hasLinks) {
    score += 15;
    feedback.push("Great! Projects include links");
  } else {
    feedback.push("Add GitHub/demo links to projects");
  }

  // Check for relevant technologies
  const projectTech = projects
    .flatMap((proj) => proj.technologies || [])
    .map((tech) => tech.toLowerCase());

  const allJobSkills = [
    ...(jobProfile.requiredSkills.programming || []),
    ...(jobProfile.requiredSkills.frameworks || []),
  ].map((skill) => skill.toLowerCase());

  const techMatches = projectTech.filter((tech) =>
    allJobSkills.some((skill) => tech.includes(skill) || skill.includes(tech))
  );

  if (techMatches.length >= 3) {
    score += 10;
    feedback.push("Projects align well with job requirements");
  }

  return {
    score: Math.min(100, Math.round(score)),
    details: `${projects.length} projects listed`,
    feedback,
  };
};

/**
 * Calculate education score
 */
const calculateEducationScore = (resumeData, jobProfile) => {
  const education = resumeData?.education || [];
  let score = 60; // Base score

  if (education.length === 0) {
    return {
      score: 50,
      details: "No education listed",
      feedback: ["Add your educational background"],
    };
  }

  const feedback = [];

  // Check for relevant degrees
  const educationText = education
    .map((edu) => `${edu.degree || ""} ${edu.field || ""}`)
    .join(" ")
    .toLowerCase();

  const relevantFields = [
    "computer science",
    "software engineering",
    "information technology",
    "data science",
    "computer engineering",
    "mathematics",
    "statistics",
  ];

  const hasRelevantDegree = relevantFields.some((field) =>
    educationText.includes(field)
  );

  if (hasRelevantDegree) {
    score += 30;
    feedback.push("Relevant degree field");
  } else {
    score += 15;
  }

  // Check for additional qualifications
  if (education.length > 1) {
    score += 10;
    feedback.push("Multiple education entries");
  }

  return {
    score: Math.min(100, Math.round(score)),
    details: `${education.length} education entries`,
    feedback,
  };
};

/**
 * Generate job-specific recommendations
 */
const generateJobSpecificRecommendations = (scores, jobProfile, resumeData) => {
  const recommendations = [];

  // Technical skills recommendations
  if (scores.technical.score < 70) {
    recommendations.push({
      category: "Technical Skills",
      priority: "high",
      message: `Add ${scores.technical.missing
        .slice(0, 5)
        .join(", ")} to your skills section`,
      impact: "+15-20 points",
    });
  }

  // Experience recommendations
  if (scores.experience.score < 70) {
    recommendations.push({
      category: "Experience",
      priority: "high",
      message: `Use action verbs like: ${jobProfile.experienceKeywords
        .slice(0, 3)
        .join(", ")}`,
      impact: "+10-15 points",
    });

    if (!/\d+%|\$\d+|\d+x/.test(JSON.stringify(resumeData.experience))) {
      recommendations.push({
        category: "Experience",
        priority: "high",
        message:
          "Add quantifiable metrics (%, $, numbers) to your achievements",
        impact: "+10 points",
      });
    }
  }

  // Projects recommendations
  if (scores.projects.score < 70) {
    recommendations.push({
      category: "Projects",
      priority: "medium",
      message: "Add 2-3 projects using technologies from the job requirements",
      impact: "+10-15 points",
    });
  }

  // Education recommendations
  if (scores.education.score < 60) {
    recommendations.push({
      category: "Education",
      priority: "low",
      message: "Add your educational background and certifications",
      impact: "+5-10 points",
    });
  }

  // Missing critical skills
  if (scores.technical.missing.length > 5) {
    recommendations.push({
      category: "Skills Gap",
      priority: "high",
      message: `Consider learning: ${scores.technical.missing
        .slice(0, 3)
        .join(", ")}`,
      impact: "Improve job match",
    });
  }

  return recommendations;
};

/**
 * Get score level classification
 */
const getScoreLevel = (score) => {
  if (score >= 90) {
    return {
      label: "Excellent Match",
      color: "green",
      description: "Your resume is highly competitive for this role",
    };
  } else if (score >= 75) {
    return {
      label: "Good Match",
      color: "blue",
      description: "Your resume meets most requirements",
    };
  } else if (score >= 60) {
    return {
      label: "Fair Match",
      color: "yellow",
      description: "Some improvements needed to be competitive",
    };
  } else {
    return {
      label: "Needs Improvement",
      color: "red",
      description: "Significant improvements needed for this role",
    };
  }
};

/**
 * Compare resume against multiple job types
 */
export const compareAgainstJobs = (resumeData, jobTypes) => {
  return jobTypes
    .map((jobType) => {
      const result = calculateJobSpecificScore(resumeData, jobType);
      return {
        jobType,
        ...result,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
};
