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

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes
router.post("/", submitFeedback);
router.get("/my-feedback", getMyFeedback);
router.get("/stats", getFeedbackStats);
router.get("/:id", getFeedbackById);
router.patch("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);
router.post("/:id/upvote", upvoteFeedback);

export default router;
