import User from "../models/User.model.js";
import {generateToken} from "../middleware/auth.middleware.js";

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const {email, password, name} = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({error: "All fields are required"});
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(409)
        .json({error: "User already exists with this email"});
    }

    // Create new user
    const user = new User({email, password, name});
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({error: "Registration failed"});
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({error: "Email and password are required"});
    }

    // Find user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
        status: user.status || "active",
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({error: "Login failed"});
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    res.json({user});
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({error: "Failed to get user profile"});
  }
};
