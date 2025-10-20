import express from "express";
import {getGitHubProfile} from "../controllers/github.controller.js";

const router = express.Router();

// @route   GET /api/github/:username
// @desc    Fetch GitHub profile and repository data
// @access  Public
router.get("/:username", getGitHubProfile);

export default router;
