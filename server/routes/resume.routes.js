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
} from "../controllers/resume.controller.js";

const router = express.Router();

// Public route - upload and parse resume (no auth required for demo)
router.post("/upload", upload.single("resume"), uploadResume);

// Public route - enhance content (no auth required for demo)
router.post("/enhance", enhanceContent);

// Public route - generate summary (no auth required for demo)
router.post("/generate-summary", generateSummary);

// Protected routes - require authentication
router.post("/save", authenticateToken, saveResume);
router.put("/:id", authenticateToken, updateResume);
router.get("/list", authenticateToken, getResumes);
router.get("/:id", authenticateToken, getResumeById);
router.delete("/:id", authenticateToken, deleteResume);

export default router;
