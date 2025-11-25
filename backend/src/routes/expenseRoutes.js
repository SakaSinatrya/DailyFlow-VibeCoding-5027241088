const express = require("express")
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controllers/expenseController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.use(authMiddleware)

router.get("/", getExpenses)
router.post("/", createExpense)
router.get("/summary", getExpenseSummary)
router.put("/:id", updateExpense)
router.delete("/:id", deleteExpense)

module.exports = router


