import * as yup from "yup";

/**
 * Contact & Feedback Form Validation Schemas
 * Centralized Yup schemas for contact and feedback forms
 */

// Contact Form Schema
export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(
      /^[\d\s\-+()]*$/,
      "Phone number can only contain numbers, spaces, and symbols: + - ( )"
    )
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters")
    .optional(),
  company: yup
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  subject: yup
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .required("Subject is required"),
  category: yup
    .string()
    .oneOf(
      ["general", "support", "sales", "partnership", "feedback", "other"],
      "Please select a valid category"
    )
    .required("Category is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .required("Message is required"),
});

// Feedback Form Schema
export const feedbackSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(
      ["suggestion", "bug", "improvement", "other"],
      "Please select a valid feedback type"
    )
    .required("Feedback type is required"),
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .required("Description is required"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Please select a valid priority")
    .required("Priority is required"),
  category: yup
    .string()
    .oneOf(
      [
        "ui-ux",
        "feature-request",
        "performance",
        "ai-enhancement",
        "template",
        "authentication",
        "other",
      ],
      "Please select a valid category"
    )
    .required("Category is required"),
  browserInfo: yup.string().optional(),
  currentUrl: yup.string().url("Invalid URL format").optional(),
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
 * @param {Object} allValues - All form values (for cross-field validation)
 * @returns {String|null} - Error message or null
 */
export const validateField = async (
  schema,
  fieldName,
  value,
  allValues = {}
) => {
  try {
    await schema.validateAt(fieldName, {...allValues, [fieldName]: value});
    return null;
  } catch (err) {
    return err.message;
  }
};
