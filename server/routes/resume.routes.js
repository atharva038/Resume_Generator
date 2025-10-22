import express from "express";
import upload from "../config/multer.config.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
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
  upload.single("resume"),
  uploadResume
);

// Protected routes - enhance content (requires authentication)
router.post("/enhance", authenticateToken, enhanceContent);

// Protected routes - generate summary (requires authentication)
router.post("/generate-summary", authenticateToken, generateSummary);

// Protected routes - categorize skills with AI (requires authentication)
router.post("/categorize-skills", authenticateToken, categorizeSkills);

// Protected routes - segregate achievements with AI (requires authentication)
router.post(
  "/segregate-achievements",
  authenticateToken,
  segregateAchievements
);

// Protected routes - process custom section with AI (requires authentication)
router.post("/process-custom-section", authenticateToken, processCustomSection);

// Protected routes - require authentication
router.post("/save", authenticateToken, saveResume);
router.put("/:id", authenticateToken, updateResume);
router.get("/list", authenticateToken, getResumes);
router.get("/:id", authenticateToken, getResumeById);
router.delete("/:id", authenticateToken, deleteResume);

export default router;
