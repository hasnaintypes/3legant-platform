import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import { sendErrorResponse } from "../utils/errorResponse.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: "products.product",
        select: "name price images description discountPercentage finalPrice stock",
      })
      .slice("products", [skip, limit]);

    if (!wishlist) {
      return sendSuccessResponse(res, { products: [] }, "Wishlist is empty");
    }

    // Get total count for pagination
    const totalItems = wishlist.products.length;
    const totalPages = Math.ceil(totalItems / limit);

    sendSuccessResponse(
      res,
      {
        products: wishlist.products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasMore: page < totalPages,
        },
      },
      "Wishlist fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return sendErrorResponse(res, "Product not found", 404);
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if product is already in wishlist
    if (wishlist.hasProduct(productId)) {
      return sendErrorResponse(res, "Product already in wishlist", 400);
    }

    // Add product to wishlist
    wishlist.products.push({ product: productId });
    await wishlist.save();

    sendSuccessResponse(res, { wishlist }, "Product added to wishlist");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return sendErrorResponse(res, "Wishlist not found", 404);
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    );
    await wishlist.save();

    sendSuccessResponse(res, { wishlist }, "Product removed from wishlist");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return sendErrorResponse(res, "Wishlist not found", 404);
    }

    wishlist.products = [];
    await wishlist.save();

    sendSuccessResponse(res, null, "Wishlist cleared successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Check if product is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isInWishlist = wishlist ? wishlist.hasProduct(productId) : false;

    sendSuccessResponse(
      res,
      { isInWishlist },
      "Wishlist status checked successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};