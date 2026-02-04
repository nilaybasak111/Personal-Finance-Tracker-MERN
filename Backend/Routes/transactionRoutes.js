import express from "express";
const router = express.Router();

import authMiddleware from "../Middlewares/authMiddleware.js";
import transactionController from "../Controllers/transactionController.js";
import {
  transactionValidator,
  insertBulkTransactionsValidator,
} from "../Middlewares/validateInputs.js";

// Transaction Testing Route
router.get("/test", authMiddleware, (req, res) => {
  res.send("<h3>Transaction Page</h3>");
});

// Transaction Routes
router.get("/", authMiddleware, transactionController.fetchAllTransactions); // Fetch All Transactions

router.post(
  "/",
  authMiddleware,
  transactionValidator,
  transactionController.insertTransaction
); // Income or Expense Route

router.post(
  "/bulk",
  authMiddleware,
  insertBulkTransactionsValidator,
  transactionController.insertBulkTransactions
); // Insert Bulk or Single Transaction Route Get By AI

export default router;
