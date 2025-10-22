import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with auth token
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

export const feedbackAPI = {
  // Submit new feedback
  submitFeedback: (data) => api.post("/", data),

  // Get user's feedback
  getMyFeedback: (params) => api.get("/my-feedback", {params}),

  // Get feedback statistics
  getFeedbackStats: () => api.get("/stats"),

  // Get single feedback
  getFeedbackById: (id) => api.get(`/${id}`),

  // Update feedback
  updateFeedback: (id, data) => api.patch(`/${id}`, data),

  // Delete feedback
  deleteFeedback: (id) => api.delete(`/${id}`),

  // Upvote feedback
  upvoteFeedback: (id) => api.post(`/${id}/upvote`),
};

export default feedbackAPI;
