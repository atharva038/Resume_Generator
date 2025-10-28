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
