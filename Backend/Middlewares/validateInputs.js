// Middleware For Input Validation
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Parse req.body against the provided schema
    // Throws ZodError if validation fails
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Transform Zod issues into clean error objects
      const errors = error.issues.map((issue) => ({
        // Extract field name (e.g. 'email', 'password')
        field: issue.path[0],
        // Use the custom error message from schema
        message: issue.message,
      }));

      // Return 400 Bad Request with structured errors
      return res.status(400).json({ errors });
    }

    // Handle unexpected errors (non-Zod errors)
    console.error("Validation middleware error: ", error);
    return res.status(500).json({
      message: "Internal Validation Error",
    });
  }
};
