import {useMemo} from "react";

export const isSectionCompleteForResume = (sectionId, data) => {
  if (!data) return false;

  switch (sectionId) {
    case "personal":
      return Boolean(data.name?.trim() && data.contact?.email?.trim());
    case "summary":
      return (data.summary || "").trim().length >= 20;
    case "skills":
      return Array.isArray(data.skills) && data.skills.length > 0;
    case "experience":
      return (
        Array.isArray(data.experience) &&
        data.experience.some((item) => item?.company || item?.title)
      );
    case "education":
      return Array.isArray(data.education) && data.education.length > 0;
    case "projects":
      return Array.isArray(data.projects) && data.projects.length > 0;
    case "certifications":
      return Array.isArray(data.certifications) && data.certifications.length > 0;
    case "achievements":
      return (
        Array.isArray(data.achievements) &&
        data.achievements.some((item) => (item || "").trim().length > 0)
      );
    case "customSections":
      return Array.isArray(data.customSections) && data.customSections.length > 0;
    default:
      return false;
  }
};

export const useSectionCompletion = ({sectionOrder, resumeData, isTrackableSection}) => {
  const trackableSectionIds = useMemo(
    () => sectionOrder.filter((sectionId) => isTrackableSection(sectionId)),
    [sectionOrder, isTrackableSection]
  );

  const sectionCompletionMap = useMemo(
    () =>
      trackableSectionIds.reduce((acc, sectionId) => {
        acc[sectionId] = isSectionCompleteForResume(sectionId, resumeData);
        return acc;
      }, {}),
    [trackableSectionIds, resumeData]
  );

  const completedSectionsCount = useMemo(
    () => Object.values(sectionCompletionMap).filter(Boolean).length,
    [sectionCompletionMap]
  );

  const completionPercentage = useMemo(
    () =>
      trackableSectionIds.length
        ? Math.round((completedSectionsCount / trackableSectionIds.length) * 100)
        : 0,
    [completedSectionsCount, trackableSectionIds.length]
  );

  const firstIncompleteSectionId = useMemo(
    () => trackableSectionIds.find((sectionId) => !sectionCompletionMap[sectionId]),
    [trackableSectionIds, sectionCompletionMap]
  );

  return {
    trackableSectionIds,
    sectionCompletionMap,
    completedSectionsCount,
    completionPercentage,
    firstIncompleteSectionId,
  };
};
