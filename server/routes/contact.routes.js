import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {contactLimiter} from "../middleware/rateLimiter.middleware.js";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Protected route - user must be logged in to submit contact form
// Rate limited to prevent spam (3 submissions per hour)
router.post("/", authenticateToken, contactLimiter, submitContact);

// Protected routes (Admin only)
router.get("/", authenticateToken, getAllContacts);
router.get("/stats/summary", authenticateToken, getContactStats);
router.get("/:id", authenticateToken, getContactById);
router.patch("/:id", authenticateToken, updateContact);
router.delete("/:id", authenticateToken, deleteContact);

export default router;
