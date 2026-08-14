import express from "express";
import {
  getProfile,
  updateProfile,
  structureWithAI,
  importResume,
  exportResumeFormat,
  getQAItems,
  generateAnswer,
  saveAnswer,
  toggleStar,
  deleteQAItem,
  generateJobQuestions,
  generateProjectQuestions,
} from "../controllers/career.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimiter.middleware.js";
import { checkAIQuota } from "../middleware/aiUsageTracker.middleware.js";

const router = express.Router();

// Career Profile Endpoints (Protected)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post(
  "/profile/ai-structure",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  structureWithAI
);
router.post("/profile/import-resume", authenticateToken, importResume);
router.get("/profile/export-resume-format", authenticateToken, exportResumeFormat);

// Career Q&A Endpoints (Protected)
router.get("/qa", authenticateToken, getQAItems);
router.post("/qa/generate", authenticateToken, aiLimiter, checkAIQuota, generateAnswer);
router.post("/qa/save", authenticateToken, saveAnswer);
router.post("/qa/toggle-star", authenticateToken, toggleStar);
router.delete("/qa/:id", authenticateToken, deleteQAItem);
router.post(
  "/qa/job-questions",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  generateJobQuestions
);
router.post(
  "/qa/project-questions",
  authenticateToken,
  aiLimiter,
  checkAIQuota,
  generateProjectQuestions
);

export default router;
