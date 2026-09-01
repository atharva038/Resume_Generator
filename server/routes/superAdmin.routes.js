import express from "express";
import rateLimit from "express-rate-limit";
import {
  superAdminLogin,
  verifySuperAdminSession,
  changeSuperAdminPassword,
  getEnvVariables,
  updateEnvVariables,
  updateRawEnv,
  testApiKey,
  getEnvBackups,
  restoreEnvBackup,
  getSystemStatus,
} from "../controllers/superAdmin.controller.js";
import {
  authenticateSuperAdmin,
  logSuperAdminAction,
} from "../middleware/superAdmin.middleware.js";

const router = express.Router();

// Strict rate limiting on Super Admin login endpoint
const superAdminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // Max 10 failed/passed attempts per 15 minutes
  message: {
    success: false,
    error: "Too many Super Admin login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// PUBLIC / AUTH ROUTES
// ==========================================
router.post("/auth/login", superAdminLoginLimiter, superAdminLogin);
router.get("/auth/verify", authenticateSuperAdmin, verifySuperAdminSession);

// ==========================================
// PROTECTED SUPER ADMIN OPERATIONS
// ==========================================
router.use(authenticateSuperAdmin);
router.use(logSuperAdminAction);

// Password Management
router.post("/auth/change-password", changeSuperAdminPassword);

// Environment & Keys Management
router.get("/env", getEnvVariables);
router.post("/env", updateEnvVariables);
router.post("/env/raw", updateRawEnv);

// 1-Click Key Diagnostics & Connection Testing
router.post("/env/test-key", testApiKey);

// Backup & Rollback
router.get("/env/backups", getEnvBackups);
router.post("/env/restore", restoreEnvBackup);

// Server & Runtime Stats
router.get("/system/status", getSystemStatus);

export default router;
