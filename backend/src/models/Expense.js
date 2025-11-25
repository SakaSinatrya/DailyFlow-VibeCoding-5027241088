const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["food", "transport", "bills", "entertainment", "health", "other"],
      default: "other",
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
    },
  },
  { timestamps: true },
)

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense

