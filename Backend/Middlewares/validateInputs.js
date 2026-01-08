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

export const transactionValidator = (req, res, next) => {
  try {
    const { type, amount, category } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const aiValidator = (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is Required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const insertBulkTransactionsValidator = (req, res, next) => {
  try {
    const { transactions } = req.body;

    // Must Exist and Must be an Array
    if (
      !transactions ||
      typeof transactions !== "object" ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      return res.status(400).json({ message: "Transactions are required" });
    }

    // Validate Every Transaction
    for (const t of transactions) {
      if (!t.type || !t.amount || !t.category) {
        return res.status(400).json({ message: "All Fields Are Required" });
      }

      // Amount Ahould Be A Number
      if (isNaN(t.amount)) {
        return res.status(400).json({ message: "Amount must be a number" });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
