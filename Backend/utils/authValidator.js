import { z } from "zod";

// Strong Password Rule - Requires at least 8 characters with:
// - At least one letter (A-Za-z)
// - At least one digit (0-9)
// - At least one special character from the defined set
const passwordRule =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

/**
 * Sign-up validation schema
 * Ensures users provide valid name, email, and strong password
 */
export const signUpSchema = z.object({
  // Name must be at least 2 characters long
  name: z.string().min(2, "Name must be at least 2 characters"),

  // Validates proper email format (user@domain.com)
  email: z.string().email("Invalid email format"),

  // Password validation combining regex + min length for clarity
  password: z
    .string()
    // Minimum 8 characters (also enforced by regex for consistency)
    .min(8, "Password must be at least 8 characters")
    // Enforces complexity using regex pattern
    .regex(
      passwordRule,
      "Password Must Contain A Letter, Number, and Special Character"
    ),
});

/**
 * Login validation schema
 * Simpler validation since we trust stored passwords
 */
export const logInSchema = z.object({
  // Email must be valid format
  email: z.string().email("Invalid email format"),

  // Password must be non-empty (Server-side Validation)
  password: z.string().min(1, "Password is required"),
});
