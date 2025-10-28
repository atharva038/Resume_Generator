import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {authLimiter} from "../middleware/rateLimiter.middleware.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// Public routes with rate limiting and validation for security
router.post("/register", authLimiter, validateRegister, register);
router.post(
  "/login",
  // , authLimiter
  validateLogin,
  login
);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
