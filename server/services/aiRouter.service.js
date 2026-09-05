import * as openaiService from "./openai.service.js";
import UsageLog from "../models/UsageLog.model.js";
import AIUsage from "../models/AIUsage.model.js";
import {notifyAIFailure} from "./adminNotification.service.js";

/**
 * AI Router Service (OpenAI GPT-4o Exclusively)
 * Routes all AI requests directly to OpenAI
 * Tracks usage and costs for analytics
 */

const AI_MODEL = "gpt4o";
const AI_PROVIDER = "openai";

/**
 * Log AI usage to database
 * @param {string} userId - User ID
 * @param {string} action - Action performed
 * @param {string} aiModel - AI model used
 * @param {Object} tokenUsage - Token usage data
 * @param {Object} cost - Cost data
 * @param {boolean} success - Whether operation succeeded
 * @param {Object} metadata - Additional metadata
 */
async function logUsage(
  userId,
  action,
  aiModel = AI_MODEL,
  tokenUsage = {},
  cost = {},
  success = true,
  metadata = {}
) {
  try {
    const featureMapping = {
      ats_scan: "ats_analysis",
      job_match: "ats_analysis",
      resume_enhanced: "resume_enhancement",
      content_enhanced: "resume_enhancement",
      resume_parsed: "github_import",
      cover_letter: "ai_suggestions",
      summary_generated: "ai_suggestions",
      skills_categorized: "ai_suggestions",
      resume_tailor: "resume_enhancement",
      resume_compress: "resume_enhancement",
    };

    const feature = featureMapping[action] || "ai_suggestions";

    await UsageLog.logUsage({
      userId,
      action,
      aiModel: AI_MODEL,
      tokensUsed: {
        input: tokenUsage.promptTokens || 0,
        output: tokenUsage.candidatesTokens || tokenUsage.completionTokens || 0,
        total: tokenUsage.totalTokens || 0,
      },
      cost: {
        amount: cost?.amount || 0,
        currency: cost?.currency || "USD",
      },
      success,
      metadata,
    });

    await AIUsage.create({
      userId,
      aiProvider: AI_PROVIDER,
      aiModel: AI_MODEL,
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

    if (!success) {
      notifyAIFailure({
        userId,
        feature,
        aiProvider: AI_PROVIDER,
        aiModel: AI_MODEL,
        error: metadata.error || "AI request failed",
      });
    }
  } catch (error) {
    console.error("❌ Failed to log usage:", error.message);
  }
}

/**
 * Parse resume with OpenAI
 */
export async function parseResume(resumeText, user) {
  const startTime = Date.now();
  try {
    const result = await openaiService.parseResumeWithAI(resumeText);
    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "resume_parsed",
      AI_MODEL,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime, textLength: resumeText.length}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_parsed",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Enhance content with OpenAI
 */
export async function enhanceContent(
  content,
  sectionType,
  resumeData,
  user,
  customPrompt = ""
) {
  const startTime = Date.now();
  try {
    const result = await openaiService.enhanceContentWithAI(
      content,
      sectionType,
      resumeData,
      customPrompt
    );

    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "content_enhanced",
      AI_MODEL,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime, sectionType}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "content_enhanced",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, sectionType, error: error.message}
    );
    throw error;
  }
}

/**
 * Generate summary with OpenAI
 */
export async function generateSummary(resumeData, user) {
  const startTime = Date.now();
  try {
    const result = await openaiService.generateSummaryWithAI(resumeData);
    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "summary_generated",
      AI_MODEL,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "summary_generated",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Categorize skills with OpenAI
 */
export async function categorizeSkills(skillsText, user) {
  const startTime = Date.now();
  try {
    const result = await openaiService.categorizeSkillsWithAI(skillsText);
    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "skills_categorized",
      AI_MODEL,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "skills_categorized",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Analyze ATS job match with OpenAI
 */
export async function analyzeJobMatch(resumeText, jobDescription, user) {
  const startTime = Date.now();
  console.log("🤖 Calling OpenAI GPT-4o for resume-job match analysis...");

  try {
    const result = await openaiService.analyzeResumeJobMatch(
      resumeText,
      jobDescription
    );

    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "job_match",
      AI_MODEL,
      result.tokenUsage,
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "job_match",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Generate cover letter with OpenAI GPT-4o
 */
export async function generateCoverLetter(
  resumeData,
  jobDescription,
  companyName,
  user
) {
  const startTime = Date.now();
  try {
    const result = await openaiService.generateCoverLetter(
      resumeData,
      jobDescription,
      companyName
    );

    const responseTime = Date.now() - startTime;

    await logUsage(
      user._id,
      "cover_letter",
      AI_MODEL,
      result.tokenUsage,
      result.cost,
      true,
      {responseTime, companyName}
    );

    return {
      ...result,
      aiModel: AI_MODEL,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "cover_letter",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, companyName, error: error.message}
    );
    throw error;
  }
}

/**
 * Tailor resume with OpenAI
 */
export async function tailorResume(resumeData, jobDescription, user) {
  const startTime = Date.now();
  try {
    const result = await openaiService.tailorResumeWithAI(
      resumeData,
      jobDescription
    );

    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_tailor",
      AI_MODEL,
      result.tokenUsage || {totalTokens: 0},
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {...result, aiModel: AI_MODEL};
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_tailor",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Compress resume with OpenAI
 */
export async function compressResume(resumeData, user) {
  const startTime = Date.now();
  try {
    const result = await openaiService.compressResumeWithAI(resumeData);

    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_compress",
      AI_MODEL,
      result.tokenUsage || {totalTokens: 0},
      result.cost || {amount: 0, currency: "USD"},
      true,
      {responseTime}
    );

    return {...result, aiModel: AI_MODEL};
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logUsage(
      user._id,
      "resume_compress",
      AI_MODEL,
      {promptTokens: 0, candidatesTokens: 0, totalTokens: 0},
      {amount: 0, currency: "USD"},
      false,
      {responseTime, error: error.message}
    );
    throw error;
  }
}

/**
 * Get AI service info for a user
 */
export function getAIServiceInfo(user) {
  return {
    tier: user?.subscription?.tier || "free",
    aiModel: AI_MODEL,
    isHybrid: false,
  };
}

export default {
  parseResume,
  enhanceContent,
  generateSummary,
  categorizeSkills,
  analyzeJobMatch,
  generateCoverLetter,
  tailorResume,
  compressResume,
  getAIServiceInfo,
};
