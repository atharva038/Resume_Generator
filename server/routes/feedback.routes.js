import express from "express";
import {
  submitFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  upvoteFeedback,
  getFeedbackStats,
} from "../controllers/feedback.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {feedbackLimiter} from "../middleware/rateLimiter.middleware.js";
import {
  validateFeedbackSubmission,
  validateMongoId,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes - rate limited to prevent feedback spam
router.post("/", feedbackLimiter, validateFeedbackSubmission, submitFeedback);
router.get("/my-feedback", getMyFeedback);
router.get("/stats", getFeedbackStats);
router.get("/:id", validateMongoId, getFeedbackById);
router.patch("/:id", validateMongoId, updateFeedback);
router.delete("/:id", validateMongoId, deleteFeedback);
router.post("/:id/upvote", validateMongoId, upvoteFeedback);

export default router;
