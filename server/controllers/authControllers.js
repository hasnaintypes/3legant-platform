import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Load secret keys from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Utility function to sanitize user object
const sanitizeUser = (user) => {
  const { _id, username, email, avatar, role } = user;
  return { _id, username, email, avatar, role };
};

// @desc    User Signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorResponse("Email is already in use", 409);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default to "user" if no role is provided
    });

    // Sanitize user before sending response
    const sanitizedUser = sanitizeUser(newUser);

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // Send the response with the token
    return sendSuccessResponse(
      res,
      { user: sanitizedUser, token },
      "User registered successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// @desc    User Sign-in
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorResponse("Invalid email or password", 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ErrorResponse("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // Sanitize user before sending response
    const sanitizedUser = sanitizeUser(user);

    return sendSuccessResponse(
      res,
      { user: sanitizedUser, token },
      "User signed in successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// @desc    User Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Clear the authentication token or session
    // If using cookies, you can clear the cookie here
    return sendSuccessResponse(res, null, "User logged out successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// @desc    Check if the user is authenticated
// @route   GET /api/auth/checkauth
// @access  Private
export const checkAuth = async (req, res) => {
  try {
    // The user data is added by the auth middleware (JWT token is verified)
    const user = req.user;

    // Sanitize user before sending the response to remove sensitive data (like password)
    const sanitizedUser = sanitizeUser(user);

    // Send success response with sanitized user data
    return sendSuccessResponse(
      res,
      { user: sanitizedUser },
      "User is authenticated"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// @desc    Get user details
// @route   GET /api/auth/user/:id
// @access  Private
export const getUser = async (req, res) => {
  try {
    // Get user ID from request params
    const userId = req.params.id;

    // Fetch user details by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }

    // Allow users to access their own profile or admins to access any profile
    if (req.user._id.toString() === userId || req.user.role === "admin") {
      const sanitizedUser = sanitizeUser(user);
      return sendSuccessResponse(
        res,
        { user: sanitizedUser },
        "User fetched successfully"
      );
    } else {
      throw new ErrorResponse("Access denied", 403);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
