import Resume from "../models/Resume.model.js";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import {extractTextFromFile, deleteFile} from "../utils/fileExtractor.js";
// Import ALL AI functions from OpenAI (Gemini has quota limits)
import {
  parseResumeWithAI as parseResumeWithOpenAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
  categorizeSkillsWithAI,
  segregateAchievementsWithAI,
  processCustomSectionWithAI,
} from "../services/openai.service.js";
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

    // Get user and check tier for AI extraction
    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);
    const tier = user?.subscription?.tier || "free";

    // Check if user can use AI resume extraction (Pro/Premium/Lifetime only)
    const canUseAIExtraction = ["pro", "premium", "lifetime"].includes(tier);

    // Get usage limits for response
    let limit = null;
    let used = null;

    // If using AI extraction, check daily limit
    if (canUseAIExtraction) {
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

    // Increment AI extraction counter for pro/premium/lifetime users
    if (canUseAIExtraction) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          "usage.aiResumeExtractions": 1,
          "usage.aiResumeExtractionsToday": 1,
        },
      });
      console.log(`✅ AI extraction count incremented for ${tier} user`);
    }

    // AI usage tracking is handled by gemini.service.js internally
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

    // Check if it's a Gemini quota error (more comprehensive check)
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
          "The free AI resume parsing service has reached its daily limit. Upgrade to Pro, Premium, or Lifetime to get unlimited AI-powered resume parsing!",
        upgradeRequired: true,
        feature: "AI Resume Parsing",
        availableIn: ["pro", "premium", "lifetime"],
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

    // Generate summary using Gemini AI
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

    // Get user's subscription info for linking
    const user = req.user; // Full user object from checkSubscription middleware
    const userTier = user.subscription?.tier || "free";
    const userStatus = user.subscription?.status || "expired";

    // Find active subscription if user has premium tier
    let subscriptionInfo = {
      subscriptionId: null,
      createdWithTier: userTier,
      createdWithSubscription: false,
      linkedAt: null,
    };

    if (
      ["one-time", "pro", "premium", "student", "lifetime"].includes(
        userTier
      ) &&
      userStatus === "active"
    ) {
      const activeSubscription = await Subscription.findOne({
        userId: user._id,
        tier: userTier,
        status: "active",
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
    const resume = new Resume({
      ...resumeData,
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
    const userId = req.user._id || req.user.userId;

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
    const userId = req.user._id || req.user.userId;
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

    // Categorize skills using Gemini AI
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

    // Segregate achievements using Gemini AI
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

    res.json({
      message: "Achievements segregated successfully",
      achievements: segregatedAchievements,
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

    // Process custom section using Gemini AI
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
