import api from "./api";

/**
 * Career Application API client
 * Handles public submissions and protected admin portal operations.
 */
export const careerApplicationAPI = {
  // Public candidate submission
  submitApplication: (payload) => api.post("/career-applications/submit", payload),

  // Admin operations (automatically sends Bearer JWT token via interceptor)
  getAllApplications: (params = {}) => api.get("/career-applications", { params }),
  getApplicationById: (id) => api.get(`/career-applications/${id}`),
  updateStatus: (id, status) => api.patch(`/career-applications/${id}/status`, { status }),
  addFounderNote: (id, noteData) => api.patch(`/career-applications/${id}/notes`, noteData),
  updateRating: (id, rating) => api.patch(`/career-applications/${id}/rating`, { rating }),
  deleteApplication: (id) => api.delete(`/career-applications/${id}`),
};

export default careerApplicationAPI;
