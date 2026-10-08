import ApiError from "./ApiError.js";

/**
 * Multipart forms send arrays as JSON strings. Accepts an array, a JSON
 * string, or nothing, and always returns an array.
 */
const parseJsonArray = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return parsed;
  } catch {
    throw ApiError.badRequest(`"${fieldName}" must be a JSON array`);
  }
};

export default parseJsonArray;
