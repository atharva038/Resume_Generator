/**
 * Parse validation errors from backend response
 * Handles both express-validator format and standard error format
 */
export const parseValidationErrors = (error) => {
  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  const {data} = error.response;

  // Handle express-validator errors (array format)
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors.map((err) => err.message).join(". ");
  }

  // Handle standard error messages
  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  // Fallback based on status code
  const status = error.response.status;
  switch (status) {
    case 400:
      return "Invalid input. Please check your data.";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "Access denied.";
    case 404:
      return "Resource not found.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
};

/**
 * Format validation errors for display
 * Returns an object with field-specific errors if available
 */
export const formatFieldErrors = (error) => {
  if (
    !error.response?.data?.errors ||
    !Array.isArray(error.response.data.errors)
  ) {
    return null;
  }

  const fieldErrors = {};
  error.response.data.errors.forEach((err) => {
    if (err.field) {
      fieldErrors[err.field] = err.message;
    }
  });

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error) => {
  return error.response?.status === 400;
};

/**
 * Check if error is a rate limit error (429)
 */
export const isRateLimitError = (error) => {
  return error.response?.status === 429;
};

/**
 * Get retry after time for rate limit errors
 */
export const getRetryAfter = (error) => {
  if (!isRateLimitError(error)) return null;
  return error.response?.data?.retryAfter || "a few minutes";
};

/**
 * Get user-friendly error message
 * @param {Object} error - Error object
 * @returns {string} User-friendly message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || parseValidationErrors(error);
  } else if (error.request) {
    // Request made but no response
    return "Network error. Please check your connection.";
  } else {
    // Something else went wrong
    return error.message || "An unexpected error occurred";
  }
};

/**
 * Handle API errors with toast notifications
 * @param {Object} error - Error object
 * @param {string} fallbackMessage - Default message if none found
 * @param {Object} toastInstance - Optional toast instance (to avoid circular dependencies)
 * @returns {string} Error message
 *
 * Note: If using in a component, pass toast as third parameter:
 * handleApiError(error, "Failed to load data", toast);
 */
export const handleApiError = (
  error,
  fallbackMessage = "An error occurred",
  toastInstance = null
) => {
  const message = getErrorMessage(error) || fallbackMessage;

  // Don't show toast for 401 (handled by interceptor)
  if (error.response?.status !== 401 && toastInstance) {
    toastInstance.error(message);
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("API Error:", error);
  }

  return message;
};

/**
 * Handle specific HTTP error codes
 * @param {Object} error - Error object
 * @param {Object} handlers - Object with handler functions for specific status codes
 */
export const handleErrorByStatus = (error, handlers = {}) => {
  const status = error.response?.status;

  if (handlers[status]) {
    handlers[status](error);
  } else if (handlers.default) {
    handlers.default(error);
  } else {
    handleApiError(error);
  }
};

/**
 * Async error boundary wrapper
 * @param {Function} fn - Async function to wrap
 * @param {string} errorMessage - Custom error message
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (fn, errorMessage) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, errorMessage);
      throw error;
    }
  };
};
