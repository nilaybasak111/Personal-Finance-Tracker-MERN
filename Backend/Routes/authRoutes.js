import express from "express";
const router = express.Router();

import authController from "../Controllers/authController.js";

// Auth Testing Route
router.get("/", (req, res) => {
  res.send("<h3>Auth Page Works</h3>");
});

router.post("/login", authController.logIn); // Login Route
router.post("/signup", authController.signUp); // Signup Route

export default router;
