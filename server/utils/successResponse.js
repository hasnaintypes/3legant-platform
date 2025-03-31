// Utility to handle success responses in a consistent manner

// Function to send success response in a standard format
const sendSuccessResponse = (res, data, message = "Request was successful") => {
  return res.status(200).json({
    success: true,
    message: message,
    data: data, // This could be any data you want to return, e.g. user data, messages, etc.
  });
};

export { sendSuccessResponse };
