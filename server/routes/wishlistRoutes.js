import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  isInWishlist,
} from "../controllers/wishlistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's wishlist with pagination
router.get("/", getWishlist);

// Add product to wishlist
router.post("/", addToWishlist);

// Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/", clearWishlist);

// Check if product is in wishlist
router.get("/:productId/check", isInWishlist);

export default router;