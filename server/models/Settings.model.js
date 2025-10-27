import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // General Settings
    siteName: {
      type: String,
      default: "ATS Resume Generator",
    },
    siteDescription: {
      type: String,
      default: "Professional Resume Builder with ATS Optimization",
    },
    contactEmail: {
      type: String,
      default: "support@atsresume.com",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    // AI Quota Settings
    aiQuota: {
      free: {
        daily: {type: Number, default: 10},
        monthly: {type: Number, default: 200},
      },
      premium: {
        daily: {type: Number, default: 100},
        monthly: {type: Number, default: 2000},
      },
    },

    // Feature Toggles
    features: {
      registration: {type: Boolean, default: true},
      githubImport: {type: Boolean, default: true},
      atsAnalyzer: {type: Boolean, default: true},
      aiEnhancement: {type: Boolean, default: true},
      feedback: {type: Boolean, default: true},
      templateUpload: {type: Boolean, default: true},
    },

    // Rate Limiting Settings
    rateLimits: {
      general: {
        windowMs: {type: Number, default: 900000}, // 15 minutes
        max: {type: Number, default: 100},
      },
      auth: {
        windowMs: {type: Number, default: 900000}, // 15 minutes
        max: {type: Number, default: 5},
      },
      ai: {
        windowMs: {type: Number, default: 60000}, // 1 minute
        max: {type: Number, default: 10},
      },
      upload: {
        windowMs: {type: Number, default: 900000}, // 15 minutes
        max: {type: Number, default: 20},
      },
    },

    // Email Settings
    email: {
      enabled: {type: Boolean, default: false},
      provider: {type: String, default: "smtp"},
      notifications: {
        welcome: {type: Boolean, default: true},
        quotaWarning: {type: Boolean, default: true},
        quotaExceeded: {type: Boolean, default: true},
      },
    },

    // Storage Settings
    storage: {
      maxFileSize: {type: Number, default: 5242880}, // 5MB in bytes
      allowedFileTypes: {
        type: [String],
        default: ["pdf", "doc", "docx"],
      },
      maxResumesPerUser: {type: Number, default: 10},
    },

    // Security Settings
    security: {
      passwordMinLength: {type: Number, default: 8},
      sessionTimeout: {type: Number, default: 86400000}, // 24 hours in ms
      enableTwoFactor: {type: Boolean, default: false},
      requireEmailVerification: {type: Boolean, default: false},
    },

    // Analytics Settings
    analytics: {
      enabled: {type: Boolean, default: true},
      trackPageViews: {type: Boolean, default: true},
      trackUserActions: {type: Boolean, default: true},
    },

    // Last Updated By
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
