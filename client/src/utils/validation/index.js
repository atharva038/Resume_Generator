/**
 * Validation Schemas Index
 * Central export point for all Yup validation schemas
 */

export * from "./authSchemas";
export * from "./contactSchemas";

// Re-export validation helper functions with clear names
export {validateWithSchema, validateField} from "./authSchemas";
