import PDFParser from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import * as aiRouter from "../services/aiRouter.service.js";
import Resume from "../models/Resume.model.js";

/**
 * Analyze resume against job description
 * POST /api/resume/analyze-resume
 */
export const analyzeResume = async (req, res) => {
  try {
    const {jobDescription, resumeId} = req.body;
    const resumeFile = req.file;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({error: "Job description is required"});
    }

    let resumeText = "";

    // Extract resume text from uploaded file or database
    if (resumeFile) {
      // Extract text from uploaded file
      if (resumeFile.mimetype === "application/pdf") {
        const pdfData = await PDFParser(resumeFile.buffer);
        resumeText = pdfData.text;
      } else if (
        resumeFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          buffer: resumeFile.buffer,
        });
        resumeText = result.value;
      } else {
        return res.status(400).json({error: "Unsupported file format"});
      }
    } else if (resumeId) {
      // Get resume from database
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({error: "Resume not found"});
      }

      // Convert resume data to text
      resumeText = convertResumeDataToText(resume);
    } else {
      return res
        .status(400)
        .json({error: "Either resume file or resume ID is required"});
    }

    if (!resumeText || !resumeText.trim()) {
      return res
        .status(400)
        .json({error: "Could not extract text from resume"});
    }

    // Get user object for AI routing
    const User = (await import("../models/User.model.js")).default;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    // Analyze resume vs job description using AI Router (Gemini or GPT-4o based on tier)
    console.log(
      `🤖 Analyzing resume against job description with AI Router (User tier: ${
        user.subscription?.tier || "free"
      })...`
    );
    const startTime = Date.now();
    const {
      data: analysis,
      tokenUsage,
      aiModel,
    } = await aiRouter.analyzeJobMatch(resumeText, jobDescription, user);
    const responseTime = Date.now() - startTime;

    console.log(`✅ ATS analysis completed using ${aiModel} model`);

    // AI usage is already tracked by aiRouter.analyzeJobMatch

    res.json(analysis);
  } catch (error) {
    console.error("❌ Resume analysis error:", error);

    // AI usage error is already tracked by aiRouter.analyzeJobMatch

    res.status(500).json({
      error: error.message || "Failed to analyze resume",
    });
  }
};

/**
 * Helper function to convert resume data object to readable text
 */
function convertResumeDataToText(resumeData) {
  let text = "";

  // Contact info
  if (resumeData.contact) {
    text += `${resumeData.contact.name || ""}\n`;
    text += `${resumeData.contact.email || ""}\n`;
    text += `${resumeData.contact.phone || ""}\n`;
    text += `${resumeData.contact.location || ""}\n\n`;
  }

  // Summary
  if (resumeData.summary) {
    text += `SUMMARY\n${resumeData.summary}\n\n`;
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += "SKILLS\n";
    resumeData.skills.forEach((skillGroup) => {
      text += `${skillGroup.category}: ${skillGroup.items.join(", ")}\n`;
    });
    text += "\n";
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    text += "EXPERIENCE\n";
    resumeData.experience.forEach((exp) => {
      text += `${exp.title} at ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet) => {
          text += `• ${bullet}\n`;
        });
      }
      text += "\n";
    });
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    text += "PROJECTS\n";
    resumeData.projects.forEach((project) => {
      text += `${project.name}\n`;
      if (project.description) {
        text += `${project.description}\n`;
      }
      if (project.technologies && project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(", ")}\n`;
      }
      if (project.bullets && project.bullets.length > 0) {
        project.bullets.forEach((bullet) => {
          text += `• ${bullet}\n`;
        });
      }
      text += "\n";
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += "EDUCATION\n";
    resumeData.education.forEach((edu) => {
      text += `${edu.degree} in ${edu.field}\n`;
      text += `${edu.institution}\n`;
      text += `${edu.startDate} - ${edu.endDate}\n\n`;
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    text += "CERTIFICATIONS\n";
    resumeData.certifications.forEach((cert) => {
      text += `${cert.name} - ${cert.issuer} (${cert.date})\n`;
    });
  }

  return text;
}

/**
 * Calculate match score between resume data and job description
 * POST /api/ats/match-score
 */
export const calculateMatchScore = async (req, res) => {
  try {
    const {resumeData, jobDescription} = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Job description is required (at least 50 characters)",
      });
    }

    // Convert resume data to text
    const resumeText = convertResumeDataToText(resumeData);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Could not extract enough content from resume",
      });
    }

    // Get user for AI routing
    const User = (await import("../models/User.model.js")).default;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({success: false, error: "User not found"});
    }

    console.log(`🎯 Calculating match score for user ${user.email}...`);

    // Use AI Router to analyze match
    const {data: analysis, aiModel} = await aiRouter.analyzeJobMatch(
      resumeText,
      jobDescription,
      user
    );

    console.log(`✅ Match score calculated using ${aiModel}`);

    res.json({
      success: true,
      data: {
        matchScore: analysis.atsScore || analysis.overallMatch || 0,
        overallMatch: analysis.atsScore || analysis.overallMatch || 0,
        keywordMatch: analysis.keywordMatch || 0,
        skillsMatch: analysis.skillsMatch || 0,
        experienceMatch: analysis.experienceMatch || 0,
        matchingKeywords: analysis.matchingKeywords || [],
        missingKeywords: analysis.missingKeywords || [],
        suggestions: analysis.suggestions || [],
        strengths: analysis.strengths || [],
        improvements: analysis.improvements || [],
        categoryScores: analysis.categoryScores || {},
        aiModel,
      },
    });
  } catch (error) {
    console.error("❌ Match score calculation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to calculate match score",
    });
  }
};

/**
 * Analyze skills from resume data
 * POST /api/ats/analyze-skills
 */
export const analyzeSkills = async (req, res) => {
  try {
    const {resumeData} = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    // Extract skills from resume data
    const skills = [];

    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      resumeData.skills.forEach((skillGroup) => {
        if (skillGroup.items && Array.isArray(skillGroup.items)) {
          skills.push(...skillGroup.items);
        }
      });
    }

    // Extract skills from experience bullets
    const experienceText =
      resumeData.experience
        ?.map((exp) => exp.bullets?.join(" ") || "")
        .join(" ") || "";

    // Extract skills from projects
    const projectSkills =
      resumeData.projects?.flatMap((p) => p.technologies || []) || [];

    res.json({
      success: true,
      data: {
        skills: [...new Set([...skills, ...projectSkills])],
        categories:
          resumeData.skills?.map((s) => ({
            name: s.category,
            items: s.items,
          })) || [],
        experienceKeywords: experienceText
          .split(/\s+/)
          .filter((w) => w.length > 4)
          .slice(0, 50),
      },
    });
  } catch (error) {
    console.error("❌ Skills analysis error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze skills",
    });
  }
};
