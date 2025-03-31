import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import { sendSuccessResponse } from "../utils/successResponse.js";

/**
 * @desc    Create a new order and initiate payment
 * @route   POST /api/orders
 * @access  Private
 */ export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, shippingMethod, paymentMethod } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      throw new ErrorResponse("No items in order", 400);
    }
    if (!shippingAddress || !shippingMethod || !paymentMethod) {
      throw new ErrorResponse("Missing required order information", 400);
    }

    // Calculate totals and verify stock
    let totalItems = 0;
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new ErrorResponse(`Product not found: ${item.product}`, 404);
      }
      if (product.stock < item.quantity) {
        throw new ErrorResponse(
          `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
          400
        );
      }

      const itemTotal = product.finalPrice * item.quantity;
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: product.price,
        finalPrice: product.finalPrice,
        totalPrice: itemTotal,
      });

      totalItems += item.quantity;
      subtotal += itemTotal;
    }

    // Calculate shipping cost based on method
    const shippingCost = calculateShippingCost(shippingMethod);
    const finalTotal = subtotal + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalItems,
      subtotal,
      shippingAddress,
      shippingMethod,
      shippingCost,
      finalTotal,
      paymentMethod,
      paymentStatus: "paid", // Since we're not using Stripe, mark as paid
      orderStatus: "processing",
    });

    return sendSuccessResponse(
      res,
      { order },
      "Order placed successfully",
      201
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Helper function to calculate shipping cost
const calculateShippingCost = (method) => {
  switch (method) {
    case "express":
      return 15.99;
    case "overnight":
      return 29.99;
    case "standard":
    default:
      return 5.99;
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/admin
 * @access  Private/Admin
 */
export const getAdminOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccessResponse(
      res,
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasMore: page < Math.ceil(total / limit),
        },
      },
      "Orders fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccessResponse(
      res,
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasMore: page < Math.ceil(total / limit),
        },
      },
      "Orders fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      throw new ErrorResponse("Order not found", 404);
    }

    // Check if the user is authorized to view this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new ErrorResponse("Not authorized", 403);
    }

    return sendSuccessResponse(res, { order }, "Order fetched successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ErrorResponse("Order not found", 404);
    }

    order.status = status;
    await order.save();

    return sendSuccessResponse(
      res,
      { order },
      "Order status updated successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
