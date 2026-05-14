import AdminNotification from "../models/AdminNotification.model.js";

const sanitizeMessage = (value, fallback = "No details available") => {
  if (!value) return fallback;
  return String(value)
    .replace(/(api[_-]?key|token|password|secret)=?[^&\s]*/gi, "$1=[redacted]")
    .slice(0, 900);
};

export const createAdminNotification = async (data) => {
  try {
    return await AdminNotification.create({
      type: data.type,
      severity: data.severity || "info",
      title: sanitizeMessage(data.title, "Admin notification").slice(0, 160),
      message: sanitizeMessage(data.message),
      targetType: data.targetType || "system",
      targetId: data.targetId,
      userId: data.userId,
      actionUrl: data.actionUrl,
      metadata: data.metadata,
    });
  } catch (error) {
    console.error("Failed to create admin notification:", error.message);
    return null;
  }
};

export const notifyNewUser = (user, source = "local") =>
  createAdminNotification({
    type: "user",
    severity: "info",
    title: "New user registered",
    message: `${user.name} (${user.email}) joined SmartNShine.`,
    targetType: "user",
    targetId: user._id,
    userId: user._id,
    actionUrl: `/admin/users/${user._id}`,
    metadata: {
      source,
      provider: user.provider || source,
    },
  });

export const notifyAIFailure = ({userId, feature, aiProvider, aiModel, error}) =>
  createAdminNotification({
    type: "ai",
    severity: "error",
    title: "AI request failed",
    message: `${feature || "AI feature"} failed: ${sanitizeMessage(error)}`,
    targetType: "ai_usage",
    userId,
    actionUrl: userId ? `/admin/users/${userId}` : "/admin/ai-analytics",
    metadata: {
      feature,
      aiProvider,
      aiModel,
    },
  });

export const notifyPaymentFailure = ({user, payment, subscription}) =>
  createAdminNotification({
    type: "payment",
    severity: "error",
    title: "Payment failed",
    message: `Payment ${payment?.id || "unknown"} failed${
      user?.email ? ` for ${user.email}` : ""
    }.`,
    targetType: subscription?._id ? "subscription" : "system",
    targetId: subscription?._id,
    userId: user?._id || subscription?.userId,
    actionUrl:
      user?._id || subscription?.userId
        ? `/admin/users/${user?._id || subscription.userId}`
        : "/admin/earnings",
    metadata: {
      paymentId: payment?.id,
      orderId: payment?.order_id,
      amount: payment?.amount,
      currency: payment?.currency,
      errorCode: payment?.error_code,
      errorDescription: payment?.error_description,
    },
  });

export const notifyContactSubmitted = (contact) =>
  createAdminNotification({
    type: "contact",
    severity: "info",
    title: "New contact message",
    message: `${contact.name} submitted: ${contact.subject}`,
    targetType: "contact",
    targetId: contact._id,
    actionUrl: "/admin/contacts",
    metadata: {
      email: contact.email,
      category: contact.category,
    },
  });

export const notifyFeedbackSubmitted = (feedback) =>
  createAdminNotification({
    type: "feedback",
    severity: feedback.type === "bug" ? "warning" : "info",
    title: feedback.type === "bug" ? "New bug feedback" : "New user feedback",
    message: `${feedback.userId?.name || "A user"} submitted: ${feedback.title}`,
    targetType: "feedback",
    targetId: feedback._id,
    userId: feedback.userId?._id || feedback.userId,
    actionUrl: "/admin/feedback",
    metadata: {
      type: feedback.type,
      priority: feedback.priority,
      category: feedback.category,
    },
  });

export const notifySystemError = ({source, error, path, method}) =>
  createAdminNotification({
    type: "system",
    severity: "error",
    title: "System error captured",
    message: `${source || "Server"} error: ${sanitizeMessage(
      error?.message || error
    )}`,
    targetType: "system",
    actionUrl: "/admin/notifications",
    metadata: {
      source,
      path,
      method,
      name: error?.name,
      status: error?.status,
    },
  });
