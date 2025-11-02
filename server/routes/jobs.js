import express from "express";
const router = express.Router();
import fetch from "node-fetch";

// GET /api/jobs/adzuna?query=software+developer&country=us&page=1&city=Mumbai&category=it-jobs
router.get("/adzuna", async (req, res) => {
  const {query, country = "us", page = 1, city, category} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;
  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${app_id}&app_key=${app_key}&results_per_page=20&what=${encodeURIComponent(
    query
  )}`;

  // Add city filter if provided
  if (city) {
    url += `&where=${encodeURIComponent(city)}`;
  }

  // Add category filter if provided
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: "Failed to fetch jobs from Adzuna"});
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({error: "Failed to fetch jobs", details: err.message});
  }
});

// GET /api/jobs/categories?country=in
router.get("/categories", async (req, res) => {
  const {country = "in"} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/categories?app_id=${app_id}&app_key=${app_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: "Failed to fetch categories from Adzuna"});
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({error: "Failed to fetch categories", details: err.message});
  }
});

// GET /api/jobs/top-companies?query=software&country=in
router.get("/top-companies", async (req, res) => {
  const {query = "jobs", country = "in"} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/top_companies?app_id=${app_id}&app_key=${app_key}&what=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: "Failed to fetch top companies from Adzuna"});
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({error: "Failed to fetch top companies", details: err.message});
  }
});

// GET /api/jobs/histogram?query=software&country=in
router.get("/histogram", async (req, res) => {
  const {query = "jobs", country = "in", location} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  let url = `https://api.adzuna.com/v1/api/jobs/${country}/histogram?app_id=${app_id}&app_key=${app_key}&what=${encodeURIComponent(
    query
  )}`;

  if (location) {
    url += `&where=${encodeURIComponent(location)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: "Failed to fetch histogram from Adzuna"});
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({error: "Failed to fetch histogram", details: err.message});
  }
});

// GET /api/jobs/geodata?query=software&country=in
router.get("/geodata", async (req, res) => {
  const {query = "jobs", country = "in"} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/geodata?app_id=${app_id}&app_key=${app_key}&what=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: "Failed to fetch geodata from Adzuna"});
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({error: "Failed to fetch geodata", details: err.message});
  }
});

// POST /api/jobs/smart-match - AI-powered job matching based on resume
router.post("/smart-match", async (req, res) => {
  const {skills, experience, summary, education, jobTitle, jobType} = req.body;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }

  try {
    // Extract keywords from resume data
    const keywords = extractKeywords(skills, experience, summary, jobTitle);

    // Use top 3-5 keywords for broader search results
    // Prioritize: job title > top skills > experience
    const topKeywords = keywords.slice(0, 5);

    // Modify search query based on job type
    let searchQuery = topKeywords.join(" ");

    // If searching for internships specifically, add "internship" keyword
    if (jobType === "internships") {
      searchQuery = "internship " + topKeywords.slice(0, 3).join(" ");
    }

    console.log("🔍 Smart Match - Keywords extracted:", keywords);
    console.log("🎯 Smart Match - Using top keywords:", topKeywords);
    console.log("🏷️ Smart Match - Job type:", jobType || "all");
    console.log("🌐 Smart Match - Search query:", searchQuery);

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=50&what=${encodeURIComponent(
      searchQuery
    )}&sort_by=relevance`;

    console.log("📡 Smart Match - API URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error("❌ Adzuna API error:", response.status);
      return res
        .status(response.status)
        .json({error: "Failed to fetch jobs from Adzuna"});
    }

    const data = await response.json();
    console.log("📦 Smart Match - Adzuna returned:", data.count, "jobs");

    // Calculate match scores and add insights
    const scoredJobs = data.results.map((job) => {
      const matchData = calculateMatchScore(job, {
        skills,
        experience,
        summary,
        education,
        jobTitle,
      });

      return {
        ...job,
        matchPercentage: matchData.score,
        matchInsights: matchData.insights,
        matchedKeywords: matchData.matchedKeywords,
      };
    });

    // Sort by match percentage
    scoredJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      count: scoredJobs.length,
      mean: data.mean,
      results: scoredJobs,
      searchKeywords: keywords,
    });
  } catch (err) {
    res.status(500).json({error: "Failed to match jobs", details: err.message});
  }
});

// Helper: Extract keywords from resume data
function extractKeywords(skills, experience, summary, jobTitle) {
  const skillKeywords = [];
  const titleKeywords = [];
  const experienceKeywords = [];

  // List of very senior titles to skip (too specific for job search)
  const seniorTitles = [
    "cto",
    "ceo",
    "founder",
    "co-founder",
    "president",
    "director",
    "vp",
    "chief",
  ];

  // 1. PRIORITY: Add skills first (most important)
  if (Array.isArray(skills)) {
    skills.forEach((skillGroup) => {
      if (skillGroup.items && Array.isArray(skillGroup.items)) {
        skillGroup.items.forEach((skill) => {
          if (typeof skill === "string" && skill.trim()) {
            const cleanSkill = skill.trim().toLowerCase();
            // Skip generic words
            if (
              cleanSkill.length > 2 &&
              !["and", "the", "for"].includes(cleanSkill)
            ) {
              skillKeywords.push(cleanSkill);
            }
          }
        });
      }
    });
  }

  // 2. Add job title words (but filter out very senior titles)
  if (jobTitle && typeof jobTitle === "string") {
    jobTitle.split(/[\s&,]+/).forEach((word) => {
      const cleanWord = word.toLowerCase().trim();
      if (cleanWord.length > 2 && !seniorTitles.includes(cleanWord)) {
        titleKeywords.push(cleanWord);
      }
    });
  }

  // 3. Add experience keywords (filter out senior titles here too)
  if (Array.isArray(experience)) {
    experience.forEach((exp) => {
      if (exp.title) {
        exp.title.split(/[\s&,]+/).forEach((word) => {
          const cleanWord = word.toLowerCase().trim();
          if (cleanWord.length > 3 && !seniorTitles.includes(cleanWord)) {
            experienceKeywords.push(cleanWord);
          }
        });
      }
    });
  }

  // 4. Combine: Skills first (max 8), then title (max 3), then experience (max 4)
  const allKeywords = [
    ...skillKeywords.slice(0, 8),
    ...titleKeywords.slice(0, 3),
    ...experienceKeywords.slice(0, 4),
  ];

  // Remove duplicates and return top 15
  return [...new Set(allKeywords)].slice(0, 15);
}

// Helper: Calculate match score between job and resume
function calculateMatchScore(job, resumeData) {
  const {skills, experience, summary, education, jobTitle} = resumeData;
  let score = 0;
  const insights = [];
  const matchedKeywords = [];

  const jobText = `${job.title} ${job.description} ${
    job.category?.label || ""
  }`.toLowerCase();

  // Match skills (40% weight)
  let skillMatches = 0;
  let totalSkills = 0;
  if (skills && Array.isArray(skills)) {
    skills.forEach((skillGroup) => {
      if (skillGroup.items && Array.isArray(skillGroup.items)) {
        skillGroup.items.forEach((skill) => {
          if (typeof skill === "string") {
            totalSkills++;
            if (jobText.includes(skill.toLowerCase())) {
              skillMatches++;
              matchedKeywords.push(skill);
            }
          }
        });
      }
    });
  }

  if (totalSkills > 0) {
    const skillScore = (skillMatches / totalSkills) * 40;
    score += skillScore;
    if (skillMatches > 0) {
      insights.push(
        `${skillMatches}/${totalSkills} of your skills match this job`
      );
    }
  }

  // Match job title/experience (30% weight)
  let experienceMatch = false;
  if (jobTitle && jobText.includes(jobTitle.toLowerCase())) {
    score += 15;
    experienceMatch = true;
    insights.push(`Your job title "${jobTitle}" matches this role`);
  }

  if (experience && Array.isArray(experience)) {
    experience.forEach((exp) => {
      if (exp.title && jobText.includes(exp.title.toLowerCase())) {
        score += 15;
        experienceMatch = true;
        insights.push(`Your experience as "${exp.title}" is relevant`);
      }
    });
  }

  // Match education (15% weight)
  if (education && Array.isArray(education)) {
    education.forEach((edu) => {
      if (edu.field && jobText.includes(edu.field.toLowerCase())) {
        score += 10;
        insights.push(`Your ${edu.field} education is relevant`);
      }
      if (edu.degree && jobText.includes(edu.degree.toLowerCase())) {
        score += 5;
      }
    });
  }

  // Match summary keywords (15% weight)
  if (summary && typeof summary === "string") {
    const summaryWords = summary.toLowerCase().split(/\s+/);
    const matchingWords = summaryWords.filter((word) => jobText.includes(word));
    const summaryScore = Math.min(
      (matchingWords.length / summaryWords.length) * 15,
      15
    );
    score += summaryScore;
  }

  // Bonus: Location match
  if (job.location?.display_name && resumeData.location) {
    if (
      job.location.display_name
        .toLowerCase()
        .includes(resumeData.location.toLowerCase())
    ) {
      score += 5;
      insights.push("Location matches your preference");
    }
  }

  // Ensure score doesn't exceed 100
  score = Math.min(Math.round(score), 100);

  // Add default insight if no specific matches
  if (insights.length === 0) {
    insights.push("This job may be a good fit based on general relevance");
  }

  return {
    score,
    insights,
    matchedKeywords,
  };
}

export default router;
