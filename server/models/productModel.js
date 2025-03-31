import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0, // 0 means no discount
    },
    finalPrice: {
      type: Number, // Auto-calculated field
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    colors: {
      type: [String], // Example: ["Red", "Blue", "Black"]
      required: true,
    },
    sizes: {
      type: [String], // Example: ["S", "M", "L", "XL"] for clothing, ["6", "7", "8", "9"] for shoes
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0, // Default stock is 0
    },
    SKU: {
      type: String,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
      enum: [
        "Shoes",
        "Dresses",
        "Children",
        "Women",
        "Men",
        "Watches",
        "Bags",
        "Jewelry",
        "Electronics",
        "Laptops",
        "Mobiles",
        "Accessories",
        "Gaming",
        "Furniture",
        "Home Decor",
        "Beauty",
        "Skin Care",
        "Hair Care",
        "Toys",
        "Baby Products",
        "Kitchen Appliances",
        "Books",
        "Sports",
        "Automotive",
        "Pets",
      ],
    },
    badge: {
      type: String,
      enum: ["Limited", "New", "Discounted", "Best Seller", "Trending"],
    },
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    warranty: {
      type: String, // Example: "1 Year Manufacturer Warranty"
    },
    returnPolicy: {
      type: String, // Example: "30-day return policy"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate final price based on discount
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discountPercentage) / 100;

  // Generate a unique SKU based on brand, category, and random ID
  if (!this.SKU) {
    this.SKU = `${this.brand.slice(0, 3).toUpperCase()}-${this.category[0]
      .slice(0, 3)
      .toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
  }

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
