import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { typr: String, required: true },
    limit: { type: Number, required: true },
    month: { type: String, required: true }, // "2026-01"
    createdAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
