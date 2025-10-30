import express from "express";
const router = express.Router();
import fetch from "node-fetch";

// GET /api/jobs/adzuna?query=software+developer&country=us&page=1
router.get("/adzuna", async (req, res) => {
  const {query, country = "us", page = 1} = req.query;
  const app_id = process.env.ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;
  if (!app_id || !app_key) {
    return res
      .status(500)
      .json({error: "Missing Adzuna API credentials in .env"});
  }
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${app_id}&app_key=${app_key}&results_per_page=20&what=${encodeURIComponent(
    query
  )}`;
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

export default router;
