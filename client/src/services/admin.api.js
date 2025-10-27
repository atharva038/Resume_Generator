import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const adminAPI = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dashboard Stats
export const getDashboardStats = () => adminAPI.get("/dashboard/stats");

// User Management
export const getAllUsers = (params) => adminAPI.get("/users", {params});
export const getUserDetails = (userId) => adminAPI.get(`/users/${userId}`);
export const updateUserStatus = (userId, status) =>
  adminAPI.patch(`/users/${userId}/status`, {status});
export const updateUserRole = (userId, role) =>
  adminAPI.patch(`/users/${userId}/role`, {role});
export const deleteUser = (userId) => adminAPI.delete(`/users/${userId}`);

// AI Analytics
export const getAIAnalytics = (params) =>
  adminAPI.get("/ai-analytics", {params});

// Contact Messages
export const getContactMessages = (params) =>
  adminAPI.get("/contacts", {params});

// Admin Logs
export const getAdminLogs = (params) => adminAPI.get("/logs", {params});

// Template Management
export const getAllTemplates = (params) => adminAPI.get("/templates", {params});
export const updateTemplateStatus = (templateId, isActive) =>
  adminAPI.patch(`/templates/${templateId}/status`, {isActive});
export const deleteTemplate = (templateId) =>
  adminAPI.delete(`/templates/${templateId}`);

// Feedback Management
export const getAllFeedback = (params) => adminAPI.get("/feedback", {params});
export const getFeedbackStatistics = () => adminAPI.get("/feedback/statistics");
export const updateFeedbackStatus = (id, data) =>
  adminAPI.patch(`/feedback/${id}/status`, data);
export const deleteFeedbackAdmin = (id) => adminAPI.delete(`/feedback/${id}`);

// AI Quota Management
export const getUserQuotaStatus = (params) =>
  adminAPI.get("/ai-quota/users", {params});
export const getUserQuotaDetails = (userId) =>
  adminAPI.get(`/ai-quota/users/${userId}`);
export const updateUserTier = (userId, tier) =>
  adminAPI.patch(`/ai-quota/users/${userId}/tier`, {tier});
export const resetUserDailyQuota = (userId) =>
  adminAPI.post(`/ai-quota/users/${userId}/reset-daily`);

// System Settings
export const getSettings = () => adminAPI.get("/settings");
export const getSystemStats = () => adminAPI.get("/settings/stats");
export const updateSettings = (settings) =>
  adminAPI.patch("/settings", settings);
export const resetSettings = () => adminAPI.post("/settings/reset");
export const updateAIQuotaLimits = (data) =>
  adminAPI.patch("/settings/ai-quota", data);
export const toggleFeature = (feature, enabled) =>
  adminAPI.patch(`/settings/features/${feature}`, {enabled});
export const updateRateLimits = (data) =>
  adminAPI.patch("/settings/rate-limits", data);

export default adminAPI;
