import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // CORS middleware
import helmet from "helmet"; // Helmet middleware for security
import errorHandler from "./middlewares/errorHandler.js"; // Global error handler middleware

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware for security and cross-origin requests
// CORS middleware configuration
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions)); // Apply the CORS middleware with the specified options

app.use(helmet()); // Adds various security headers to requests

// Raw body parser for Stripe webhooks
app.use("/api/orders/webhook", express.raw({ type: "application/json" }));

// Body parser middleware to handle JSON requests for all other routes
app.use(express.json()); // Parse incoming JSON requests

// Use routes
app.use("/api/auth", authRoutes); // Mount the auth routes on the "/api/auth" path
app.use("/api/user", userRoutes); // Mount the user routes on the "/api/user" path
app.use("/api/products", productRoutes); // Mount the product routes on the "/api/products" path
app.use("/api/wishlist", wishlistRoutes); // Mount the wishlist routes on the "/api/wishlist" path
app.use("/api/reviews", reviewRoutes); // Mount the review routes on the "/api/reviews" path
app.use("/api/cart", cartRoutes); // Mount the cart routes on the "/api/cart" path
app.use("/api/orders", orderRoutes); // Mount the order routes on the "/api/orders" path

// Global Error Handling Middleware
app.use(errorHandler); // This should be last to catch any unhandled errors

export default app;
