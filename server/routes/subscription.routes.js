import express from "express";
import * as subscriptionController from "../controllers/subscription.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {
  checkSubscription,
  requirePremium,
} from "../middleware/subscription.middleware.js";

const router = express.Router();

/**
 * Subscription Routes
 * Base path: /api/subscription
 */

// Public routes
router.get("/pricing", subscriptionController.getPricing);

// Protected routes (require authentication)
router.use(authenticateToken);
router.use(checkSubscription); // Check and update subscription status

// Payment & Subscription Management
router.post("/create-order", subscriptionController.createPaymentOrder);
router.post("/verify-payment", subscriptionController.verifyPayment);
router.post("/cancel", subscriptionController.cancelSubscription);
router.post("/renew", subscriptionController.renewSubscription);

// Subscription Information
router.get("/status", subscriptionController.getSubscriptionStatus);
router.get("/history", subscriptionController.getSubscriptionHistory);
router.get("/usage", subscriptionController.getUsageStats);
router.get("/analytics", subscriptionController.getAdvancedAnalytics); // Advanced analytics for Pro users
router.get("/compare", subscriptionController.comparePlans);

// AI Configuration
router.get("/ai-config", subscriptionController.getAIConfig);
router.post("/ai-preference", subscriptionController.updateAIPreference);

// Webhook (public, no auth)
router.post(
  "/webhook",
  express.raw({type: "application/json"}),
  subscriptionController.handleWebhook
);

export default router;
