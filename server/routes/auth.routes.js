import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {authLimiter} from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

// Public routes with rate limiting for security
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
