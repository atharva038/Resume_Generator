import * as geminiService from "./gemini.service.js";
import * as openaiService from "./openai.service.js";
import UsageLog from "../models/UsageLog.model.js";
import AIUsage from "../models/AIUsage.model.js";

/**
 * AI Router Service
 * Routes AI requests to appropriate service (Gemini or GPT-4o) based on user tier
 * Tracks usage and costs for analytics
 */

// Tier to AI Model mapping
const TIER_AI_MAPPING = {
  free: "gemini",
  "one-time": "gpt4o",
  pro: "hybrid", // 70% Gemini, 30% GPT-4o
  premium: "gpt4o",
  student: "hybrid",
  lifetime: "gpt4o",
};

// Action types that support hybrid mode (can use Gemini for some operations)
const HYBRID_COMPATIBLE_ACTIONS = [
  "resume_parsed",
  "skills_categorized",
  "summary_generated",
];

/**
 * Determine which AI service to use based on user tier ONLY
 * @param {Object} user - User object with subscription info
 * @param {string} action - Action being performed
 * @returns {string} - 'gemini' or 'gpt4o'
 */
function selectAIService(user, action = "resume_created") {
  // Get default model for user's tier
  const userTier = user.subscription?.tier || "free";
  const tierModel = TIER_AI_MAPPING[userTier];

  console.log(
    `🎯 AI Selection: User tier "${userTier}" → Model "${tierModel}"`
  );

  // Handle hybrid mode (for pro and student tiers)
  if (tierModel === "hybrid") {
    // For hybrid, use Gemini for lighter tasks, GPT-4o for critical tasks
    if (HYBRID_COMPATIBLE_ACTIONS.includes(action)) {
      // 70% chance of Gemini for hybrid-compatible actions
      const selectedModel = Math.random() < 0.7 ? "gemini" : "gpt4o";
      console.log(`   Hybrid mode: ${action} → ${selectedModel}`);
      return selectedModel;
    }
    // Use GPT-4o for critical actions like content enhancement
    console.log(`   Hybrid mode: ${action} → gpt4o (critical action)`);
    return "gpt4o";
  }

  return tierModel;
}

/**
 * Log AI usage to database
 * @param {string} userId - User ID
 * @param {string} action - Action performed
 * @param {string} aiModel - AI model used (gemini, gpt4o, hybrid)
 * @param {Object} tokenUsage - Token usage data
 * @param {Object} cost - Cost data
 * @param {boolean} success - Whether operation succeeded
 * @param {Object} metadata - Additional metadata
 */
async function logUsage(
  userId,
  action,
  aiModel,
  tokenUsage,
  cost,
  success = true,
  metadata = {}
) {
  try {
    // Determine AI provider from model
    const aiProvider =
      aiModel === "gpt4o"
        ? "openai"
        : aiModel === "gemini"
        ? "gemini"
        : "hybrid";

    // Map action to feature for AIUsage
    const featureMapping = {
      ats_scan: "ats_analysis",
      job_match: "ats_analysis",
      resume_enhanced: "resume_enhancement",
      content_enhanced: "resume_enhancement",
      resume_parsed: "github_import",
      cover_letter: "ai_suggestions",
      summary_generated: "ai_suggestions",
      skills_categorized: "ai_suggestions",
    };

    const feature = featureMapping[action] || "ai_suggestions";

    // Log to UsageLog (existing)
    await UsageLog.logUsage({
      userId,
      action,
      aiModel,
      tokensUsed: {
        input: tokenUsage.promptTokens || 0,
        output: tokenUsage.candidatesTokens || 0,
        total: tokenUsage.totalTokens || 0,
      },
      cost: {
        amount: cost?.amount || 0,
        currency: cost?.currency || "USD",
      },
      success,
      metadata,
    });

    // Log to AIUsage (for admin analytics)
    await AIUsage.create({
      userId,
      aiProvider,
      aiModel,
      feature,
      tokensUsed: tokenUsage.totalTokens || 0,
      cost: cost?.amount || 0,
      responseTime: metadata.responseTime || 0,
      status: success ? "success" : "error",
      errorMessage: metadata.error || null,
      metadata: {
        action,
        ...metadata,
      },
    });
  } catch (error) {
    console.error("❌ Failed to log usage:", error.message);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Parse resume with appropriate AI service
 * @param {string} resumeText - Raw resume text
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Parsed resume data
 */
export async function parseResume(resumeText, user) {
  const aiService = selectAIService(user, "resume_parsed");
  const startTime = Date.now();

  try {
    let result;
    if (aiService === "gpt4o") {
      result = await openaiService.parseResumeWithAI(resumeText);
    } else {
      result = await geminiService.parseResumeWithAI(resumeText);
    }

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "resume_parsed",
      aiService,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime, textLength: resumeText.length}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_parsed",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Enhance content with appropriate AI service
 * @param {string} content - Content to enhance
 * @param {string} sectionType - Section type
 * @param {Object} resumeData - Full resume data
 * @param {Object} user - User object
 * @param {string} customPrompt - Optional custom prompt
 * @returns {Promise<Object>} - Enhanced content
 */
export async function enhanceContent(
  content,
  sectionType,
  resumeData,
  user,
  customPrompt = ""
) {
  const aiService = selectAIService(user, "content_enhanced");
  const startTime = Date.now();

  try {
    let result;
    if (aiService === "gpt4o") {
      result = await openaiService.enhanceContentWithAI(
        content,
        sectionType,
        resumeData,
        customPrompt
      );
    } else {
      result = await geminiService.enhanceContentWithAI(
        content,
        sectionType,
        resumeData,
        customPrompt
      );
    }

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "content_enhanced",
      aiService,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime, sectionType}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "content_enhanced",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, sectionType, error: error.message}
    );
    throw error;
  }
}

/**
 * Generate summary with appropriate AI service
 * @param {Object} resumeData - Resume data
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Generated summary
 */
export async function generateSummary(resumeData, user) {
  const aiService = selectAIService(user, "summary_generated");
  const startTime = Date.now();

  try {
    let result;
    if (aiService === "gpt4o") {
      result = await openaiService.generateSummaryWithAI(resumeData);
    } else {
      result = await geminiService.generateSummaryWithAI(resumeData);
    }

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "summary_generated",
      aiService,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "summary_generated",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Categorize skills with appropriate AI service
 * @param {string} skillsText - Skills text
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Categorized skills
 */
export async function categorizeSkills(skillsText, user) {
  const aiService = selectAIService(user, "skills_categorized");
  const startTime = Date.now();

  try {
    let result;
    if (aiService === "gpt4o") {
      result = await openaiService.categorizeSkillsWithAI(skillsText);
    } else {
      result = await geminiService.categorizeSkillsWithAI(skillsText);
    }

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "skills_categorized",
      aiService,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "skills_categorized",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Analyze ATS job match with appropriate AI service
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Match analysis
 */
export async function analyzeJobMatch(resumeText, jobDescription, user) {
  const aiService = selectAIService(user, "job_match");
  const startTime = Date.now();

  // Debug logging
  console.log("🔍 [AI Router] analyzeJobMatch:");
  console.log("   User ID:", user._id);
  console.log("   User Tier:", user.subscription?.tier || "free");
  console.log("   Selected AI Service:", aiService);

  try {
    let result;
    if (aiService === "gpt4o") {
      console.log("🤖 Calling OpenAI GPT-4o for resume-job match analysis...");

      // Check if OpenAI is available
      if (
        !openaiService ||
        typeof openaiService.analyzeResumeJobMatch !== "function"
      ) {
        console.warn("⚠️ OpenAI service not available, falling back to Gemini");
        result = await geminiService.analyzeResumeJobMatch(
          resumeText,
          jobDescription
        );
        // Override aiModel to reflect actual service used
        const responseTime = Date.now() - startTime;
        await logUsage(
          user._id,
          "job_match",
          "gemini",
          result.tokenUsage,
          result.cost || {amount: 0, currency: "USD"},
          true,
          {responseTime, fallback: "openai_unavailable"}
        );
        return {
          ...result,
          aiModel: "gemini",
          fallback: true,
        };
      }

      try {
        result = await openaiService.analyzeResumeJobMatch(
          resumeText,
          jobDescription
        );
      } catch (openaiError) {
        console.error(
          "❌ OpenAI GPT-4o failed, falling back to Gemini:",
          openaiError.message
        );
        result = await geminiService.analyzeResumeJobMatch(
          resumeText,
          jobDescription
        );
        // Override aiModel to reflect actual service used
        const responseTime = Date.now() - startTime;
        await logUsage(
          user._id,
          "job_match",
          "gemini",
          result.tokenUsage,
          result.cost || {amount: 0, currency: "USD"},
          true,
          {
            responseTime,
            fallback: "openai_error",
            openaiError: openaiError.message,
          }
        );
        return {
          ...result,
          aiModel: "gemini",
          fallback: true,
          fallbackReason: openaiError.message,
        };
      }
    } else {
      console.log("🤖 Calling Gemini API for resume-job match analysis...");
      result = await geminiService.analyzeResumeJobMatch(
        resumeText,
        jobDescription
      );
    }

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "job_match",
      aiService,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "job_match",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Generate cover letter with appropriate AI service (Premium feature - always GPT-4o)
 * @param {Object} resumeData - Resume data
 * @param {string} jobDescription - Job description
 * @param {string} companyName - Company name
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Generated cover letter
 */
export async function generateCoverLetter(
  resumeData,
  jobDescription,
  companyName,
  user
) {
  // Cover letters always use GPT-4o for premium quality
  const aiService = "gpt4o";
  const startTime = Date.now();

  try {
    const result = await openaiService.generateCoverLetter(
      resumeData,
      jobDescription,
      companyName
    );

    const responseTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      user._id,
      "cover_letter",
      aiService,
      result.tokenUsage,
      result.cost,
      true,
      {responseTime, companyName}
    );

    return {
      ...result,
      aiModel: aiService,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "cover_letter",
      aiService,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, companyName, error: error.message}
    );
    throw error;
  }
}

/**
 * Get AI service info for a user
 * @param {Object} user - User object
 * @returns {Object} - AI service configuration
 */
export function getAIServiceInfo(user) {
  const tier = user.subscription?.tier || "free";
  const aiModel = TIER_AI_MAPPING[tier];

  return {
    tier,
    aiModel,
    isHybrid: aiModel === "hybrid",
  };
}

export default {
  parseResume,
  enhanceContent,
  generateSummary,
  categorizeSkills,
  analyzeJobMatch,
  generateCoverLetter,
  getAIServiceInfo,
};
