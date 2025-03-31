import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import { sendSuccessResponse } from "../utils/successResponse.js";

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, color, size } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      throw new ErrorResponse("Product is out of stock", 400);
    }

    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    // Check if product already exists in cart
    const cartItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (cartItemIndex > -1) {
      // Update quantity if item exists
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        color,
        size,
        price: product.price,
        finalPrice: product.finalPrice,
        totalPrice: product.finalPrice * quantity,
      });
    }

    // Update cart totals
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save cart
    await cart.save();

    return sendSuccessResponse(
      res,
      { cart },
      "Item added to cart successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get cart details
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "name images finalPrice stock",
    });

    if (!cart) {
      return sendSuccessResponse(res, {
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    return sendSuccessResponse(res, { cart }, "Cart fetched successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get cart items count
 * @route   GET /api/cart/count
 * @access  Private
 */
export const getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart ? cart.totalItems : 0;

    return sendSuccessResponse(
      res,
      { count },
      "Cart items count fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new ErrorResponse("Cart not found", 404);
    }

    // Find cart item
    const cartItem = cart.items.id(req.params.itemId);
    if (!cartItem) {
      throw new ErrorResponse("Cart item not found", 404);
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    if (product.stock < quantity) {
      throw new ErrorResponse("Product is out of stock", 400);
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Update cart totals
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    return sendSuccessResponse(res, { cart }, "Cart item updated successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new ErrorResponse("Cart not found", 404);
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    // Update cart totals
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    return sendSuccessResponse(res, { cart }, "Cart item removed successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new ErrorResponse("Cart not found", 404);
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    return sendSuccessResponse(res, { cart }, "Cart cleared successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
