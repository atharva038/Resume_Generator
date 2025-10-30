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

export default router;
