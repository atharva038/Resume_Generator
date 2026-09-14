import OpenAI from "openai";
import Settings from "../models/Settings.model.js";
import AIUsage from "../models/AIUsage.model.js";
import UsageLog from "../models/UsageLog.model.js";
import {notifyAIFailure} from "./adminNotification.service.js";

/**
 * OpenAI Credit & Balance Tracking Service
 * Tracks real-time credit consumption, remaining balances, burn rate forecasting,
 * live OpenAI Organization API sync, and API connection/quota health.
 */

// Average baseline operation costs for estimation fallbacks (USD)
const DEFAULT_AVG_COSTS = {
  ats_analysis: 0.0075, // ~3,000 tokens of GPT-4o
  resume_enhancement: 0.0040, // ~1,600 tokens of GPT-4o
  ai_interview: 0.0025, // GPT-4o-mini
  ai_suggestions: 0.0030,
  general_call: 0.0050,
};

/**
 * Fetch live usage costs and completions data directly from OpenAI Organization API
 */
export async function fetchLiveOpenAIOrganizationData(days = 30) {
  const adminKey = process.env.OPENAI_ADMIN_KEY || process.env.OPENAI_API_KEY;
  if (!adminKey) {
    return {
      success: false,
      status: "no_key",
      message: "No OpenAI API or Admin key configured",
    };
  }

  try {
    const startTimeUnix = Math.floor(Date.now() / 1000 - days * 24 * 60 * 60);
    const headers = {
      Authorization: `Bearer ${adminKey}`,
      "Content-Type": "application/json",
    };

    // 1. Fetch live costs
    const costUrl = `https://api.openai.com/v1/organization/costs?start_time=${startTimeUnix}`;
    const costRes = await fetch(costUrl, {headers});

    if (costRes.status === 403) {
      return {
        success: false,
        status: "missing_scope",
        message:
          "OpenAI key lacks 'api.usage.read' scope. Add an Admin Key (sk-admin-...) to enable automatic live sync.",
      };
    }

    if (!costRes.ok) {
      const err = await costRes.json().catch(() => ({}));
      return {
        success: false,
        status: "api_error",
        statusCode: costRes.status,
        message: err.error?.message || `OpenAI Organization API returned HTTP ${costRes.status}`,
      };
    }

    const costData = await costRes.json();
    let totalLiveCostUsd = 0;
    let orgName = "Personal";
    let orgId = "";

    if (costData.data) {
      for (const bucket of costData.data) {
        if (bucket.results) {
          for (const r of bucket.results) {
            totalLiveCostUsd += r.amount?.value || 0;
            if (r.organization_name) orgName = r.organization_name;
            if (r.organization_id) orgId = r.organization_id;
          }
        }
      }
    }

    // 2. Fetch live completions usage (requests & token volume)
    let totalLiveRequests = 0;
    let totalLiveInputTokens = 0;
    let totalLiveOutputTokens = 0;

    try {
      const usageUrl = `https://api.openai.com/v1/organization/usage/completions?start_time=${startTimeUnix}`;
      const usageRes = await fetch(usageUrl, {headers});
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        if (usageData.data) {
          for (const bucket of usageData.data) {
            if (bucket.results) {
              for (const r of bucket.results) {
                totalLiveRequests += r.num_model_requests || 0;
                totalLiveInputTokens += r.input_tokens || 0;
                totalLiveOutputTokens += r.output_tokens || 0;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch completions token details from OpenAI:", e.message);
    }

    return {
      success: true,
      status: "live_synced",
      liveCostUsd: Number(totalLiveCostUsd.toFixed(6)),
      liveRequests: totalLiveRequests,
      liveInputTokens: totalLiveInputTokens,
      liveOutputTokens: totalLiveOutputTokens,
      liveTotalTokens: totalLiveInputTokens + totalLiveOutputTokens,
      orgName,
      orgId,
      periodDays: days,
      syncedAt: new Date(),
      message: "Successfully fetched real-time metrics from OpenAI Organization API",
    };
  } catch (error) {
    return {
      success: false,
      status: "network_error",
      message: error.message,
    };
  }
}

/**
 * Get full OpenAI credit and account balance summary
 */
export async function getOpenAICreditSummary() {
  const settings = await Settings.getSettings();
  const creditConfig = settings.openaiCredits || {
    allocatedBudgetUsd: 10.0,
    alertThresholdUsd: 2.0,
    lastRefillDate: new Date(0),
    totalRefilledHistoricalUsd: 10.0,
    autoAlertEnabled: true,
    notes: "Default budget allocation",
  };

  const exchangeRate = settings.interviewPricing?.usdToInrExchangeRate || 86.5;
  const lastRefillDate = creditConfig.lastRefillDate
    ? new Date(creditConfig.lastRefillDate)
    : new Date(0);

  // 1. Attempt Live OpenAI Organization API sync
  const liveOrgData = await fetchLiveOpenAIOrganizationData(30);

  // 2. Calculate OpenAI usage from local database records
  const periodUsage = await AIUsage.aggregate([
    {
      $match: {
        aiProvider: "openai",
        createdAt: {$gte: lastRefillDate},
      },
    },
    {
      $group: {
        _id: null,
        totalCost: {$sum: "$cost"},
        totalTokens: {$sum: "$tokensUsed"},
        totalCalls: {$sum: 1},
        successCalls: {
          $sum: {$cond: [{$eq: ["$status", "success"]}, 1, 0]},
        },
        errorCalls: {
          $sum: {$cond: [{$ne: ["$status", "success"]}, 1, 0]},
        },
      },
    },
  ]);

  // 3. Feature-specific average cost breakdown
  const featureCosts = await AIUsage.aggregate([
    {
      $match: {
        aiProvider: "openai",
        status: "success",
        cost: {$gt: 0},
      },
    },
    {
      $group: {
        _id: "$feature",
        avgCost: {$avg: "$cost"},
        totalCost: {$sum: "$cost"},
        count: {$sum: 1},
      },
    },
  ]);

  const featureCostMap = {};
  featureCosts.forEach((f) => {
    featureCostMap[f._id] = f.avgCost;
  });

  const localSpentPeriodUsd = periodUsage[0]?.totalCost || 0;
  const localTokensPeriod = periodUsage[0]?.totalTokens || 0;
  const localCallsPeriod = periodUsage[0]?.totalCalls || 0;

  // Use live OpenAI cost if available, otherwise local tracked cost
  const totalSpentPeriodUsd = liveOrgData.success
    ? liveOrgData.liveCostUsd
    : localSpentPeriodUsd;

  const totalTokensPeriod = liveOrgData.success
    ? liveOrgData.liveTotalTokens
    : localTokensPeriod;

  const totalCallsPeriod = liveOrgData.success
    ? liveOrgData.liveRequests
    : localCallsPeriod;

  const envInitialCredits =
    process.env.OPENAI_TOTAL_CREDITS || process.env.OPENAI_INITIAL_CREDITS;
  const allocatedBudgetUsd = envInitialCredits
    ? parseFloat(envInitialCredits)
    : (creditConfig.allocatedBudgetUsd || 10.0);
  const alertThresholdUsd = creditConfig.alertThresholdUsd || 2.0;

  const remainingBalanceUsd = Math.max(0, allocatedBudgetUsd - totalSpentPeriodUsd);
  const remainingBalanceInr = remainingBalanceUsd * exchangeRate;
  const allocatedBudgetInr = allocatedBudgetUsd * exchangeRate;
  const totalSpentPeriodInr = totalSpentPeriodUsd * exchangeRate;

  const percentRemaining =
    allocatedBudgetUsd > 0
      ? Math.min(100, Math.max(0, (remainingBalanceUsd / allocatedBudgetUsd) * 100))
      : 0;

  // Evaluate status
  let status = "healthy";
  if (remainingBalanceUsd <= 0) {
    status = "depleted";
  } else if (remainingBalanceUsd <= alertThresholdUsd) {
    status = "low";
  }

  // Calculate burn rates and estimated remaining actions
  const avgAtsCost = featureCostMap["ats_analysis"] || DEFAULT_AVG_COSTS.ats_analysis;
  const avgEnhanceCost =
    featureCostMap["resume_enhancement"] || DEFAULT_AVG_COSTS.resume_enhancement;
  const avgInterviewCost =
    featureCostMap["ai_interview"] || DEFAULT_AVG_COSTS.ai_interview;
  const avgCallCost =
    totalCallsPeriod > 0
      ? totalSpentPeriodUsd / totalCallsPeriod
      : DEFAULT_AVG_COSTS.general_call;

  const estimatedRemaining = {
    atsScans: Math.max(0, Math.floor(remainingBalanceUsd / avgAtsCost)),
    resumeEnhancements: Math.max(0, Math.floor(remainingBalanceUsd / avgEnhanceCost)),
    interviews: Math.max(0, Math.floor(remainingBalanceUsd / avgInterviewCost)),
    totalCalls: Math.max(0, Math.floor(remainingBalanceUsd / avgCallCost)),
  };

  const hasAdminKey = Boolean(process.env.OPENAI_ADMIN_KEY);

  return {
    status,
    syncMode: liveOrgData.success ? "live_openai_synced" : "local_tracked",
    liveOrgData,
    budget: {
      allocatedUsd: Number(allocatedBudgetUsd.toFixed(4)),
      allocatedInr: Number(allocatedBudgetInr.toFixed(2)),
      remainingUsd: Number(remainingBalanceUsd.toFixed(4)),
      remainingInr: Number(remainingBalanceInr.toFixed(2)),
      spentPeriodUsd: Number(totalSpentPeriodUsd.toFixed(4)),
      spentPeriodInr: Number(totalSpentPeriodInr.toFixed(2)),
      percentRemaining: Number(percentRemaining.toFixed(1)),
      alertThresholdUsd: Number(alertThresholdUsd.toFixed(2)),
      alertThresholdInr: Number((alertThresholdUsd * exchangeRate).toFixed(2)),
      lastRefillDate,
      totalRefilledHistoricalUsd: creditConfig.totalRefilledHistoricalUsd || allocatedBudgetUsd,
      notes: creditConfig.notes || "",
    },
    usageStats: {
      periodTokens: totalTokensPeriod,
      periodCalls: totalCallsPeriod,
      totalSpentUsd: Number(totalSpentPeriodUsd.toFixed(4)),
      totalSpentInr: Number((totalSpentPeriodUsd * exchangeRate).toFixed(2)),
      avgCallCostUsd: Number(avgCallCost.toFixed(5)),
      avgCallCostInr: Number((avgCallCost * exchangeRate).toFixed(3)),
    },
    burnRate: {
      avgAtsCostUsd: Number(avgAtsCost.toFixed(4)),
      avgEnhanceCostUsd: Number(avgEnhanceCost.toFixed(4)),
      avgInterviewCostUsd: Number(avgInterviewCost.toFixed(4)),
    },
    estimatedRemaining,
    exchangeRate,
    isApiKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
    hasAdminKey,
  };
}

/**
 * Set exact available balance (syncs allocated budget so remaining equals exact target)
 * @param {Object} params - { exactBalanceUsd, notes, userId }
 */
export async function setExactOpenAIBalance({
  exactBalanceUsd,
  notes = "",
  userId = null,
}) {
  const numericAmount = Number(exactBalanceUsd);
  if (isNaN(numericAmount) || numericAmount < 0) {
    throw new Error("Exact balance must be a non-negative number in USD");
  }

  const settings = await Settings.getSettings();
  const lastRefillDate = new Date();

  // Get current spent to set allocated = exactBalance + spent
  const liveOrg = await fetchLiveOpenAIOrganizationData(30);
  const spentSoFar = liveOrg.success ? liveOrg.liveCostUsd : 0;
  const newAllocated = numericAmount + spentSoFar;

  settings.openaiCredits = {
    ...settings.openaiCredits,
    allocatedBudgetUsd: newAllocated,
    totalRefilledHistoricalUsd: newAllocated,
    lastRefillDate,
    notes: notes || `Set exact current balance to $${numericAmount.toFixed(2)}`,
  };

  if (userId) {
    settings.lastUpdatedBy = userId;
  }

  await settings.save();
  return await getOpenAICreditSummary();
}

/**
 * Refill or reset allocated OpenAI credits budget
 * @param {Object} params - { amountUsd, isReset, notes, userId }
 */
export async function refillOpenAICredits({
  amountUsd,
  isReset = false,
  notes = "",
  userId = null,
}) {
  const numericAmount = Number(amountUsd);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error("Refill amount must be a positive number in USD");
  }

  const settings = await Settings.getSettings();
  const currentBudget = settings.openaiCredits?.allocatedBudgetUsd || 10.0;
  const currentHistorical =
    settings.openaiCredits?.totalRefilledHistoricalUsd || currentBudget;

  let newAllocatedBudget = numericAmount;
  let newHistorical = currentHistorical;

  if (isReset) {
    newAllocatedBudget = numericAmount;
    newHistorical = numericAmount;
  } else {
    newAllocatedBudget = currentBudget + numericAmount;
    newHistorical = currentHistorical + numericAmount;
  }

  settings.openaiCredits = {
    ...settings.openaiCredits,
    allocatedBudgetUsd: newAllocatedBudget,
    totalRefilledHistoricalUsd: newHistorical,
    lastRefillDate: isReset ? new Date() : settings.openaiCredits?.lastRefillDate || new Date(),
    notes: notes || (isReset ? `Budget reset to $${numericAmount}` : `Added $${numericAmount} budget`),
  };

  if (userId) {
    settings.lastUpdatedBy = userId;
  }

  await settings.save();
  return await getOpenAICreditSummary();
}

/**
 * Update OpenAI credit alert settings & threshold
 * @param {Object} params - { alertThresholdUsd, autoAlertEnabled, notes, userId }
 */
export async function updateCreditSettings({
  alertThresholdUsd,
  autoAlertEnabled,
  notes,
  userId = null,
}) {
  const settings = await Settings.getSettings();

  if (alertThresholdUsd !== undefined) {
    const threshold = Number(alertThresholdUsd);
    if (!isNaN(threshold) && threshold >= 0) {
      settings.openaiCredits.alertThresholdUsd = threshold;
    }
  }

  if (autoAlertEnabled !== undefined) {
    settings.openaiCredits.autoAlertEnabled = Boolean(autoAlertEnabled);
  }

  if (notes !== undefined) {
    settings.openaiCredits.notes = notes;
  }

  if (userId) {
    settings.lastUpdatedBy = userId;
  }

  await settings.save();
  return await getOpenAICreditSummary();
}

/**
 * Test live OpenAI API connection, authorization and check for quota health
 */
export async function testOpenAIQuotaHealth() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      healthy: false,
      status: "missing_key",
      message: "OPENAI_API_KEY is not configured in server environment variables.",
    };
  }

  const startTime = Date.now();
  try {
    const openai = new OpenAI({apiKey});
    const response = await openai.models.list();
    const responseTime = Date.now() - startTime;

    const availableModels = response.data?.map((m) => m.id) || [];
    const hasGpt4o = availableModels.includes("gpt-4o");

    const liveCostCheck = await fetchLiveOpenAIOrganizationData(30);

    return {
      healthy: true,
      status: "active",
      responseTimeMs: responseTime,
      modelAvailable: hasGpt4o ? "gpt-4o" : availableModels[0] || "unknown",
      message: "OpenAI API connection is healthy and authorized.",
      liveCostCheck,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const isQuotaError =
      error.status === 429 ||
      error.code === "insufficient_quota" ||
      error.message?.toLowerCase().includes("quota") ||
      error.message?.toLowerCase().includes("billing");

    if (isQuotaError) {
      notifyAIFailure({
        feature: "openai_credit_check",
        aiProvider: "openai",
        aiModel: "gpt-4o",
        error: "OpenAI Quota Exceeded (429: insufficient_quota). Please top up OpenAI billing credits.",
      });
    }

    return {
      healthy: false,
      status: isQuotaError ? "quota_exceeded" : "error",
      statusCode: error.status || 500,
      responseTimeMs: responseTime,
      message: error.message || "Failed to connect to OpenAI API",
      isQuotaError,
    };
  }
}
