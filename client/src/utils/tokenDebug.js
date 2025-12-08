/**
 * Utility functions to debug JWT token issues
 * Use these in browser console to diagnose authentication problems
 */

/**
 * Check if token exists and is valid
 * Usage in console: checkToken()
 */
export const checkToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found in localStorage");
    return {
      exists: false,
      valid: false,
      message: "No token - please log in",
    };
  }

  try {
    // Decode token (without verification)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("❌ Invalid token format");
      return {
        exists: true,
        valid: false,
        message: "Token is corrupted - please log in again",
      };
    }

    const payload = JSON.parse(atob(parts[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = expirationDate < now;

    console.log("📋 Token Details:");
    console.log("  User ID:", payload.userId);
    console.log("  Email:", payload.email);
    console.log("  Issued:", new Date(payload.iat * 1000).toLocaleString());
    console.log("  Expires:", expirationDate.toLocaleString());
    console.log("  Status:", isExpired ? "❌ EXPIRED" : "✅ VALID");

    if (isExpired) {
      console.log(
        "\n💡 Action: Please log out and log in again to get a new token"
      );
      return {
        exists: true,
        valid: false,
        expired: true,
        expiresAt: expirationDate,
        message: "Token expired - please log in again",
      };
    }

    console.log("\n✅ Token is valid!");
    return {
      exists: true,
      valid: true,
      expired: false,
      expiresAt: expirationDate,
      userId: payload.userId,
      email: payload.email,
      message: "Token is valid",
    };
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return {
      exists: true,
      valid: false,
      message: "Token is corrupted - please log in again",
    };
  }
};

/**
 * Clear the current token
 * Usage in console: clearToken()
 */
export const clearToken = () => {
  localStorage.removeItem("token");
  console.log("✅ Token cleared. Please log in again.");
  return {
    success: true,
    message: "Token cleared - please log in again",
  };
};

/**
 * Get raw token
 * Usage in console: getToken()
 */
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token:", token);
    return token;
  } else {
    console.log("❌ No token found");
    return null;
  }
};

// Make functions available globally in development
if (import.meta.env.DEV) {
  window.checkToken = checkToken;
  window.clearToken = clearToken;
  window.getToken = getToken;
}
