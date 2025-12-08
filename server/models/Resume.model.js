import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeTitle: {
      type: String,
      default: "Untitled Resume",
    },
    description: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      phone: String,
      email: String,
      linkedin: String,
      github: String,
      portfolio: String,
      location: String,
    },
    summary: {
      type: String,
      default: "",
    },
    skills: [
      {
        category: String,
        items: [String],
      },
    ],
    experience: [
      {
        company: String,
        title: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        bullets: [String],
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
        bullets: [String],
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String,
        bullets: [String],
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        credentialId: String,
        link: String,
      },
    ],
    achievements: {
      type: [String],
      default: [],
    },
    customSections: [
      {
        id: String,
        title: String,
        items: [String],
      },
    ],
    rawText: {
      type: String,
      default: "",
    },
    templateId: {
      type: String,
      default: "classic",
    },
    colorTheme: {
      type: String,
      default: null, // Will use template's default if not specified
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
