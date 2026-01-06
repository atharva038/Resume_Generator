/**
 * Storage Abstraction Layer
 * Centralized wrapper for localStorage with error handling and type safety
 */

/**
 * Storage utility wrapper for localStorage with error handling
 */
export const storage = {
  /**
   * Store data in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified for objects)
   * @returns {boolean} Success status
   */
  set: (key, value) => {
    try {
      // For objects/arrays, stringify. For primitives, convert to string directly
      const serializedValue =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      return false;
    }
  },

  /**
   * Retrieve data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key not found
   * @returns {any} Parsed value, defaultValue, or null if not found
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      // Try to parse as JSON, if it fails, return as plain string
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // If JSON.parse fails, it's likely a plain string (like a token)
        return item;
      }
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  },

  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has: (key) => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking ${key}:`, error);
      return false;
    }
  },

  /**
   * Get all keys from localStorage
   * @returns {string[]} Array of storage keys
   */
  keys: () => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error("Error getting storage keys:", error);
      return [];
    }
  },

  /**
   * Get storage size (approximate)
   * @returns {number} Size in bytes
   */
  size: () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error("Error calculating storage size:", error);
      return 0;
    }
  },
};

/**
 * Storage keys constants
 * Centralized keys to prevent typos and enable easy refactoring
 */
export const STORAGE_KEYS = {
  // Authentication
  TOKEN: "token",
  USER: "user",
  REFRESH_TOKEN: "refreshToken",

  // Theme & Preferences
  THEME: "theme",
  DARK_MODE: "darkMode",

  // Resume Data
  RESUME_DRAFT: "resume_draft",
  LAST_TEMPLATE: "last_template",
  LAST_RESUME_ID: "lastResumeId",

  // Editor State
  EDITOR_AUTO_SAVE: "editorAutoSave",
  EDITOR_ZOOM: "editorZoom",
  SHOW_PREVIEW: "showPreview",

  // User Preferences
  LANGUAGE: "language",
  NOTIFICATIONS_ENABLED: "notificationsEnabled",
  TOUR_COMPLETED: "tourCompleted",

  // Feature Flags
  BETA_FEATURES: "betaFeatures",
  AI_SUGGESTIONS_ENABLED: "aiSuggestionsEnabled",
};

/**
 * Higher-level storage functions for specific data types
 */
export const authStorage = {
  setToken: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
  getToken: () => storage.get(STORAGE_KEYS.TOKEN),
  removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),
  hasToken: () => storage.has(STORAGE_KEYS.TOKEN),

  setUser: (user) => storage.set(STORAGE_KEYS.USER, user),
  getUser: () => storage.get(STORAGE_KEYS.USER),
  removeUser: () => storage.remove(STORAGE_KEYS.USER),

  clearAuth: () => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export const themeStorage = {
  setTheme: (theme) => storage.set(STORAGE_KEYS.THEME, theme),
  getTheme: () => storage.get(STORAGE_KEYS.THEME, "light"),
  setDarkMode: (enabled) => storage.set(STORAGE_KEYS.DARK_MODE, enabled),
  getDarkMode: () => storage.get(STORAGE_KEYS.DARK_MODE, false),
};

export const resumeStorage = {
  setDraft: (draft) => storage.set(STORAGE_KEYS.RESUME_DRAFT, draft),
  getDraft: () => storage.get(STORAGE_KEYS.RESUME_DRAFT),
  clearDraft: () => storage.remove(STORAGE_KEYS.RESUME_DRAFT),
  hasDraft: () => storage.has(STORAGE_KEYS.RESUME_DRAFT),

  setLastTemplate: (template) =>
    storage.set(STORAGE_KEYS.LAST_TEMPLATE, template),
  getLastTemplate: () => storage.get(STORAGE_KEYS.LAST_TEMPLATE),

  setLastResumeId: (id) => storage.set(STORAGE_KEYS.LAST_RESUME_ID, id),
  getLastResumeId: () => storage.get(STORAGE_KEYS.LAST_RESUME_ID),
};

export default storage;
