/**
 * Resume Template Utilities
 * Shared helpers for ATS-safe rendering, text deduplication, bullet sanitization,
 * and smart education degree/major/minor formatting.
 */

/**
 * Strips leading bullet symbols, asterisks, dashes, and duplicate symbols from bullet text.
 * Ensures text never renders on top of or double-bulleted with template bullet markers.
 *
 * @param {string|object} bullet - The bullet text or object
 * @returns {string} Cleaned text string without leading bullet symbols
 */
export const cleanBulletText = (bullet) => {
  if (!bullet) return "";
  const rawText =
    typeof bullet === "string"
      ? bullet
      : bullet?.text || bullet?.content || bullet?.value || "";

  if (!rawText || typeof rawText !== "string") return "";

  // Strip leading bullet symbols, dots, dashes, asterisks, triangles, diamonds and whitespace
  return rawText
    .replace(/^[\s•\-\*\u2022\u2023\u25E6\u2043\u2219\u25B8\u25AA\u25AB\u25CF\u25CB\u25C6\u25C7\u25BA\u25BC\u25A0\u25A1\u2713\u2714\u25B6\u25B7\u25C0\u25C1\u00B7\u22C5\u2219\u2043\u2022]+\s*/, "")
    .trim();
};

/**
 * Checks if a description paragraph is already duplicated or substantially covered by bullet points.
 * Prevents repeating the exact same text as a paragraph and again as bullet points.
 *
 * @param {string} description - The item description/overview
 * @param {Array<string|object>} bullets - List of bullet point items
 * @returns {boolean} True if the description is already covered by bullets and should be omitted
 */
export const isDescriptionDuplicatedInBullets = (description, bullets) => {
  if (!description || !bullets || !Array.isArray(bullets) || bullets.length === 0) {
    return false;
  }

  const bulletTexts = bullets
    .map((b) => (typeof b === "string" ? b : b?.text || b?.content || ""))
    .filter((t) => Boolean(t && t.trim()));

  // When bullet points exist, they are the primary structured accomplishments.
  // Displaying an un-editable, parsed description paragraph above the bullets creates
  // phantom lines that don't match the editor form and pushes resumes onto extra pages.
  if (bulletTexts.length > 0) {
    return true;
  }

  return false;
};

/**
 * Formats education degree, field of study, major, and minor into a clean, ATS-compliant string.
 * Handles inputs like:
 * - degree: "B.Tech", field: "Computer Science" -> "B.Tech in Computer Science"
 * - degree: "B.Tech", field: "Major Computer Science Minor Cyber Security" -> "B.Tech — Major in Computer Science, Minor in Cyber Security"
 * - degree: "B.Tech", field: "Major in CS, Minor in Cybersecurity" -> "B.Tech — Major in CS, Minor in Cybersecurity"
 * - degree: "Bachelor of Science", field: "in Data Science" -> "Bachelor of Science in Data Science"
 * - degree: "B.S.", field: "" -> "B.S."
 * - degree: "", field: "Computer Science" -> "Computer Science"
 *
 * @param {object} edu - The education item object
 * @returns {string} Formatted education title string
 */
export const formatEducationDegreeAndField = (edu) => {
  if (!edu) return "";
  const degree = (edu.degree || "").trim();
  const rawField = (
    edu.field ||
    edu.fieldOfStudy ||
    edu.major ||
    edu.specialization ||
    ""
  ).trim();
  const minor = (edu.minor || "").trim();

  // Combine rawField with minor if minor is stored as a separate property
  let fullField = rawField;
  if (minor && !fullField.toLowerCase().includes("minor")) {
    fullField = fullField ? `${fullField}, Minor in ${minor}` : `Minor in ${minor}`;
  }

  if (!degree && !fullField) return "";
  if (!fullField) return degree;
  if (!degree) return fullField;

  // Clean up user inputs like "Major Computer Science Minor Cyber Security"
  let formattedField = fullField;

  // If user typed "Major Computer Science Minor Cyber Security" without 'in' or commas
  if (/^major\s+([a-z0-9\s&]+?)\s+minor\s+(.+)$/i.test(formattedField)) {
    formattedField = formattedField.replace(
      /^major\s+([a-z0-9\s&]+?)\s+minor\s+(.+)$/i,
      (match, maj, min) => {
        const cleanMaj = maj.trim().replace(/^in\s+/i, "");
        const cleanMin = min.trim().replace(/^in\s+/i, "");
        return `Major in ${cleanMaj}, Minor in ${cleanMin}`;
      }
    );
  } else if (
    /^major\s+([a-z0-9\s&]+)$/i.test(formattedField) &&
    !/^major\s+in/i.test(formattedField)
  ) {
    formattedField = formattedField.replace(/^major\s+/i, "Major in ");
  }

  // Check if field contains Major/Minor or starts with punctuation/dash
  if (
    /^major/i.test(formattedField) ||
    /minor/i.test(formattedField) ||
    /^[-—–,:]/.test(formattedField)
  ) {
    if (/^[-—–,:]/.test(formattedField)) {
      return `${degree} ${formattedField}`;
    }
    return `${degree} — ${formattedField}`;
  }

  // If field already starts with "in "
  if (/^in\s+/i.test(formattedField)) {
    return `${degree} ${formattedField}`;
  }

  return `${degree} in ${formattedField}`;
};
