import { sendErrorResponse } from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  // Log error details (can be enhanced with more info or logging tools like Winston)
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack); // In development, log the stack trace
  }

  // Handle different types of errors
  if (!err.statusCode) {
    err.statusCode = 500; // Default to internal server error
  }

  // Send a structured error response using sendErrorResponse
  sendErrorResponse(res, err);
};

export default errorHandler;
