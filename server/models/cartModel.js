import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalTotal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate totals
cartSchema.pre("save", async function (next) {
  let subtotal = 0;
  let totalItems = 0;

  // Calculate totals for each item
  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    // Validate stock availability
    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for product ${product.name}. Available: ${product.stock}`
      );
    }

    // Set item prices from product
    item.price = product.price;
    item.finalPrice = product.finalPrice;
    item.totalPrice = item.finalPrice * item.quantity;

    // Update running totals
    subtotal += item.totalPrice;
    totalItems += item.quantity;
  }

  // Update cart totals
  this.subtotal = subtotal;
  this.totalItems = totalItems;
  this.finalTotal = this.subtotal - this.discount;
  this.lastActive = new Date();

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;