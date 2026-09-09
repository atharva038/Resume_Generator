/**
 * Normalizes resume data from API or navigation state to ensure all expected
 * fields, defaults, contacts, and section arrays are safely defined.
 *
 * @param {Object} rawData - Incoming resume object
 * @returns {Object} Cleaned, standardized resume object
 */
export function normalizeResumeData(rawData) {
  const data = { ...(rawData || {}) };

  if (!data.targetJobRole) {
    data.targetJobRole = "software-engineer";
  }

  if (!data.colorTheme) {
    const savedColorTheme = localStorage.getItem("selectedColorTheme");
    if (savedColorTheme) {
      data.colorTheme = savedColorTheme;
      localStorage.removeItem("selectedColorTheme");
    }
  }

  if (!data.contact || typeof data.contact !== "object") {
    data.contact = {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    };
  } else {
    data.contact = {
      email: data.contact.email || "",
      phone: data.contact.phone || "",
      location: data.contact.location || "",
      linkedin: data.contact.linkedin || "",
      github: data.contact.github || "",
      portfolio: data.contact.portfolio || "",
    };
  }

  if (!data.sectionTitles) {
    data.sectionTitles = {
      summary: "Professional Summary",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      projects: "Projects",
      certifications: "Certifications",
      achievements: "Achievements",
    };
  }

  if (!Array.isArray(data.skills)) {
    data.skills = [];
  } else {
    data.skills = data.skills
      .map((s) => (typeof s === "string" ? s : s?.name || s?.title || s?.label || ""))
      .filter(Boolean);
  }

  if (!Array.isArray(data.experience)) data.experience = [];
  if (!Array.isArray(data.education)) data.education = [];
  if (!Array.isArray(data.projects)) data.projects = [];
  if (!Array.isArray(data.certifications)) data.certifications = [];

  if (!Array.isArray(data.achievements)) {
    data.achievements = [];
  } else {
    data.achievements = data.achievements
      .map((a) => {
        if (typeof a === "string") return a;
        if (a && typeof a === "object") {
          return a.title
            ? a.description
              ? `${a.title}: ${a.description}`
              : a.title
            : a.description || "";
        }
        return "";
      })
      .filter(Boolean);
  }

  if (!Array.isArray(data.customSections)) data.customSections = [];
  if (!data.summary) data.summary = "";

  return data;
}
