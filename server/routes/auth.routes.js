import express from "express";
import passport from "../config/passport.config.js";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
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
router.post("/login", authLimiter, validateLogin, login);

// Password reset routes (public with rate limiting)
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
      );

      // Redirect to frontend with token
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=google`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=token_generation_failed`
      );
    }
  }
);

// ==========================================
// GITHUB OAUTH ROUTES
// ==========================================

// Initiate GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`,
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
      );

      // Redirect to frontend with token
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=github`
      );
    } catch (error) {
      console.error("GitHub callback error:", error);
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=token_generation_failed`
      );
    }
  }
);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
