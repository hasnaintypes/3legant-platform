import express from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getProductReviews,
  getMyReviews,
} from "../controllers/reviewControllers.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);
router.get("/:id", getReviewById);

// Protected routes
router.post("/", authMiddleware, createReview);
router.get("/myreviews", authMiddleware, getMyReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

// Protected routes (admin only)
router.get("/", authMiddleware, adminMiddleware, getReviews);

export default router;
