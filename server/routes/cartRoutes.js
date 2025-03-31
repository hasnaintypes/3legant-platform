import express from "express";
import {
  getCart,
  addToCart,
  removeCartItem,
  clearCart,
  updateCartItem,
  getCartCount,
} from "../controllers/cartControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's cart
router.get("/", getCart);

// Get cart items count
router.get("/count", getCartCount);

// Add item to cart
router.post("/", addToCart);

// Update cart item quantity
router.put("/:itemId", updateCartItem);

// Remove item from cart
router.delete("/:itemId", removeCartItem);

// Clear cart
router.delete("/", clearCart);

export default router;
