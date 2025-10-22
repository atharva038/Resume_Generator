import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["professional", "creative", "modern", "minimal", "executive"],
      default: "professional",
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // URL to thumbnail image
    },
    componentPath: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
      default: 0,
      min: 0,
      max: 5,
    },
    tags: [
      {
        type: String,
      },
    ],
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
templateSchema.index({name: 1, isActive: 1});
templateSchema.index({category: 1, isActive: 1});

const Template = mongoose.model("Template", templateSchema);

export default Template;
