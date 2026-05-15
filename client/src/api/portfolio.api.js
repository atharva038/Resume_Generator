import api from "./api";

export const portfolioAPI = {
  list: () => api.get("/portfolio"),
  createFromResume: (resumeId) => api.post(`/portfolio/from-resume/${resumeId}`),
  getById: (id) => api.get(`/portfolio/${id}`),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
  publish: (id) => api.post(`/portfolio/${id}/publish`),
  unpublish: (id) => api.post(`/portfolio/${id}/unpublish`),

  createProject: (portfolioId, data) =>
    api.post(`/portfolio/${portfolioId}/projects`, data),
  updateProject: (portfolioId, projectId, data) =>
    api.put(`/portfolio/${portfolioId}/projects/${projectId}`, data),
  deleteProject: (portfolioId, projectId) =>
    api.delete(`/portfolio/${portfolioId}/projects/${projectId}`),

  getPublic: (slug) => api.get(`/portfolio/public/${slug}`),
  trackView: (slug) => api.post(`/portfolio/public/${slug}/view`),
  trackResumeDownload: (slug) =>
    api.post(`/portfolio/public/${slug}/resume-download`),
  trackContactClick: (slug) =>
    api.post(`/portfolio/public/${slug}/contact-click`),
  trackProjectClick: (slug) =>
    api.post(`/portfolio/public/${slug}/project-click`),
};

export default portfolioAPI;
