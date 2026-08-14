import api from "./api";

export const careerAPI = {
  // Profile
  getProfile: () => api.get("/career/profile"),
  updateProfile: (data) => api.put("/career/profile", data),
  structureWithAI: (section, rawText) =>
    api.post("/career/profile/ai-structure", { section, rawText }),
  importResume: (resumeId, selectedSections = []) =>
    api.post("/career/profile/import-resume", { resumeId, selectedSections }),
  getExportResumeFormat: () => api.get("/career/profile/export-resume-format"),

  // Q&A
  getQAItems: (params = {}) => api.get("/career/qa", { params }),
  generateAnswer: (payload) => api.post("/career/qa/generate", payload),
  saveAnswer: (payload) => api.post("/career/qa/save", payload),
  toggleStar: (payload) => api.post("/career/qa/toggle-star", payload),
  deleteQAItem: (id) => api.delete(`/career/qa/${id}`),

  // Job & Project Questions
  generateJobQuestions: (jobDescription) =>
    api.post("/career/qa/job-questions", { jobDescription }),
  generateProjectQuestions: (project) =>
    api.post("/career/qa/project-questions", { project }),
};

export default careerAPI;
