const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message); // Extract error messages

      // Optional: Add structured field errors for better front-end handling
      const fieldErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages,
        fieldErrors: fieldErrors,
      });
    }
    next(); // Proceed to the next middleware or route handler
  };
};

export default validateRequest;
