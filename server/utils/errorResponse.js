// Utility to handle error responses in a consistent manner
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent class constructor (Error)
    this.statusCode = statusCode; // Set the HTTP status code
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}

// Function to send error response in a standard format
const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500; // Default to 500 for server errors
  const message = error.message || "Server Error";
  const stack = process.env.NODE_ENV === "production" ? null : error.stack; // Hide stack trace in production

  // Send a structured error response
  return res.status(statusCode).json({
    success: false,
    error: message,
    stack: stack, // Include stack trace only in non-production environments
  });
};

export { ErrorResponse, sendErrorResponse };
