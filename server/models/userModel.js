import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
      required: false,
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    postalCode: {
      type: String,
      required: false,
      default: "",
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    }, // Role of the user (admin or user)
    // Add any other fields relevant to your e-commerce application
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ], // Cart for the user
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ], // Orders made by the user
  },
  {
    timestamps: true,
  } // Adds 'createdAt' and 'updatedAt' timestamps
);

export default mongoose.model("User", userSchema);
