import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const validateObjectId =
  (param = "id") =>
  (req, _res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      throw ApiError.badRequest(`Invalid ${param}`);
    }
    next();
  };

export default validateObjectId;
