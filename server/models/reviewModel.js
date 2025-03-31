import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            // Basic URL validation
            return /^https?:\/\/.+/.test(v);
          },
          message: "Invalid image URL",
        },
      },
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product's average rating and total reviews
reviewSchema.post("save", async function () {
  const Product = mongoose.model("Product");
  const productId = this.product;

  const stats = await this.constructor.aggregate([
    { $match: { product: productId, status: "approved" } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      "ratings.averageRating": Math.round(stats[0].averageRating * 10) / 10,
      "ratings.totalReviews": stats[0].totalReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      "ratings.averageRating": 0,
      "ratings.totalReviews": 0,
    });
  }
});

// Also update product ratings when a review is removed
reviewSchema.post("remove", async function () {
  await this.constructor.post("save").apply(this);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
