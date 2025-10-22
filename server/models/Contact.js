import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
    minlength: [5, "Subject must be at least 5 characters"],
    maxlength: [200, "Subject cannot exceed 200 characters"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters"],
    maxlength: [2000, "Message cannot exceed 2000 characters"],
  },
  status: {
    type: String,
    enum: ["new", "read", "replied", "archived"],
    default: "new",
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "general",
      "support",
      "feedback",
      "business",
      "bug-report",
      "feature-request",
    ],
    default: "general",
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  repliedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
});

// Index for faster queries
contactSchema.index({status: 1, createdAt: -1});
contactSchema.index({email: 1});

// Virtual for formatted date
contactSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

export default mongoose.model("Contact", contactSchema);
