import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as GitHubStrategy} from "passport-github2";
import User from "../models/User.model.js";

/**
 * Passport Configuration for OAuth Authentication
 * Supports Google and GitHub OAuth 2.0
 */

// ==========================================
// SERIALIZE/DESERIALIZE USER
// ==========================================

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ==========================================
// GOOGLE OAUTH STRATEGY
// ==========================================

// Only initialize Google strategy if credentials are provided
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.includes("PLACEHOLDER")
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({googleId: profile.id});

          if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Check if user exists with same email (link accounts)
          user = await User.findOne({email: profile.emails[0].value});

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.provider = "google";
            user.profilePicture =
              user.profilePicture || profile.photos[0]?.value;
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            provider: "google",
            profilePicture: profile.photos[0]?.value,
            lastLogin: new Date(),
          });

          done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          done(error, null);
        }
      }
    )
  );
  console.log("✅ Google OAuth strategy initialized");
} else {
  console.log(
    "⚠️  Google OAuth not configured - set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
  );
}

// ==========================================
// GITHUB OAUTH STRATEGY
// ==========================================

// Only initialize GitHub strategy if credentials are provided
if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  !process.env.GITHUB_CLIENT_ID.includes("PLACEHOLDER")
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this GitHub ID
          let user = await User.findOne({githubId: profile.id});

          if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // GitHub may not return email in profile, get primary email
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.local`;

          // Check if user exists with same email (link accounts)
          user = await User.findOne({email});

          if (user) {
            // Link GitHub account to existing user
            user.githubId = profile.id;
            user.provider = "github";
            user.profilePicture =
              user.profilePicture || profile.photos[0]?.value;
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            githubId: profile.id,
            email,
            name: profile.displayName || profile.username,
            provider: "github",
            profilePicture: profile.photos[0]?.value,
            lastLogin: new Date(),
          });

          done(null, user);
        } catch (error) {
          console.error("GitHub OAuth error:", error);
          done(error, null);
        }
      }
    )
  );
  console.log("✅ GitHub OAuth strategy initialized");
} else {
  console.log(
    "⚠️  GitHub OAuth not configured - set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
  );
}

export default passport;
