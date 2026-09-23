import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    timezone: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    roleId: {
      type: String,
      trim: true,
      default: "general",
    },
    roleTitle: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
      maxlength: 200,
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: "Early-Stage Hustler",
    },
    availability: {
      type: String,
      trim: true,
      default: "Part-Time (10-20 hrs/week)",
    },
    startDate: {
      type: String,
      trim: true,
      default: "Immediate",
    },
    workingStyle: {
      type: String,
      trim: true,
      default: "Async-First & Flexible",
    },
    // Proof of work & social footprints
    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    otherUrl: {
      type: String,
      trim: true,
      default: "",
    },
    bestProjectUrl: {
      type: String,
      trim: true,
      default: "",
    },
    bestProjectDesc: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    // Deep founding questions
    whyJoin: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    scrappyStory: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    first30DaysPlan: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    marketInsight: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    // Resume & attachments
    resumeName: {
      type: String,
      trim: true,
      default: "",
    },
    resumeSize: {
      type: Number,
      default: 0,
    },
    resumeData: {
      type: String, // base64 or file URL
      default: "",
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    // Admin management fields
    status: {
      type: String,
      enum: ["pending", "reviewed", "interviewing", "shortlisted", "rejected", "archived"],
      default: "pending",
      index: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    founderNotes: [
      {
        text: { type: String, required: true },
        author: { type: String, default: "Founder" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    source: {
      type: String,
      default: "careers_page",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast administrative search & filtering
careerApplicationSchema.index({ createdAt: -1 });
careerApplicationSchema.index({ email: 1 });
careerApplicationSchema.index({ roleId: 1 });
careerApplicationSchema.index({ department: 1 });
careerApplicationSchema.index({
  name: "text",
  email: "text",
  roleTitle: "text",
  whyJoin: "text",
  scrappyStory: "text",
});

const CareerApplication = mongoose.model("CareerApplication", careerApplicationSchema);

export default CareerApplication;
