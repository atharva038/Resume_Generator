/**
 * Feedback API Service Module
 *
 * Provides API endpoints for user feedback management:
 * - Submit feedback, suggestions, and feature requests
 * - View user's own feedback history
 * - Upvote feedback from other users
 * - Get feedback statistics
 *
 * All endpoints require authentication via JWT token
 *
 * @module feedback.api
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Axios instance configured for feedback endpoints
 * Base URL: /api/feedback
 * Automatically injects JWT token from localStorage
 */
const api = axios.create({
  baseURL: `${API_URL}/feedback`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Feedback API endpoints
 *
 * @namespace feedbackAPI
 * @example
 * import {feedbackAPI} from '@/api/feedback.api';
 *
 * // Submit feedback
 * await feedbackAPI.submitFeedback({
 *   type: 'feature-request',
 *   title: 'Add dark mode',
 *   description: 'Please add dark mode support'
 * });
 *
 * // Upvote existing feedback
 * await feedbackAPI.upvoteFeedback(feedbackId);
 */
export const feedbackAPI = {
  /**
   * Submit new feedback, suggestion, or bug report
   * @param {Object} data - Feedback data
   * @param {string} data.type - Feedback type (bug, feature-request, improvement, etc.)
   * @param {string} data.title - Feedback title
   * @param {string} data.description - Detailed feedback description
   * @param {string} [data.category] - Feedback category
   * @returns {Promise} Axios response with created feedback object
   */
  submitFeedback: (data) => api.post("/", data),

  /**
   * Get current user's feedback submissions
   * @param {Object} params - Query parameters (pagination, filters)
   * @returns {Promise} Axios response with array of user's feedback
   */
  getMyFeedback: (params) => api.get("/my-feedback", {params}),

  /**
   * Get feedback statistics and metrics
   * @returns {Promise} Axios response with stats (total, by type, top voted, etc.)
   */
  getFeedbackStats: () => api.get("/stats"),

  /**
   * Get specific feedback by ID
   * @param {string} id - Feedback MongoDB ObjectId
   * @returns {Promise} Axios response with feedback object
   */
  getFeedbackById: (id) => api.get(`/${id}`),

  /**
   * Update existing feedback (owner only)
   * @param {string} id - Feedback MongoDB ObjectId
   * @param {Object} data - Updated feedback data
   * @returns {Promise} Axios response with updated feedback
   */
  updateFeedback: (id, data) => api.patch(`/${id}`, data),

  /**
   * Delete feedback (owner only)
   * @param {string} id - Feedback MongoDB ObjectId
   * @returns {Promise} Axios response confirming deletion
   */
  deleteFeedback: (id) => api.delete(`/${id}`),

  /**
   * Upvote feedback to show support
   * Users can only upvote once per feedback item
   * @param {string} id - Feedback MongoDB ObjectId
   * @returns {Promise} Axios response with updated upvote count
   */
  upvoteFeedback: (id) => api.post(`/${id}/upvote`),
};

export default feedbackAPI;
