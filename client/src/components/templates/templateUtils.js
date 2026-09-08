/**
 * Resume Template Utilities
 * Shared helpers for ATS-safe rendering, text deduplication, and bullet sanitization
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

  const cleanDesc = (typeof description === "string" ? description : "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!cleanDesc) return false;

  const bulletTexts = bullets
    .map((b) => (typeof b === "string" ? b : b?.text || b?.content || ""))
    .filter(Boolean);

  if (bulletTexts.length === 0) return false;

  const joinedBullets = bulletTexts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // Exact match with joined bullets
  if (cleanDesc === joinedBullets) return true;

  // Normalized comparisons: remove punctuation to compare semantic content
  const stripPunct = (str) =>
    str.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  const punctFreeDesc = stripPunct(cleanDesc);
  const punctFreeJoined = stripPunct(joinedBullets);

  if (punctFreeDesc === punctFreeJoined) return true;

  // If any non-trivial bullet (>= 15 chars) is substantially contained in description or vice versa
  return bulletTexts.some((b) => {
    const cleanB = b.replace(/\s+/g, " ").trim().toLowerCase();
    const punctFreeB = stripPunct(cleanB);
    if (punctFreeB.length < 15) return false;
    return (
      cleanDesc.includes(cleanB) ||
      cleanB.includes(cleanDesc) ||
      punctFreeDesc.includes(punctFreeB) ||
      punctFreeB.includes(punctFreeDesc)
    );
  });
};
