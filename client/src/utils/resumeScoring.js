/**
 * ATS Resume Scoring Algorithm
 * Analyzes resume quality and ATS-friendliness with a 0-100 score
 */

// Common ATS action verbs
const ACTION_VERBS = [
  "achieved",
  "led",
  "managed",
  "developed",
  "created",
  "implemented",
  "designed",
  "built",
  "increased",
  "decreased",
  "improved",
  "reduced",
  "launched",
  "initiated",
  "drove",
  "spearheaded",
  "established",
  "coordinated",
  "executed",
  "delivered",
  "optimized",
  "streamlined",
  "automated",
  "enhanced",
  "resolved",
  "collaborated",
  "directed",
];

// Common technical/professional keywords
const KEYWORDS = [
  "project",
  "team",
  "analysis",
  "strategy",
  "metrics",
  "data",
  "growth",
  "revenue",
  "client",
  "customer",
  "stakeholder",
  "budget",
  "performance",
  "quality",
  "process",
  "efficiency",
  "innovation",
];

/**
 * Calculate comprehensive resume score
 * @param {Object} resumeData - Resume data object
 * @returns {Object} - Score and detailed breakdown
 */
export function calculateResumeScore(resumeData) {
  if (!resumeData) {
    return {
      totalScore: 0,
      breakdown: {},
      recommendations: ["No resume data available"],
    };
  }

  const scores = {
    contact: scoreContact(resumeData.contact),
    summary: scoreSummary(resumeData.summary),
    skills: scoreSkills(resumeData.skills),
    experience: scoreExperience(resumeData.experience),
    education: scoreEducation(resumeData.education),
    extras: scoreExtras(resumeData),
    formatting: scoreFormatting(resumeData),
    keywords: scoreKeywords(resumeData),
  };

  const totalScore = Math.round(
    scores.contact.score +
      scores.summary.score +
      scores.skills.score +
      scores.experience.score +
      scores.education.score +
      scores.extras.score +
      scores.formatting.score +
      scores.keywords.score
  );

  const recommendations = generateRecommendations(scores, resumeData);

  return {
    totalScore,
    breakdown: scores,
    recommendations,
    level: getScoreLevel(totalScore),
  };
}

/**
 * Score contact information completeness (0-10 points)
 */
function scoreContact(contact) {
  if (!contact) {
    return {
      score: 0,
      maxScore: 10,
      details: "No contact information provided",
      issues: ["Missing all contact details"],
    };
  }

  const fields = ["email", "phone", "location", "linkedin", "github"];
  const provided = fields.filter((field) => contact[field]?.trim()).length;
  const score = Math.round((provided / fields.length) * 10);

  const issues = [];
  if (!contact.email) issues.push("Missing email address");
  if (!contact.phone) issues.push("Missing phone number");
  if (!contact.location) issues.push("Missing location");
  if (!contact.linkedin) issues.push("Missing LinkedIn profile");
  if (!contact.github) issues.push("Missing GitHub profile");

  return {
    score,
    maxScore: 10,
    details: `${provided}/${fields.length} contact fields completed`,
    issues,
  };
}

/**
 * Score professional summary quality (0-10 points)
 */
function scoreSummary(summary) {
  if (!summary?.trim()) {
    return {
      score: 0,
      maxScore: 10,
      details: "No professional summary",
      issues: [
        "Add a 3-4 sentence professional summary highlighting your expertise",
      ],
    };
  }

  const wordCount = summary.trim().split(/\s+/).length;
  const hasActionWords = ACTION_VERBS.some((verb) =>
    summary.toLowerCase().includes(verb)
  );
  const hasNumbers = /\d+/.test(summary);

  let score = 0;
  const issues = [];

  // Length check (optimal 50-100 words)
  if (wordCount >= 50 && wordCount <= 100) {
    score += 5;
  } else if (wordCount >= 30 && wordCount < 50) {
    score += 3;
    issues.push("Summary is a bit short, aim for 50-100 words");
  } else if (wordCount > 100) {
    score += 3;
    issues.push("Summary is too long, keep it under 100 words");
  } else {
    issues.push("Summary is too short, expand to 50-100 words");
  }

  // Content quality
  if (hasActionWords) {
    score += 3;
  } else {
    issues.push("Include strong action verbs (achieved, led, developed, etc.)");
  }

  if (hasNumbers) {
    score += 2;
  } else {
    issues.push("Add quantifiable achievements or years of experience");
  }

  return {
    score,
    maxScore: 10,
    details: `${wordCount} words, ${
      hasActionWords ? "has" : "lacks"
    } action verbs`,
    issues,
  };
}

/**
 * Score skills section (0-10 points)
 */
function scoreSkills(skills) {
  if (!skills || skills.length === 0) {
    return {
      score: 0,
      maxScore: 10,
      details: "No skills listed",
      issues: ["Add at least 3 skill categories with 4-6 skills each"],
    };
  }

  const totalSkills = skills.reduce(
    (sum, cat) => sum + (cat.items?.length || 0),
    0
  );
  const categoryCount = skills.length;

  let score = 0;
  const issues = [];

  // Number of categories (ideal: 3-5)
  if (categoryCount >= 3 && categoryCount <= 5) {
    score += 5;
  } else if (categoryCount >= 2) {
    score += 3;
    if (categoryCount < 3)
      issues.push("Add more skill categories (aim for 3-5)");
  } else {
    issues.push("Add at least 3 skill categories");
  }

  // Total skills count (ideal: 12-30)
  if (totalSkills >= 12 && totalSkills <= 30) {
    score += 5;
  } else if (totalSkills >= 8) {
    score += 3;
    if (totalSkills < 12) issues.push("Add more skills (aim for 12-30 total)");
  } else {
    issues.push("Add more skills to demonstrate breadth of expertise");
  }

  return {
    score,
    maxScore: 10,
    details: `${categoryCount} categories, ${totalSkills} total skills`,
    issues,
  };
}

/**
 * Score experience section (0-25 points) - MOST IMPORTANT
 */
function scoreExperience(experience) {
  if (!experience || experience.length === 0) {
    return {
      score: 0,
      maxScore: 25,
      details: "No work experience listed",
      issues: ["Add at least 2 work experiences with detailed accomplishments"],
    };
  }

  let score = 0;
  const issues = [];

  // Number of experiences (ideal: 2-4)
  if (experience.length >= 2 && experience.length <= 5) {
    score += 5;
  } else if (experience.length === 1) {
    score += 3;
    issues.push("Add more work experiences to show career progression");
  } else if (experience.length > 5) {
    score += 4;
    issues.push("Consider keeping only most recent/relevant 5 positions");
  }

  // Analyze each experience entry
  let totalBullets = 0;
  let bulletsWithNumbers = 0;
  let bulletsWithActionVerbs = 0;
  let experiencesWithAllFields = 0;

  experience.forEach((exp, index) => {
    const bullets = exp.bullets || [];
    totalBullets += bullets.length;

    // Check completeness
    if (exp.company && exp.title && exp.startDate && bullets.length > 0) {
      experiencesWithAllFields++;
    } else {
      issues.push(
        `Experience #${index + 1}: Missing company, title, dates, or bullets`
      );
    }

    // Check bullet quality
    bullets.forEach((bullet) => {
      if (/\d+/.test(bullet)) bulletsWithNumbers++;
      if (ACTION_VERBS.some((verb) => bullet.toLowerCase().startsWith(verb))) {
        bulletsWithActionVerbs++;
      }
    });
  });

  // Completeness score (5 points)
  score += Math.round((experiencesWithAllFields / experience.length) * 5);

  // Bullet count score (5 points) - ideal: 3-5 per experience
  const avgBullets = totalBullets / experience.length;
  if (avgBullets >= 3 && avgBullets <= 5) {
    score += 5;
  } else if (avgBullets >= 2) {
    score += 3;
    if (avgBullets < 3)
      issues.push("Add more bullet points (aim for 3-5 per position)");
  } else {
    issues.push("Add detailed bullet points for each position");
  }

  // Quantification score (5 points)
  const quantificationRate =
    totalBullets > 0 ? bulletsWithNumbers / totalBullets : 0;
  if (quantificationRate >= 0.5) {
    score += 5;
  } else if (quantificationRate >= 0.3) {
    score += 3;
    issues.push("Add more numbers/metrics to quantify achievements");
  } else {
    issues.push("Quantify achievements with numbers, percentages, or metrics");
  }

  // Action verbs score (5 points)
  const actionVerbRate =
    totalBullets > 0 ? bulletsWithActionVerbs / totalBullets : 0;
  if (actionVerbRate >= 0.7) {
    score += 5;
  } else if (actionVerbRate >= 0.4) {
    score += 3;
    issues.push("Start more bullets with strong action verbs");
  } else {
    issues.push(
      "Start each bullet with action verbs (Led, Developed, Achieved, etc.)"
    );
  }

  return {
    score,
    maxScore: 25,
    details: `${
      experience.length
    } positions, ${totalBullets} bullets (${Math.round(
      quantificationRate * 100
    )}% quantified)`,
    issues,
  };
}

/**
 * Score education section (0-10 points)
 */
function scoreEducation(education) {
  if (!education || education.length === 0) {
    return {
      score: 0,
      maxScore: 10,
      details: "No education listed",
      issues: ["Add at least one education entry"],
    };
  }

  let score = 0;
  const issues = [];

  // At least one education entry
  if (education.length >= 1) score += 5;

  // Check completeness
  const complete = education.filter(
    (edu) => edu.institution && edu.degree && edu.field && edu.endDate
  );

  if (complete.length === education.length) {
    score += 5;
  } else {
    score += 3;
    issues.push(
      "Complete all education fields (institution, degree, field, dates)"
    );
  }

  // Check for GPA (bonus)
  const hasGPA = education.some((edu) => edu.gpa);
  if (!hasGPA && education.length > 0) {
    issues.push("Consider adding GPA if 3.5+ or relevant honors/awards");
  }

  return {
    score,
    maxScore: 10,
    details: `${education.length} education entries, ${complete.length} complete`,
    issues,
  };
}

/**
 * Score extras (projects, certifications) (0-10 points)
 */
function scoreExtras(resumeData) {
  const projects = resumeData.projects || [];
  const certifications = resumeData.certifications || [];

  let score = 0;
  const issues = [];

  // Projects (up to 5 points)
  if (projects.length >= 2) {
    score += 5;
  } else if (projects.length === 1) {
    score += 3;
    issues.push("Add more projects to showcase skills (aim for 2-4)");
  } else {
    issues.push("Add relevant projects to demonstrate practical experience");
  }

  // Certifications (up to 5 points)
  if (certifications.length >= 2) {
    score += 5;
  } else if (certifications.length === 1) {
    score += 3;
    issues.push("Add more relevant certifications if available");
  } else {
    issues.push("Add industry certifications to boost credibility");
  }

  return {
    score,
    maxScore: 10,
    details: `${projects.length} projects, ${certifications.length} certifications`,
    issues,
  };
}

/**
 * Score formatting quality (0-15 points)
 */
function scoreFormatting(resumeData) {
  let score = 0;
  const issues = [];

  // Has name (3 points)
  if (resumeData.name?.trim()) {
    score += 3;
  } else {
    issues.push("Add your full name");
  }

  // Consistent date formatting (3 points)
  const allDates = [];
  (resumeData.experience || []).forEach((exp) => {
    if (exp.startDate) allDates.push(exp.startDate);
    if (exp.endDate) allDates.push(exp.endDate);
  });
  (resumeData.education || []).forEach((edu) => {
    if (edu.startDate) allDates.push(edu.startDate);
    if (edu.endDate) allDates.push(edu.endDate);
  });

  // Check if dates follow "Month YYYY" format
  const dateFormatConsistent = allDates.every(
    (date) =>
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(
        date
      ) || date.toLowerCase() === "present"
  );

  if (dateFormatConsistent) {
    score += 3;
  } else {
    score += 1;
    issues.push("Use consistent date format: 'Month YYYY' (e.g., 'Jan 2023')");
  }

  // Section organization (3 points)
  const hasSummary = resumeData.summary?.trim();
  const hasSkills = resumeData.skills?.length > 0;
  const hasExperience = resumeData.experience?.length > 0;
  const hasEducation = resumeData.education?.length > 0;

  const sectionsPresent = [
    hasSummary,
    hasSkills,
    hasExperience,
    hasEducation,
  ].filter(Boolean).length;
  score += Math.round((sectionsPresent / 4) * 3);

  // Length appropriateness (3 points)
  const estimatedLength = estimateResumeLength(resumeData);
  if (estimatedLength >= 400 && estimatedLength <= 800) {
    score += 3;
  } else if (estimatedLength >= 300 && estimatedLength <= 1000) {
    score += 2;
    if (estimatedLength < 400)
      issues.push("Resume seems sparse, add more detail");
    if (estimatedLength > 800)
      issues.push("Resume may be too long, focus on most relevant info");
  } else {
    issues.push(
      estimatedLength < 300
        ? "Add more content to your resume"
        : "Reduce resume length to 1 page"
    );
  }

  // Consistency check (3 points)
  if (resumeData.experience?.length > 0) {
    const bulletsPerExp = resumeData.experience.map(
      (exp) => exp.bullets?.length || 0
    );
    const variance = Math.max(...bulletsPerExp) - Math.min(...bulletsPerExp);
    if (variance <= 2) {
      score += 3;
    } else {
      score += 1;
      issues.push(
        "Keep similar number of bullets per experience (consistency)"
      );
    }
  }

  return {
    score,
    maxScore: 15,
    details: `${sectionsPresent}/4 sections, ${estimatedLength} words estimated`,
    issues,
  };
}

/**
 * Score keyword optimization (0-10 points)
 */
function scoreKeywords(resumeData) {
  const allText = JSON.stringify(resumeData).toLowerCase();

  let score = 0;
  const issues = [];

  // Action verbs presence
  const actionVerbsFound = ACTION_VERBS.filter((verb) =>
    allText.includes(verb)
  );
  const actionVerbScore = Math.min((actionVerbsFound.length / 10) * 5, 5);
  score += actionVerbScore;

  if (actionVerbsFound.length < 8) {
    issues.push(
      `Use more action verbs (found ${actionVerbsFound.length}/10+ recommended)`
    );
  }

  // Professional keywords
  const keywordsFound = KEYWORDS.filter((kw) => allText.includes(kw));
  const keywordScore = Math.min((keywordsFound.length / 8) * 5, 5);
  score += keywordScore;

  if (keywordsFound.length < 6) {
    issues.push(
      `Include more professional keywords (found ${keywordsFound.length}/8+ recommended)`
    );
  }

  return {
    score: Math.round(score),
    maxScore: 10,
    details: `${actionVerbsFound.length} action verbs, ${keywordsFound.length} keywords`,
    issues,
  };
}

/**
 * Generate prioritized recommendations
 */
function generateRecommendations(scores, resumeData) {
  const allIssues = [];

  // Collect all issues with priority
  Object.entries(scores).forEach(([category, data]) => {
    if (data.issues?.length > 0) {
      data.issues.forEach((issue) => {
        allIssues.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          issue,
          priority: getPriority(category, data.score, data.maxScore),
        });
      });
    }
  });

  // Sort by priority (high to low)
  allIssues.sort((a, b) => b.priority - a.priority);

  // Return top recommendations
  return allIssues
    .slice(0, 10)
    .map((item) => `[${item.category}] ${item.issue}`);
}

/**
 * Get priority level for recommendation
 */
function getPriority(category, score, maxScore) {
  const percentage = (score / maxScore) * 100;

  // Critical sections get higher priority
  const categoryWeight = {
    experience: 3,
    summary: 2,
    skills: 2,
    contact: 2,
    education: 1.5,
    extras: 1,
    formatting: 1,
    keywords: 1.5,
  };

  const weight = categoryWeight[category] || 1;

  // Lower scores = higher priority
  return (100 - percentage) * weight;
}

/**
 * Estimate word count for resume length
 */
function estimateResumeLength(resumeData) {
  let wordCount = 0;

  if (resumeData.name) wordCount += resumeData.name.split(/\s+/).length;
  if (resumeData.summary) wordCount += resumeData.summary.split(/\s+/).length;

  (resumeData.experience || []).forEach((exp) => {
    (exp.bullets || []).forEach((bullet) => {
      wordCount += bullet.split(/\s+/).length;
    });
  });

  (resumeData.skills || []).forEach((cat) => {
    wordCount += (cat.items?.length || 0) * 2; // Average 2 words per skill
  });

  wordCount += (resumeData.education?.length || 0) * 10;
  wordCount += (resumeData.projects?.length || 0) * 20;
  wordCount += (resumeData.certifications?.length || 0) * 5;

  return wordCount;
}

/**
 * Get score level description
 */
function getScoreLevel(score) {
  if (score >= 90)
    return {
      label: "Excellent",
      color: "green",
      description: "ATS-optimized and highly competitive",
    };
  if (score >= 80)
    return {
      label: "Very Good",
      color: "green",
      description: "Strong ATS compatibility",
    };
  if (score >= 70)
    return {
      label: "Good",
      color: "yellow",
      description: "Good foundation, room for improvement",
    };
  if (score >= 60)
    return {
      label: "Fair",
      color: "yellow",
      description: "Needs several improvements",
    };
  if (score >= 50)
    return {
      label: "Needs Work",
      color: "orange",
      description: "Significant improvements needed",
    };
  return {
    label: "Poor",
    color: "red",
    description: "Major improvements required",
  };
}
