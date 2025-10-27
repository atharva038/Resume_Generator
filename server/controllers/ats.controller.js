import PDFParser from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import {analyzeResumeJobMatch} from "../services/gemini.service.js";
import Resume from "../models/Resume.model.js";
import {trackAIUsage} from "../middleware/aiUsageTracker.middleware.js";

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

    // Analyze resume vs job description using Gemini AI
    console.log(
      "🤖 Analyzing resume against job description with Gemini AI..."
    );
    const startTime = Date.now();
    const {data: analysis, tokenUsage} = await analyzeResumeJobMatch(
      resumeText,
      jobDescription
    );
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "ats_analysis",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json(analysis);
  } catch (error) {
    console.error("❌ Resume analysis error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "ats_analysis",
        0,
        0,
        "error",
        error.message
      );
    }

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
