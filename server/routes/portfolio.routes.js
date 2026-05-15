import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {
  checkSubscription,
  checkUsageLimit,
} from "../middleware/subscription.middleware.js";
import {aiLimiter} from "../middleware/rateLimiter.middleware.js";
import {checkAIQuota} from "../middleware/aiUsageTracker.middleware.js";
import {
  createPortfolioFromResume,
  createPortfolioProject,
  deletePortfolio,
  deletePortfolioProject,
  generatePortfolioAbout,
  generatePortfolioSeo,
  getPortfolioById,
  getPortfolios,
  getPublicPortfolio,
  improvePortfolioProjectDescription,
  publishPortfolio,
  trackContactClick,
  trackProjectClick,
  trackPublicView,
  trackResumeDownload,
  unpublishPortfolio,
  updatePortfolio,
  updatePortfolioProject,
} from "../controllers/portfolio.controller.js";

const router = express.Router();

// Public portfolio routes.
router.get("/public/:slug", getPublicPortfolio);
router.post("/public/:slug/view", trackPublicView);
router.post("/public/:slug/resume-download", trackResumeDownload);
router.post("/public/:slug/contact-click", trackContactClick);
router.post("/public/:slug/project-click", trackProjectClick);

// Protected portfolio routes.
router.post(
  "/from-resume/:resumeId",
  authenticateToken,
  checkSubscription,
  createPortfolioFromResume
);
router.get("/", authenticateToken, checkSubscription, getPortfolios);
router.get("/:id", authenticateToken, checkSubscription, getPortfolioById);
router.put("/:id", authenticateToken, checkSubscription, updatePortfolio);
router.delete("/:id", authenticateToken, checkSubscription, deletePortfolio);
router.post(
  "/:id/publish",
  authenticateToken,
  checkSubscription,
  publishPortfolio
);
router.post(
  "/:id/unpublish",
  authenticateToken,
  checkSubscription,
  unpublishPortfolio
);

// Protected AI helper routes.
router.post(
  "/:id/ai/about",
  authenticateToken,
  checkSubscription,
  checkUsageLimit("aiGenerationsPerMonth"),
  aiLimiter,
  checkAIQuota,
  generatePortfolioAbout
);
router.post(
  "/:id/ai/project-description",
  authenticateToken,
  checkSubscription,
  checkUsageLimit("aiGenerationsPerMonth"),
  aiLimiter,
  checkAIQuota,
  improvePortfolioProjectDescription
);
router.post(
  "/:id/ai/seo",
  authenticateToken,
  checkSubscription,
  checkUsageLimit("aiGenerationsPerMonth"),
  aiLimiter,
  checkAIQuota,
  generatePortfolioSeo
);

// Protected project routes.
router.post(
  "/:id/projects",
  authenticateToken,
  checkSubscription,
  createPortfolioProject
);
router.put(
  "/:id/projects/:projectId",
  authenticateToken,
  checkSubscription,
  updatePortfolioProject
);
router.delete(
  "/:id/projects/:projectId",
  authenticateToken,
  checkSubscription,
  deletePortfolioProject
);

export default router;
