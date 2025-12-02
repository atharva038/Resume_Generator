import AIUsage from "../models/AIUsage.model.js";

// ============================================
// AI USAGE TRACKING & QUOTA MIDDLEWARE
// ============================================
// This middleware tracks AI usage, enforces quotas, and calculates costs
// to prevent unlimited API abuse and control expenses.
//
// Features:
// - Daily/Monthly quota enforcement per user
// - Real-time cost tracking
// - Token usage monitoring
// - User tier-based limits (free/premium)
// - Admin bypass capability
//
// Gemini API Pricing (as of 2024):
// - Input: $0.000125 per 1K tokens
// - Output: $0.000375 per 1K tokens
// - Average cost per request: ~$0.01 (estimated)
// ============================================

// Configuration: User tier limits
const QUOTA_LIMITS = {
  free: {
    daily: 10, // 10 AI requests per day for free users
    monthly: 200, // 200 AI requests per month
  },
  "one-time": {
    daily: 30, // 30 AI requests per day for one-time purchase users
    monthly: 200, // 200 AI requests during 21-day access period
  },
  premium: {
    daily: 100, // 100 AI requests per day for premium users
    monthly: 2000, // 2000 AI requests per month
  },
  admin: {
    daily: Infinity, // Unlimited for admins
    monthly: Infinity,
  },
};

// Estimated token costs (Gemini API pricing)
const TOKEN_COSTS = {
  inputTokenPer1K: 0.000125, // $0.000125 per 1K input tokens
  outputTokenPer1K: 0.000375, // $0.000375 per 1K output tokens
};

/**
 * Calculate cost based on token usage
 * @param {number} inputTokens - Number of input tokens
 * @param {number} outputTokens - Number of output tokens
 * @returns {number} Total cost in dollars
 */
const calculateCost = (inputTokens = 0, outputTokens = 0) => {
  const inputCost = (inputTokens / 1000) * TOKEN_COSTS.inputTokenPer1K;
  const outputCost = (outputTokens / 1000) * TOKEN_COSTS.outputTokenPer1K;
  return inputCost + outputCost;
};

/**
 * Get user's AI usage for a specific time period
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date for the period
 * @returns {Promise<number>} Number of AI requests in the period
 */
const getUsageCount = async (userId, startDate) => {
  try {
    const count = await AIUsage.countDocuments({
      userId,
      createdAt: {$gte: startDate},
      status: "success", // Only count successful requests
      countTowardsQuota: {$ne: false}, // Only count records that count towards quota
    });
    return count;
  } catch (error) {
    console.error("Error fetching usage count:", error);
    return 0;
  }
};

/**
 * Get user's tier (free/premium/admin)
 * For now, defaults to 'free' for regular users
 * TODO: Add tier field to User model when implementing paid plans
 * @param {Object} user - User object from req.user
 * @returns {string} User tier ('free', 'premium', or 'admin')
 */
const getUserTier = (user) => {
  if (user.role === "admin") return "admin";
  // TODO: Check user.tier when premium plans are implemented
  // return user.tier || 'free';
  return "free";
};

/**
 * Middleware: Check if user has exceeded their AI quota
 * This runs BEFORE the AI request is made
 */
export const checkAIQuota = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const userId = req.user.userId;
    const userTier = getUserTier(req.user);

    // Admins bypass quota checks
    if (userTier === "admin") {
      console.log(`[AI Quota] Admin user ${userId} - quota check bypassed`);
      return next();
    }

    // Get quota limits for user's tier
    const limits = QUOTA_LIMITS[userTier] || QUOTA_LIMITS.free;

    // Calculate time boundaries
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage counts
    const [dailyUsage, monthlyUsage] = await Promise.all([
      getUsageCount(userId, startOfDay),
      getUsageCount(userId, startOfMonth),
    ]);

    // Check daily quota
    if (dailyUsage >= limits.daily) {
      console.log(
        `[AI Quota] User ${userId} exceeded daily limit: ${dailyUsage}/${limits.daily}`
      );
      return res.status(429).json({
        success: false,
        error: "Daily AI quota exceeded",
        message: `You have reached your daily limit of ${limits.daily} AI requests. Please try again tomorrow.`,
        quota: {
          tier: userTier,
          daily: {
            used: dailyUsage,
            limit: limits.daily,
            remaining: 0,
          },
          monthly: {
            used: monthlyUsage,
            limit: limits.monthly,
            remaining: Math.max(0, limits.monthly - monthlyUsage),
          },
          resetsAt: new Date(
            startOfDay.getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      });
    }

    // Check monthly quota
    if (monthlyUsage >= limits.monthly) {
      console.log(
        `[AI Quota] User ${userId} exceeded monthly limit: ${monthlyUsage}/${limits.monthly}`
      );
      return res.status(429).json({
        success: false,
        error: "Monthly AI quota exceeded",
        message: `You have reached your monthly limit of ${limits.monthly} AI requests. Upgrade to premium for higher limits.`,
        quota: {
          tier: userTier,
          daily: {
            used: dailyUsage,
            limit: limits.daily,
            remaining: Math.max(0, limits.daily - dailyUsage),
          },
          monthly: {
            used: monthlyUsage,
            limit: limits.monthly,
            remaining: 0,
          },
          resetsAt: new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
          ).toISOString(),
        },
      });
    }

    // Quota check passed - attach usage info to request for logging
    req.aiUsageInfo = {
      userId,
      userTier,
      dailyUsage,
      monthlyUsage,
      dailyRemaining: limits.daily - dailyUsage,
      monthlyRemaining: limits.monthly - monthlyUsage,
    };

    console.log(
      `[AI Quota] User ${userId} quota check passed: ${dailyUsage}/${limits.daily} daily, ${monthlyUsage}/${limits.monthly} monthly`
    );
    next();
  } catch (error) {
    console.error("[AI Quota] Error checking quota:", error);
    // Don't block the request on quota check errors
    // Log the error and allow the request to proceed
    next();
  }
};

/**
 * Middleware: Track AI usage after successful request
 * This runs AFTER the AI request is completed
 * Call this manually in the controller after getting AI response
 */
export const trackAIUsage = async (
  userId,
  feature,
  tokensUsed,
  responseTime,
  status = "success",
  errorMessage = null
) => {
  try {
    // Calculate cost based on token usage
    // For simplicity, assuming 60% input, 40% output token split
    const estimatedInputTokens = Math.floor(tokensUsed * 0.6);
    const estimatedOutputTokens = Math.floor(tokensUsed * 0.4);
    const cost = calculateCost(estimatedInputTokens, estimatedOutputTokens);

    // Create usage record
    const usageRecord = await AIUsage.create({
      userId,
      feature,
      tokensUsed,
      cost,
      responseTime,
      status,
      errorMessage,
      metadata: {
        estimatedInputTokens,
        estimatedOutputTokens,
        timestamp: new Date(),
      },
    });

    console.log(
      `[AI Usage] Tracked: User ${userId}, Feature: ${feature}, Tokens: ${tokensUsed}, Cost: $${cost.toFixed(
        4
      )}, Status: ${status}`
    );
    return usageRecord;
  } catch (error) {
    console.error("[AI Usage] Error tracking usage:", error);
    // Don't throw error - usage tracking failure shouldn't break the app
    return null;
  }
};

/**
 * Helper function to get user's current quota status
 * Can be used in API endpoints to show users their usage
 */
export const getQuotaStatus = async (userId, userRole) => {
  try {
    const userTier = getUserTier({role: userRole});
    const limits = QUOTA_LIMITS[userTier] || QUOTA_LIMITS.free;

    // Calculate time boundaries
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage counts
    const [dailyUsage, monthlyUsage] = await Promise.all([
      getUsageCount(userId, startOfDay),
      getUsageCount(userId, startOfMonth),
    ]);

    // Calculate total costs for the month
    const monthlyCosts = await AIUsage.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: {$gte: startOfMonth},
          status: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalCost: {$sum: "$cost"},
          totalTokens: {$sum: "$tokensUsed"},
        },
      },
    ]);

    const totalMonthlyCost = monthlyCosts[0]?.totalCost || 0;
    const totalMonthlyTokens = monthlyCosts[0]?.totalTokens || 0;

    return {
      tier: userTier,
      daily: {
        used: dailyUsage,
        limit: limits.daily,
        remaining: Math.max(0, limits.daily - dailyUsage),
        percentage: (dailyUsage / limits.daily) * 100,
      },
      monthly: {
        used: monthlyUsage,
        limit: limits.monthly,
        remaining: Math.max(0, limits.monthly - monthlyUsage),
        percentage: (monthlyUsage / limits.monthly) * 100,
        totalCost: totalMonthlyCost,
        totalTokens: totalMonthlyTokens,
      },
      nextReset: {
        daily: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
        monthly: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    };
  } catch (error) {
    console.error("[AI Usage] Error getting quota status:", error);
    return null;
  }
};

// Export configuration for testing/monitoring
export const config = {
  QUOTA_LIMITS,
  TOKEN_COSTS,
};
