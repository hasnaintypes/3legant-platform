import jwt from "jsonwebtoken";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Load secret keys from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// @desc    Middleware to check if the user is authenticated
// @route   Private route
// @access  Private
export const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header (Bearer <token>)
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new ErrorResponse("Not authorized to access this route", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from the decoded token and attach user to request object
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }

    // Attach user to request object for use in route handlers
    req.user = user;

    next();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// @desc    Middleware to check if the user is an admin
// @route   Private route
// @access  Private, Admin-only
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return sendErrorResponse(
      res,
      new ErrorResponse("Not authorized as an admin", 403)
    );
  }
  next();
};
