import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "user_deleted",
        "user_disabled",
        "user_enabled",
        "template_uploaded",
        "template_deleted",
        "template_disabled",
        "template_enabled",
        "feedback_viewed",
        "settings_updated",
        "login",
        "other",
      ],
    },
    targetType: {
      type: String,
      enum: ["user", "template", "resume", "feedback", "contact", "system"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
adminLogSchema.index({adminId: 1, createdAt: -1});
adminLogSchema.index({action: 1, createdAt: -1});

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
