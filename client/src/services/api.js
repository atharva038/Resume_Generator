import axios from "axios";

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
  enhance: (content, sectionType) => {
    return api.post("/resume/enhance", {content, sectionType});
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
  save: (resumeData) => api.post("/resume/save", resumeData),
  update: (id, resumeData) => api.put(`/resume/${id}`, resumeData),
  list: () => api.get("/resume/list"),
  getById: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
};

export default api;
