import express from "express";
import {
  updateUserProfile,
  changePassword,
  getUserProfile,
  deleteUserAccount,
} from "../controllers/userControllers.js";
import validateRequest from "../middlewares/validateMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/userSchemas.js";

const router = express.Router();

// Route to get user profile (only for authenticated users)
router.get("/profile", authMiddleware, getUserProfile);

// Route to update user profile (with validation)
router.put(
  "/profile",
  authMiddleware,
  validateRequest(updateProfileSchema),
  updateUserProfile
);

// Route to change user password (with validation)
router.put(
  "/change-password",
  authMiddleware,
  validateRequest(changePasswordSchema),
  changePassword
);

// Route to delete user account (only for the logged-in user)
router.delete("/delete", authMiddleware, deleteUserAccount);

export default router;
