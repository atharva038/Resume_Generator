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
    daily: Infinity, // No daily limit for free users (only monthly)
    monthly: 10, // 10 AI requests per month for free users
  },
  "one-time": {
    daily: Infinity, // No daily limit
    period: 21, // 21-day period instead of monthly
    periodLimit: 150, // 150 AI requests for 21-day period from purchase date
  },
  pro: {
    daily: Infinity, // No daily limit
    monthly: Infinity, // Unlimited for pro users
  },
  premium: {
    daily: Infinity, // No daily limit
    monthly: Infinity, // Unlimited for premium users
  },
  lifetime: {
    daily: Infinity, // No daily limit
    monthly: Infinity, // Unlimited for lifetime users
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
 * Get user's tier (free/one-time/pro/premium/lifetime/admin)
 * @param {Object} user - User object from req.user
 * @returns {string} User tier
 */
const getUserTier = (user) => {
  if (user.role === "admin") return "admin";
  // Get tier from user's subscription
  return user.subscription?.tier || "free";
};

/**
 * Middleware: Check if user has exceeded their AI quota
 * This runs BEFORE the AI request is made
 */
export const checkAIQuota = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    // Handle both JWT payload (userId) and MongoDB user object (_id)
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      console.error("❌ checkAIQuota: No user ID found in req.user:", req.user);
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    console.log("🔍 checkAIQuota middleware for user:", userId);

    const userTier = getUserTier(req.user);

    // Admins bypass quota checks
    if (userTier === "admin") {
      console.log(`✅ Admin user ${userId} - quota check bypassed`);
      return next();
    }

    // Get quota limits for user's tier
    const limits = QUOTA_LIMITS[userTier] || QUOTA_LIMITS.free;

    // Calculate time boundaries
    const now = new Date();

    // Special handling for one-time subscriptions: 21-day period from purchase date
    if (userTier === "one-time") {
      const subscriptionStartDate = req.user.subscription?.startDate;

      if (!subscriptionStartDate) {
        console.error("❌ One-time user has no subscription start date");
        return res.status(400).json({
          success: false,
          error: "Invalid subscription",
          message: "Subscription start date not found. Please contact support.",
        });
      }

      // Calculate 21-day period start (from subscription purchase date)
      const periodStart = new Date(subscriptionStartDate);
      const periodEnd = new Date(
        periodStart.getTime() + limits.period * 24 * 60 * 60 * 1000
      );

      // Get usage count for the 21-day period
      const periodUsage = await getUsageCount(userId, periodStart);

      // Check if subscription period has ended
      if (now > periodEnd) {
        console.log(
          `[AI Quota] User ${userId} subscription period ended: ${periodEnd.toISOString()}`
        );
        return res.status(403).json({
          success: false,
          error: "Subscription expired",
          message: `Your 21-day subscription period ended on ${periodEnd.toLocaleDateString()}. Please purchase a new subscription to continue using AI features.`,
          quota: {
            tier: userTier,
            period: {
              used: periodUsage,
              limit: limits.periodLimit,
              remaining: 0,
              daysRemaining: 0,
            },
            startDate: periodStart.toISOString(),
            endDate: periodEnd.toISOString(),
            expired: true,
          },
        });
      }

      // Check 21-day period quota
      if (periodUsage >= limits.periodLimit) {
        console.log(
          `[AI Quota] User ${userId} exceeded 21-day period limit: ${periodUsage}/${limits.periodLimit}`
        );
        return res.status(429).json({
          success: false,
          error: "AI quota exceeded",
          message: `You have used all ${limits.periodLimit} AI requests from your 21-day subscription. Upgrade to Pro for unlimited AI requests.`,
          quota: {
            tier: userTier,
            period: {
              used: periodUsage,
              limit: limits.periodLimit,
              remaining: 0,
              daysRemaining: Math.ceil(
                (periodEnd - now) / (24 * 60 * 60 * 1000)
              ),
            },
            startDate: periodStart.toISOString(),
            endDate: periodEnd.toISOString(),
            expired: false,
          },
        });
      }

      // Quota check passed for one-time user
      const daysRemaining = Math.ceil(
        (periodEnd - now) / (24 * 60 * 60 * 1000)
      );
      req.aiUsageInfo = {
        userId,
        userTier,
        periodUsage,
        periodRemaining: limits.periodLimit - periodUsage,
        daysRemaining,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
      };

      console.log(
        `✅ AI quota check passed for user ${userId}: ${periodUsage}/${limits.periodLimit} in 21-day period (${daysRemaining} days remaining)`
      );
      return next();
    }

    // For other tiers (free, pro, premium, lifetime): monthly quota
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

    // Check daily quota (only if not Infinity)
    if (limits.daily !== Infinity && dailyUsage >= limits.daily) {
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

    // Check monthly quota (only if not Infinity)
    if (limits.monthly !== Infinity && monthlyUsage >= limits.monthly) {
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
      dailyRemaining:
        limits.daily === Infinity ? Infinity : limits.daily - dailyUsage,
      monthlyRemaining:
        limits.monthly === Infinity ? Infinity : limits.monthly - monthlyUsage,
    };

    console.log(
      `✅ AI quota check passed for user ${userId}: ${dailyUsage}/${limits.daily} daily, ${monthlyUsage}/${limits.monthly} monthly`
    );
    next();
  } catch (error) {
    console.error("❌ AI Quota check error:", error);
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
  errorMessage = null,
  aiProvider = "gemini",
  aiModel = "gemini"
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
      aiProvider,
      aiModel,
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
      `✅ AI Usage tracked: User ${userId}, Provider: ${aiProvider}, Model: ${aiModel}, Feature: ${feature}, Tokens: ${tokensUsed}, Cost: $${cost.toFixed(
        4
      )}, Status: ${status}`
    );
    return usageRecord;
  } catch (error) {
    console.error("❌ AI Usage tracking error:", error);
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
