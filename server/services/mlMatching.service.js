import {analyzeResumeJobMatch} from "./gemini.service.js";

/**
 * AI Job Matching Service
 * Uses Google Gemini AI API to perform semantic analysis between resumes and job descriptions
 * Note: This is AI-as-a-Service (API integration), not custom ML model training
 */

/**
 * Calculate match score between resume and job description
 * @param {Object} resumeData - Structured resume data
 * @param {String} jobDescription - Job description text
 * @returns {Object} Match analysis results
 */
const calculateMatchScore = async (resumeData, jobDescription) => {
  try {
    // Build resume text from structured data
    const resumeText = buildResumeText(resumeData);

    console.log("📊 Analyzing resume vs job match with Gemini AI...");

    // Use existing Gemini service function
    const {data: analysis, tokenUsage} = await analyzeResumeJobMatch(
      resumeText,
      jobDescription
    );

    console.log(`✅ Match analysis complete: ${analysis.match_score}%`);

    // Return formatted result matching our expected structure
    return {
      matchPercentage: analysis.match_score,
      matchedSkills: analysis.present_keywords || [],
      missingSkills: analysis.missing_keywords || [],
      matchedExperience: [], // Not provided by current analysis
      strengths: analysis.strengths || [],
      weaknesses: [], // Can be derived from improvements if needed
      suggestions: analysis.improvements || [],
      assessment: `Match Score: ${analysis.match_score}%. ${
        analysis.eligible
          ? "Candidate is likely to pass ATS screening."
          : "Candidate may need to improve resume to pass ATS screening."
      }`,
      tokensUsed: tokenUsage.totalTokens || 0,
    };
  } catch (error) {
    console.error("ML Matching Error:", error);
    throw new Error(`Failed to calculate match score: ${error.message}`);
  }
};

/**
 * Analyze skill gaps and provide learning recommendations
 * @param {Object} resumeData - Resume data
 * @param {String} jobDescription - Job description
 * @returns {Object} Skill gap analysis
 */
const analyzeSkillGaps = async (resumeData, jobDescription) => {
  try {
    // Get match score first
    const matchResult = await calculateMatchScore(resumeData, jobDescription);

    // Build learning recommendations based on missing skills
    const recommendations = buildLearningRecommendations(
      matchResult.missingSkills
    );

    return {
      ...matchResult,
      learningRecommendations: recommendations,
      prioritySkills: matchResult.missingSkills.slice(0, 5), // Top 5 priority skills
    };
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    throw new Error(`Failed to analyze skill gaps: ${error.message}`);
  }
};

/**
 * Build resume text from structured data
 */
const buildResumeText = (resumeData) => {
  let text = "";

  // Personal Info
  if (resumeData.personalInfo) {
    text += `Name: ${resumeData.personalInfo.name || "N/A"}\n`;
    text += `Email: ${resumeData.personalInfo.email || "N/A"}\n`;
    if (resumeData.personalInfo.location) {
      text += `Location: ${resumeData.personalInfo.location}\n`;
    }
    text += "\n";
  } else if (resumeData.name) {
    // Fallback for simpler format
    text += `Name: ${resumeData.name}\n`;
    if (resumeData.email) text += `Email: ${resumeData.email}\n`;
    text += "\n";
  }

  // Summary
  if (resumeData.summary) {
    text += `PROFESSIONAL SUMMARY:\n${resumeData.summary}\n\n`;
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += `SKILLS:\n`;

    // Check if skills is an array of strings or objects with grouped format
    if (typeof resumeData.skills[0] === "string") {
      // Simple array of skills
      text += resumeData.skills.join(", ") + "\n\n";
    } else if (resumeData.skills[0].items) {
      // Grouped skills with categories
      resumeData.skills.forEach((skillGroup) => {
        if (skillGroup.category && skillGroup.items) {
          text += `${skillGroup.category}: ${skillGroup.items.join(", ")}\n`;
        }
      });
      text += "\n";
    }
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    text += `EXPERIENCE:\n`;
    resumeData.experience.forEach((exp) => {
      text += `${exp.role || exp.title || "Position"} at ${
        exp.company || "Company"
      }\n`;
      text += `${exp.startDate || ""} - ${
        exp.endDate || exp.current ? "Present" : ""
      }\n`;

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach((resp) => {
          text += `• ${resp}\n`;
        });
      }
      text += "\n";
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += `EDUCATION:\n`;
    resumeData.education.forEach((edu) => {
      text += `${edu.degree || "Degree"} - ${
        edu.institution || edu.school || "Institution"
      }\n`;
      if (edu.graduationDate || edu.year) {
        text += `Graduated: ${edu.graduationDate || edu.year}\n`;
      }
      if (edu.gpa) {
        text += `GPA: ${edu.gpa}\n`;
      }
      text += "\n";
    });
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    text += `PROJECTS:\n`;
    resumeData.projects.forEach((project) => {
      text += `${project.name || "Project"}\n`;
      if (project.description) {
        text += `${project.description}\n`;
      }
      if (project.technologies && project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(", ")}\n`;
      }
      text += "\n";
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    text += `CERTIFICATIONS:\n`;
    resumeData.certifications.forEach((cert) => {
      text += `${cert.name || "Certification"} - ${cert.issuer || "Issuer"} (${
        cert.date || "Date"
      })\n`;
    });
    text += "\n";
  }

  return text.trim();
};

/**
 * Build learning recommendations for missing skills
 */
const buildLearningRecommendations = (missingSkills) => {
  const recommendations = [];

  // Common learning resources for various skills
  const skillResources = {
    React: {
      name: "React.js",
      resources: [
        "Official React Documentation",
        "React - The Complete Guide (Udemy)",
        "Frontend Masters React Path",
      ],
    },
    "Node.js": {
      name: "Node.js",
      resources: [
        "Node.js Documentation",
        "The Complete Node.js Developer Course",
        "Learn Node.js on freeCodeCamp",
      ],
    },
    Docker: {
      name: "Docker",
      resources: [
        "Docker Official Tutorials",
        "Docker Mastery Course",
        "Play with Docker Labs",
      ],
    },
    Kubernetes: {
      name: "Kubernetes",
      resources: [
        "Kubernetes Official Tutorials",
        "Certified Kubernetes Administrator (CKA)",
        "Kubernetes for Beginners",
      ],
    },
    AWS: {
      name: "AWS",
      resources: [
        "AWS Free Tier",
        "AWS Certified Solutions Architect",
        "AWS Training and Certification",
      ],
    },
    TypeScript: {
      name: "TypeScript",
      resources: [
        "TypeScript Official Handbook",
        "Understanding TypeScript Course",
        "TypeScript Deep Dive Book",
      ],
    },
    GraphQL: {
      name: "GraphQL",
      resources: [
        "How to GraphQL Tutorial",
        "Apollo GraphQL Documentation",
        "GraphQL.org Official Site",
      ],
    },
  };

  missingSkills.forEach((skill) => {
    // Try to find matching resource
    const resourceKey = Object.keys(skillResources).find((key) =>
      skill.toLowerCase().includes(key.toLowerCase())
    );

    if (resourceKey) {
      recommendations.push({
        skill,
        ...skillResources[resourceKey],
      });
    } else {
      // Generic recommendation
      recommendations.push({
        skill,
        name: skill,
        resources: [
          `Search "${skill} tutorial" on YouTube`,
          `Take a course on Udemy or Coursera`,
          `Read official ${skill} documentation`,
        ],
      });
    }
  });

  return recommendations;
};

export default {
  calculateMatchScore,
  analyzeSkillGaps,
};
