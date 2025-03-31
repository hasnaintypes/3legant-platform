import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";

/**
 * @desc    Get reviews created by the authenticated user
 * @route   GET /api/reviews/myreviews
 * @access  Private
 */
export const getMyReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Review.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(total / limit);

    // Get user's reviews with pagination
    const reviews = await Review.find({ user: req.user._id })
      .populate({
        path: "product",
        select: "name images price",
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    sendSuccessResponse(
      res,
      {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasMore: page < totalPages,
        },
      },
      "My reviews fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      throw new ErrorResponse("You have already reviewed this product", 400);
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    // Update product's review statistics
    await updateProductReviewStats(productId);

    return sendSuccessResponse(
      res,
      { review },
      "Review created successfully",
      201
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews
 * @access  Public
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (productId) filter.product = productId;

    // Get total count for pagination
    const total = await Review.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get reviews with pagination
    const reviews = await Review.find(filter)
      .populate({
        path: "user",
        select: "name email avatar",
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    sendSuccessResponse(
      res,
      {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasMore: page < totalPages,
        },
      },
      "Reviews fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Find review
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new ErrorResponse("Review not found", 404);
    }

    // Verify review ownership
    if (review.user.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized to update this review", 403);
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product's review statistics
    await updateProductReviewStats(review.product);

    sendSuccessResponse(res, { review }, "Review updated successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
  try {
    // Find review
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new ErrorResponse("Review not found", 404);
    }

    // Verify review ownership
    if (review.user.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized to delete this review", 403);
    }

    const productId = review.product;

    // Delete review
    await Review.findByIdAndDelete(req.params.id);

    // Update product's review statistics
    await updateProductReviewStats(productId);

    sendSuccessResponse(res, null, "Review deleted successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get review statistics for a product
 * @route   GET /api/reviews/stats/:productId
 * @access  Public
 */
export const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get review statistics
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ["$averageRating", 1] },
          totalReviews: 1,
          ratingDistribution: {
            1: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 1] },
                },
              },
            },
            2: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 2] },
                },
              },
            },
            3: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 3] },
                },
              },
            },
            4: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 4] },
                },
              },
            },
            5: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 5] },
                },
              },
            },
          },
        },
      },
    ]);

    const reviewStats =
      stats.length > 0
        ? stats[0]
        : {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };

    sendSuccessResponse(
      res,
      { stats: reviewStats },
      "Review statistics fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Helper function to update product's review statistics
const updateProductReviewStats = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
};

/**
 * @desc    Get a single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "user",
      select: "name email avatar",
    });

    if (!review) {
      throw new ErrorResponse("Review not found", 404);
    }

    sendSuccessResponse(res, { review }, "Review fetched successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get all reviews (admin only)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
export const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.productId) filter.product = req.query.productId;
    if (req.query.userId) filter.user = req.query.userId;

    // Get total count for pagination
    const total = await Review.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get reviews with pagination and populate user and product details
    const reviews = await Review.find(filter)
      .populate({
        path: "user",
        select: "name email avatar",
      })
      .populate({
        path: "product",
        select: "name images price",
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    sendSuccessResponse(
      res,
      {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasMore: page < totalPages,
        },
      },
      "Reviews fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
