import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feature: {
      type: String,
      enum: [
        "ats_analysis",
        "resume_enhancement",
        "github_import",
        "ai_suggestions",
        "ml_job_matching",
        "ml_skill_gap_analysis",
      ],
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number, // in milliseconds
    },
    status: {
      type: String,
      enum: ["success", "error", "timeout"],
      default: "success",
    },
    errorMessage: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
aiUsageSchema.index({userId: 1, createdAt: -1});
aiUsageSchema.index({feature: 1, createdAt: -1});

const AIUsage = mongoose.model("AIUsage", aiUsageSchema);

export default AIUsage;
