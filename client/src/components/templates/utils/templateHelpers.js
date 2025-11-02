/**
 * Template Helper Functions
 * Utility functions for resume template components
 */

/**
 * Format skills - handles both array and string
 */
export const formatSkills = (items, separator = " • ") => {
  if (Array.isArray(items)) {
    return items.join(separator);
  }
  if (typeof items === "string") {
    return items;
  }
  return "";
};

/**
 * Format date range
 */
export const formatDateRange = (startDate, endDate, present = "Present") => {
  if (!startDate) return "";

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : present;

  return `${start} - ${end}`;
};

/**
 * Format single date
 */
export const formatDate = (date) => {
  if (!date) return "";

  // If it's already formatted, return as is
  if (typeof date === "string" && date.includes("/")) {
    return date;
  }

  // Try to parse and format
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    const month = d.toLocaleString("en-US", {month: "short"});
    const year = d.getFullYear();
    return `${month} ${year}`;
  } catch {
    return date;
  }
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  return phone;
};

/**
 * Format URL - remove protocol for display
 */
export const formatURL = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "");
};

/**
 * Truncate text to specific length
 */
export const truncate = (text, maxLength = 100, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
};

/**
 * Calculate duration between dates
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate) return "";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  if (isNaN(start.getTime())) return "";

  const diffMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (diffMonths < 1) return "Less than a month";
  if (diffMonths < 12)
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"}`;

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  let result = `${years} ${years === 1 ? "year" : "years"}`;
  if (months > 0) {
    result += `, ${months} ${months === 1 ? "month" : "months"}`;
  }

  return result;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Sort array by date (most recent first)
 */
export const sortByDate = (items, dateField = "startDate") => {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateField] || 0);
    const dateB = new Date(b[dateField] || 0);
    return dateB - dateA;
  });
};

/**
 * Check if section has content
 */
export const hasContent = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "string") return data.trim().length > 0;
  if (typeof data === "object") return Object.keys(data).length > 0;
  return false;
};

/**
 * Get section visibility based on resume data
 */
export const getSectionVisibility = (resumeData, sectionId) => {
  const sectionData = resumeData[sectionId];
  return hasContent(sectionData);
};

/**
 * Generate section order with defaults
 */
export const generateSectionOrder = (customOrder, defaultOrder) => {
  if (customOrder && customOrder.length > 0) {
    return customOrder.filter(
      (id) => !["score", "personal", "recommendations"].includes(id)
    );
  }
  return defaultOrder;
};

/**
 * Get custom section title or default
 */
export const getSectionTitle = (
  sectionId,
  customTitles = {},
  defaultTitles = {}
) => {
  return (
    customTitles[sectionId] ||
    defaultTitles[sectionId] ||
    sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
  );
};

export default {
  formatSkills,
  formatDateRange,
  formatDate,
  formatPhone,
  formatURL,
  truncate,
  calculateDuration,
  getInitials,
  sortByDate,
  hasContent,
  getSectionVisibility,
  generateSectionOrder,
  getSectionTitle,
};
