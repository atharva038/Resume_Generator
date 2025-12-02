import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/Subscription.model.js";
import User from "../models/User.model.js";
import {sendPaymentConfirmationEmail} from "./email.service.js";

/**
 * Payment Service (Razorpay Integration)
 * Handles payment creation, verification, and subscription management
 */

/**
 * Generate unique receipt ID
 * Format: RCP-YYYYMMDD-XXXXXX (e.g., RCP-20251202-A1B2C3)
 */
function generateReceiptId() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `RCP-${dateStr}-${random}`;
}

// Initialize Razorpay instance (with fallback for missing keys)
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// Pricing configuration (in INR)
export const PRICING = {
  free: {
    amount: 0,
    plan: "lifetime",
    features: ["1 resume/month", "Gemini AI", "1 template"],
  },
  "one-time": {
    amount: 49,
    plan: "one-time",
    features: [
      "1 resume",
      "GPT-4o AI",
      "All templates",
      "1 ATS scan",
      "3 job matches",
      "21-day access",
    ],
  },
  pro: {
    monthly: {
      amount: 199,
    },
    yearly: {
      amount: 1990, // ~17% discount (2 months free)
    },
    plan: "monthly",
    features: [
      "Unlimited resumes",
      "GPT-4o AI (Premium)",
      "All templates",
      "Unlimited ATS scans",
      "Unlimited job matches",
      "Unlimited cover letters",
      "2 AI resume extractions/day",
      "Priority support",
      "Advanced analytics",
    ],
  },
};

/**
 * Create a Razorpay order for payment
 * @param {string} tier - Subscription tier
 * @param {string} plan - Plan duration (monthly, yearly, one-time, etc.)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Order details
 */
export async function createOrder(tier, plan, userId) {
  try {
    console.log(
      `📝 Creating order for tier: ${tier}, plan: ${plan}, userId: ${userId}`
    );

    console.log(`🔑 Razorpay initialized:`, razorpay ? "YES" : "NO");
    console.log(
      `🔑 Razorpay KEY_ID:`,
      process.env.RAZORPAY_KEY_ID ? "Set" : "Not set"
    );
    console.log(
      `🔑 Razorpay KEY_SECRET:`,
      process.env.RAZORPAY_KEY_SECRET ? "Set" : "Not set"
    );

    if (!razorpay) {
      throw new Error(
        "Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
      );
    }

    // Get pricing
    const pricing = PRICING[tier];
    if (!pricing) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    console.log(`📊 Pricing structure for ${tier}:`, pricing);

    // Extract amount based on tier structure
    let amount;
    if (tier === "pro") {
      // Pro tier has monthly/yearly sub-objects
      if (plan === "monthly" || plan === "yearly") {
        amount = pricing[plan]?.amount;
      } else {
        amount = pricing.monthly?.amount; // Default to monthly
      }
    } else if (tier === "one-time" || tier === "student") {
      // Direct amount property
      amount = pricing.amount;
    } else {
      // Free tier or others
      amount = pricing.amount;
    }

    console.log(`💰 Extracted amount: ${amount}`);

    if (!amount || amount === 0) {
      throw new Error("Cannot create order for free tier or invalid amount");
    }

    // Create Razorpay order
    console.log(`🔄 Attempting to create Razorpay order...`);

    // Generate short receipt ID (max 40 chars for Razorpay)
    // Format: rcpt_<timestamp>_<last8charsOfUserId>
    const timestamp = Date.now().toString();
    const userIdShort = userId.toString().slice(-8);
    const receipt = `rcpt_${timestamp}_${userIdShort}`;

    console.log(`📋 Order params:`, {
      amount: amount * 100,
      currency: "INR",
      receipt: receipt,
      receiptLength: receipt.length,
      notes: {userId, tier, plan},
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        tier,
        plan,
      },
    });

    console.log(`✅ Razorpay order created: ${order.id} for ₹${amount}`);

    return {
      orderId: order.id,
      amount: amount,
      currency: "INR",
      tier,
      plan,
    };
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Full error object:", JSON.stringify(error, null, 2));

    const errorMessage =
      error.message ||
      error.description ||
      error.error?.description ||
      "Unknown error occurred";
    throw new Error(`Failed to create payment order: ${errorMessage}`);
  }
}

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} - True if signature is valid
 */
export function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generated_signature === signature;
  } catch (error) {
    console.error("❌ Signature verification error:", error.message);
    return false;
  }
}

/**
 * Verify payment via Razorpay API (for UPI and other async payment methods)
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} orderId - Razorpay order ID
 * @param {number} amount - Expected amount
 * @returns {Promise<boolean>} - True if payment is valid
 */
export async function verifyPaymentViaAPI(paymentId, orderId, amount) {
  try {
    if (!razorpay) {
      console.error("❌ Razorpay not configured");
      return false;
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    console.log("💳 Payment details from Razorpay:", {
      id: payment.id,
      order_id: payment.order_id,
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
    });

    // Verify payment details
    const isValid =
      payment.status === "captured" &&
      payment.order_id === orderId &&
      payment.amount === amount * 100; // Razorpay amount is in paise

    if (isValid) {
      console.log("✅ Payment verified via Razorpay API");
    } else {
      console.error("❌ Payment verification failed:", {
        statusMatch: payment.status === "captured",
        orderIdMatch: payment.order_id === orderId,
        amountMatch: payment.amount === amount * 100,
      });
    }

    return isValid;
  } catch (error) {
    console.error("❌ Razorpay API verification error:", error.message);
    return false;
  }
}

/**
 * Create subscription after successful payment
 * @param {string} userId - User ID
 * @param {string} tier - Subscription tier
 * @param {string} plan - Plan duration
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} orderId - Razorpay order ID
 * @param {number} amount - Amount paid
 * @returns {Promise<Object>} - Created subscription
 */
export async function createSubscription(
  userId,
  tier,
  plan,
  paymentId,
  orderId,
  amount
) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate unique receipt ID
    const receiptId = generateReceiptId();
    console.log(`📧 Generated Receipt ID: ${receiptId}`);

    // Calculate end date based on plan
    const startDate = new Date();
    let endDate = new Date();

    switch (plan) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case "3-months":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "one-time":
        endDate.setDate(endDate.getDate() + 21); // 21 days access
        break;
      case "lifetime":
        endDate.setFullYear(endDate.getFullYear() + 100); // 100 years
        break;
      default:
        throw new Error(`Invalid plan: ${plan}`);
    }

    // Create subscription record
    const subscription = await Subscription.create({
      userId,
      tier,
      plan,
      status: "active",
      startDate,
      endDate,
      amount,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentId,
      orderId,
      receiptId, // Add receipt ID
      autoRenew: plan === "monthly" || plan === "yearly",
    });

    // Update user subscription
    user.subscription = {
      tier,
      plan,
      status: "active",
      startDate,
      endDate,
      paymentId,
      orderId,
      receiptId, // Add receipt ID to user model
      autoRenew: subscription.autoRenew,
    };

    // Reset usage counters when new subscription is purchased
    // This allows users to buy the same plan again (e.g., one-time plan)
    // Reset both monthly/daily and total counters
    user.usage = {
      resumesCreated: 0,
      resumesThisMonth: 0,
      atsScans: 0,
      atsScansThisMonth: 0,
      jobMatches: 0,
      jobMatchesToday: 0,
      coverLetters: 0,
      coverLettersThisMonth: 0,
      tokensUsed: 0,
      lastResetDate: new Date(),
      lastDailyReset: new Date(),
    };

    await user.save();

    console.log(
      `✅ Subscription created for user ${userId}: ${tier} (${plan})`
    );
    console.log(`🔄 Usage counters reset for new subscription`);

    // Send payment confirmation email
    try {
      await sendPaymentConfirmationEmail(user.email, user.name, {
        receiptId,
        tier,
        plan,
        amount,
        paymentId,
        orderId,
        transactionDate: startDate,
        startDate,
        endDate,
      });
      console.log(`📧 Payment confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        "❌ Failed to send payment confirmation email:",
        emailError.message
      );
      // Don't throw error - payment was successful even if email fails
    }

    return subscription;
  } catch (error) {
    console.error("❌ Subscription creation error:", error.message);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
}

/**
 * Cancel subscription
 * @param {string} userId - User ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} - Updated subscription
 */
export async function cancelSubscription(userId, reason = "User requested") {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get active subscription
    const subscription = await Subscription.getActiveSubscription(userId);
    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Cancel subscription
    await subscription.cancel(reason);

    // Update user
    user.subscription.status = "cancelled";
    user.subscription.cancelledAt = new Date();
    user.subscription.autoRenew = false;

    await user.save();

    console.log(`✅ Subscription cancelled for user ${userId}`);

    return subscription;
  } catch (error) {
    console.error("❌ Subscription cancellation error:", error.message);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

/**
 * Renew subscription
 * @param {string} userId - User ID
 * @param {string} paymentId - New payment ID
 * @param {string} orderId - New order ID
 * @returns {Promise<Object>} - Renewed subscription
 */
export async function renewSubscription(userId, paymentId, orderId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const currentSub = await Subscription.getActiveSubscription(userId);
    if (!currentSub) {
      throw new Error("No subscription to renew");
    }

    // Calculate new end date
    const currentEndDate = new Date(currentSub.endDate);
    const now = new Date();
    const startDate = currentEndDate > now ? currentEndDate : now;
    let newEndDate = new Date(startDate);

    switch (currentSub.plan) {
      case "monthly":
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case "yearly":
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
      default:
        throw new Error(`Cannot renew ${currentSub.plan} plan`);
    }

    // Renew subscription
    await currentSub.renew(newEndDate);

    // Update payment details
    currentSub.paymentId = paymentId;
    currentSub.orderId = orderId;
    await currentSub.save();

    // Update user
    user.subscription.endDate = newEndDate;
    user.subscription.status = "active";
    user.subscription.paymentId = paymentId;
    user.subscription.orderId = orderId;

    await user.save();

    console.log(
      `✅ Subscription renewed for user ${userId} until ${newEndDate}`
    );

    return currentSub;
  } catch (error) {
    console.error("❌ Subscription renewal error:", error.message);
    throw new Error(`Failed to renew subscription: ${error.message}`);
  }
}

/**
 * Handle Razorpay webhook events
 * @param {Object} event - Webhook event
 * @param {string} signature - Razorpay signature
 * @returns {Promise<void>}
 */
export async function handleWebhook(event, signature) {
  try {
    // Verify webhook signature
    const isValid = verifyWebhookSignature(JSON.stringify(event), signature);
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    const {event: eventType, payload} = event;

    console.log(`📨 Razorpay webhook: ${eventType}`);

    switch (eventType) {
      case "payment.captured":
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payment.entity);
        break;

      case "subscription.activated":
        // Handle subscription activation
        console.log("Subscription activated:", payload.subscription.entity.id);
        break;

      case "subscription.cancelled":
        // Handle subscription cancellation
        console.log("Subscription cancelled:", payload.subscription.entity.id);
        break;

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
  } catch (error) {
    console.error("❌ Webhook handling error:", error.message);
    throw error;
  }
}

/**
 * Verify webhook signature
 * @param {string} body - Request body
 * @param {string} signature - Razorpay signature
 * @returns {boolean} - True if valid
 */
function verifyWebhookSignature(body, signature) {
  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    return generated_signature === signature;
  } catch (error) {
    console.error("❌ Webhook signature verification error:", error.message);
    return false;
  }
}

/**
 * Handle payment captured event
 */
async function handlePaymentCaptured(payment) {
  console.log(
    `✅ Payment captured: ${payment.id} for ₹${payment.amount / 100}`
  );
  // Additional handling if needed
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(payment) {
  console.log(`❌ Payment failed: ${payment.id}`);

  // Update subscription status if exists
  const subscription = await Subscription.findOne({
    orderId: payment.order_id,
  });

  if (subscription) {
    subscription.status = "failed";
    await subscription.save();

    // Update user
    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscription.status = "failed";
      await user.save();
    }
  }
}

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} - Payment details
 */
export async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("❌ Get payment details error:", error.message);
    throw new Error(`Failed to get payment details: ${error.message}`);
  }
}

/**
 * Refund payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (in paise)
 * @returns {Promise<Object>} - Refund details
 */
export async function refundPayment(paymentId, amount = null) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // null for full refund
      speed: "normal",
    });

    console.log(
      `✅ Refund initiated: ${refund.id} for ₹${refund.amount / 100}`
    );
    return refund;
  } catch (error) {
    console.error("❌ Refund error:", error.message);
    throw new Error(`Failed to process refund: ${error.message}`);
  }
}

export default {
  createOrder,
  verifyPaymentSignature,
  createSubscription,
  cancelSubscription,
  renewSubscription,
  handleWebhook,
  getPaymentDetails,
  refundPayment,
  PRICING,
};
