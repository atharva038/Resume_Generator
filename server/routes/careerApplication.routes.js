import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { contactLimiter } from "../middleware/rateLimiter.middleware.js";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addFounderNote,
  updateApplicationRating,
  deleteApplication,
} from "../controllers/careerApplication.controller.js";

const router = express.Router();

// Public submission route (rate limited to prevent spam)
router.post("/submit", contactLimiter, submitApplication);

// Admin dashboard routes (Protected)
router.get("/", authenticateToken, getAllApplications);
router.get("/:id", authenticateToken, getApplicationById);
router.patch("/:id/status", authenticateToken, updateApplicationStatus);
router.patch("/:id/notes", authenticateToken, addFounderNote);
router.patch("/:id/rating", authenticateToken, updateApplicationRating);
router.delete("/:id", authenticateToken, deleteApplication);

export default router;
