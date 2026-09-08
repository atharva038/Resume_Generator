import logger from "@/utils/logger";

/**
 * Pure utility function to merge GitHub import data into resume data
 * @param {Object} prev - Existing resumeData object
 * @param {Object} importedData - GitHub payload with profile, projects, skills, experience, certifications
 * @returns {Object} Updated deep copy of resumeData
 */
export function mergeGitHubImportData(prev, importedData) {
  const updated = JSON.parse(JSON.stringify(prev || {}));

  // 1. Profile Data
  if (importedData.profile) {
    updated.contact = {
      ...updated.contact,
      github: importedData.profile.githubUrl,
      location: importedData.profile.location || updated.contact?.location,
    };
    if (importedData.profile.bio) {
      updated.summary = importedData.profile.bio;
    }
  }

  // 2. Projects
  if (importedData.projects && importedData.projects.length > 0) {
    const githubProjects = importedData.projects.map((repo) => ({
      name: repo.name,
      title: repo.name,
      description: repo.description || "No description provided",
      technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
      link: repo.url,
      bullets: [`${repo.stars} stars`, `${repo.forks} forks`],
      highlights: [`${repo.stars} stars`, `${repo.forks} forks`],
    }));

    if (importedData.mergeOptions?.projects === "replace") {
      updated.projects = githubProjects;
    } else {
      updated.projects = [...(updated.projects || []), ...githubProjects];
    }
  }

  // 3. Skills
  if (importedData.skills && importedData.skills.length > 0) {
    const isCategorized =
      Array.isArray(updated.skills) &&
      updated.skills.length > 0 &&
      updated.skills[0]?.category;

    if (importedData.mergeOptions?.skills === "replace") {
      if (isCategorized) {
        updated.skills = [
          {
            category: "GitHub Skills",
            items: importedData.skills,
          },
        ];
      } else {
        updated.skills = importedData.skills;
      }
    } else {
      if (isCategorized) {
        let githubCategory = updated.skills.find(
          (cat) => cat.category === "GitHub Skills"
        );

        if (githubCategory) {
          const existingItems = new Set(
            githubCategory.items.map((item) => item.toLowerCase())
          );
          const newSkills = importedData.skills.filter(
            (skill) => !existingItems.has(skill.toLowerCase())
          );
          githubCategory.items = [...githubCategory.items, ...newSkills];
        } else {
          updated.skills.push({
            category: "GitHub Skills",
            items: importedData.skills,
          });
        }
      } else {
        const existingSkills = new Set(
          (updated.skills || []).map((s) =>
            typeof s === "string"
              ? s.toLowerCase()
              : s.name?.toLowerCase() || ""
          )
        );
        const newSkills = importedData.skills.filter(
          (skill) =>
            !existingSkills.has(
              typeof skill === "string"
                ? skill.toLowerCase()
                : skill.name?.toLowerCase() || ""
            )
        );
        updated.skills = [...(updated.skills || []), ...newSkills];
      }
    }
    logger.log("✅ Skills imported:", updated.skills);
  }

  // 4. Experience
  if (importedData.experience && importedData.experience.length > 0) {
    const githubExperience = importedData.experience.map((exp) => ({
      company: exp.company,
      title: exp.position,
      position: exp.position,
      location: "",
      startDate: exp.period || "Present",
      endDate: "Present",
      current: true,
      bullets: exp.highlights || [],
      description: exp.description,
    }));

    if (importedData.mergeOptions?.experience === "replace") {
      updated.experience = githubExperience;
    } else {
      updated.experience = [
        ...(updated.experience || []),
        ...githubExperience,
      ];
    }
    logger.log("✅ Experience imported:", updated.experience);
  }

  // 5. Certifications
  if (importedData.certifications && importedData.certifications.length > 0) {
    const githubCertifications = importedData.certifications.map((cert) => ({
      title: cert.title,
      issuer: "GitHub",
      date: cert.date,
      description: cert.description,
    }));

    if (importedData.mergeOptions?.certifications === "replace") {
      updated.certifications = githubCertifications;
    } else {
      updated.certifications = [
        ...(updated.certifications || []),
        ...githubCertifications,
      ];
    }
    logger.log("✅ Certifications imported:", updated.certifications);
  }

  return updated;
}
