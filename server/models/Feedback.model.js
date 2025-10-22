import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["improvement", "feedback", "bug"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed", "duplicate"],
      default: "open",
    },
    category: {
      type: String,
      enum: [
        "ui-ux",
        "performance",
        "feature-request",
        "ai-enhancement",
        "template",
        "authentication",
        "other",
      ],
      default: "other",
    },
    browserInfo: {
      type: String,
      trim: true,
    },
    deviceInfo: {
      type: String,
      trim: true,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    screenshot: {
      type: String, // URL to uploaded screenshot
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    adminResponse: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
feedbackSchema.index({userId: 1, createdAt: -1});
feedbackSchema.index({type: 1, status: 1});
feedbackSchema.index({priority: 1, status: 1});
feedbackSchema.index({createdAt: -1});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
