import express from "express";
import {
  createOrder,
  getAdminOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes (user)
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderById);

// Protected routes (admin)
router.get("/admin/all", authMiddleware, adminMiddleware, getAdminOrders);
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
