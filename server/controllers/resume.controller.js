import Resume from "../models/Resume.model.js";
import {extractTextFromFile, deleteFile} from "../utils/fileExtractor.js";
import {
  parseResumeWithAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
  categorizeSkillsWithAI,
  segregateAchievementsWithAI,
  processCustomSectionWithAI,
} from "../services/gemini.service.js";
import {trackAIUsage} from "../middleware/aiUsageTracker.middleware.js";

/**
 * Upload and parse resume file
 * POST /api/resume/upload
 */
export const uploadResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({error: "No file uploaded"});
    }

    filePath = req.file.path;
    console.log("📄 Processing file:", req.file.originalname);

    // Extract text from file
    const extractedText = await extractTextFromFile(filePath);

    if (!extractedText || extractedText.length < 50) {
      throw new Error(
        "Insufficient text extracted from resume. Please ensure the file contains readable text."
      );
    }

    // Parse resume using Gemini AI
    const startTime = Date.now();
    const {data: parsedData, tokenUsage} = await parseResumeWithAI(
      extractedText
    );
    const responseTime = Date.now() - startTime;

    // Track AI usage (upload doesn't require auth, so skip tracking)
    // Note: Upload endpoint should ideally require authentication for better tracking
    // For now, we'll track only if user is authenticated
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "resume_enhancement",
        tokenUsage?.totalTokens || 0,
        responseTime,
        "success"
      );
    }

    // Add raw text to parsed data
    parsedData.rawText = extractedText;

    // Delete uploaded file after processing
    await deleteFile(filePath);

    res.json({
      message: "Resume uploaded and parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    // Clean up file on error
    if (filePath) {
      await deleteFile(filePath);
    }

    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Failed to process resume",
    });
  }
};

/**
 * Enhance resume content section
 * POST /api/resume/enhance
 */
export const enhanceContent = async (req, res) => {
  try {
    const {content, sectionType, resumeData, customPrompt} = req.body;

    if (!content) {
      return res.status(400).json({error: "Content is required"});
    }

    if (!sectionType) {
      return res.status(400).json({error: "Section type is required"});
    }

    // Enhance content using Gemini AI with full resume context and custom prompt
    const startTime = Date.now();
    const {data: enhancedContent, tokenUsage} = await enhanceContentWithAI(
      content,
      sectionType,
      resumeData,
      customPrompt
    );
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "resume_enhancement",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json({
      message: "Content enhanced successfully",
      enhanced: enhancedContent,
    });
  } catch (error) {
    console.error("Enhance error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "resume_enhancement",
        0,
        0,
        "error",
        error.message
      );
    }

    res.status(500).json({
      error: error.message || "Failed to enhance content",
    });
  }
};

/**
 * Generate professional summary
 * POST /api/resume/generate-summary
 */
export const generateSummary = async (req, res) => {
  try {
    const {resumeData} = req.body;

    if (!resumeData) {
      return res.status(400).json({error: "Resume data is required"});
    }

    // Generate summary using Gemini AI
    const startTime = Date.now();
    const {data: summary, tokenUsage} = await generateSummaryWithAI(resumeData);
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json({
      message: "Summary generated successfully",
      summary,
    });
  } catch (error) {
    console.error("Generate summary error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "ai_suggestions",
        0,
        0,
        "error",
        error.message
      );
    }

    res.status(500).json({
      error: error.message || "Failed to generate summary",
    });
  }
};

/**
 * Save resume to database
 * POST /api/resume/save
 */
export const saveResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const resumeData = req.body;

    if (!resumeData.name) {
      return res.status(400).json({error: "Resume name is required"});
    }

    // Map 'title' to 'resumeTitle' if provided, otherwise use default
    if (resumeData.title) {
      resumeData.resumeTitle = resumeData.title;
      delete resumeData.title;
    } else if (!resumeData.resumeTitle) {
      resumeData.resumeTitle = "Untitled Resume";
    }

    // Create new resume document
    const resume = new Resume({
      ...resumeData,
      userId,
    });

    await resume.save();

    // Return the full resume object
    res.status(201).json(resume);
  } catch (error) {
    console.error("Save resume error:", error);
    res.status(500).json({
      error: error.message || "Failed to save resume",
    });
  }
};

/**
 * Update existing resume
 * PUT /api/resume/:id
 */
export const updateResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {id} = req.params;
    const resumeData = req.body;

    // Find resume and verify ownership
    const resume = await Resume.findOne({_id: id, userId});

    if (!resume) {
      return res.status(404).json({error: "Resume not found"});
    }

    // Map 'title' to 'resumeTitle' if provided
    if (resumeData.title) {
      resumeData.resumeTitle = resumeData.title;
      delete resumeData.title;
    }

    // Update resume fields - special handling for nested contact object
    if (resumeData.contact !== undefined) {
      resume.contact = {...resume.contact, ...resumeData.contact};
      resume.markModified("contact");
    }

    // Update other fields
    Object.keys(resumeData).forEach((key) => {
      if (key !== "contact") {
        resume[key] = resumeData[key];
      }
    });

    await resume.save();

    // Return the full resume object
    res.json(resume);
  } catch (error) {
    console.error("Update resume error:", error);
    res.status(500).json({
      error: error.message || "Failed to update resume",
    });
  }
};

/**
 * Get all resumes for current user
 * GET /api/resume/list
 */
export const getResumes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const resumes = await Resume.find({userId})
      .select("name resumeTitle description templateId createdAt updatedAt")
      .sort({updatedAt: -1});

    res.json({
      message: "Resumes retrieved successfully",
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve resumes",
    });
  }
};

/**
 * Get single resume by ID
 * GET /api/resume/:id
 */
export const getResumeById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {id} = req.params;

    const resume = await Resume.findOne({_id: id, userId});

    if (!resume) {
      return res.status(404).json({error: "Resume not found"});
    }

    // Return the resume object directly
    res.json(resume);
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve resume",
    });
  }
};

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {id} = req.params;

    const resume = await Resume.findOneAndDelete({_id: id, userId});

    if (!resume) {
      return res.status(404).json({error: "Resume not found"});
    }

    res.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({
      error: error.message || "Failed to delete resume",
    });
  }
};

/**
 * Categorize skills using AI
 * POST /api/resume/categorize-skills
 */
export const categorizeSkills = async (req, res) => {
  try {
    const {skills} = req.body;

    if (!skills) {
      return res.status(400).json({error: "Skills text is required"});
    }

    if (typeof skills !== "string") {
      return res.status(400).json({error: "Skills must be a string"});
    }

    // Categorize skills using Gemini AI
    const startTime = Date.now();
    const {data: categorizedSkills, tokenUsage} = await categorizeSkillsWithAI(
      skills
    );
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json({
      message: "Skills categorized successfully",
      skills: categorizedSkills,
    });
  } catch (error) {
    console.error("Categorize skills error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "ai_suggestions",
        0,
        0,
        "error",
        error.message
      );
    }

    res.status(500).json({
      error: error.message || "Failed to categorize skills",
    });
  }
};

/**
 * Segregate achievements using AI
 * POST /api/resume/segregate-achievements
 */
export const segregateAchievements = async (req, res) => {
  try {
    const {achievements} = req.body;

    if (!achievements) {
      return res.status(400).json({error: "Achievements text is required"});
    }

    if (typeof achievements !== "string") {
      return res.status(400).json({error: "Achievements must be a string"});
    }

    // Segregate achievements using Gemini AI
    const startTime = Date.now();
    const {data: segregatedAchievements, tokenUsage} =
      await segregateAchievementsWithAI(achievements);
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json({
      message: "Achievements segregated successfully",
      achievements: segregatedAchievements,
    });
  } catch (error) {
    console.error("Segregate achievements error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "ai_suggestions",
        0,
        0,
        "error",
        error.message
      );
    }

    res.status(500).json({
      error: error.message || "Failed to segregate achievements",
    });
  }
};

/**
 * Process custom section using AI
 * POST /api/resume/process-custom-section
 */
export const processCustomSection = async (req, res) => {
  try {
    const {content, title} = req.body;

    if (!content) {
      return res.status(400).json({error: "Content is required"});
    }

    if (typeof content !== "string") {
      return res.status(400).json({error: "Content must be a string"});
    }

    // Process custom section using Gemini AI
    const startTime = Date.now();
    const {data: processedContent, tokenUsage} =
      await processCustomSectionWithAI(content, title || "Custom Section");
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      req.user.userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    res.json({
      message: "Custom section processed successfully",
      content: processedContent,
    });
  } catch (error) {
    console.error("Process custom section error:", error);

    // Track failed AI usage
    if (req.user?.userId) {
      await trackAIUsage(
        req.user.userId,
        "ai_suggestions",
        0,
        0,
        "error",
        error.message
      );
    }

    res.status(500).json({
      error: error.message || "Failed to process custom section",
    });
  }
};
