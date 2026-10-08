import mongoose from "mongoose";
import multer from "multer";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import env from "../config/env.js";

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiError.badRequest("Validation failed", details);
  }
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for "${err.path}"`);
  }
  if (err instanceof multer.MulterError) {
    return ApiError.badRequest(err.message);
  }
  if (err?.type === "entity.parse.failed") {
    return ApiError.badRequest("Malformed JSON body");
  }
  return new ApiError(500, "Internal server error");
};

export const errorHandler = (err, req, res, _next) => {
  const apiError = normalizeError(err);

  if (apiError.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, err);
  }

  res.status(apiError.statusCode).json({
    message: apiError.message,
    ...(apiError.details && { details: apiError.details }),
    ...(!env.isProduction && apiError.statusCode >= 500 && { stack: err.stack }),
  });
};
