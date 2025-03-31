import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/ConfigDb.js";

dotenv.config();

// Connect to the database
connectDB()
  .then(() => {
    // Start the server after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); // Exit the process if DB connection fails
  });
