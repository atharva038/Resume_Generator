import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Professional",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    emoji: {
      type: String,
      default: "📄",
    },
    atsScore: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    tier: {
      type: String,
      enum: ["free", "one-time", "pro"],
      default: "free",
    },
    badge: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String, // URL to thumbnail image or svg preview
      default: "",
    },
    componentPath: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        default: "",
        trim: true,
      },
      metaDescription: {
        type: String,
        default: "",
        trim: true,
      },
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
      targetSearchQueries: [
        {
          type: String,
          trim: true,
        },
      ],
      ogImage: {
        type: String,
        default: "",
      },
      canonicalUrl: {
        type: String,
        default: "",
      },
      faqItems: [
        {
          question: { type: String, trim: true },
          answer: { type: String, trim: true },
        },
      ],
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

// Index for faster queries
templateSchema.index({templateId: 1});
templateSchema.index({name: 1, isActive: 1});
templateSchema.index({category: 1, isActive: 1});
templateSchema.index({tier: 1, isActive: 1});

const Template = mongoose.model("Template", templateSchema);

export default Template;
