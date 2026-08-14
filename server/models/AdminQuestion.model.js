import mongoose from "mongoose";

const adminQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["hr", "behavioral", "project", "application", "job-specific", "technical", "custom"],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: {
      type: [String],
      default: [],
    },
    hint: {
      type: String,
      default: "",
      trim: true,
    },
    recommendedLength: {
      type: String,
      enum: ["short", "standard", "detailed"],
      default: "standard",
    },
    recommendedTone: {
      type: String,
      enum: ["conversational", "professional", "concise"],
      default: "conversational",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category and active queries
adminQuestionSchema.index({ category: 1, isActive: 1, order: 1 });

const AdminQuestion = mongoose.model("AdminQuestion", adminQuestionSchema);

export default AdminQuestion;
