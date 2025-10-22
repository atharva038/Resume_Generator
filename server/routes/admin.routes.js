import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {isAdmin, logAdminAction} from "../middleware/admin.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAIAnalytics,
  getContactMessages,
  getAdminLogs,
  getAllTemplates,
  updateTemplateStatus,
  deleteTemplate,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedbackAdmin,
  getFeedbackStatistics,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authenticateToken);
router.use(isAdmin);
router.use(logAdminAction);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.patch("/users/:userId/status", updateUserStatus);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// AI Analytics
router.get("/ai-analytics", getAIAnalytics);

// Contact Messages
router.get("/contacts", getContactMessages);

// Admin Logs
router.get("/logs", getAdminLogs);

// Template Management
router.get("/templates", getAllTemplates);
router.patch("/templates/:templateId/status", updateTemplateStatus);
router.delete("/templates/:templateId", deleteTemplate);

// Feedback Management
router.get("/feedback", getAllFeedback);
router.get("/feedback/statistics", getFeedbackStatistics);
router.patch("/feedback/:id/status", updateFeedbackStatus);
router.delete("/feedback/:id", deleteFeedbackAdmin);

export default router;
