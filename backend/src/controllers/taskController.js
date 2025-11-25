const mongoose = require("mongoose")
const Task = require("../models/Task")
const asyncHandler = require("../utils/asyncHandler")
const { getTaskSummaryData } = require("../services/analyticsService")
const { validateTask } = require("../utils/validate")

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getTasks = asyncHandler(async (req, res) => {
  const { range, status, startDate, endDate } = req.query
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit || '50', 10)))
  const skip = (page - 1) * limit

  const query = { user: req.user._id }

  if (status === "completed") {
    query.completed = true
  } else if (status === "pending") {
    query.completed = false
  }

  if (range === "today") {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    query.deadline = { $gte: start, $lt: end }
  } else if (range === "week") {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    const end = new Date(today)
    end.setHours(23, 59, 59, 999)
    query.deadline = { $gte: start, $lte: end }
  } else {
    const start = parseDate(startDate)
    const end = parseDate(endDate)
    if (start || end) {
      query.deadline = {}
      if (start) query.deadline.$gte = start
      if (end) {
        const endOfDay = new Date(end)
        endOfDay.setHours(23, 59, 59, 999)
        query.deadline.$lte = endOfDay
      }
    }
  }

  const total = await Task.countDocuments(query)
  const tasks = await Task.find(query).sort({ deadline: 1 }).skip(skip).limit(limit)
  res.json({ tasks, meta: { total, page, limit } })
})

const createTask = asyncHandler(async (req, res) => {
  const { name, category, deadline, priority, notes } = req.body

  const { valid, errors } = validateTask(req.body, { requireAll: true })
  if (!valid) return res.status(400).json({ message: errors.join(', ') })

  const task = await Task.create({
    user: req.user._id,
    name,
    category: category || "personal",
    deadline: new Date(deadline),
    priority: priority || "medium",
    notes,
  })

  res.status(201).json({ task })
})

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id" })
  }

  const task = await Task.findOne({ _id: id, user: req.user._id })
  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  const { name, category, deadline, priority, notes, completed } = req.body

  const { valid, errors } = validateTask(req.body, { requireAll: false })
  if (!valid) return res.status(400).json({ message: errors.join(', ') })

  if (name !== undefined) task.name = name
  if (category) task.category = category
  if (deadline) task.deadline = new Date(deadline)
  if (priority) task.priority = priority
  if (notes !== undefined) task.notes = notes
  if (completed !== undefined) task.completed = completed

  await task.save()

  res.json({ task })
})

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id" })
  }

  const task = await Task.findOneAndDelete({ _id: id, user: req.user._id })
  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  res.json({ message: "Task deleted" })
})

const getTaskSummary = asyncHandler(async (req, res) => {
  const summary = await getTaskSummaryData(req.user._id)
  res.json(summary)
})

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskSummary,
}


