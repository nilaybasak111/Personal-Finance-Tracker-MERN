import express from "express";
const router = express.Router();

import authController from "../Controllers/authController.js";
import { validate } from "../Middlewares/validateInputs.js";
import { signUpSchema, logInSchema } from "../utils/authValidator.js";

// Auth Testing Route
router.get("/", (req, res) => {
  res.send("<h3>Auth Page Works</h3>");
});

// Auth Routes
router.post("/login", validate(logInSchema), authController.logIn); // Login Route
router.post("/signup", validate(signUpSchema), authController.signUp); // Signup Route

export default router;
