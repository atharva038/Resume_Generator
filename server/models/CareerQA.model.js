import mongoose from "mongoose";

const careerQASchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["hr", "behavioral", "project", "application", "job-specific", "custom"],
      required: true,
      index: true,
    },
    aiDraft: {
      type: String,
      default: "",
    },
    savedAnswer: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["unanswered", "drafted", "saved"],
      default: "unanswered",
      index: true,
    },
    answerLength: {
      type: String,
      enum: ["short", "standard", "detailed"],
      default: "standard",
    },
    answerTone: {
      type: String,
      enum: ["conversational", "professional", "concise"],
      default: "conversational",
    },
    relatedProjects: {
      type: [String],
      default: [],
    },
    relatedExperience: {
      type: [String],
      default: [],
    },
    jobContext: {
      jobTitle: { type: String, trim: true, default: "" },
      company: { type: String, trim: true, default: "" },
      jobDescription: { type: String, default: "" },
      matchedSkills: { type: [String], default: [] },
    },
    isStarred: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

careerQASchema.index({ userId: 1, category: 1 });
careerQASchema.index({ userId: 1, status: 1 });
careerQASchema.index({ userId: 1, isStarred: 1 });

const CareerQA = mongoose.model("CareerQA", careerQASchema);

export default CareerQA;
