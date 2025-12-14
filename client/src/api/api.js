import axios from "axios";
import {authStorage} from "@/utils/storage";
import {handleErrorByStatus} from "@/utils/errorHandler";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
        if (import.meta.env.DEV) {
          console.error("API Error:", err);
        }
      },
    });

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// Resume API
export const resumeAPI = {
  upload: (formData) => {
    return api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  enhance: (content, sectionType, resumeData = null, customPrompt = "") => {
    return api.post("/resume/enhance", {
      content,
      sectionType,
      resumeData,
      customPrompt,
    });
  },
  generateSummary: (resumeData) => {
    return api.post("/resume/generate-summary", {resumeData});
  },
  categorizeSkills: (skills) => {
    return api.post("/resume/categorize-skills", {skills});
  },
  segregateAchievements: (achievements) => {
    return api.post("/resume/segregate-achievements", {achievements});
  },
  processCustomSection: (content, title) => {
    return api.post("/resume/process-custom-section", {content, title});
  },
  analyzeResume: (formData) => {
    return api.post("/ats/analyze-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  save: (resumeData) => api.post("/resume/save", resumeData),
  update: (id, resumeData) => api.put(`/resume/${id}`, resumeData),
  list: () => api.get("/resume/list"),
  getById: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
  trackDownload: () => api.post("/resume/track-download"),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  list: (params) => api.get("/contact", {params}),
  getById: (id) => api.get(`/contact/${id}`),
  update: (id, data) => api.patch(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
  getStats: () => api.get("/contact/stats/summary"),
};

// AI Matching API (Google Gemini)
export const mlAPI = {
  calculateMatchScore: (resumeData, jobDescription) =>
    api.post("/ml/match-score", {resumeData, jobDescription}),
  analyzeSkillGaps: (resumeData, jobDescription) =>
    api.post("/ml/skill-gap-analysis", {resumeData, jobDescription}),
  quickMatch: (skills, jobDescription) =>
    api.post("/ml/quick-match", {skills, jobDescription}),
};

export default api;
