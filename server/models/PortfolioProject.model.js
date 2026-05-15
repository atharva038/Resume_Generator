import mongoose from "mongoose";

const portfolioProjectImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      default: "",
    },
    alt: {
      type: String,
      trim: true,
      default: "",
    },
    isCover: {
      type: Boolean,
      default: false,
    },
  },
  {_id: false}
);

const portfolioProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    resumeProjectId: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    longDescription: {
      type: String,
      trim: true,
      default: "",
    },
    problem: {
      type: String,
      trim: true,
      default: "",
    },
    solution: {
      type: String,
      trim: true,
      default: "",
    },
    impact: {
      type: String,
      trim: true,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    links: {
      live: {
        type: String,
        trim: true,
        default: "",
      },
      github: {
        type: String,
        trim: true,
        default: "",
      },
      caseStudy: {
        type: String,
        trim: true,
        default: "",
      },
      video: {
        type: String,
        trim: true,
        default: "",
      },
    },
    images: {
      type: [portfolioProjectImageSchema],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    visible: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

portfolioProjectSchema.index({portfolioId: 1, order: 1});
portfolioProjectSchema.index({portfolioId: 1, visible: 1, featured: -1});

const PortfolioProject = mongoose.model(
  "PortfolioProject",
  portfolioProjectSchema
);

export default PortfolioProject;
