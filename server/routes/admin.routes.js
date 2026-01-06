import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {isAdmin, logAdminAction} from "../middleware/admin.middleware.js";
import {adminLimiter} from "../middleware/rateLimiter.middleware.js";
import {
  validateMongoId,
  validateUserId,
  validateTemplateId,
  validateContactStatusUpdate,
  validateFeedbackStatusUpdate,
  validateUserRoleUpdate,
} from "../middleware/validation.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAIAnalytics,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
  getContactStatistics,
  getAdminLogs,
  getAllTemplates,
  updateTemplateStatus,
  deleteTemplate,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedbackAdmin,
  getFeedbackStatistics,
  getUserQuotaStatus,
  getUserQuotaDetails,
  updateUserTier,
  resetUserDailyQuota,
  getSettings,
  updateSettings,
  resetSettings,
  getSystemStats,
  updateAIQuotaLimits,
  toggleFeature,
  updateRateLimits,
  getAIExtractionUsage,
  resetUserExtractionCounter,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply auth, admin, rate limiting, and logging middleware to all routes
router.use(authenticateToken);
router.use(isAdmin);
router.use(adminLimiter); // Higher limit for admin operations (200 req/15min)
router.use(logAdminAction);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:userId", validateUserId, getUserDetails);
router.patch("/users/:userId/status", validateUserId, updateUserStatus);
router.patch("/users/:userId/role", validateUserRoleUpdate, updateUserRole);
router.delete("/users/:userId", validateUserId, deleteUser);

// AI Analytics
router.get("/ai-analytics", getAIAnalytics);

// Contact Messages
router.get("/contacts", getContactMessages);
router.get("/contacts/statistics", getContactStatistics);
router.patch(
  "/contacts/:id/status",
  validateContactStatusUpdate,
  updateContactStatus
);
router.delete("/contacts/:id", validateMongoId, deleteContactMessage);

// Admin Logs
router.get("/logs", getAdminLogs);

// Template Management
router.get("/templates", getAllTemplates);
router.patch(
  "/templates/:templateId/status",
  validateTemplateId,
  updateTemplateStatus
);
router.delete("/templates/:templateId", validateTemplateId, deleteTemplate);

// Feedback Management
router.get("/feedback", getAllFeedback);
router.get("/feedback/statistics", getFeedbackStatistics);
router.patch(
  "/feedback/:id/status",
  validateFeedbackStatusUpdate,
  updateFeedbackStatus
);
router.delete("/feedback/:id", validateMongoId, deleteFeedbackAdmin);

// AI Quota Management
router.get("/ai-quota/users", getUserQuotaStatus);
router.get("/ai-quota/users/:userId", validateUserId, getUserQuotaDetails);
router.patch("/ai-quota/users/:userId/tier", validateUserId, updateUserTier);
router.post(
  "/ai-quota/users/:userId/reset-daily",
  validateUserId,
  resetUserDailyQuota
);

// AI Resume Extraction Usage Management
router.get("/ai-extraction-usage", getAIExtractionUsage);
router.post(
  "/users/:userId/reset-extraction-counter",
  validateUserId,
  resetUserExtractionCounter
);

// System Settings
router.get("/settings", getSettings);
router.get("/settings/stats", getSystemStats);
router.patch("/settings", updateSettings);
router.post("/settings/reset", resetSettings);
router.patch("/settings/ai-quota", updateAIQuotaLimits);
router.patch("/settings/features/:feature", toggleFeature);
router.patch("/settings/rate-limits", updateRateLimits);

export default router;
