import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "user",
        "ai",
        "payment",
        "quota",
        "system",
        "contact",
        "feedback",
        "security",
      ],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "error", "critical"],
      default: "info",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true,
    },
    targetType: {
      type: String,
      enum: [
        "user",
        "resume",
        "subscription",
        "ai_usage",
        "contact",
        "feedback",
        "system",
      ],
      default: "system",
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    actionUrl: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

adminNotificationSchema.index({status: 1, createdAt: -1});
adminNotificationSchema.index({severity: 1, createdAt: -1});
adminNotificationSchema.index({type: 1, createdAt: -1});
adminNotificationSchema.index({userId: 1, createdAt: -1});

const AdminNotification = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);

export default AdminNotification;
