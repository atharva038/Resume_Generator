import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Public routes
router.post("/", submitContact);

// Protected routes (Admin only)
router.get("/", authenticateToken, getAllContacts);
router.get("/stats/summary", authenticateToken, getContactStats);
router.get("/:id", authenticateToken, getContactById);
router.patch("/:id", authenticateToken, updateContact);
router.delete("/:id", authenticateToken, deleteContact);

export default router;
