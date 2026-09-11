export const getProfileImageUrl = (value) => {
  const rawUrl = typeof value === "string" ? value.trim() : value?.url || value?.src || "";
  const driveFileId = rawUrl.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([^/?&]+)/
  )?.[1];
  const resourceKey = rawUrl.match(/[?&]resourcekey=([^&]+)/)?.[1];

  return driveFileId
    ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1200${resourceKey ? `&resourcekey=${resourceKey}` : ""}`
    : rawUrl;
};

export const getProfileImageSources = (value) => {
  const imageUrl = getProfileImageUrl(value);
  const driveFileId = imageUrl.match(/[?&]id=([^&]+)/)?.[1];

  return driveFileId
    ? [
        imageUrl,
        `https://lh3.googleusercontent.com/d/${driveFileId}=w1200`,
        `https://drive.google.com/uc?export=view&id=${driveFileId}`,
      ]
    : [imageUrl];
};
