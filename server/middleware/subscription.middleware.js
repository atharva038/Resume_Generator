import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";

/**
 * Subscription Middleware
 * Handles subscription checks, usage limits, and tracking
 */

/**
 * Check if user has an active subscription
 * Attaches subscription info to req.user
 */
export async function checkSubscription(req, res, next) {
  try {
    // Get userId from JWT payload (set by authenticateToken middleware)
    const userId = req.user.userId || req.user._id;

    console.log("🔍 checkSubscription middleware:");
    console.log("  - userId:", userId);
    console.log("  - req.user:", JSON.stringify(req.user, null, 2));

    // Fetch user with subscription details
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found with ID:", userId);
      return res.status(404).json({
        error: "User not found",
        message: "Your account could not be found. Please contact support.",
      });
    }

    // Check subscription status and expiry
    await user.checkSubscriptionExpiry();

    // Check if daily usage needs to be reset (for job matches and AI extractions)
    const now = new Date();
    const lastReset = user.usage.lastDailyReset;

    if (lastReset) {
      const hoursSinceReset = (now - new Date(lastReset)) / (1000 * 60 * 60);
      // Reset if more than 24 hours have passed
      if (hoursSinceReset >= 24) {
        console.log("🔄 Resetting daily usage counters for user:", user.email);
        await user.resetDailyUsage();
      }
    } else {
      // First time - initialize the reset date
      user.usage.lastDailyReset = now;
      await user.save();
    }

    // Attach updated user to request
    req.user = user;

    console.log("✅ Subscription check passed for:", user.email);
    console.log("  - Tier:", user.subscription?.tier || "free");
    console.log("  - Status:", user.subscription?.status || "N/A");

    next();
  } catch (error) {
    console.error("❌ Subscription check error:", error.message);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      error: "Subscription check failed",
      message: "Failed to check subscription status. Please try again.",
    });
  }
}

/**
 * Check if user has reached usage limit for a specific feature
 * @param {string} limitType - Type of limit to check (resumes, atsScans, jobMatches, coverLetters)
 */
export function checkUsageLimit(limitType) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        console.error("❌ checkUsageLimit: User not authenticated");
        return res.status(401).json({
          error: "Authentication required",
          message: "Please log in to use this feature",
        });
      }

      console.log(`🔍 Checking usage limit for ${limitType}:`, {
        userId: user._id,
        tier: user.subscription?.tier || "free",
        current: user.usage?.[limitType] || 0,
        limit: user.getUsageLimit(limitType),
      });

      // Check if limit reached
      if (user.hasReachedLimit(limitType)) {
        const limit = user.getUsageLimit(limitType);
        const tier = user.subscription?.tier || "free";

        console.log(`⚠️ User has reached limit for ${limitType}`);

        // Customize messages based on limit type and tier
        const limitMessages = {
          resumesPerMonth: {
            free: {
              title: "Resume Limit Reached",
              message:
                "You've created your 1 free resume for this month. Upgrade to create unlimited resumes!",
              action: "Upgrade to Pro",
            },
            "one-time": {
              title: "Resume Limit Reached",
              message:
                "You've already created your resume with the One-Time plan. Upgrade to Pro to create unlimited resumes!",
              action: "Upgrade to Pro",
            },
          },
          resumeDownloadsPerMonth: {
            free: {
              title: "Download Limit Reached",
              message:
                "You've used your 1 free download for this month. Upgrade to download unlimited times!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "Download Limit Reached",
              message:
                "You've reached your download limit. Upgrade to Pro for unlimited downloads!",
              action: "Upgrade to Pro",
            },
          },
          aiGenerationsPerMonth: {
            free: {
              title: "AI Feature Limit Reached",
              message:
                "You've used your 1 free AI generation for this month. Upgrade to use AI features unlimited times!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "AI Generation Limit Reached",
              message:
                "You've reached your monthly AI generation limit. Upgrade to Pro for unlimited AI features!",
              action: "Upgrade to Pro",
            },
          },
          atsScansPerMonth: {
            free: {
              title: "ATS Scan Not Available",
              message:
                "ATS scanning is not available on the free plan. Upgrade to unlock ATS analysis!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "ATS Scan Limit Reached",
              message:
                "You've used your ATS scans. Upgrade to Pro for unlimited scans!",
              action: "Upgrade to Pro",
            },
          },
          jobMatchesPerDay: {
            free: {
              title: "Job Matching Not Available",
              message:
                "Job matching is not available on the free plan. Upgrade to unlock this feature!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "Daily Job Match Limit Reached",
              message:
                "You've used your 3 job matches for today. Upgrade to Pro for more matches!",
              action: "Upgrade to Pro",
            },
          },
          coverLettersPerMonth: {
            free: {
              title: "Cover Letters Not Available",
              message:
                "Cover letter generation is not available on the free plan. Upgrade to unlock this feature!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "Cover Letter Limit Reached",
              message:
                "You've used your cover letters. Upgrade to Pro for unlimited cover letters!",
              action: "Upgrade to Pro",
            },
          },
          aiResumeExtractionsPerDay: {
            free: {
              title: "Daily AI Extraction Limit Reached",
              message:
                "You've used your 1 free AI resume extraction for today. Upgrade to extract more resumes!",
              action: "Upgrade Now",
            },
            "one-time": {
              title: "Daily AI Extraction Limit Reached",
              message:
                "You've used your 10 AI resume extractions for today. Try again tomorrow or upgrade to Pro!",
              action: "Upgrade to Pro",
            },
            pro: {
              title: "Daily AI Extraction Limit Reached",
              message:
                "You've used your 10 AI resume extractions for today. This limit resets at midnight!",
              action: "Try Tomorrow",
            },
            premium: {
              title: "Daily AI Extraction Limit Reached",
              message:
                "You've used your 10 AI resume extractions for today. This limit resets at midnight!",
              action: "Try Tomorrow",
            },
            lifetime: {
              title: "Daily AI Extraction Limit Reached",
              message:
                "You've used your 10 AI resume extractions for today. This limit resets at midnight!",
              action: "Try Tomorrow",
            },
          },
        };

        const defaultMessage = {
          title: "Limit Reached",
          message: `You have reached your ${limitType} limit (${limit}). Upgrade for more access!`,
          action: "Upgrade Now",
        };

        const customMessage =
          limitMessages[limitType]?.[tier] || defaultMessage;

        return res.status(403).json({
          success: false,
          error: customMessage.title,
          message: customMessage.message,
          action: customMessage.action,
          limit,
          current: tier,
          upgradeRequired: true,
          upgradeUrl: "/pricing",
        });
      }

      console.log(`✅ Usage limit check passed for ${limitType}`);
      next();
    } catch (error) {
      console.error(
        `❌ Usage limit check error (${limitType}):`,
        error.message
      );
      res.status(500).json({
        error: "Usage check failed",
        message: "Failed to check usage limit. Please try again.",
      });
    }
  };
}

/**
 * Require premium tier (pro, premium, or lifetime)
 */
export async function requirePremium(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({message: "User not authenticated"});
    }

    if (!user.isPremiumUser()) {
      return res.status(403).json({
        message: "This feature requires a premium subscription",
        tier: user.subscription?.tier || "free",
        upgradeRequired: true,
        upgradeUrl: "/pricing",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Premium check error:", error.message);
    res.status(500).json({message: "Failed to check premium status"});
  }
}

/**
 * Require specific subscription tier
 * @param {Array<string>} allowedTiers - Array of allowed tiers
 */
export function requireTier(allowedTiers) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      const userTier = user.subscription?.tier || "free";

      if (!allowedTiers.includes(userTier)) {
        return res.status(403).json({
          message: `This feature requires one of the following tiers: ${allowedTiers.join(
            ", "
          )}`,
          currentTier: userTier,
          requiredTiers: allowedTiers,
          upgradeRequired: true,
          upgradeUrl: "/pricing",
        });
      }

      next();
    } catch (error) {
      console.error("❌ Tier check error:", error.message);
      res.status(500).json({message: "Failed to check subscription tier"});
    }
  };
}

/**
 * Check if user can access a specific feature
 * @param {string} feature - Feature to check access for
 */
export function requireFeature(feature) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      if (!user.canAccessFeature(feature)) {
        return res.status(403).json({
          message: `This feature is not available in your current plan`,
          feature,
          tier: user.subscription?.tier || "free",
          upgradeRequired: true,
          upgradeUrl: "/pricing",
        });
      }

      next();
    } catch (error) {
      console.error(`❌ Feature check error (${feature}):`, error.message);
      res.status(500).json({message: "Failed to check feature access"});
    }
  };
}

/**
 * Track usage after successful operation
 * @param {string} usageType - Type of usage to track (resume, atsScan, jobMatch, coverLetter)
 */
export function trackUsage(usageType) {
  return async (req, res, next) => {
    // Store original res.json to intercept it
    const originalJson = res.json;

    res.json = async function (data) {
      try {
        // Only track if response was successful (status 2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const user = req.user;

          if (user) {
            await user.incrementUsage(usageType);
            console.log(`✅ Tracked ${usageType} usage for user ${user._id}`);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to track ${usageType} usage:`, error.message);
        // Don't fail the request if tracking fails
      }

      // Call original res.json
      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Rate limiting based on tier
 * Free: 10 requests/hour
 * One-time: 20 requests/hour (during 21-day access)
 * Pro: 100 requests/hour
 * Premium: 500 requests/hour
 * Student: 100 requests/hour
 * Lifetime: 500 requests/hour
 */
const rateLimitStore = new Map(); // Simple in-memory store (use Redis in production)

export function tierBasedRateLimit(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({message: "User not authenticated"});
    }

    const tier = user.subscription?.tier || "free";
    const userId = user._id.toString();

    // Define rate limits per tier (requests per hour)
    const limits = {
      free: 10,
      "one-time": 20,
      pro: 100,
      premium: 500,
      student: 100,
      lifetime: 500,
    };

    const limit = limits[tier] || limits.free;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour

    // Get or create user's rate limit data
    if (!rateLimitStore.has(userId)) {
      rateLimitStore.set(userId, {
        count: 0,
        resetTime: now + windowMs,
      });
    }

    const userLimit = rateLimitStore.get(userId);

    // Reset if window expired
    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + windowMs;
    }

    // Check if limit exceeded
    if (userLimit.count >= limit) {
      const resetIn = Math.ceil((userLimit.resetTime - now) / 1000 / 60); // minutes
      return res.status(429).json({
        message: "Rate limit exceeded",
        limit,
        resetIn: `${resetIn} minutes`,
        tier,
        upgradeUrl: "/pricing",
      });
    }

    // Increment count
    userLimit.count++;
    rateLimitStore.set(userId, userLimit);

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": limit,
      "X-RateLimit-Remaining": limit - userLimit.count,
      "X-RateLimit-Reset": new Date(userLimit.resetTime).toISOString(),
    });

    next();
  } catch (error) {
    console.error("❌ Rate limit error:", error.message);
    // Don't block request on rate limit error
    next();
  }
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [userId, data] of rateLimitStore.entries()) {
    if (now > data.resetTime + 60 * 60 * 1000) {
      // 1 hour after reset
      rateLimitStore.delete(userId);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);

/**
 * Get user's current usage statistics
 */
export async function getUserUsageStats(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({message: "User not authenticated"});
    }

    const stats = {
      tier: user.subscription?.tier || "free",
      status: user.subscription?.status || "active",
      usage: {
        resumes: {
          used: user.usage?.resumesThisMonth || 0,
          limit: user.getUsageLimit("resumes"),
          unlimited: user.getUsageLimit("resumes") === Infinity,
        },
        atsScans: {
          used: user.usage?.atsScansThisMonth || 0,
          limit: user.getUsageLimit("atsScans"),
          unlimited: user.getUsageLimit("atsScans") === Infinity,
        },
        jobMatches: {
          used: user.usage?.jobMatchesToday || 0,
          limit: user.getUsageLimit("jobMatches"),
          unlimited: user.getUsageLimit("jobMatches") === Infinity,
        },
        coverLetters: {
          used: user.usage?.coverLettersThisMonth || 0,
          limit: user.getUsageLimit("coverLetters"),
          unlimited: user.getUsageLimit("coverLetters") === Infinity,
        },
      },
      subscription: {
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate,
        autoRenew: user.subscription?.autoRenew || false,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("❌ Get usage stats error:", error.message);
    res.status(500).json({message: "Failed to get usage statistics"});
  }
}

export default {
  checkSubscription,
  checkUsageLimit,
  requirePremium,
  requireTier,
  requireFeature,
  trackUsage,
  tierBasedRateLimit,
  getUserUsageStats,
};
