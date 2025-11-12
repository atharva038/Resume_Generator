const CHARACTER_LIMITS = {
  summary: 600,
  experience: {
    description: 400,
    maxItems: 3
  },
  education: {
    description: 200,
    maxItems: 2
  },
  projects: {
    description: 300,
    maxItems: 3
  },
  skills: {
    maxCategories: 6,
    itemsPerCategory: 15
  },
  certifications: {
    maxItems: 4
  },
  achievements: {
    maxItems: 6
  }
};

const A4_HEIGHT_PX = 1122;
const A4_WIDTH_PX = 794;
const MARGIN_BUFFER = 50;
const MAX_ALLOWED_HEIGHT = A4_HEIGHT_PX - MARGIN_BUFFER;

export const validateResumeLength = (element) => {
  if (!element) return { isValid: true, overflow: 0 };
  
  const height = element.scrollHeight;
  const overflow = height - MAX_ALLOWED_HEIGHT;
  
  return {
    isValid: height <= MAX_ALLOWED_HEIGHT,
    overflow: overflow > 0 ? overflow : 0,
    currentHeight: height,
    maxHeight: MAX_ALLOWED_HEIGHT
  };
};

export const getCharacterLimit = (section, field = null) => {
  if (field) {
    return CHARACTER_LIMITS[section]?.[field] || 500;
  }
  return CHARACTER_LIMITS[section] || 500;
};

export const validateFieldLength = (section, field, value, currentItems = 0) => {
  if (typeof value === 'string') {
    const limit = getCharacterLimit(section, field);
    return {
      isValid: value.length <= limit,
      current: value.length,
      limit: limit,
      remaining: limit - value.length
    };
  }
  
  if (Array.isArray(value)) {
    const limit = CHARACTER_LIMITS[section]?.maxItems || 10;
    return {
      isValid: value.length <= limit,
      current: value.length,
      limit: limit,
      remaining: limit - value.length
    };
  }
  
  return { isValid: true };
};

export const getResumeStats = (resumeData) => {
  if (!resumeData) return null;
  
  return {
    summary: resumeData.summary?.length || 0,
    experienceCount: resumeData.experience?.length || 0,
    educationCount: resumeData.education?.length || 0,
    projectsCount: resumeData.projects?.length || 0,
    skillsCount: resumeData.skills?.length || 0,
    certificationsCount: resumeData.certifications?.length || 0,
    achievementsCount: resumeData.achievements?.length || 0
  };
};

export { CHARACTER_LIMITS };
