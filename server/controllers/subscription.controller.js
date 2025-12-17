import * as paymentService from "../services/payment.service.js";
import Subscription from "../models/Subscription.model.js";
import UsageLog from "../models/UsageLog.model.js";
import User from "../models/User.model.js";

/**
 * Subscription Controller
 * Handles subscription-related operations
 */

/**
 * Get pricing information
 */
export async function getPricing(req, res) {
  try {
    res.json({
      success: true,
      pricing: paymentService.PRICING,
    });
  } catch (error) {
    console.error("❌ Get pricing error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get pricing information",
    });
  }
}

/**
 * Create payment order
 */
export async function createPaymentOrder(req, res) {
  try {
    const {tier, plan} = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!tier || !plan) {
      return res.status(400).json({
        success: false,
        message: "Tier and plan are required",
      });
    }

    // Create order
    const order = await paymentService.createOrder(tier, plan, userId);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Create payment order error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
}

/**
 * Verify payment and create subscription
 */
export async function verifyPayment(req, res) {
  try {
    const {orderId, paymentId, signature, tier, plan, amount} = req.body;
    const userId = req.user._id;

    console.log("💳 Payment verification request:", {
      orderId,
      paymentId,
      signature: signature ? "Present" : "Missing",
      tier,
      plan,
      amount,
      userId,
    });

    // Validate inputs
    if (!orderId || !paymentId || !tier || !plan || !amount) {
      console.error("❌ Missing required fields:", {
        orderId: !!orderId,
        paymentId: !!paymentId,
        signature: !!signature,
        tier: !!tier,
        plan: !!plan,
        amount: !!amount,
      });
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // For UPI and some payment methods, signature might not be provided
    // In such cases, we verify the payment using Razorpay API instead
    let isValid = false;

    if (signature && signature !== "UPI_PAYMENT") {
      // Verify signature (for card payments, net banking, etc.)
      console.log("🔐 Verifying payment signature...");
      isValid = paymentService.verifyPaymentSignature(
        orderId,
        paymentId,
        signature
      );
    } else {
      // For UPI payments, verify via Razorpay API
      console.log("💳 Verifying UPI payment via Razorpay API...");
      isValid = await paymentService.verifyPaymentViaAPI(
        paymentId,
        orderId,
        amount
      );
    }

    if (!isValid) {
      console.error("❌ Payment verification failed");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature or payment verification failed",
      });
    }

    console.log("✅ Payment verified successfully");

    // Create subscription
    const subscription = await paymentService.createSubscription(
      userId,
      tier,
      plan,
      paymentId,
      orderId,
      amount
    );

    console.log("✅ Subscription created successfully:", {
      tier: subscription.tier,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    });

    // Fetch updated user with subscription
    const updatedUser = await User.findById(userId);

    console.log("✅ Updated user subscription:", updatedUser.subscription);

    res.json({
      success: true,
      message: "Payment verified and subscription activated",
      subscription: {
        tier: subscription.tier,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const userId = req.user._id;

    console.log("📊 Getting subscription status for user:", userId);

    // Get active subscription from database (not cached req.user)
    const subscription = await Subscription.getActiveSubscription(userId);

    // Also get fresh user data from database
    const user = await User.findById(userId);

    console.log("📊 Active subscription from DB:", subscription);
    console.log("📊 User subscription from DB:", user?.subscription);

    // If there's an active subscription, use its data
    // Otherwise, fall back to user.subscription or free tier
    const subscriptionData = subscription || user?.subscription;

    res.json({
      success: true,
      subscription: {
        tier: subscriptionData?.tier || "free",
        plan: subscriptionData?.plan || "lifetime",
        status: subscriptionData?.status || "active",
        startDate: subscriptionData?.startDate,
        endDate: subscriptionData?.endDate,
        daysRemaining: subscription ? subscription.daysRemaining() : null,
        autoRenew: subscriptionData?.autoRenew || false,
        features:
          paymentService.PRICING[subscriptionData?.tier || "free"]?.features ||
          [],
      },
    });
  } catch (error) {
    console.error("❌ Get subscription status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get subscription status",
    });
  }
}

/**
 * Get subscription history
 */
export async function getSubscriptionHistory(req, res) {
  try {
    const userId = req.user._id;

    console.log("📊 Fetching subscription history for user:", userId);

    const history = await Subscription.getUserSubscriptionHistory(userId);

    console.log("📊 Subscription history query result:", {
      userId,
      count: history?.length || 0,
      hasData: history && history.length > 0,
    });

    if (history && history.length > 0) {
      console.log("📊 Sample subscription:", {
        tier: history[0].tier,
        plan: history[0].plan,
        amount: history[0].amount,
        receiptId: history[0].receiptId,
        createdAt: history[0].createdAt,
        status: history[0].status,
      });
    }

    res.json({
      success: true,
      history: history || [],
      count: history?.length || 0,
    });
  } catch (error) {
    console.error("❌ Get subscription history error:", error.message);
    console.error("❌ Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to get subscription history",
      error: error.message,
    });
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(req, res) {
  try {
    const userId = req.user._id;
    const {reason} = req.body;

    const subscription = await paymentService.cancelSubscription(
      userId,
      reason
    );

    res.json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error("❌ Cancel subscription error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel subscription",
    });
  }
}

/**
 * Renew subscription
 */
export async function renewSubscription(req, res) {
  try {
    const {paymentId, orderId} = req.body;
    const userId = req.user._id;

    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Order ID are required",
      });
    }

    const subscription = await paymentService.renewSubscription(
      userId,
      paymentId,
      orderId
    );

    res.json({
      success: true,
      message: "Subscription renewed successfully",
      subscription: {
        tier: subscription.tier,
        plan: subscription.plan,
        status: subscription.status,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error("❌ Renew subscription error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to renew subscription",
    });
  }
}

/**
 * Get usage statistics
 */
export async function getUsageStats(req, res) {
  try {
    const userId = req.user._id;
    const user = req.user;

    // Get basic usage stats
    const basicStats = {
      tier: user.subscription?.tier || "free",
      usage: {
        resumes: {
          used: user.usage?.resumesThisMonth || 0,
          total: user.usage?.resumesCreated || 0,
          limit: user.getUsageLimit("resumesPerMonth"),
        },
        aiGenerations: {
          used: user.usage?.aiGenerationsThisMonth || 0,
          total: user.usage?.aiGenerationsUsed || 0,
          limit: user.getUsageLimit("aiGenerationsPerMonth"),
        },
        atsScans: {
          used: user.usage?.atsScansThisMonth || 0,
          total: user.usage?.atsScans || 0,
          limit: user.getUsageLimit("atsScansPerMonth"),
        },
        jobMatches: {
          used: user.usage?.jobMatchesToday || 0,
          total: user.usage?.jobMatches || 0,
          limit: user.getUsageLimit("jobMatchesPerDay"),
        },
        coverLetters: {
          used: user.usage?.coverLettersThisMonth || 0,
          total: user.usage?.coverLetters || 0,
          limit: user.getUsageLimit("coverLettersPerMonth"),
        },
      },
    };

    // Get detailed usage logs for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const detailedUsage = await UsageLog.getUserUsageSummary(userId, {
      startDate: thirtyDaysAgo,
      endDate: new Date(),
    });

    res.json({
      success: true,
      stats: basicStats,
      detailed: detailedUsage,
    });
  } catch (error) {
    console.error("❌ Get usage stats error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get usage statistics",
    });
  }
}

/**
 * Get advanced analytics (Pro users only)
 * Provides comprehensive statistics and insights
 */
export async function getAdvancedAnalytics(req, res) {
  try {
    const userId = req.user._id;
    const user = req.user;
    const tier = user.subscription?.tier || "free";

    // Check if user has access to advanced analytics
    if (!["pro", "premium", "lifetime"].includes(tier)) {
      return res.status(403).json({
        success: false,
        error: "Advanced Analytics - Pro Feature",
        message: "Upgrade to Pro to access advanced analytics and insights!",
        upgradeRequired: true,
        upgradeUrl: "/pricing",
      });
    }

    // Import AIUsage and Resume models
    const AIUsage = (await import("../models/AIUsage.model.js")).default;
    const Resume = (await import("../models/Resume.model.js")).default;

    // Date ranges
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Overall usage summary
    const overallUsage = {
      resumesCreated: user.usage?.resumesCreated || 0,
      atsScans: user.usage?.atsScans || 0,
      jobMatches: user.usage?.jobMatches || 0,
      coverLetters: user.usage?.coverLetters || 0,
      aiRequestsTotal: user.usage?.tokensUsed || 0,
    };

    // 2. AI Usage Analytics
    const aiUsage = await AIUsage.aggregate([
      {$match: {userId: userId}},
      {
        $group: {
          _id: "$aiProvider",
          count: {$sum: 1},
          totalCost: {$sum: "$cost"},
          totalTokens: {$sum: "$tokens"},
        },
      },
    ]);

    const aiUsageLast7Days = await AIUsage.countDocuments({
      userId,
      createdAt: {$gte: last7Days},
    });

    const aiUsageLast30Days = await AIUsage.countDocuments({
      userId,
      createdAt: {$gte: last30Days},
    });

    const aiAnalytics = {
      byProvider: aiUsage.map((item) => ({
        provider: item._id || "unknown",
        requests: item.count,
        cost: item.totalCost,
        tokens: item.totalTokens,
      })),
      last7Days: aiUsageLast7Days,
      last30Days: aiUsageLast30Days,
      totalCost: aiUsage.reduce((sum, item) => sum + (item.totalCost || 0), 0),
    };

    // 3. Resume Analytics
    const resumes = await Resume.find({userId}).sort({updatedAt: -1});
    const resumeAnalytics = {
      total: resumes.length,
      last7Days: resumes.filter((r) => r.createdAt >= last7Days).length,
      last30Days: resumes.filter((r) => r.createdAt >= last30Days).length,
      byTemplate: resumes.reduce((acc, resume) => {
        const template = resume.template || "classic";
        acc[template] = (acc[template] || 0) + 1;
        return acc;
      }, {}),
      mostRecentlyUpdated: resumes.slice(0, 5).map((r) => ({
        id: r._id,
        title: r.resumeTitle || r.name || "Untitled",
        template: r.template,
        updatedAt: r.updatedAt,
      })),
    };

    // 4. Activity Timeline (last 30 days)
    const activityTimeline = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const aiRequests = await AIUsage.countDocuments({
        userId,
        createdAt: {$gte: startOfDay, $lte: endOfDay},
      });

      const resumesCreated = await Resume.countDocuments({
        userId,
        createdAt: {$gte: startOfDay, $lte: endOfDay},
      });

      activityTimeline.push({
        date: startOfDay.toISOString().split("T")[0],
        aiRequests,
        resumesCreated,
      });
    }

    // 5. Subscription Info
    const subscriptionInfo = {
      tier,
      plan: user.subscription?.plan || "lifetime",
      status: user.subscription?.status || "active",
      startDate: user.subscription?.startDate,
      endDate: user.subscription?.endDate,
      daysRemaining: user.subscription?.endDate
        ? Math.ceil(
            (new Date(user.subscription.endDate) - now) / (1000 * 60 * 60 * 24)
          )
        : null,
    };

    // 6. Current Month Usage
    const currentMonthUsage = {
      resumes: {
        used: user.usage?.resumesThisMonth || 0,
        limit: user.getUsageLimit("resumesPerMonth"),
      },
      atsScans: {
        used: user.usage?.atsScansThisMonth || 0,
        limit: user.getUsageLimit("atsScansPerMonth"),
      },
      coverLetters: {
        used: user.usage?.coverLettersThisMonth || 0,
        limit: user.getUsageLimit("coverLettersPerMonth"),
      },
      jobMatches: {
        used: user.usage?.jobMatchesToday || 0,
        limit: user.getUsageLimit("jobMatchesPerDay"),
      },
    };

    // 7. Cost Savings (vs Pay-as-you-go)
    const costSavings = {
      estimatedPayAsYouGo:
        overallUsage.resumesCreated * 10 +
        overallUsage.atsScans * 5 +
        overallUsage.coverLetters * 8,
      actualPaid: tier === "pro" ? 199 : tier === "one-time" ? 49 : 0,
      saved: 0,
    };
    costSavings.saved =
      costSavings.estimatedPayAsYouGo - costSavings.actualPaid;

    res.json({
      success: true,
      analytics: {
        overallUsage,
        aiAnalytics,
        resumeAnalytics,
        activityTimeline,
        subscriptionInfo,
        currentMonthUsage,
        costSavings,
        generatedAt: now,
      },
    });
  } catch (error) {
    console.error("❌ Get advanced analytics error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get advanced analytics",
    });
  }
}

/**
 * Handle Razorpay webhooks
 */
export async function handleWebhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const event = req.body;

    await paymentService.handleWebhook(event, signature);

    res.json({success: true});
  } catch (error) {
    console.error("❌ Webhook handling error:", error.message);
    res.status(400).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
}

/**
 * Compare plans (for upgrade/downgrade decisions)
 */
export async function comparePlans(req, res) {
  try {
    const {fromTier, toTier} = req.query;

    if (!fromTier || !toTier) {
      return res.status(400).json({
        success: false,
        message: "fromTier and toTier are required",
      });
    }

    const fromPlan = paymentService.PRICING[fromTier];
    const toPlan = paymentService.PRICING[toTier];

    if (!fromPlan || !toPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid tier specified",
      });
    }

    res.json({
      success: true,
      comparison: {
        from: {
          tier: fromTier,
          features: fromPlan.features,
        },
        to: {
          tier: toTier,
          features: toPlan.features,
        },
        isUpgrade:
          ["pro", "premium", "lifetime"].includes(toTier) &&
          !["pro", "premium", "lifetime"].includes(fromTier),
      },
    });
  } catch (error) {
    console.error("❌ Compare plans error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to compare plans",
    });
  }
}

/**
 * Get AI service configuration for user
 * Returns tier-based AI model assignment (no user preferences)
 */
export async function getAIConfig(req, res) {
  try {
    const user = req.user;
    const tier = user.subscription?.tier || "free";

    // Tier-to-AI mapping
    const TIER_AI_MAPPING = {
      free: "gemini",
      pro: "hybrid",
      premium: "gpt4o",
      "one-time": "gpt4o",
      lifetime: "gpt4o",
    };

    const config = {
      tier,
      aiModel: TIER_AI_MAPPING[tier],
      isHybrid: TIER_AI_MAPPING[tier] === "hybrid",
      description: {
        gemini: "Gemini Flash - Fast and efficient",
        gpt4o: "GPT-4o - Premium quality",
        hybrid: "Hybrid - 70% Gemini + 30% GPT-4o",
      }[TIER_AI_MAPPING[tier]],
    };

    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("❌ Get AI config error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get AI configuration",
    });
  }
}

/**
 * Update AI model preference (DEPRECATED - kept for API compatibility)
 * AI model is now determined solely by subscription tier
 * This endpoint returns the tier-based model without changing anything
 */
export async function updateAIPreference(req, res) {
  try {
    const user = req.user;
    const tier = user.subscription?.tier || "free";

    // Tier-to-AI mapping
    const TIER_AI_MAPPING = {
      free: "gemini",
      pro: "hybrid",
      premium: "gpt4o",
      "one-time": "gpt4o",
      lifetime: "gpt4o",
    };

    const aiModel = TIER_AI_MAPPING[tier];

    res.json({
      success: true,
      message:
        "AI model is automatically assigned based on your subscription tier",
      aiModel,
      tier,
      note: "User preferences are no longer used. AI selection is tier-based.",
    });
  } catch (error) {
    console.error("❌ Update AI preference error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get AI configuration",
    });
  }
}

export default {
  getPricing,
  createPaymentOrder,
  verifyPayment,
  getSubscriptionStatus,
  getSubscriptionHistory,
  cancelSubscription,
  renewSubscription,
  getUsageStats,
  getAdvancedAnalytics,
  handleWebhook,
  comparePlans,
  getAIConfig,
  updateAIPreference,
};
