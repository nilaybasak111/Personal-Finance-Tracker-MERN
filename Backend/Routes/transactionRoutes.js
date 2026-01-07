import express from "express";
const router = express.Router();

import authMiddleware from "../Middlewares/authMiddleware.js";
import transactionController from "../Controllers/transactionController.js";
import { transactionValidator } from "../Middlewares/validateInputs.js";

// Transaction Testing Route
router.get("/test", authMiddleware, (req, res) => {
  res.send("<h3>Transaction Page</h3>");
});

// Transaction Routes
router.post(
  "/",
  authMiddleware,
  transactionValidator,
  transactionController.insertTransaction
); // Income or Expense Route

export default router;
