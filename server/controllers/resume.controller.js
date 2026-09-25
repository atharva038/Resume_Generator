import Resume from "../models/Resume.model.js";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import Template from "../models/Template.model.js";
import {extractTextFromFile, deleteFile} from "../utils/fileExtractor.js";
import {
  createPdfExportSession,
  deletePdfExportSession,
  getPdfExportSession,
} from "../services/pdfExportSession.service.js";
import {renderResumePdf} from "../services/pdfExport.service.js";
// Import ALL AI functions from OpenAI
import {
  parseResumeWithAI as parseResumeWithOpenAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
  categorizeSkillsWithAI,
  segregateAchievementsWithAI,
  processCustomSectionWithAI,
} from "../services/openai.service.js";
import {trackAIUsage} from "../middleware/aiUsageTracker.middleware.js";
import {getResumeAccess} from "../middleware/subscription.middleware.js";

/**
 * Normalizes resume skills to ensure array of { category, items: string[] }
 */
export const normalizeSkillsHelper = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((group) => {
      if (typeof group === "string") {
        return { category: "Technical Skills", items: [group.trim()].filter(Boolean) };
      }
      if (group && typeof group === "object") {
        const category = (group.category || group.name || "Technical Skills").trim();
        let items = group.items || group.skills || [];
        if (typeof items === "string") {
          items = items
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (Array.isArray(items)) {
          items = items
            .flatMap((it) => (typeof it === "string" ? it.split(",") : String(it)))
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          items = [];
        }
        return { category, items };
      }
      return null;
    })
    .filter((g) => g && (g.items.length > 0 || g.category));
};

/**
 * Normalizes resume achievements to ensure a flat array of strings (ATS bullet points)
 */
export const normalizeAchievementsHelper = (rawAchievements) => {
  if (!rawAchievements) return [];

  // If string, try to JSON parse or split by newlines
  if (typeof rawAchievements === "string") {
    const trimmed = rawAchievements.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeAchievementsHelper(parsed);
      } catch {
        return trimmed
          .split("\n")
          .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
          .filter(Boolean);
      }
    }
    return trimmed
      .split("\n")
      .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
      .filter(Boolean);
  }

  // If array
  if (Array.isArray(rawAchievements)) {
    const flattened = [];
    for (const item of rawAchievements) {
      if (!item) continue;
      if (typeof item === "string") {
        const t = item.trim();
        if (t.startsWith("{") || t.startsWith("[")) {
          try {
            const parsed = JSON.parse(t);
            flattened.push(...normalizeAchievementsHelper(parsed));
            continue;
          } catch {}
        }
        if (t) flattened.push(t);
      } else if (typeof item === "object") {
        flattened.push(...normalizeAchievementsHelper(item));
      }
    }
    return flattened;
  }

  // If object (e.g., categorized dictionary from AI: { 'Technical Achievements': [...], ... })
  if (typeof rawAchievements === "object") {
    const items = [];
    if (Array.isArray(rawAchievements.achievements)) {
      items.push(...normalizeAchievementsHelper(rawAchievements.achievements));
    } else if (Array.isArray(rawAchievements.items)) {
      items.push(...normalizeAchievementsHelper(rawAchievements.items));
    } else if (
      typeof rawAchievements.text === "string" ||
      typeof rawAchievements.title === "string" ||
      typeof rawAchievements.description === "string"
    ) {
      const val =
        rawAchievements.description ||
        rawAchievements.title ||
        rawAchievements.text;
      if (val) items.push(String(val).trim());
    } else {
      // Category map
      for (const value of Object.values(rawAchievements)) {
        if (Array.isArray(value)) {
          for (const subItem of value) {
            if (typeof subItem === "string" && subItem.trim()) {
              items.push(subItem.trim());
            } else if (typeof subItem === "object" && subItem) {
              items.push(...normalizeAchievementsHelper(subItem));
            }
          }
        } else if (typeof value === "string" && value.trim()) {
          items.push(value.trim());
        }
      }
    }
    return items.filter(Boolean);
  }

  return [];
};

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

    // Get user and check tier for AI extraction
    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);
    const tier = user?.subscription?.tier || "free";
    const isAdmin = user?.role === "admin";

    // Admin users have unlimited access
    const canUseAIExtraction = isAdmin || tier === "pro";

    // Get usage limits for response
    let limit = null;
    let used = null;

    // If using AI extraction and not admin, check daily limit
    if (canUseAIExtraction && !isAdmin) {
      limit = user.getUsageLimit("aiResumeExtractionsPerDay");
      used = user.usage?.aiResumeExtractionsToday || 0;

      if (used >= limit) {
        return res.status(403).json({
          success: false,
          error: "AI Extraction Limit Reached",
          message: `You've used all ${limit} AI resume extractions for today. Try again tomorrow or upgrade your plan!`,
          upgradeRequired: false,
          limit,
          used,
        });
      }
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

    // Use OpenAI for all parsing operations
    const parseResumeWithAI = parseResumeWithOpenAI;
    const aiProvider = "OpenAI";

    // Parse resume using AI
    console.log(`🤖 Using ${aiProvider} for ${tier} user's resume extraction`);
    const startTime = Date.now();
    const {data: parsedData, tokenUsage} = await parseResumeWithAI(
      extractedText
    );
    const responseTime = Date.now() - startTime;

    // Increment AI extraction counter for pro users (skip for admins)
    if (canUseAIExtraction && !isAdmin) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          "usage.aiResumeExtractions": 1,
          "usage.aiResumeExtractionsToday": 1,
        },
      });
      console.log(`✅ AI extraction count incremented for ${tier} user`);
    } else if (isAdmin) {
      console.log(`✅ Admin user - AI extraction count not incremented`);
    }

    // AI usage tracking is handled by openai.service.js internally
    // No need to track here as parseResumeWithAI doesn't go through aiRouter

    // Add raw text to parsed data
    parsedData.rawText = extractedText;

    // Delete temporary uploaded file after successful processing
    // (Data is already parsed and will be saved to database by client)
    await deleteFile(filePath);
    console.log("✅ Resume data parsed and ready for database storage");

    res.json({
      message: "Resume uploaded and parsed successfully",
      data: parsedData,
      aiUsed: aiProvider.toLowerCase(),
      extractionsRemaining: canUseAIExtraction ? limit - (used + 1) : null,
    });
  } catch (error) {
    // Clean up file on error
    if (filePath) {
      await deleteFile(filePath);
    }

    console.error("Upload error:", error);

    // Check if it's an AI quota or rate limit error (more comprehensive check)
    const errorMsg = error.message?.toLowerCase() || "";
    const isQuotaError =
      errorMsg.includes("429") ||
      errorMsg.includes("quota") ||
      errorMsg.includes("too many requests") ||
      errorMsg.includes("rate limit");

    if (isQuotaError) {
      console.log(
        "🚫 Detected quota error - sending upgrade required response"
      );
      return res.status(403).json({
        error: "AI Parsing Limit Reached",
        message:
          "The free AI resume parsing service has reached its daily limit. Upgrade to Pro for AI-powered resume parsing.",
        upgradeRequired: true,
        feature: "AI Resume Parsing",
        availableIn: ["pro"],
        quotaExceeded: true,
      });
    }

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

    // Get user ID for tracking
    const userId = req.user._id || req.user.userId;

    // Usage limits are now checked by checkUsageLimit middleware
    // Free users get 10 AI generations per month
    // One-time users get 100 AI generations per month
    // Pro/Premium/Lifetime users get unlimited

    // Enhance content using OpenAI with full resume context and custom prompt
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
      userId,
      "resume_enhancement",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    // Increment AI generation counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      message: "Content enhanced successfully",
      enhanced: enhancedContent,
    });
  } catch (error) {
    console.error("Enhance error:", error);

    // Track failed AI usage
    const userId = req.user?._id || req.user?.userId;
    if (userId) {
      await trackAIUsage(
        userId,
        "resume_enhancement",
        0,
        0,
        "error",
        error.message
      );
    }

    // Handle quota exceeded errors specifically
    if (error.code === "QUOTA_EXCEEDED" || error.statusCode === 429) {
      return res.status(429).json({
        error: "AI service quota exceeded",
        message:
          "The AI enhancement service has reached its daily limit. Please try again later or contact support.",
        quotaExceeded: true,
        retryAfter: "1 hour", // Generic retry time
      });
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

    // Get user ID for tracking
    const userId = req.user._id || req.user.userId;

    // Usage limits are checked by checkUsageLimit middleware
    // Free users: 10 AI generations/month, One-time: 100/month, Pro+: Unlimited

    // Generate summary using OpenAI
    const startTime = Date.now();
    const {data: summary, tokenUsage} = await generateSummaryWithAI(resumeData);
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    // Increment AI generation counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      message: "Summary generated successfully",
      summary,
    });
  } catch (error) {
    console.error("Generate summary error:", error);

    // Track failed AI usage
    const userId = req.user?._id || req.user?.userId;
    if (userId) {
      await trackAIUsage(
        userId,
        "ai_suggestions",
        0,
        0,
        "error",
        error.message
      );
    }

    // Handle quota exceeded errors specifically
    if (error.code === "QUOTA_EXCEEDED" || error.statusCode === 429) {
      return res.status(429).json({
        error: "AI service quota exceeded",
        message:
          "The AI summary generation service has reached its daily limit. Please try again later or contact support.",
        quotaExceeded: true,
        retryAfter: "1 hour",
      });
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
    // After checkSubscription middleware, req.user is the full User document
    const userId = req.user._id || req.user.userId;
    const resumeData = { ...req.body };

    // Strip client-side _id if null/empty or passed during new save
    delete resumeData._id;
    delete resumeData.id;

    // Fallback for name if missing or empty
    if (
      !resumeData.name ||
      typeof resumeData.name !== "string" ||
      !resumeData.name.trim()
    ) {
      resumeData.name = req.user?.name || "Untitled Resume";
    } else {
      resumeData.name = resumeData.name.trim();
    }

    // Map 'title' to 'resumeTitle' if provided, otherwise use default
    if (resumeData.title) {
      resumeData.resumeTitle = resumeData.title;
      delete resumeData.title;
    } else if (!resumeData.resumeTitle || !resumeData.resumeTitle.trim()) {
      resumeData.resumeTitle = "Untitled Resume";
    }

    // Ensure templateId defaults to classic if missing
    if (!resumeData.templateId) {
      resumeData.templateId = "classic";
    }

    // Get user's subscription info for linking
    const user = req.user; // Full user object from checkSubscription middleware
    const userTier = user.subscription?.tier || "free";
    const userStatus = user.subscription?.status || "expired";

    // Find active subscription if user has a paid tier
    let subscriptionInfo = {
      subscriptionId: null,
      createdWithTier: userTier,
      createdWithSubscription: false,
      linkedAt: null,
    };

    if (["one-time", "pro"].includes(userTier) && userStatus === "active") {
      const activeSubscription = await Subscription.findOne({
        userId: user._id,
        tier: userTier,
        status: "active",
        ...(userTier === "one-time" && {assignmentStatus: "pending"}),
      }).sort({createdAt: -1}); // Get the latest active subscription

      if (activeSubscription) {
        subscriptionInfo = {
          subscriptionId: activeSubscription._id,
          createdWithTier: userTier,
          createdWithSubscription: true,
          linkedAt: new Date(),
        };
        console.log(
          `🔗 Linking resume to subscription: ${activeSubscription._id} (${userTier})`
        );
      }
    }

    // Create new resume document with subscription info
    const cleanResumeData = { ...resumeData };
    if (cleanResumeData.skills !== undefined) {
      cleanResumeData.skills = normalizeSkillsHelper(cleanResumeData.skills);
    }
    if (cleanResumeData.achievements !== undefined) {
      cleanResumeData.achievements = normalizeAchievementsHelper(cleanResumeData.achievements);
    }

    const resume = new Resume({
      ...cleanResumeData,
      userId,
      subscriptionInfo,
    });

    await resume.save();
    console.log(
      `💾 Resume saved to database: ID ${resume._id}, Title: "${resume.resumeTitle}", Tier: ${subscriptionInfo.createdWithTier}`
    );

    // Increment user's resume creation counters
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.resumesCreated": 1,
        "usage.resumesThisMonth": 1,
      },
    });
    console.log(`📊 Updated resume creation count for user ${userId}`);

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
    const userId = req.user._id || req.user.userId;
    const {id} = req.params;
    const resumeData = {...req.body};

    // Strip immutable / version fields that cause VersionError during concurrent autosaves
    delete resumeData._id;
    delete resumeData.__v;
    delete resumeData.userId;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;

    // Map 'title' to 'resumeTitle' if provided
    if (resumeData.title) {
      resumeData.resumeTitle = resumeData.title;
      delete resumeData.title;
    }

    // Prepare atomic update fields
    const updateFields = {...resumeData};

    // Normalize skills if provided
    if (resumeData.skills !== undefined) {
      updateFields.skills = normalizeSkillsHelper(resumeData.skills);
    }

    // Normalize achievements if provided to guarantee clean flat string array
    if (resumeData.achievements !== undefined) {
      updateFields.achievements = normalizeAchievementsHelper(resumeData.achievements);
    }

    // Execute atomic update without optimistic concurrency lock collisions
    const updatedResume = await Resume.findOneAndUpdate(
      {_id: id, userId},
      {$set: updateFields},
      {new: true, runValidators: true}
    );

    if (!updatedResume) {
      return res.status(404).json({error: "Resume not found"});
    }

    // Return the updated resume object
    res.json(updatedResume);
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
    const userId = req.user._id || req.user.userId;

    const resumes = await Resume.find({userId})
      .select(
        "name resumeTitle description templateId createdAt updatedAt subscriptionInfo"
      )
      .sort({updatedAt: -1});

    const resumesWithAccess = await Promise.all(
      resumes.map(async (resume) => {
        const resumeObject = resume.toObject();
        resumeObject.access = await getResumeAccess(req.user, resume);
        return resumeObject;
      })
    );

    res.json({
      message: "Resumes retrieved successfully",
      resumes: resumesWithAccess,
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
    const userId = req.user._id || req.user.userId;
    const {id} = req.params;

    const resume = await Resume.findOne({_id: id, userId});

    if (!resume) {
      return res.status(404).json({error: "Resume not found"});
    }

    const resumeObject = resume.toObject();
    resumeObject.access = await getResumeAccess(req.user, resume);

    res.json(resumeObject);
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
    const userId = req.user._id || req.user.userId;
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

    // Get user ID for tracking
    const userId = req.user._id || req.user.userId;

    // Usage limits are checked by checkUsageLimit middleware
    // Free users: 10 AI generations/month, One-time: 100/month, Pro+: Unlimited

    // Categorize skills using OpenAI
    const startTime = Date.now();
    const {data: categorizedSkills, tokenUsage} = await categorizeSkillsWithAI(
      skills
    );
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    // Increment AI generation counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      message: "Skills categorized successfully",
      skills: categorizedSkills,
    });
  } catch (error) {
    console.error("Categorize skills error:", error);

    // Track failed AI usage
    if (req.user?.userId || req.user?._id) {
      await trackAIUsage(
        req.user._id || req.user.userId,
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

    // Get user ID for tracking
    const userId = req.user._id || req.user.userId;

    // Usage limits are checked by checkUsageLimit middleware
    // Free users: 10 AI generations/month, One-time: 100/month, Pro+: Unlimited

    // Segregate achievements using OpenAI
    const startTime = Date.now();
    const {data: segregatedAchievements, tokenUsage} =
      await segregateAchievementsWithAI(achievements);
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    // Increment AI generation counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    // Flatten achievements into string[] for direct consumption in templates & editor
    const flatAchievements = normalizeAchievementsHelper(segregatedAchievements);

    res.json({
      message: "Achievements segregated successfully",
      achievements: flatAchievements,
      categorized: segregatedAchievements,
    });
  } catch (error) {
    console.error("Segregate achievements error:", error);

    // Track failed AI usage
    if (req.user?.userId || req.user?._id) {
      await trackAIUsage(
        req.user._id || req.user.userId,
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

    // Get user ID for tracking
    const userId = req.user._id || req.user.userId;

    // Usage limits are checked by checkUsageLimit middleware
    // Free users: 10 AI generations/month, One-time: 100/month, Pro+: Unlimited

    // Process custom section using OpenAI
    const startTime = Date.now();
    const {data: processedContent, tokenUsage} =
      await processCustomSectionWithAI(content, title || "Custom Section");
    const responseTime = Date.now() - startTime;

    // Track AI usage
    await trackAIUsage(
      userId,
      "ai_suggestions",
      tokenUsage?.totalTokens || 0,
      responseTime,
      "success"
    );

    // Increment AI generation counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      message: "Custom section processed successfully",
      content: processedContent,
    });
  } catch (error) {
    console.error("Process custom section error:", error);

    // Track failed AI usage
    if (req.user?.userId || req.user?._id) {
      await trackAIUsage(
        req.user._id || req.user.userId,
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

/**
 * Track resume download
 * POST /api/resume/track-download
 */
export const trackDownload = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const user = req.user;

    // Increment download counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.resumesDownloaded": 1,
        "usage.resumesDownloadedThisMonth": 1,
      },
    });

    console.log(`📥 Download tracked for user ${userId}`);

    res.json({
      success: true,
      message: "Download tracked successfully",
      usage: {
        downloaded: (user.usage.resumesDownloaded || 0) + 1,
        downloadedThisMonth: (user.usage.resumesDownloadedThisMonth || 0) + 1,
        limit: user.getUsageLimit("resumeDownloadsPerMonth"),
      },
    });
  } catch (error) {
    console.error("Track download error:", error);
    res.status(500).json({
      error: error.message || "Failed to track download",
    });
  }
};

/**
 * Get short-lived resume data for Puppeteer PDF rendering
 * GET /api/resume/pdf-session/:token
 */
export const getPdfSession = async (req, res) => {
  const session = getPdfExportSession(req.params.token);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "PDF export session expired or not found",
    });
  }

  res.json({
    success: true,
    resumeData: session.resumeData,
    template: session.template,
  });
};

/**
 * Export resume as a server-generated PDF
 * POST /api/resume/export-pdf
 */
export const exportResumePdf = async (req, res) => {
  let token = null;

  try {
    const {resumeData, template = "classic"} = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({
        success: false,
        message: "Resume data is required for PDF export",
      });
    }

    token = createPdfExportSession({resumeData, template});
    const pdfBuffer = await renderResumePdf(token, req.get("origin"));

    const userId = req.user._id || req.user.userId;
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.resumesDownloaded": 1,
        "usage.resumesDownloadedThisMonth": 1,
      },
    });

    const safeName = (resumeData.name || "Resume")
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName || "Resume"}_Resume.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF export error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to export resume PDF",
    });
  } finally {
    if (token) {
      deletePdfExportSession(token);
    }
  }
};

/**
 * Fetch all active templates for public gallery & SEO metadata
 * GET /api/resume/templates/public
 */
export const getPublicTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Get public templates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public templates",
      error: error.message,
    });
  }
};

/**
 * Tailor resume to a job description with AI
 * POST /api/resume/tailor
 */
export const tailorResume = async (req, res) => {
  try {
    const {resumeData, jobDescription} = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: "Job description is required (at least 30 characters)",
      });
    }

    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({success: false, error: "User not found"});
    }

    const result = await aiRouter.tailorResume(resumeData, jobDescription, user);

    // Increment AI usage counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      success: true,
      data: result.data,
      aiModel: result.aiModel,
    });
  } catch (error) {
    console.error("❌ Tailor resume error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to tailor resume",
    });
  }
};

/**
 * Compress resume to fit on a single page with AI
 * POST /api/resume/compress
 */
export const compressResume = async (req, res) => {
  try {
    const {resumeData} = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({success: false, error: "User not found"});
    }

    const result = await aiRouter.compressResume(resumeData, user);

    // Increment AI usage counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      success: true,
      data: result.data,
      aiModel: result.aiModel,
    });
  } catch (error) {
    console.error("❌ Compress resume error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to compress resume",
    });
  }
};

/**
 * Generate 3 tailored variations of a bullet point or summary
 * POST /api/resume/bullet-rewrites
 */
export const getBulletRewrites = async (req, res) => {
  try {
    const {content, sectionType = "experience", context = {}, resumeData = null, customInstruction = ""} = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Content is required for AI bullet rewrite",
      });
    }

    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({success: false, error: "User not found"});
    }

    const result = await aiRouter.generateBulletVariations(
      content,
      sectionType,
      context,
      resumeData,
      user,
      customInstruction
    );

    // Increment AI usage counter
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "usage.aiGenerationsUsed": 1,
        "usage.aiGenerationsThisMonth": 1,
      },
    });

    res.json({
      success: true,
      data: result.data,
      aiModel: result.aiModel,
    });
  } catch (error) {
    console.error("❌ Bullet rewrite error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate bullet variations",
    });
  }
};


