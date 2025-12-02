import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "resume_created",
        "resume_parsed",
        "resume_enhanced",
        "ats_scan",
        "job_match",
        "cover_letter",
        "summary_generated",
        "skills_categorized",
        "portfolio_export",
        "interview_qa",
        "content_enhanced",
      ],
      required: true,
      index: true,
    },
    aiModel: {
      type: String,
      enum: ["gemini", "gpt4o", "hybrid"],
      required: true,
    },
    // Token usage
    tokensUsed: {
      input: {
        type: Number,
        default: 0,
      },
      output: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    // Cost calculation
    cost: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR",
      },
    },
    // Request details
    requestId: {
      type: String,
    },
    responseTime: {
      type: Number, // in milliseconds
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
    // Metadata
    metadata: {
      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },
      sectionType: String,
      jobDescription: String,
      feature: String,
      userTier: String,
      ipAddress: String,
      userAgent: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // Using custom timestamp field
  }
);

// Compound indexes for performance
usageLogSchema.index({userId: 1, timestamp: -1});
usageLogSchema.index({userId: 1, action: 1, timestamp: -1});
usageLogSchema.index({aiModel: 1, timestamp: -1});
usageLogSchema.index({timestamp: -1});

// TTL index - auto-delete logs older than 90 days
usageLogSchema.index({timestamp: 1}, {expireAfterSeconds: 7776000}); // 90 days

// Static methods for analytics
usageLogSchema.statics.getUserUsageSummary = async function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          action: "$action",
          aiModel: "$aiModel",
        },
        count: {$sum: 1},
        totalTokens: {$sum: "$tokensUsed.total"},
        totalCost: {$sum: "$cost.amount"},
        avgResponseTime: {$avg: "$responseTime"},
      },
    },
    {
      $sort: {count: -1},
    },
  ]);
};

usageLogSchema.statics.getSystemUsageSummary = async function (
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          date: {$dateToString: {format: "%Y-%m-%d", date: "$timestamp"}},
          aiModel: "$aiModel",
        },
        requestCount: {$sum: 1},
        totalTokens: {$sum: "$tokensUsed.total"},
        totalCost: {$sum: "$cost.amount"},
        successRate: {
          $avg: {$cond: ["$success", 1, 0]},
        },
      },
    },
    {
      $sort: {"_id.date": -1},
    },
  ]);
};

usageLogSchema.statics.getCostByTier = async function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          tier: "$metadata.userTier",
          aiModel: "$aiModel",
        },
        totalCost: {$sum: "$cost.amount"},
        totalTokens: {$sum: "$tokensUsed.total"},
        requestCount: {$sum: 1},
        avgCostPerRequest: {$avg: "$cost.amount"},
      },
    },
    {
      $sort: {totalCost: -1},
    },
  ]);
};

usageLogSchema.statics.getTopUsers = async function (
  startDate,
  endDate,
  limit = 10
) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalRequests: {$sum: 1},
        totalTokens: {$sum: "$tokensUsed.total"},
        totalCost: {$sum: "$cost.amount"},
      },
    },
    {
      $sort: {totalCost: -1},
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        userId: "$_id",
        userName: "$user.name",
        userEmail: "$user.email",
        userTier: "$user.subscription.tier",
        totalRequests: 1,
        totalTokens: 1,
        totalCost: 1,
      },
    },
  ]);
};

usageLogSchema.statics.getDailyCosts = async function (days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        timestamp: {$gte: startDate},
      },
    },
    {
      $group: {
        _id: {
          date: {$dateToString: {format: "%Y-%m-%d", date: "$timestamp"}},
        },
        totalCost: {$sum: "$cost.amount"},
        requestCount: {$sum: 1},
        geminiCost: {
          $sum: {
            $cond: [{$eq: ["$aiModel", "gemini"]}, "$cost.amount", 0],
          },
        },
        gpt4oCost: {
          $sum: {
            $cond: [{$eq: ["$aiModel", "gpt4o"]}, "$cost.amount", 0],
          },
        },
      },
    },
    {
      $sort: {"_id.date": 1},
    },
  ]);
};

// Helper method to log usage
usageLogSchema.statics.logUsage = async function (data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error("Error logging usage:", error);
    // Don't throw - logging shouldn't break the app
    return null;
  }
};

const UsageLog = mongoose.model("UsageLog", usageLogSchema);

export default UsageLog;
