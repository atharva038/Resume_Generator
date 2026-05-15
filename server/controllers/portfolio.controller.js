import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.model.js";
import PortfolioProject from "../models/PortfolioProject.model.js";
import Resume from "../models/Resume.model.js";

const DEFAULT_SECTION_ORDER = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "contact",
];

const VALID_SOCIAL_TYPES = new Set([
  "linkedin",
  "github",
  "twitter",
  "website",
  "leetcode",
  "behance",
  "dribbble",
  "other",
]);

const getUserId = (req) => req.user?._id || req.user?.userId;

const normalizeSlug = (value) => {
  const slug = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "portfolio";
};

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const getFirstProfessionalTitle = (resume) => {
  return (
    resume?.experience?.find((item) => item?.title)?.title ||
    resume?.resumeTitle ||
    ""
  );
};

const getSocialLinksFromResume = (resume) => {
  const links = [];
  const contact = resume?.contact || {};

  if (contact.linkedin) {
    links.push({
      label: "LinkedIn",
      url: contact.linkedin,
      type: "linkedin",
    });
  }

  if (contact.github) {
    links.push({
      label: "GitHub",
      url: contact.github,
      type: "github",
    });
  }

  if (contact.portfolio) {
    links.push({
      label: "Website",
      url: contact.portfolio,
      type: "website",
    });
  }

  return links.filter((link) => isValidUrl(link.url));
};

const createUniqueSlug = async (baseValue, ignoredPortfolioId = null) => {
  const baseSlug = normalizeSlug(baseValue);
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await Portfolio.exists({
      slug: candidate,
      ...(ignoredPortfolioId && {_id: {$ne: ignoredPortfolioId}}),
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const validateUrlFields = (fields) => {
  const invalidField = Object.entries(fields).find(([, value]) => {
    if (Array.isArray(value)) {
      return value.some((item) => item && !isValidUrl(item));
    }

    return value && !isValidUrl(value);
  });

  return invalidField?.[0] || null;
};

const validateSocialLinks = (links = []) => {
  if (!Array.isArray(links)) {
    return "Social links must be an array";
  }

  for (const link of links) {
    if (!isValidUrl(link?.url)) {
      return "Social links must use valid http or https URLs";
    }

    if (link?.type && !VALID_SOCIAL_TYPES.has(link.type)) {
      return `Unsupported social link type: ${link.type}`;
    }
  }

  return null;
};

const getOwnedPortfolio = async (portfolioId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    return null;
  }

  return Portfolio.findOne({_id: portfolioId, userId});
};

const getPortfolioWithProjects = async (portfolio) => {
  const projects = await PortfolioProject.find({
    portfolioId: portfolio._id,
  }).sort({order: 1, createdAt: 1});

  return {
    portfolio,
    projects,
  };
};

const handleDuplicateSlug = (error, res) => {
  if (error?.code === 11000 && error?.keyPattern?.slug) {
    res.status(409).json({
      error: "Portfolio slug is already taken",
    });
    return true;
  }

  return false;
};

const buildPublicPayload = (portfolio, resume, projects) => {
  const portfolioObject = portfolio.toObject();
  const resumeObject = resume?.toObject ? resume.toObject() : resume;

  return {
    portfolio: {
      id: portfolioObject._id,
      slug: portfolioObject.slug,
      title: portfolioObject.title,
      tagline: portfolioObject.tagline,
      professionalTitle: portfolioObject.professionalTitle,
      about: portfolioObject.about,
      location: portfolioObject.location,
      profileImage: portfolioObject.profileImage,
      heroImage: portfolioObject.heroImage,
      themeId: portfolioObject.themeId,
      colorPreset: portfolioObject.colorPreset,
      fontPreset: portfolioObject.fontPreset,
      socialLinks: portfolioObject.socialLinks,
      sections: portfolioObject.sections,
      sectionOrder: portfolioObject.sectionOrder,
      seo: portfolioObject.seo,
      settings: portfolioObject.settings,
      publishedAt: portfolioObject.publishedAt,
      contact: {
        email: portfolioObject.contact?.showEmail
          ? portfolioObject.contact?.email
          : "",
        phone: portfolioObject.contact?.showPhone
          ? portfolioObject.contact?.phone
          : "",
        showEmail: portfolioObject.contact?.showEmail,
        showPhone: portfolioObject.contact?.showPhone,
      },
    },
    resume: resumeObject
      ? {
          name: resumeObject.name,
          summary: resumeObject.summary,
          skills: resumeObject.skills,
          experience: resumeObject.experience,
          education: resumeObject.education,
          certifications: resumeObject.certifications,
          achievements: resumeObject.achievements,
          customSections: resumeObject.customSections,
        }
      : null,
    projects,
  };
};

export const createPortfolioFromResume = async (req, res) => {
  try {
    const userId = getUserId(req);
    const {resumeId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({error: "Invalid resume ID"});
    }

    const resume = await Resume.findOne({_id: resumeId, userId});

    if (!resume) {
      return res.status(404).json({error: "Resume not found"});
    }

    const professionalTitle = getFirstProfessionalTitle(resume);
    const slug = await createUniqueSlug(
      `${resume.name || "portfolio"} ${professionalTitle}`
    );

    const portfolio = await Portfolio.create({
      userId,
      resumeId: resume._id,
      slug,
      title: `${resume.name}'s Portfolio`,
      tagline: resume.summary || "",
      professionalTitle,
      about: resume.summary || "",
      location: resume.contact?.location || "",
      contact: {
        email: resume.contact?.email || "",
        phone: resume.contact?.phone || "",
        showEmail: Boolean(resume.contact?.email),
        showPhone: false,
      },
      socialLinks: getSocialLinksFromResume(resume),
      seo: {
        title: `${resume.name} | ${professionalTitle || "Portfolio"}`,
        description: resume.summary || "",
        keywords: [
          resume.name,
          professionalTitle,
          ...(resume.skills || []).flatMap((group) => group.items || []),
        ].filter(Boolean),
      },
      sectionOrder: DEFAULT_SECTION_ORDER,
    });

    const copiedProjects = await PortfolioProject.insertMany(
      (resume.projects || []).map((project, index) => ({
        userId,
        portfolioId: portfolio._id,
        resumeProjectId: project._id?.toString() || "",
        title: project.name || `Project ${index + 1}`,
        shortDescription: project.description || "",
        longDescription: project.bullets?.join("\n") || project.description || "",
        technologies: project.technologies || [],
        links: {
          live: isValidUrl(project.link) ? project.link : "",
        },
        highlights: project.bullets || [],
        featured: index < 3,
        order: index,
        visible: true,
      })),
      {ordered: true}
    );

    res.status(201).json({
      message: "Portfolio created from resume successfully",
      portfolio,
      projects: copiedProjects,
    });
  } catch (error) {
    if (handleDuplicateSlug(error, res)) return;

    console.error("Create portfolio from resume error:", error);
    res.status(500).json({
      error: error.message || "Failed to create portfolio",
    });
  }
};

export const getPortfolios = async (req, res) => {
  try {
    const userId = getUserId(req);

    const portfolios = await Portfolio.find({userId})
      .select(
        "resumeId slug title professionalTitle themeId status publishedAt analytics updatedAt createdAt"
      )
      .sort({updatedAt: -1});

    res.json({
      message: "Portfolios retrieved successfully",
      portfolios,
    });
  } catch (error) {
    console.error("Get portfolios error:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve portfolios",
    });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const payload = await getPortfolioWithProjects(portfolio);
    res.json(payload);
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve portfolio",
    });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const {
      slug,
      title,
      tagline,
      professionalTitle,
      about,
      location,
      profileImage,
      heroImage,
      themeId,
      colorPreset,
      fontPreset,
      contact,
      socialLinks,
      sections,
      sectionOrder,
      seo,
      settings,
    } = req.body;

    const urlError = validateUrlFields({
      profileImage,
      heroImage,
      ogImage: seo?.ogImage,
    });

    if (urlError) {
      return res.status(400).json({
        error: `${urlError} must be a valid http or https URL`,
      });
    }

    const socialError = validateSocialLinks(socialLinks);
    if (socialError) {
      return res.status(400).json({error: socialError});
    }

    if (slug !== undefined) {
      portfolio.slug = await createUniqueSlug(slug, portfolio._id);
    }

    const scalarUpdates = {
      title,
      tagline,
      professionalTitle,
      about,
      location,
      profileImage,
      heroImage,
      themeId,
      colorPreset,
      fontPreset,
    };

    Object.entries(scalarUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        portfolio[key] = value;
      }
    });

    if (contact !== undefined) {
      portfolio.contact = {
        ...portfolio.contact.toObject?.(),
        ...contact,
      };
      portfolio.markModified("contact");
    }

    if (socialLinks !== undefined) {
      portfolio.socialLinks = socialLinks;
    }

    if (sections !== undefined) {
      portfolio.sections = {
        ...portfolio.sections.toObject?.(),
        ...sections,
      };
      portfolio.markModified("sections");
    }

    if (sectionOrder !== undefined) {
      portfolio.sectionOrder = Array.isArray(sectionOrder)
        ? sectionOrder
        : portfolio.sectionOrder;
    }

    if (seo !== undefined) {
      portfolio.seo = {
        ...portfolio.seo.toObject?.(),
        ...seo,
      };
      portfolio.markModified("seo");
    }

    if (settings !== undefined) {
      portfolio.settings = {
        ...portfolio.settings.toObject?.(),
        ...settings,
      };
      portfolio.markModified("settings");
    }

    await portfolio.save();

    res.json({
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    if (handleDuplicateSlug(error, res)) return;

    console.error("Update portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to update portfolio",
    });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    await PortfolioProject.deleteMany({portfolioId: portfolio._id, userId});
    await portfolio.deleteOne();

    res.json({
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to delete portfolio",
    });
  }
};

export const createPortfolioProject = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    if (!req.body.title) {
      return res.status(400).json({error: "Project title is required"});
    }

    const urlError = validateUrlFields({
      live: req.body.links?.live,
      github: req.body.links?.github,
      caseStudy: req.body.links?.caseStudy,
      video: req.body.links?.video,
      images: (req.body.images || []).map((image) => image.url),
    });

    if (urlError) {
      return res.status(400).json({
        error: `${urlError} must be a valid http or https URL`,
      });
    }

    const projectCount = await PortfolioProject.countDocuments({
      portfolioId: portfolio._id,
    });

    const project = await PortfolioProject.create({
      ...req.body,
      userId,
      portfolioId: portfolio._id,
      order: req.body.order ?? projectCount,
    });

    res.status(201).json({
      message: "Portfolio project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create portfolio project error:", error);
    res.status(500).json({
      error: error.message || "Failed to create portfolio project",
    });
  }
};

export const updatePortfolioProject = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const project = await PortfolioProject.findOne({
      _id: req.params.projectId,
      portfolioId: portfolio._id,
      userId,
    });

    if (!project) {
      return res.status(404).json({error: "Portfolio project not found"});
    }

    const urlError = validateUrlFields({
      live: req.body.links?.live,
      github: req.body.links?.github,
      caseStudy: req.body.links?.caseStudy,
      video: req.body.links?.video,
      images: (req.body.images || []).map((image) => image.url),
    });

    if (urlError) {
      return res.status(400).json({
        error: `${urlError} must be a valid http or https URL`,
      });
    }

    const allowedFields = [
      "title",
      "shortDescription",
      "longDescription",
      "problem",
      "solution",
      "impact",
      "technologies",
      "role",
      "duration",
      "links",
      "images",
      "highlights",
      "featured",
      "order",
      "visible",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      message: "Portfolio project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update portfolio project error:", error);
    res.status(500).json({
      error: error.message || "Failed to update portfolio project",
    });
  }
};

export const deletePortfolioProject = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const project = await PortfolioProject.findOneAndDelete({
      _id: req.params.projectId,
      portfolioId: portfolio._id,
      userId,
    });

    if (!project) {
      return res.status(404).json({error: "Portfolio project not found"});
    }

    res.json({
      message: "Portfolio project deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio project error:", error);
    res.status(500).json({
      error: error.message || "Failed to delete portfolio project",
    });
  }
};

export const publishPortfolio = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const visibleSectionCount = Object.values(
      portfolio.sections?.toObject?.() || portfolio.sections || {}
    ).filter(Boolean).length;
    const hasContact =
      portfolio.contact?.email ||
      portfolio.contact?.phone ||
      portfolio.socialLinks?.some((link) => link.url);

    if (!portfolio.title && !portfolio.professionalTitle) {
      return res.status(400).json({
        error: "Add a title or professional title before publishing",
      });
    }

    if (!hasContact) {
      return res.status(400).json({
        error: "Add at least one contact or social link before publishing",
      });
    }

    if (visibleSectionCount === 0) {
      return res.status(400).json({
        error: "Enable at least one portfolio section before publishing",
      });
    }

    portfolio.status = "published";
    portfolio.publishedAt = portfolio.publishedAt || new Date();
    await portfolio.save();

    res.json({
      message: "Portfolio published successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Publish portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to publish portfolio",
    });
  }
};

export const unpublishPortfolio = async (req, res) => {
  try {
    const userId = getUserId(req);
    const portfolio = await getOwnedPortfolio(req.params.id, userId);

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    portfolio.status = "unpublished";
    await portfolio.save();

    res.json({
      message: "Portfolio unpublished successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Unpublish portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to unpublish portfolio",
    });
  }
};

export const getPublicPortfolio = async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const portfolio = await Portfolio.findOne({
      slug,
      status: "published",
    });

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    const [resume, projects] = await Promise.all([
      portfolio.resumeId
        ? Resume.findOne({
            _id: portfolio.resumeId,
            userId: portfolio.userId,
          }).select(
            "name summary skills experience education certifications achievements customSections"
          )
        : null,
      PortfolioProject.find({
        portfolioId: portfolio._id,
        visible: true,
      }).sort({featured: -1, order: 1, createdAt: 1}),
    ]);

    res.json(buildPublicPayload(portfolio, resume, projects));
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve public portfolio",
    });
  }
};

export const trackPublicView = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {slug: normalizeSlug(req.params.slug), status: "published"},
      {$inc: {"analytics.totalViews": 1}},
      {new: true}
    ).select("analytics");

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    res.json({message: "View tracked", analytics: portfolio.analytics});
  } catch (error) {
    console.error("Track portfolio view error:", error);
    res.status(500).json({
      error: error.message || "Failed to track portfolio view",
    });
  }
};

export const trackResumeDownload = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {slug: normalizeSlug(req.params.slug), status: "published"},
      {$inc: {"analytics.resumeDownloads": 1}},
      {new: true}
    ).select("analytics");

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    res.json({
      message: "Resume download tracked",
      analytics: portfolio.analytics,
    });
  } catch (error) {
    console.error("Track resume download error:", error);
    res.status(500).json({
      error: error.message || "Failed to track resume download",
    });
  }
};

export const trackContactClick = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {slug: normalizeSlug(req.params.slug), status: "published"},
      {$inc: {"analytics.contactClicks": 1}},
      {new: true}
    ).select("analytics");

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    res.json({
      message: "Contact click tracked",
      analytics: portfolio.analytics,
    });
  } catch (error) {
    console.error("Track contact click error:", error);
    res.status(500).json({
      error: error.message || "Failed to track contact click",
    });
  }
};

export const trackProjectClick = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {slug: normalizeSlug(req.params.slug), status: "published"},
      {$inc: {"analytics.projectClicks": 1}},
      {new: true}
    ).select("analytics");

    if (!portfolio) {
      return res.status(404).json({error: "Portfolio not found"});
    }

    res.json({
      message: "Project click tracked",
      analytics: portfolio.analytics,
    });
  } catch (error) {
    console.error("Track project click error:", error);
    res.status(500).json({
      error: error.message || "Failed to track project click",
    });
  }
};
