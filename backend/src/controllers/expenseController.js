const mongoose = require("mongoose")
const Expense = require("../models/Expense")
const asyncHandler = require("../utils/asyncHandler")
const { getExpenseSummaryData } = require("../services/analyticsService")
const { validateExpense } = require("../utils/validate")

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, date } = req.query
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit || '50', 10)))
  const skip = (page - 1) * limit

  const query = { user: req.user._id }

  if (category && category !== "all") {
    query.category = category
  }

  if (date) {
    const target = parseDate(date)
    if (target) {
      const nextDay = new Date(target)
      nextDay.setDate(nextDay.getDate() + 1)
      query.date = { $gte: target, $lt: nextDay }
    }
  } else {
    const range = {}
    const start = parseDate(startDate)
    const end = parseDate(endDate)
    if (start) range.$gte = start
    if (end) {
      const endOfDay = new Date(end)
      endOfDay.setHours(23, 59, 59, 999)
      range.$lte = endOfDay
    }
    if (Object.keys(range).length) {
      query.date = range
    }
  }

  const total = await Expense.countDocuments(query)
  const expenses = await Expense.find(query).sort({ date: -1 }).skip(skip).limit(limit)
  res.json({ expenses, meta: { total, page, limit } })
})

const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, notes, attachmentUrl } = req.body

  const { valid, errors } = validateExpense(req.body, { requireAll: true })
  if (!valid) return res.status(400).json({ message: errors.join(', ') })

  const parsedAmount = Number(amount)

  const expense = await Expense.create({
    user: req.user._id,
    amount: parsedAmount,
    category: category || "other",
    date: new Date(date),
    notes,
    attachmentUrl,
  })

  res.status(201).json({ expense })
})

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid expense id" })
  }

  const expense = await Expense.findOne({ _id: id, user: req.user._id })
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  const { amount, category, date, notes, attachmentUrl } = req.body

  // validate partial payload
  const { valid, errors } = validateExpense(req.body, { requireAll: false })
  if (!valid) return res.status(400).json({ message: errors.join(', ') })

  if (amount !== undefined) {
    const parsedAmount = Number(amount)
    expense.amount = parsedAmount
  }

  if (category) expense.category = category
  if (date) expense.date = new Date(date)
  if (notes !== undefined) expense.notes = notes
  if (attachmentUrl !== undefined) expense.attachmentUrl = attachmentUrl

  await expense.save()

  res.json({ expense })
})

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid expense id" })
  }

  const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id })
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  res.json({ message: "Expense deleted" })
})

const getExpenseSummary = asyncHandler(async (req, res) => {
  const summary = await getExpenseSummaryData(req.user._id)
  res.json(summary)
})

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
}


