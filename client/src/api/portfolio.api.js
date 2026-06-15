import api from "./api";

export const portfolioAPI = {
  list: () => api.get("/portfolio"),
  createFromResume: (resumeId) =>
    api.post(`/portfolio/from-resume/${resumeId}`),
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
  downloadResume: (slug) =>
    api.get(`/portfolio/public/${slug}/resume`, {responseType: "blob"}),
  getResumeDownloadUrl: (slug) =>
    api.getUri({url: `/portfolio/public/${slug}/resume`}),
  trackView: (slug) => api.post(`/portfolio/public/${slug}/view`),
  trackResumeDownload: (slug) =>
    api.post(`/portfolio/public/${slug}/resume-download`),
  trackContactClick: (slug) =>
    api.post(`/portfolio/public/${slug}/contact-click`),
  trackProjectClick: (slug) =>
    api.post(`/portfolio/public/${slug}/project-click`),

  generateAbout: (portfolioId, data = {}) =>
    api.post(`/portfolio/${portfolioId}/ai/about`, data),
  improveProjectDescription: (portfolioId, data) =>
    api.post(`/portfolio/${portfolioId}/ai/project-description`, data),
  generateSeo: (portfolioId) => api.post(`/portfolio/${portfolioId}/ai/seo`),
};

export default portfolioAPI;
