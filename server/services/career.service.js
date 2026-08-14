import CareerProfile from "../models/CareerProfile.model.js";
import CareerQA from "../models/CareerQA.model.js";
import AdminQuestion from "../models/AdminQuestion.model.js";
import Resume from "../models/Resume.model.js";
import Portfolio from "../models/Portfolio.model.js";
import PortfolioProject from "../models/PortfolioProject.model.js";
import * as aiRouter from "./aiRouter.service.js";
import * as geminiService from "./gemini.service.js";
import * as openaiService from "./openai.service.js";

/**
 * Standard question bank templates
 */
export const DEFAULT_QUESTIONS = [
  // HR
  {
    question: "Tell me about yourself.",
    category: "hr",
  },
  {
    question: "Why should we hire you for this position?",
    category: "hr",
  },
  {
    question: "Why are you interested in joining our company?",
    category: "hr",
  },
  {
    question: "What are your greatest professional strengths?",
    category: "hr",
  },
  {
    question: "What is an area of development or weakness you are working on?",
    category: "hr",
  },
  {
    question: "Where do you see yourself professionally in 5 years?",
    category: "hr",
  },
  {
    question: "Why did you choose your specific field of study/work?",
    category: "hr",
  },

  // Behavioral
  {
    question: "Tell me about a complex or difficult problem you solved.",
    category: "behavioral",
  },
  {
    question: "Tell me about a time you faced a failure or setback and how you handled it.",
    category: "behavioral",
  },
  {
    question: "Describe a mistake you made on a project and what you learned from it.",
    category: "behavioral",
  },
  {
    question: "Tell me about a time you had to deliver under tight deadlines or high pressure.",
    category: "behavioral",
  },
  {
    question: "Describe a situation where you resolved a conflict or disagreement within a team.",
    category: "behavioral",
  },
  {
    question: "Share an example of a time you stepped up and took initiative or leadership.",
    category: "behavioral",
  },
  {
    question: "Describe a time when you had to learn a completely new technology or tool quickly.",
    category: "behavioral",
  },

  // Project
  {
    question: "Walk me through your best or most impactful project.",
    category: "project",
  },
  {
    question: "What was the biggest technical or architectural challenge you overcame in your project?",
    category: "project",
  },
  {
    question: "Why did you choose this specific tech stack over alternatives?",
    category: "project",
  },
  {
    question: "What was your individual contribution versus the rest of the team?",
    category: "project",
  },
  {
    question: "How did you design for scalability, performance, and maintainability?",
    category: "project",
  },
  {
    question: "What were the key takeaways or things you would do differently if you rebuilt it?",
    category: "project",
  },

  // Application
  {
    question: "Why are you a strong fit for this specific role?",
    category: "application",
  },
  {
    question: "Describe your most relevant professional experience related to this opening.",
    category: "application",
  },
  {
    question: "Which of your completed projects is most relevant to the challenges of this role?",
    category: "application",
  },
  {
    question: "What makes your background and approach unique compared to other candidates?",
    category: "application",
  },
];

/**
 * Seed initial Admin Questions if the collection is empty
 */
export const seedAdminQuestionsIfEmpty = async (userId = null) => {
  try {
    const count = await AdminQuestion.countDocuments();
    if (count === 0) {
      const initialDocs = DEFAULT_QUESTIONS.map((q, idx) => ({
        question: q.question,
        category: q.category,
        difficulty: "medium",
        recommendedTone: "conversational",
        recommendedLength: "standard",
        isActive: true,
        order: idx,
        tags: [q.category],
        hint: `Focus on genuine metrics and projects from your career profile when answering.`,
        ...(userId ? { createdBy: userId } : {}),
      }));

      await AdminQuestion.insertMany(initialDocs);
      console.log("✅ Seeded Admin Master Questions Bank successfully");
    }
  } catch (err) {
    console.error("Error auto-seeding Admin Questions:", err);
  }
};

/**
 * Get active master questions (with fallback to DEFAULT_QUESTIONS)
 */
export const getActiveMasterQuestions = async (filter = {}) => {
  try {
    await seedAdminQuestionsIfEmpty();
    const query = { isActive: true };
    if (filter.category && filter.category !== "all" && filter.category !== "saved") {
      query.category = filter.category;
    }
    if (filter.search) {
      query.question = { $regex: filter.search, $options: "i" };
    }

    const questions = await AdminQuestion.find(query).sort({ order: 1, createdAt: 1 }).lean();
    if (questions && questions.length > 0) {
      return questions;
    }
    return DEFAULT_QUESTIONS;
  } catch (err) {
    console.error("Error fetching master questions from DB:", err);
    return DEFAULT_QUESTIONS;
  }
};

/**
 * Calculate profile completeness with weighted section scores and actionable suggestions
 */
export const calculateCompleteness = (profile) => {
  if (!profile) {
    return {
      totalScore: 0,
      sections: {
        personal: 0,
        education: 0,
        skills: 0,
        experience: 0,
        projects: 0,
        achievements: 0,
        certifications: 0,
        leadership: 0,
        additional: 0,
      },
      suggestions: [
        "Fill in your personal information and headline",
        "Add your core technical skills",
        "Add at least one project with measurable metrics",
        "Add your educational background",
      ],
    };
  }

  const suggestions = [];

  // 1. Personal Info (Weight: 15%)
  let personalScore = 0;
  const p = profile.personalInfo || {};
  if (p.fullName?.trim()) personalScore += 25;
  if (p.headline?.trim() || p.bio?.trim()) personalScore += 25;
  if (p.email?.trim() && p.phone?.trim()) personalScore += 25;
  if (p.linkedin?.trim() || p.github?.trim() || p.portfolio?.trim()) personalScore += 25;
  if (personalScore < 75) {
    if (!p.linkedin?.trim()) suggestions.push("Add your LinkedIn or GitHub profile link");
    if (!p.headline?.trim()) suggestions.push("Add a professional headline summarizing your expertise");
  }

  // 2. Education (Weight: 10%)
  let educationScore = 0;
  const eduList = profile.education || [];
  if (eduList.length > 0) {
    educationScore = 50;
    const hasDetails = eduList.some((e) => e.institution && e.degree && (e.gpa || e.percentage || e.relevantCoursework?.length > 0));
    if (hasDetails) educationScore = 100;
  } else {
    suggestions.push("Add your educational background (degree & institution)");
  }

  // 3. Skills (Weight: 15%)
  let skillsScore = 0;
  const skillsList = profile.skills || [];
  if (skillsList.length >= 8) {
    skillsScore = 100;
  } else if (skillsList.length >= 4) {
    skillsScore = 70;
  } else if (skillsList.length > 0) {
    skillsScore = 40;
  }
  if (skillsList.length < 5) {
    suggestions.push("Add at least 5 technical and categorized skills");
  }

  // 4. Experience (Weight: 20%)
  let experienceScore = 0;
  const expList = profile.experience || [];
  if (expList.length > 0) {
    experienceScore = 60;
    const hasDetailedExp = expList.some(
      (e) =>
        e.company &&
        e.position &&
        (e.responsibilities?.length > 0 || e.achievements?.length > 0 || e.description?.length > 50)
    );
    if (hasDetailedExp) experienceScore = 100;
  } else {
    suggestions.push("Add your work or internship experience with key responsibilities");
  }

  // 5. Projects (Weight: 20%)
  let projectsScore = 0;
  const projList = profile.projects || [];
  if (projList.length >= 2) {
    projectsScore = 80;
    const hasMetrics = projList.some((pr) => (pr.metrics && pr.metrics.length > 0) || (pr.problemSolved && pr.solution));
    if (hasMetrics) projectsScore = 100;
  } else if (projList.length === 1) {
    projectsScore = 50;
    const pr = projList[0];
    if (pr.metrics?.length > 0 || pr.solution) projectsScore = 75;
  }
  if (projList.length === 0) {
    suggestions.push("Add at least 1-2 major projects with problem, solution, and tech stack");
  } else if (!projList.some((pr) => pr.metrics && pr.metrics.length > 0)) {
    suggestions.push("Add measurable results or impact metrics to your projects (e.g., 'Reduced latency by 35%')");
  }

  // 6. Achievements (Weight: 10%)
  let achievementsScore = 0;
  const achList = profile.achievements || [];
  if (achList.length > 0) {
    achievementsScore = Math.min(100, achList.length * 50);
  } else {
    suggestions.push("Add any hackathon wins, awards, or academic/professional achievements");
  }

  // 7. Certifications (Weight: 5%)
  let certScore = 0;
  const certList = profile.certifications || [];
  if (certList.length > 0) {
    certScore = 100;
  }

  // 8. Leadership (Weight: 5%)
  let leadershipScore = 0;
  const leadList = profile.leadership || [];
  if (leadList.length > 0) {
    leadershipScore = 100;
  }

  // 9. Additional (Bonus)
  let addScore = 0;
  const add = profile.additionalInfo || {};
  if (
    add.openSource?.length > 0 ||
    add.hackathons?.length > 0 ||
    add.publications?.length > 0 ||
    add.volunteerWork?.length > 0 ||
    add.languages?.length > 0
  ) {
    addScore = 100;
  }

  // Weighted total:
  // Personal: 15%, Education: 10%, Skills: 15%, Experience: 20%, Projects: 20%, Achievements: 10%, Certs: 5%, Leadership: 5%
  const totalScore = Math.round(
    personalScore * 0.15 +
      educationScore * 0.10 +
      skillsScore * 0.15 +
      experienceScore * 0.20 +
      projectsScore * 0.20 +
      achievementsScore * 0.10 +
      certScore * 0.05 +
      leadershipScore * 0.05
  );

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    sections: {
      personal: personalScore,
      education: educationScore,
      skills: skillsScore,
      experience: experienceScore,
      projects: projectsScore,
      achievements: achievementsScore,
      certifications: certScore,
      leadership: leadershipScore,
      additional: addScore,
    },
    suggestions: suggestions.slice(0, 4),
  };
};

/**
 * Execute AI prompt with tier-aware fallback
 */
async function executeAIPrompt(systemPrompt, userPrompt, user) {
  const userTier = user?.subscription?.tier || "free";
  const preferredModel = (userTier === "pro" || userTier === "one-time") ? "gpt4o" : "gemini";

  try {
    if (preferredModel === "gemini" && process.env.GEMINI_API_KEY?.trim()) {
      const response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.3,
        maxOutputTokens: 2000,
        jsonMode: true,
      });
      const textResult = response?.text || response?.content || (typeof response === "string" ? response : "");
      if (textResult) return textResult;
    } else if (process.env.OPENAI_API_KEY?.trim()) {
      const response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.3,
        maxTokens: 2000,
        jsonMode: true,
      });
      const textResult = response?.text || response?.content || (typeof response === "string" ? response : "");
      if (textResult) return textResult;
    } else if (process.env.GEMINI_API_KEY?.trim()) {
      const response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.3,
        maxOutputTokens: 2000,
        jsonMode: true,
      });
      const textResult = response?.text || response?.content || (typeof response === "string" ? response : "");
      if (textResult) return textResult;
    }
  } catch (error) {
    console.error("Primary AI Generation Error, attempting backup provider:", error.message);
    if (process.env.OPENAI_API_KEY?.trim()) {
      try {
        const response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
          temperature: 0.3,
          maxTokens: 2000,
          jsonMode: true,
        });
        const textResult = response?.text || response?.content || (typeof response === "string" ? response : "");
        if (textResult) return textResult;
      } catch (err2) {
        console.error("Secondary OpenAI fallback error:", err2.message);
      }
    }
    if (process.env.GEMINI_API_KEY?.trim()) {
      try {
        const response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
          temperature: 0.3,
          maxOutputTokens: 2000,
          jsonMode: true,
        });
        const textResult = response?.text || response?.content || (typeof response === "string" ? response : "");
        if (textResult) return textResult;
      } catch (err3) {
        console.error("Secondary Gemini fallback error:", err3.message);
      }
    }
  }

  // Graceful structured fallback
  return JSON.stringify({
    answer: "In my professional work, I focus on delivering high-impact solutions through structured problem solving and collaboration. I prioritize understanding core requirements, executing with clean engineering standards, and continuously learning to drive measurable team success.",
    talkingPoints: [
      "Highlights structured approach to execution",
      "Demonstrates proactive collaboration and ownership",
      "Focused on quantifiable results and domain rigor"
    ],
    relatedProjects: [],
    relatedExperience: [],
    missingInfoTip: "Complete your Career Profile sections (projects, experience, metrics) to unlock fully customized AI drafts."
  });
}

/**
 * Fast Import / AI Structuring for a section
 */
export const structureSectionWithAI = async ({ section, rawText, user }) => {
  if (!rawText || !rawText.trim()) {
    throw new Error("Text content is required for AI structuring");
  }

  const systemPrompt = `You are an expert ATS and career profile data parser.
Your task is to take raw, unstructured career notes/text and extract clean, structured JSON matching the requested section schema.
Do NOT invent or hallucinate data that is not present in the user text. Leave unknown fields as empty strings or empty arrays.
Return valid JSON only.`;

  let sectionSchemaDesc = "";

  switch (section) {
    case "personal":
      sectionSchemaDesc = `JSON object with fields:
{
  "fullName": string,
  "preferredName": string,
  "headline": string,
  "bio": string,
  "careerObjective": string,
  "email": string,
  "phone": string,
  "location": string,
  "linkedin": string,
  "github": string,
  "portfolio": string,
  "otherLinks": [ { "label": string, "url": string } ]
}`;
      break;

    case "education":
      sectionSchemaDesc = `JSON array of education objects:
[
  {
    "institution": string,
    "degree": string,
    "fieldOfStudy": string,
    "startDate": string,
    "endDate": string,
    "isCurrent": boolean,
    "gpa": string,
    "percentage": string,
    "relevantCoursework": [ string ],
    "description": string
  }
]`;
      break;

    case "skills":
      sectionSchemaDesc = `JSON array of skill objects:
[
  {
    "name": string,
    "category": one of ["Programming Languages", "Frameworks", "Libraries", "Databases", "Cloud", "DevOps", "Tools", "AI/ML", "Other"],
    "proficiency": one of ["Beginner", "Intermediate", "Advanced", "Expert", ""],
    "yearsOfExperience": string
  }
]`;
      break;

    case "experience":
      sectionSchemaDesc = `JSON array of experience objects:
[
  {
    "company": string,
    "position": string,
    "employmentType": one of ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Self-employed", ""],
    "location": string,
    "startDate": string,
    "endDate": string,
    "currentlyWorking": boolean,
    "description": string,
    "responsibilities": [ string ],
    "achievements": [ string ],
    "technologies": [ string ]
  }
]`;
      break;

    case "projects":
      sectionSchemaDesc = `JSON array of project objects:
[
  {
    "name": string,
    "shortDescription": string,
    "detailedDescription": string,
    "problemSolved": string,
    "solution": string,
    "role": string,
    "teamSize": string,
    "startDate": string,
    "endDate": string,
    "status": one of ["Completed", "In Progress", "Maintained", "Archived", ""],
    "technologies": [ string ],
    "features": [ string ],
    "challenges": [ string ],
    "results": [ string ],
    "metrics": [ string ],
    "achievements": [ string ],
    "githubUrl": string,
    "liveUrl": string,
    "demoUrl": string
  }
]`;
      break;

    case "achievements":
      sectionSchemaDesc = `JSON array of achievement objects:
[
  {
    "title": string,
    "description": string,
    "organization": string,
    "date": string,
    "category": one of ["Hackathon", "Competition", "Award", "Ranking", "Scholarship", "Major Accomplishment", "Other", ""],
    "evidenceUrl": string
  }
]`;
      break;

    case "certifications":
      sectionSchemaDesc = `JSON array of certification objects:
[
  {
    "name": string,
    "issuingOrganization": string,
    "issueDate": string,
    "expiryDate": string,
    "credentialId": string,
    "credentialUrl": string,
    "description": string
  }
]`;
      break;

    case "leadership":
      sectionSchemaDesc = `JSON array of leadership objects:
[
  {
    "organization": string,
    "position": string,
    "startDate": string,
    "endDate": string,
    "description": string,
    "achievements": [ string ]
  }
]`;
      break;

    case "additional":
      sectionSchemaDesc = `JSON object with fields:
{
  "openSource": [ { "title": string, "description": string, "url": string } ],
  "hackathons": [ { "name": string, "project": string, "award": string, "date": string, "url": string } ],
  "publications": [ { "title": string, "publisher": string, "date": string, "url": string, "description": string } ],
  "volunteerWork": [ { "organization": string, "role": string, "startDate": string, "endDate": string, "description": string } ],
  "languages": [ { "language": string, "proficiency": string } ],
  "hobbies": [ string ],
  "other": [ string ]
}`;
      break;

    default:
      throw new Error(`Unsupported section: ${section}`);
  }

  const userPrompt = `Section to parse: ${section}
Target Schema:
${sectionSchemaDesc}

Raw Text from User:
"""
${rawText}
"""

Extract and structure the data now. Return ONLY JSON.`;

  const rawJson = await executeAIPrompt(systemPrompt, userPrompt, user);
  try {
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse structured JSON from AI response:", rawJson);
    throw new Error("Could not parse AI structured response. Please try again.");
  }
};

/**
 * Build optimized context from CareerProfile for a specific question & JD
 */
export const buildCareerContext = ({ question, category, jobDescription, profile, selectedProject }) => {
  if (!profile) return "No career profile data available.";

  const parts = [];

  // Personal
  if (profile.personalInfo) {
    const { fullName, headline, bio, careerObjective, location } = profile.personalInfo;
    parts.push(
      `CANDIDATE: ${fullName || "Candidate"}` +
        (headline ? ` | Headline: ${headline}` : "") +
        (location ? ` | Location: ${location}` : "") +
        (bio ? `\nBio: ${bio}` : "") +
        (careerObjective ? `\nCareer Objective: ${careerObjective}` : "")
    );
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    const skillList = profile.skills.map((s) => `${s.name}${s.proficiency ? ` (${s.proficiency})` : ""}`).join(", ");
    parts.push(`SKILLS: ${skillList}`);
  }

  // Experience
  if (profile.experience && profile.experience.length > 0) {
    const expStrings = profile.experience.map((e) => {
      let str = `- ${e.position} at ${e.company} (${e.startDate || ""} - ${e.currentlyWorking ? "Present" : e.endDate || ""})`;
      if (e.description) str += `\n  Summary: ${e.description}`;
      if (e.responsibilities?.length > 0) str += `\n  Responsibilities: ${e.responsibilities.slice(0, 3).join("; ")}`;
      if (e.achievements?.length > 0) str += `\n  Key Achievements: ${e.achievements.join("; ")}`;
      if (e.technologies?.length > 0) str += `\n  Tech: ${e.technologies.join(", ")}`;
      return str;
    });
    parts.push(`EXPERIENCE:\n${expStrings.join("\n")}`);
  }

  // Projects
  if (profile.projects && profile.projects.length > 0) {
    // If a specific project was chosen or referenced, prioritize it
    let projectsToInclude = profile.projects;
    if (selectedProject) {
      const match = profile.projects.find((p) => p.name.toLowerCase() === selectedProject.toLowerCase() || p._id?.toString() === selectedProject);
      if (match) {
        projectsToInclude = [match, ...profile.projects.filter((p) => p !== match).slice(0, 2)];
      }
    }

    const projStrings = projectsToInclude.slice(0, 3).map((p) => {
      let str = `- Project: ${p.name}`;
      if (p.role) str += ` (Role: ${p.role})`;
      if (p.shortDescription) str += `\n  Overview: ${p.shortDescription}`;
      if (p.problemSolved) str += `\n  Problem: ${p.problemSolved}`;
      if (p.solution) str += `\n  Solution: ${p.solution}`;
      if (p.technologies?.length > 0) str += `\n  Tech Stack: ${p.technologies.join(", ")}`;
      if (p.metrics?.length > 0) str += `\n  Metrics/Results: ${p.metrics.join("; ")}`;
      if (p.challenges?.length > 0) str += `\n  Challenges Overcome: ${p.challenges.join("; ")}`;
      return str;
    });
    parts.push(`PROJECTS:\n${projStrings.join("\n")}`);
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    const eduStrings = profile.education.map((e) => `- ${e.degree} in ${e.fieldOfStudy || "Field"} at ${e.institution} (${e.startDate || ""} - ${e.endDate || ""})`);
    parts.push(`EDUCATION:\n${eduStrings.join("\n")}`);
  }

  // Achievements
  if (profile.achievements && profile.achievements.length > 0) {
    const achStrings = profile.achievements.map((a) => `- ${a.title} (${a.organization || ""} ${a.date || ""}): ${a.description || ""}`);
    parts.push(`ACHIEVEMENTS:\n${achStrings.join("\n")}`);
  }

  // Leadership
  if (profile.leadership && profile.leadership.length > 0) {
    const leadStrings = profile.leadership.map((l) => `- ${l.position} at ${l.organization}: ${l.description || ""}`);
    parts.push(`LEADERSHIP:\n${leadStrings.join("\n")}`);
  }

  if (jobDescription && jobDescription.trim()) {
    parts.push(`TARGET JOB DESCRIPTION / REQUIREMENTS:\n${jobDescription.trim().slice(0, 2000)}`);
  }

  return parts.join("\n\n");
};

/**
 * Generate a personalized answer grounded in the user's Career Profile
 */
export const generatePersonalizedAnswer = async ({
  question,
  category = "hr",
  answerLength = "standard",
  answerTone = "conversational",
  jobDescription = "",
  selectedProject = "",
  user,
}) => {
  const userId = user?._id || user?.userId;
  let profile = await CareerProfile.findOne({ userId });
  if (!profile) {
    // Auto-create or build from user/resume data
    const latestResume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
    profile = new CareerProfile({
      userId,
      personalInfo: {
        fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email || "",
        location: user?.profile?.location || "",
        linkedin: user?.profile?.linkedin || "",
        github: user?.profile?.github || "",
      },
      education: latestResume?.education || [],
      skills: latestResume?.skills
        ? latestResume.skills.flatMap((s) => s.items?.map((name) => ({ name, category: s.category || "Other" })) || [])
        : [],
      experience: latestResume?.experience || [],
      projects: latestResume?.projects || [],
    });
    try {
      await profile.save();
    } catch (saveErr) {
      console.warn("Could not persist initial profile:", saveErr.message);
    }
  }

  const careerContext = buildCareerContext({
    question,
    category,
    jobDescription,
    profile,
    selectedProject,
  });

  // Length constraints
  let lengthGuide = "";
  if (answerLength === "short") {
    lengthGuide = "Target speaking duration: 30–45 seconds (approx. 90–130 words). Deliver a punchy, focused, high-impact summary.";
  } else if (answerLength === "detailed") {
    lengthGuide = "Target speaking duration: 2–3 minutes (approx. 320–480 words). Provide a rich, comprehensive breakdown with full architectural context, technical trade-offs, engineering decisions, and quantifiable impact (using the STAR method).";
  } else {
    lengthGuide = "Target speaking duration: 60–90 seconds (approx. 180–260 words). Provide a complete, structured, and substantive interview response with concrete details, project narrative, and business impact.";
  }

  // Tone constraints
  let toneGuide = "Conversational yet professional — sounds like an authentic, highly articulate candidate in a live interview, not a robot reciting a resume.";
  if (answerTone === "professional") {
    toneGuide = "Formal, polished, and structured. Emphasize domain rigor and business impact.";
  } else if (answerTone === "concise") {
    toneGuide = "High-impact, concise, straight-to-the-point with zero filler words.";
  }

  const systemPrompt = `You are SmartNShine's Elite Career & Interview Coach.
Your mission is to generate a personalized, high-converting interview answer tailored specifically to the candidate's real career profile.

CRITICAL NON-NEGOTIABLE GROUNDING RULES:
1. Ground the answer EXCLUSIVELY in the Candidate's actual career profile data provided below.
2. DO NOT hallucinate or invent:
   - Companies they didn't work for
   - Projects they didn't build
   - Skills or technologies they don't possess
   - Metrics or numbers not substantiated in their profile
3. If critical information is missing to fully answer a specific angle of the question, acknowledge what is present and gracefully add a brief bracketed note [Coach Tip: Add X metric or Y detail to your profile to make this even stronger].
4. The answer must sound natural, confident, and human. Avoid generic clichés.
5. Follow the requested length and tone.

Return a JSON object with:
{
  "answer": string (the personalized interview answer),
  "talkingPoints": [ string ] (3-4 bullet points highlighting what makes this answer strong),
  "relatedProjects": [ string ] (names of projects referenced from the candidate profile),
  "relatedExperience": [ string ] (companies/roles referenced from the candidate profile),
  "missingInfoTip": string (optional constructive note if any key info was missing)
}`;

  const userPrompt = `QUESTION: "${question}"
CATEGORY: ${category}
${selectedProject ? `SELECTED PROJECT CONTEXT: ${selectedProject}` : ""}

LENGTH GUIDELINE: ${lengthGuide}
TONE GUIDELINE: ${toneGuide}

CANDIDATE CAREER PROFILE DATA:
=========================================
${careerContext}
=========================================

Generate the personalized response in JSON now.`;

  const rawJson = await executeAIPrompt(systemPrompt, userPrompt, user);
  try {
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse JSON for answer generation:", rawJson);
    return {
      answer: rawJson.trim(),
      talkingPoints: ["Clear narrative grounded in your real profile", "Directly addresses the question"],
      relatedProjects: [],
      relatedExperience: [],
      missingInfoTip: "",
    };
  }
};

/**
 * Generate job-specific questions based on a Job Description and the user's Career Profile
 */
export const generateJobSpecificQuestions = async ({ jobDescription, user }) => {
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job description is required");
  }

  const profile = await CareerProfile.findOne({ userId: user._id || user.userId });
  const careerContext = buildCareerContext({
    question: "Job specific preparation",
    category: "job-specific",
    jobDescription,
    profile,
  });

  const systemPrompt = `You are an executive tech recruiter and interview strategist.
Analyze the target Job Description against the Candidate's Career Profile.
Identify 5 to 7 high-probability, high-impact interview and application questions that the hiring manager or recruiter is most likely to ask this specific candidate for this role.

For each question:
- State the question clearly
- Give the category ('job-specific', 'behavioral', 'project', 'application')
- Provide a brief 'rationale' explaining why this question is crucial given the JD requirements and the candidate's background.

Return valid JSON:
{
  "targetRole": string,
  "matchedSkills": [ string ],
  "missingOrDesiredSkills": [ string ],
  "questions": [
    {
      "question": string,
      "category": string,
      "rationale": string,
      "recommendedProject": string
    }
  ]
}`;

  const userPrompt = `JOB DESCRIPTION:
"""
${jobDescription.slice(0, 3000)}
"""

CANDIDATE PROFILE SUMMARY:
"""
${careerContext}
"""

Analyze and output JSON now.`;

  const rawJson = await executeAIPrompt(systemPrompt, userPrompt, user);
  const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

/**
 * Generate deep project-aware questions for a specific project in the user's profile
 */
export const generateProjectQuestions = async ({ project, user }) => {
  if (!project) {
    throw new Error("Project details are required");
  }

  const systemPrompt = `You are a Principal Software Architect conducting a senior technical interview.
Analyze the candidate's project details and generate 5 targeted, high-value technical & architectural interview questions about this specific project (architecture decisions, tech choices, scaling, trade-offs, challenges, and edge cases).

Return valid JSON:
{
  "projectName": string,
  "questions": [
    {
      "question": string,
      "focusArea": string (e.g., "Architecture & Tech Stack", "Scalability & Performance", "Technical Challenges", "Database Design", "Security / Deployment"),
      "suggestedAngle": string
    }
  ]
}`;

  const userPrompt = `PROJECT DETAILS:
Name: ${project.name}
Role: ${project.role || "Developer"}
Tech Stack: ${(project.technologies || []).join(", ")}
Short Description: ${project.shortDescription || ""}
Detailed Description: ${project.detailedDescription || ""}
Problem Solved: ${project.problemSolved || ""}
Solution: ${project.solution || ""}
Challenges: ${(project.challenges || []).join("; ")}
Metrics/Results: ${(project.metrics || []).join("; ")}

Generate the 5 project-aware questions in JSON now.`;

  const rawJson = await executeAIPrompt(systemPrompt, userPrompt, user);
  const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

/**
 * Import and merge data from existing SmartNShine resume or portfolio into CareerProfile
 */
export const importFromResumeData = async ({ userId, sourceResumeId, selectedSections = [] }) => {
  let resume = null;
  if (sourceResumeId) {
    resume = await Resume.findOne({ _id: sourceResumeId, userId });
  } else {
    // Find most recent resume
    resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  if (!resume) {
    throw new Error("No existing resume found to import from");
  }

  let profile = await CareerProfile.findOne({ userId });
  if (!profile) {
    profile = new CareerProfile({ userId });
  }

  const shouldImport = (sec) => selectedSections.length === 0 || selectedSections.includes(sec);

  // 1. Personal Info
  if (shouldImport("personal")) {
    profile.personalInfo = {
      fullName: resume.name || profile.personalInfo?.fullName || "",
      preferredName: profile.personalInfo?.preferredName || "",
      headline: resume.summary ? resume.summary.split("\n")[0].slice(0, 100) : profile.personalInfo?.headline || "",
      bio: resume.summary || profile.personalInfo?.bio || "",
      careerObjective: profile.personalInfo?.careerObjective || "",
      email: resume.contact?.email || profile.personalInfo?.email || "",
      phone: resume.contact?.phone || profile.personalInfo?.phone || "",
      location: resume.contact?.location || profile.personalInfo?.location || "",
      linkedin: resume.contact?.linkedin || profile.personalInfo?.linkedin || "",
      github: resume.contact?.github || profile.personalInfo?.github || "",
      portfolio: resume.contact?.portfolio || profile.personalInfo?.portfolio || "",
      otherLinks: profile.personalInfo?.otherLinks || [],
    };
  }

  // 2. Education
  if (shouldImport("education") && resume.education?.length > 0) {
    const importedEdu = resume.education.map((e) => ({
      institution: e.institution || "Institution",
      degree: e.degree || "Degree",
      fieldOfStudy: e.field || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      isCurrent: false,
      gpa: e.gpa || "",
      percentage: "",
      relevantCoursework: [],
      description: e.bullets ? e.bullets.join("\n") : "",
    }));

    // Merge without duplicates by institution+degree
    const existing = profile.education || [];
    const merged = [...existing];
    importedEdu.forEach((ne) => {
      const exists = merged.some(
        (ex) => ex.institution.toLowerCase() === ne.institution.toLowerCase() && ex.degree.toLowerCase() === ne.degree.toLowerCase()
      );
      if (!exists) merged.push(ne);
    });
    profile.education = merged;
  }

  // 3. Skills
  if (shouldImport("skills") && resume.skills?.length > 0) {
    const validCategories = [
      "Programming Languages",
      "Frameworks",
      "Libraries",
      "Databases",
      "Cloud",
      "DevOps",
      "Tools",
      "AI/ML",
      "Other",
    ];

    const importedSkills = [];
    resume.skills.forEach((group) => {
      const cat = validCategories.includes(group.category) ? group.category : "Other";
      if (Array.isArray(group.items)) {
        group.items.forEach((item) => {
          if (item && item.trim()) {
            importedSkills.push({
              name: item.trim(),
              category: cat,
              proficiency: "",
              yearsOfExperience: "",
            });
          }
        });
      }
    });

    const existingSkills = profile.skills || [];
    const mergedSkills = [...existingSkills];
    importedSkills.forEach((ns) => {
      if (!mergedSkills.some((s) => s.name.toLowerCase() === ns.name.toLowerCase())) {
        mergedSkills.push(ns);
      }
    });
    profile.skills = mergedSkills;
  }

  // 4. Experience
  if (shouldImport("experience") && resume.experience?.length > 0) {
    const importedExp = resume.experience.map((e) => ({
      company: e.company || "Company",
      position: e.title || "Position",
      employmentType: "Full-time",
      location: e.location || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      currentlyWorking: Boolean(e.current),
      description: "",
      responsibilities: e.bullets || [],
      achievements: [],
      technologies: [],
    }));

    const existingExp = profile.experience || [];
    const mergedExp = [...existingExp];
    importedExp.forEach((ne) => {
      const exists = mergedExp.some(
        (ex) => ex.company.toLowerCase() === ne.company.toLowerCase() && ex.position.toLowerCase() === ne.position.toLowerCase()
      );
      if (!exists) mergedExp.push(ne);
    });
    profile.experience = mergedExp;
  }

  // 5. Projects
  if (shouldImport("projects") && resume.projects?.length > 0) {
    const importedProjects = resume.projects.map((p) => ({
      name: p.name || "Project",
      shortDescription: p.description || "",
      detailedDescription: p.bullets ? p.bullets.join("\n") : "",
      problemSolved: "",
      solution: "",
      role: "",
      teamSize: "",
      startDate: "",
      endDate: "",
      status: "Completed",
      technologies: p.technologies || [],
      features: p.bullets || [],
      challenges: [],
      results: [],
      metrics: [],
      achievements: [],
      githubUrl: p.link || "",
      liveUrl: "",
      demoUrl: "",
      images: [],
    }));

    const existingProj = profile.projects || [];
    const mergedProj = [...existingProj];
    importedProjects.forEach((np) => {
      if (!mergedProj.some((p) => p.name.toLowerCase() === np.name.toLowerCase())) {
        mergedProj.push(np);
      }
    });
    profile.projects = mergedProj;
  }

  // Also check if user has Portfolio Projects in DB to enrich
  try {
    const portfolioProjects = await PortfolioProject.find({ userId });
    if (portfolioProjects.length > 0 && shouldImport("projects")) {
      portfolioProjects.forEach((pp) => {
        const match = profile.projects.find((p) => p.name.toLowerCase() === pp.title.toLowerCase());
        if (match) {
          if (pp.problem && !match.problemSolved) match.problemSolved = pp.problem;
          if (pp.solution && !match.solution) match.solution = pp.solution;
          if (pp.role && !match.role) match.role = pp.role;
          if (pp.links?.live && !match.liveUrl) match.liveUrl = pp.links.live;
          if (pp.links?.github && !match.githubUrl) match.githubUrl = pp.links.github;
          if (pp.impact && match.metrics.length === 0) match.metrics = [pp.impact];
        } else {
          profile.projects.push({
            name: pp.title,
            shortDescription: pp.shortDescription || "",
            detailedDescription: pp.longDescription || "",
            problemSolved: pp.problem || "",
            solution: pp.solution || "",
            role: pp.role || "",
            teamSize: "",
            startDate: "",
            endDate: "",
            status: "Completed",
            technologies: pp.technologies || [],
            features: pp.highlights || [],
            challenges: [],
            results: [],
            metrics: pp.impact ? [pp.impact] : [],
            achievements: [],
            githubUrl: pp.links?.github || "",
            liveUrl: pp.links?.live || "",
            demoUrl: pp.links?.video || "",
            images: [],
          });
        }
      });
    }
  } catch (err) {
    console.warn("Portfolio projects check skipped:", err.message);
  }

  // 6. Certifications
  if (shouldImport("certifications") && resume.certifications?.length > 0) {
    const importedCerts = resume.certifications.map((c) => ({
      name: c.name || "Certification",
      issuingOrganization: c.issuer || "Organization",
      issueDate: c.date || "",
      expiryDate: "",
      credentialId: c.credentialId || "",
      credentialUrl: c.link || "",
      description: "",
    }));

    const existingCerts = profile.certifications || [];
    const mergedCerts = [...existingCerts];
    importedCerts.forEach((nc) => {
      if (!mergedCerts.some((c) => c.name.toLowerCase() === nc.name.toLowerCase())) {
        mergedCerts.push(nc);
      }
    });
    profile.certifications = mergedCerts;
  }

  // 7. Achievements
  if (shouldImport("achievements") && resume.achievements?.length > 0) {
    const importedAch = resume.achievements.map((ach) => ({
      title: typeof ach === "string" ? ach : ach.title || "Achievement",
      description: typeof ach === "string" ? "" : ach.description || "",
      organization: "",
      date: "",
      category: "Major Accomplishment",
      evidenceUrl: "",
    }));

    const existingAch = profile.achievements || [];
    const mergedAch = [...existingAch];
    importedAch.forEach((na) => {
      if (!mergedAch.some((a) => a.title.toLowerCase() === na.title.toLowerCase())) {
        mergedAch.push(na);
      }
    });
    profile.achievements = mergedAch;
  }

  await profile.save();
  return profile;
};

/**
 * Export Career Profile to Resume format for one-click prefill in Resume Builder or ATS Analyzer
 */
export const exportProfileToResumeFormat = (profile) => {
  if (!profile) return null;

  const p = profile.personalInfo || {};

  // Group skills by category
  const skillsMap = {};
  (profile.skills || []).forEach((s) => {
    const cat = s.category || "Technical Skills";
    if (!skillsMap[cat]) skillsMap[cat] = [];
    skillsMap[cat].push(s.name);
  });

  const skillsArray = Object.entries(skillsMap).map(([category, items]) => ({
    category,
    items,
  }));

  const experienceArray = (profile.experience || []).map((e) => ({
    company: e.company,
    title: e.position,
    location: e.location || "",
    startDate: e.startDate || "",
    endDate: e.currentlyWorking ? "Present" : e.endDate || "",
    current: Boolean(e.currentlyWorking),
    bullets: e.responsibilities?.length > 0 ? e.responsibilities : e.description ? [e.description] : [],
  }));

  const educationArray = (profile.education || []).map((edu) => ({
    institution: edu.institution,
    degree: edu.degree,
    field: edu.fieldOfStudy || "",
    location: "",
    startDate: edu.startDate || "",
    endDate: edu.isCurrent ? "Present" : edu.endDate || "",
    gpa: edu.gpa || edu.percentage || "",
    bullets: edu.relevantCoursework?.length > 0 ? [`Relevant Coursework: ${edu.relevantCoursework.join(", ")}`] : [],
  }));

  const projectsArray = (profile.projects || []).map((pr) => {
    const bullets = [];
    if (pr.shortDescription) bullets.push(pr.shortDescription);
    if (pr.problemSolved && pr.solution) bullets.push(`Problem & Solution: ${pr.problemSolved} -> ${pr.solution}`);
    if (pr.metrics?.length > 0) bullets.push(...pr.metrics);
    if (pr.features?.length > 0) bullets.push(...pr.features.slice(0, 3));

    return {
      name: pr.name,
      description: pr.shortDescription || pr.detailedDescription || "",
      technologies: pr.technologies || [],
      link: pr.liveUrl || pr.githubUrl || "",
      bullets,
    };
  });

  const certificationsArray = (profile.certifications || []).map((c) => ({
    name: c.name,
    issuer: c.issuingOrganization,
    date: c.issueDate || "",
    credentialId: c.credentialId || "",
    link: c.credentialUrl || "",
  }));

  const achievementsArray = (profile.achievements || []).map((a) => a.title + (a.description ? `: ${a.description}` : ""));

  return {
    name: p.fullName || "Your Name",
    contact: {
      phone: p.phone || "",
      email: p.email || "",
      linkedin: p.linkedin || "",
      github: p.github || "",
      portfolio: p.portfolio || "",
      location: p.location || "",
    },
    summary: p.bio || p.careerObjective || p.headline || "",
    skills: skillsArray,
    experience: experienceArray,
    education: educationArray,
    projects: projectsArray,
    certifications: certificationsArray,
    achievements: achievementsArray,
    customSections: [],
  };
};
