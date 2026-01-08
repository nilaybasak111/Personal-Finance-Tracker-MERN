import express from "express";
const router = express.Router();

import AiController from "../Controllers/aiController.js";
import { aiValidator } from "../Middlewares/validateInputs.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

// AI Testing Route
router.get("/", authMiddleware, (req, res) => {
  res.send("<h3>AI Page Works</h3>");
});

// AI Routes
router.post(
  "/parse",
  authMiddleware,
  aiValidator,
  AiController.parseTransaction
); // AI Route to Parse Transaction Data from Text to JSON

export default router;
