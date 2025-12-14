import * as yup from "yup";

/**
 * Authentication Form Validation Schemas
 * Centralized Yup schemas for all auth-related forms
 */

// Login Schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Register Schema
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

// Forgot Password Schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

// Reset Password Schema
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Validate form data against a schema
 * @param {Object} schema - Yup schema
 * @param {Object} data - Form data to validate
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
export const validateWithSchema = async (schema, data) => {
  try {
    await schema.validate(data, {abortEarly: false});
    return {isValid: true, errors: {}};
  } catch (err) {
    const errors = {};
    err.inner.forEach((error) => {
      if (error.path) {
        errors[error.path] = error.message;
      }
    });
    return {isValid: false, errors};
  }
};

/**
 * Validate a single field
 * @param {Object} schema - Yup schema
 * @param {String} fieldName - Field name to validate
 * @param {*} value - Field value
 * @returns {String|null} - Error message or null
 */
export const validateField = async (schema, fieldName, value) => {
  try {
    await schema.validateAt(fieldName, {[fieldName]: value});
    return null;
  } catch (err) {
    return err.message;
  }
};
