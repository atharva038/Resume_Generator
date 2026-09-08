/**
 * Universal Image URL Normalizer
 * Resolves cloud sharing links (Google Drive, Google UserContent, Dropbox, OneDrive, etc.)
 * into direct, high-res embeddable image streams.
 */

export function resolveImageUrl(url) {
  if (!url || typeof url !== "string") return "";

  const cleanUrl = url.trim();
  if (!cleanUrl) return "";

  // 1. Google Drive & Google UserContent Direct Stream Resolver
  // Matches drive.google.com, docs.google.com, and lh3.googleusercontent.com
  if (
    cleanUrl.includes("drive.google.com") ||
    cleanUrl.includes("docs.google.com") ||
    cleanUrl.includes("googleusercontent.com")
  ) {
    const fileIdMatch =
      cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // drive.google.com/thumbnail?id=...&sz=w1600 is the most permissive endpoint that bypasses 403 blocks
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  // 2. Dropbox Direct Stream Resolver
  if (cleanUrl.includes("dropbox.com")) {
    if (cleanUrl.includes("?dl=0")) {
      return cleanUrl.replace("?dl=0", "?raw=1");
    }
    if (!cleanUrl.includes("raw=1") && !cleanUrl.includes("dl=1")) {
      return `${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}raw=1`;
    }
  }

  // 3. GitHub raw image
  if (cleanUrl.includes("github.com") && cleanUrl.includes("/blob/")) {
    return cleanUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }

  return cleanUrl;
}

export default resolveImageUrl;
