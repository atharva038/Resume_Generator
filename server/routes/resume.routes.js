import express from "express";
import upload from "../config/multer.config.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {
  aiLimiter,
  uploadLimiter,
} from "../middleware/rateLimiter.middleware.js";
import {checkAIQuota} from "../middleware/aiUsageTracker.middleware.js";
import {
  validateResumeCreate,
  validateResumeUpdate,
  validateResumeId,
  validateContentEnhance,
  validateSkillsCategorize,
  validateFileUpload,
} from "../middleware/validation.middleware.js";
import {
  uploadResume,
  enhanceContent,
  generateSummary,
  saveResume,
  updateResume,
  getResumes,
  getResumeById,
  deleteResume,
  categorizeSkills,
  segregateAchievements,
  processCustomSection,
} from "../controllers/resume.controller.js";

const router = express.Router();

// Protected routes - require authentication for resume upload and processing
router.post(
  "/upload",
  authenticateToken,
  uploadLimiter, // Rate limit file uploads
  upload.single("resume"),
  validateFileUpload,
  uploadResume
);

// Protected routes - enhance content (requires authentication + AI rate limiting + quota check)
router.post(
  "/enhance",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  validateContentEnhance,
  enhanceContent
);

// Protected routes - generate summary (requires authentication + AI rate limiting + quota check)
router.post(
  "/generate-summary",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  validateContentEnhance,
  generateSummary
);

// Protected routes - categorize skills with AI (requires authentication + AI rate limiting + quota check)
router.post(
  "/categorize-skills",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  validateSkillsCategorize,
  categorizeSkills
);

// Protected routes - segregate achievements with AI (requires authentication + AI rate limiting + quota check)
router.post(
  "/segregate-achievements",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  validateContentEnhance,
  segregateAchievements
);

// Protected routes - process custom section with AI (requires authentication + AI rate limiting + quota check)
router.post(
  "/process-custom-section",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  validateContentEnhance,
  processCustomSection
);

// Protected routes - require authentication
router.post("/save", authenticateToken, validateResumeCreate, saveResume);
router.put("/:id", authenticateToken, validateResumeUpdate, updateResume);
router.get("/list", authenticateToken, getResumes);
router.get("/:id", authenticateToken, validateResumeId, getResumeById);
router.delete("/:id", authenticateToken, validateResumeId, deleteResume);

export default router;
