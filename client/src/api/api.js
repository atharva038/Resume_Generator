/**
 * Main API Service Module
 *
 * Provides centralized API client and service functions for:
 * - Authentication (register, login, get current user)
 * - Resume operations (CRUD, upload, enhance, analyze)
 * - Contact form management
 * - AI-powered job matching and skill analysis
 *
 * Features:
 * - Automatic JWT token injection via interceptors
 * - Comprehensive error handling with status-specific actions
 * - Toast notifications for user feedback
 * - Axios instance with default configuration
 *
 * @module api
 */

import axios from "axios";
import {authStorage} from "@/utils/storage";
import {handleErrorByStatus} from "@/utils/errorHandler";
import {config} from "@/utils/constants";
import toast from "react-hot-toast";

const API_BASE_URL = config.apiUrl;

/**
 * Axios instance with default configuration
 * Base URL and headers are automatically applied to all requests
 * JWT tokens are automatically attached via request interceptor
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with comprehensive error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    handleErrorByStatus(error, {
      401: () => {
        // Token is invalid or expired - redirect to login
        console.error("Authentication failed - token may be expired");
        authStorage.clearAuth();

        // Only redirect if not already on login/register page
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
        }
      },
      403: () => {
        // Permission denied
        toast.error("You don't have permission to perform this action");
      },
      429: () => {
        // Rate limit exceeded
        const retryAfter = error.response?.data?.retryAfter || "a few minutes";
        toast.error(`Too many requests. Please try again after ${retryAfter}`);
      },
      500: () => {
        // Server error
        toast.error("Server error. Please try again later.");
      },
      503: () => {
        // Service unavailable
        toast.error("Service temporarily unavailable. Please try again later.");
      },
      default: (err) => {
        // For other errors, log in development
        if (config.isDev) {
          console.error("API Error:", err);
        }
      },
    });

    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 *
 * @namespace authAPI
 * @example
 * import {authAPI} from '@/api/api';
 *
 * // Register new user
 * const response = await authAPI.register({ name: "John", email: "john@example.com", password: "pass123" });
 *
 * // Login
 * const {data} = await authAPI.login({ email: "john@example.com", password: "pass123" });
 * console.log(data.token); // JWT token
 *
 * // Get current user profile
 * const {data: user} = await authAPI.getCurrentUser();
 */
export const authAPI = {
  /**
   * Register a new user account
   * @param {Object} data - Registration data
   * @param {string} data.name - User's full name
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @returns {Promise} Axios response with user data and JWT token
   */
  register: (data) => api.post("/auth/register", data),

  /**
   * Authenticate user and receive JWT token
   * @param {Object} data - Login credentials
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @returns {Promise} Axios response with user data and JWT token
   */
  login: (data) => api.post("/auth/login", data),

  /**
   * Get current authenticated user's profile
   * Requires valid JWT token in storage
   * @returns {Promise} Axios response with user profile data
   */
  getCurrentUser: () => api.get("/auth/me"),
};

/**
 * Resume API endpoints for CRUD operations and AI enhancements
 *
 * @namespace resumeAPI
 * @example
 * import {resumeAPI} from '@/api/api';
 *
 * // Upload resume file for parsing
 * const formData = new FormData();
 * formData.append('resume', file);
 * const {data} = await resumeAPI.upload(formData);
 *
 * // Save parsed resume
 * await resumeAPI.save(resumeData);
 *
 * // List all user's resumes
 * const {data: resumes} = await resumeAPI.list();
 */
export const resumeAPI = {
  /**
   * Upload and parse resume file (PDF, DOCX)
   * @param {FormData} formData - Form data containing 'resume' file
   * @returns {Promise} Axios response with parsed resume data
   */
  upload: (formData) => {
    return api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * AI-enhance resume section content
   * @param {string} content - Original section content
   * @param {string} sectionType - Section type (summary, experience, skills, etc.)
   * @param {Object|null} resumeData - Full resume context (optional)
   * @param {string} customPrompt - Custom AI instructions (optional)
   * @returns {Promise} Axios response with enhanced content
   */
  enhance: (content, sectionType, resumeData = null, customPrompt = "") => {
    // Extract resumeId from resumeData
    const resumeId = resumeData?._id;

    return api.post("/resume/enhance", {
      content,
      sectionType,
      resumeData,
      customPrompt,
      resumeId, // Required by checkResumeSubscriptionAccess middleware
    });
  },

  /**
   * Generate professional summary from resume data using AI
   * @param {Object} resumeData - Complete resume data object
   * @returns {Promise} Axios response with generated summary text
   */
  generateSummary: (resumeData) => {
    const resumeId = resumeData?._id;
    return api.post("/resume/generate-summary", {
      resumeData,
      resumeId, // Required by checkResumeSubscriptionAccess middleware
    });
  },

  /**
   * Automatically categorize skills into groups using AI
   * @param {Array<string>} skills - Flat list of skills
   * @param {string} resumeId - Resume ID for subscription check
   * @returns {Promise} Axios response with categorized skills array
   */
  categorizeSkills: (skills, resumeId) => {
    return api.post("/resume/categorize-skills", {
      skills,
      resumeId, // Required by checkResumeSubscriptionAccess middleware
    });
  },

  /**
   * Organize achievements into categories using AI
   * @param {Array<string>} achievements - List of achievement strings
   * @param {string} resumeId - Resume ID for subscription check
   * @returns {Promise} Axios response with categorized achievements
   */
  segregateAchievements: (achievements, resumeId) => {
    return api.post("/resume/segregate-achievements", {
      achievements,
      resumeId, // Required by checkResumeSubscriptionAccess middleware
    });
  },

  /**
   * Process and format custom resume section using AI
   * @param {string} content - Raw section content
   * @param {string} title - Section title/header
   * @param {string} resumeId - Resume ID for subscription check
   * @returns {Promise} Axios response with processed section
   */
  processCustomSection: (content, title, resumeId) => {
    return api.post("/resume/process-custom-section", {
      content,
      title,
      resumeId, // Required by checkResumeSubscriptionAccess middleware
    });
  },

  /**
   * Analyze resume for ATS compatibility and scoring
   * @param {FormData} formData - Form data containing resume file
   * @returns {Promise} Axios response with ATS score and analysis
   */
  analyzeResume: (formData) => {
    return api.post("/ats/analyze-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Save new resume to database
   * @param {Object} resumeData - Complete resume data object
   * @returns {Promise} Axios response with saved resume (includes _id)
   */
  save: (resumeData) => api.post("/resume/save", resumeData),

  /**
   * Update existing resume by ID
   * @param {string} id - Resume MongoDB ObjectId
   * @param {Object} resumeData - Updated resume data
   * @returns {Promise} Axios response with updated resume
   */
  update: (id, resumeData) => api.put(`/resume/${id}`, resumeData),

  /**
   * Get all resumes for current authenticated user
   * @returns {Promise} Axios response with array of user's resumes
   */
  list: () => api.get("/resume/list"),

  /**
   * Get specific resume by ID
   * @param {string} id - Resume MongoDB ObjectId
   * @returns {Promise} Axios response with resume object
   */
  getById: (id) => api.get(`/resume/${id}`),

  /**
   * Delete resume by ID
   * @param {string} id - Resume MongoDB ObjectId
   * @returns {Promise} Axios response confirming deletion
   */
  delete: (id) => api.delete(`/resume/${id}`),

  /**
   * Track resume download for analytics
   * @param {string} resumeId - Resume ID to track download for
   * @returns {Promise} Axios response confirming tracking
   */
  trackDownload: (resumeId) => api.post("/resume/track-download", {resumeId}),
};

/**
 * Contact form API endpoints (Admin-accessible)
 *
 * @namespace contactAPI
 * @example
 * import {contactAPI} from '@/api/api';
 *
 * // Submit contact form
 * await contactAPI.submit({ name: "John", email: "john@example.com", message: "Hello" });
 *
 * // Admin: List all contact submissions
 * const {data} = await contactAPI.list({ status: 'pending' });
 */
export const contactAPI = {
  /**
   * Submit contact form message
   * @param {Object} data - Contact form data
   * @param {string} data.name - Sender's name
   * @param {string} data.email - Sender's email
   * @param {string} data.message - Message content
   * @returns {Promise} Axios response confirming submission
   */
  submit: (data) => api.post("/contact", data),

  /**
   * List contact submissions with optional filters (Admin only)
   * @param {Object} params - Query parameters (status, date range, etc.)
   * @returns {Promise} Axios response with array of contact submissions
   */
  list: (params) => api.get("/contact", {params}),

  /**
   * Get specific contact submission by ID (Admin only)
   * @param {string} id - Contact submission MongoDB ObjectId
   * @returns {Promise} Axios response with contact object
   */
  getById: (id) => api.get(`/contact/${id}`),

  /**
   * Update contact submission status (Admin only)
   * @param {string} id - Contact submission MongoDB ObjectId
   * @param {Object} data - Update data (e.g., {status: 'resolved'})
   * @returns {Promise} Axios response with updated contact
   */
  update: (id, data) => api.patch(`/contact/${id}`, data),

  /**
   * Delete contact submission (Admin only)
   * @param {string} id - Contact submission MongoDB ObjectId
   * @returns {Promise} Axios response confirming deletion
   */
  delete: (id) => api.delete(`/contact/${id}`),

  /**
   * Get contact form statistics (Admin only)
   * @returns {Promise} Axios response with stats (total, pending, resolved, etc.)
   */
  getStats: () => api.get("/contact/stats/summary"),
};

/**
 * AI-powered job matching and skill analysis API (Google Gemini)
 *
 * @namespace mlAPI
 * @example
 * import {mlAPI} from '@/api/api';
 *
 * // Calculate resume-job match score
 * const {data} = await mlAPI.calculateMatchScore(resumeData, jobDescription);
 * console.log(data.matchScore); // 0-100
 *
 * // Analyze skill gaps
 * const {data: gaps} = await mlAPI.analyzeSkillGaps(resumeData, jobDescription);
 */
export const mlAPI = {
  /**
   * Calculate match score between resume and job description
   * @param {Object} resumeData - Complete resume data object
   * @param {string} jobDescription - Job posting description text
   * @returns {Promise} Axios response with match score (0-100) and analysis
   */
  calculateMatchScore: (resumeData, jobDescription) =>
    api.post("/ml/match-score", {resumeData, jobDescription}),

  /**
   * Analyze skill gaps between resume and job requirements
   * @param {Object} resumeData - Complete resume data object
   * @param {string} jobDescription - Job posting description text
   * @returns {Promise} Axios response with missing skills and recommendations
   */
  analyzeSkillGaps: (resumeData, jobDescription) =>
    api.post("/ml/skill-gap-analysis", {resumeData, jobDescription}),

  /**
   * Quick match based on skills only (faster than full resume match)
   * @param {Array<string>} skills - List of candidate skills
   * @param {string} jobDescription - Job posting description text
   * @returns {Promise} Axios response with quick match score and key insights
   */
  quickMatch: (skills, jobDescription) =>
    api.post("/ml/quick-match", {skills, jobDescription}),
};

export default api;
