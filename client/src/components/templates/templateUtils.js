/**
 * Resume Template Utilities
 * Shared helpers for ATS-safe rendering and text deduplication
 */

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
