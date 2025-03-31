import express from "express";
import { signupSchema, loginSchema } from "../validators/authSchemas.js";
import {
  signup,
  signin,
  logout,
  checkAuth,
  getUser,
} from "../controllers/authControllers.js";
import validateRequest from "../middlewares/validateMiddleware.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply validation middleware to the signup route
router.post("/signup", validateRequest(signupSchema), signup);

// Apply validation middleware to the login route
router.post("/signin", validateRequest(loginSchema), signin);

// Apply authentication middleware to the logout route
router.post("/logout", authMiddleware, logout);

// Apply authentication middleware to the checkauth route
router.get("/checkauth", authMiddleware, checkAuth);

// Route to get user details by user ID, allowing only the logged-in user or an admin to access
router.get("/user/:id", authMiddleware, getUser);

// Admin-only route to view all users or perform other admin operations
router.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Admin logic to fetch all users or perform administrative tasks
      const users = await User.find();
      return sendSuccessResponse(res, { users }, "Users fetched successfully");
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }
);

export default router;
