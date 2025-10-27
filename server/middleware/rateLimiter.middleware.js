import rateLimit from "express-rate-limit";

/**
 * Rate Limiter Middleware
 * Protects API endpoints from abuse, brute force attacks, and excessive usage
 */

/**
 * Authentication Rate Limiter
 * Applied to: /api/auth/login, /api/auth/register
 * Purpose: Prevent brute force attacks and spam registrations
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error:
      "Too many authentication attempts. Please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      error:
        "Too many authentication attempts from this IP. Please try again after 15 minutes.",
      retryAfter: "15 minutes",
      type: "AUTH_RATE_LIMIT_EXCEEDED",
    });
  },
});

/**
 * AI Operations Rate Limiter (Per User)
 * Applied to: AI-powered endpoints (enhance, generate-summary, categorize-skills, etc.)
 * Purpose: Prevent API abuse and control costs (Gemini API is paid)
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each authenticated user to 20 AI requests per hour
  message: {
    error: "AI usage quota exceeded. You can make 20 AI requests per hour.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID as key instead of IP for authenticated routes
  keyGenerator: (req) => {
    // If user is authenticated, use their user ID
    if (req.user && req.user.userId) {
      return `user_${req.user.userId}`;
    }
    // Let the library handle IP addresses (including IPv6)
    return undefined;
  },
  handler: (req, res) => {
    const userId = req.user?.userId || "unknown";
    console.warn(
      `⚠️  AI rate limit exceeded for user: ${userId} on ${req.path}`
    );
    res.status(429).json({
      error:
        "AI usage quota exceeded. You can make 20 AI-powered requests per hour. Please try again later.",
      retryAfter: "1 hour",
      type: "AI_RATE_LIMIT_EXCEEDED",
      limit: 20,
      window: "1 hour",
    });
  },
  skip: (req) => {
    // Skip rate limiting for admin users (optional)
    return req.user?.role === "admin";
  },
});

/**
 * File Upload Rate Limiter
 * Applied to: /api/resume/upload, /api/ats/analyze-resume (with file upload)
 * Purpose: Prevent upload spam and server resource abuse
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 file uploads per 15 minutes
  message: {
    error: "Too many file uploads. Please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise let library handle IP
    if (req.user && req.user.userId) {
      return `user_${req.user.userId}_upload`;
    }
    return undefined;
  },
  handler: (req, res) => {
    const identifier = req.user?.userId || req.ip;
    console.warn(
      `⚠️  Upload rate limit exceeded for: ${identifier} on ${req.path}`
    );
    res.status(429).json({
      error:
        "Too many file uploads. You can upload 10 files per 15 minutes. Please try again later.",
      retryAfter: "15 minutes",
      type: "UPLOAD_RATE_LIMIT_EXCEEDED",
      limit: 10,
      window: "15 minutes",
    });
  },
});

/**
 * General API Rate Limiter
 * Applied to: All /api/* routes (global protection)
 * Purpose: Protect against DoS attacks and general API abuse
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    error: "Too many requests. Please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(
      `⚠️  General API rate limit exceeded for IP: ${req.ip} on ${req.path}`
    );
    res.status(429).json({
      error:
        "Too many requests from this IP. Please try again after 15 minutes.",
      retryAfter: "15 minutes",
      type: "API_RATE_LIMIT_EXCEEDED",
      limit: 100,
      window: "15 minutes",
    });
  },
  // Skip rate limiting for health check endpoint
  skip: (req) => req.path === "/api/health",
});

/**
 * Contact Form Rate Limiter
 * Applied to: /api/contact/* routes
 * Purpose: Prevent contact form spam
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 contact submissions per hour
  message: {
    error: "Too many contact form submissions. Please try again after 1 hour.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(
      `⚠️  Contact form rate limit exceeded for IP: ${req.ip} on ${req.path}`
    );
    res.status(429).json({
      error:
        "Too many contact form submissions. You can submit 3 messages per hour. Please try again later.",
      retryAfter: "1 hour",
      type: "CONTACT_RATE_LIMIT_EXCEEDED",
      limit: 3,
      window: "1 hour",
    });
  },
});

/**
 * Feedback Rate Limiter
 * Applied to: /api/feedback/* routes
 * Purpose: Prevent feedback spam
 */
export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each user to 5 feedback submissions per hour
  message: {
    error: "Too many feedback submissions. Please try again after 1 hour.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user && req.user.userId) {
      return `user_${req.user.userId}_feedback`;
    }
    return undefined;
  },
  handler: (req, res) => {
    const identifier = req.user?.userId || req.ip;
    console.warn(
      `⚠️  Feedback rate limit exceeded for: ${identifier} on ${req.path}`
    );
    res.status(429).json({
      error:
        "Too many feedback submissions. You can submit 5 feedback messages per hour. Please try again later.",
      retryAfter: "1 hour",
      type: "FEEDBACK_RATE_LIMIT_EXCEEDED",
      limit: 5,
      window: "1 hour",
    });
  },
});

/**
 * Admin Operations Rate Limiter
 * Applied to: /api/admin/* routes
 * Purpose: Protect admin endpoints from abuse (even from admins)
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admin operations
  message: {
    error: "Too many admin operations. Please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if available, otherwise let library handle IP
    if (req.user?.userId) {
      return `user_${req.user.userId}_admin`;
    }
    return undefined;
  },
  handler: (req, res) => {
    const userId = req.user?.userId || "unknown";
    console.warn(
      `⚠️  Admin rate limit exceeded for user: ${userId} on ${req.path}`
    );
    res.status(429).json({
      error: "Too many admin operations. Please try again after 15 minutes.",
      retryAfter: "15 minutes",
      type: "ADMIN_RATE_LIMIT_EXCEEDED",
    });
  },
});

// Export all rate limiters
export default {
  authLimiter,
  aiLimiter,
  uploadLimiter,
  apiLimiter,
  contactLimiter,
  feedbackLimiter,
  adminLimiter,
};
