/**
 * API Barrel Export
 * 
 * Centralized exports for all API modules.
 * Use: import { authAPI, resumeAPI } from '@/api'
 */

// Core API exports
export { authAPI, resumeAPI, contactAPI, mlAPI } from './api';

// Admin API exports
export {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAIAnalytics,
  getContactMessages,
  getContactStatistics,
  updateContactStatus,
  deleteContactMessage,
  getAdminLogs,
  getAllTemplates,
  updateTemplateStatus,
  deleteTemplate,
  getAllFeedback,
  getFeedbackStatistics,
  updateFeedbackStatus,
  deleteFeedbackAdmin,
  getUserQuotaStatus,
  getUserQuotaDetails,
  resetUserQuota,
  getSystemSettings,
  updateSystemSettings,
  updatePaymentSettings,
} from './admin.api';

// Subscription API exports
export {
  getPricing,
  comparePlans,
  createPaymentOrder,
  verifyPayment,
  getSubscriptionStatus,
  getSubscriptionHistory,
  cancelSubscription,
  renewSubscription,
  getUsageStats,
  getAIConfig,
  updateAIPreference,
} from './subscription.api';

// Feedback API exports
export { feedbackAPI } from './feedback.api';
