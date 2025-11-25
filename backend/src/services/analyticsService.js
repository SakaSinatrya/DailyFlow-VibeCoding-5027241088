const Expense = require("../models/Expense")
const Task = require("../models/Task")

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const formatKey = (date) => date.toISOString().split("T")[0]

const mapExpense = (expense) => ({
  id: expense._id,
  amount: expense.amount,
  category: expense.category,
  date: expense.date,
  notes: expense.notes,
  attachmentUrl: expense.attachmentUrl,
})

const mapTask = (task) => ({
  id: task._id,
  name: task.name,
  category: task.category,
  priority: task.priority,
  deadline: task.deadline,
  completed: task.completed,
  notes: task.notes,
})

const getExpenseSummaryData = async (userId) => {
  const expenses = await Expense.find({ user: userId }).sort({ date: -1 })
  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrow = new Date(todayStart)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const totals = { today: 0, week: 0, month: 0 }
  const categoryTotals = {}
  const dailyTotals = {}

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date)
    const amount = expense.amount

    if (expenseDate >= todayStart && expenseDate < tomorrow) {
      totals.today += amount
    }

    if (expenseDate >= weekStart && expenseDate < tomorrow) {
      totals.week += amount
    }

    if (expenseDate >= monthStart) {
      totals.month += amount
    }

    const dayKey = formatKey(startOfDay(expenseDate))
    dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + amount

    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount
  })

  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(todayStart)
    day.setDate(day.getDate() - i)
    const key = formatKey(day)
    last7Days.push({
      date: key,
      label: day.toLocaleDateString("id-ID", { weekday: "short" }),
      amount: dailyTotals[key] || 0,
    })
  }

  const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }))

  categoryBreakdown.sort((a, b) => b.amount - a.amount)

  const topCategory =
    categoryBreakdown.length > 0
      ? { name: categoryBreakdown[0].category, amount: categoryBreakdown[0].amount }
      : { name: "-", amount: 0 }

  return {
    totals,
    topCategory,
    byCategory: categoryBreakdown,
    weeklyTrend: last7Days,
    recentExpenses: expenses.slice(0, 5).map(mapExpense),
  }
}

const getTaskSummaryData = async (userId) => {
  const tasks = await Task.find({ user: userId }).sort({ deadline: 1 })
  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrow = new Date(todayStart)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)

  const todayTasks = []
  let todayCompleted = 0

  let weeklyTotal = 0
  let weeklyCompleted = 0
  const dayTotals = {}
  const upcoming = []

  tasks.forEach((task) => {
    const deadline = new Date(task.deadline)
    const key = formatKey(startOfDay(deadline))
    dayTotals[key] = dayTotals[key] || { total: 0, completed: 0 }
    dayTotals[key].total += 1
    if (task.completed) {
      dayTotals[key].completed += 1
    }

    if (deadline >= todayStart && deadline < tomorrow) {
      todayTasks.push(task)
      if (task.completed) todayCompleted += 1
    }

    if (deadline >= weekStart && deadline < tomorrow) {
      weeklyTotal += 1
      if (task.completed) weeklyCompleted += 1
    }

    if (!task.completed && deadline >= todayStart) {
      upcoming.push(task)
    }
  })

  const weeklyBreakdown = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    const key = formatKey(day)
    const totals = dayTotals[key] || { total: 0, completed: 0 }

    let status = "pending"
    let statusColor = "bg-gray-100 text-gray-700"

    if (totals.total === 0) {
      status = "pending"
      statusColor = "bg-gray-100 text-gray-700"
    } else if (totals.completed === totals.total) {
      status = "completed"
      statusColor = "bg-green-100 text-green-700"
    } else if (totals.completed === 0) {
      status = "pending"
      statusColor = "bg-red-100 text-red-700"
    } else {
      status = "partial"
      statusColor = "bg-yellow-100 text-yellow-700"
    }

    weeklyBreakdown.push({
      day: day.toLocaleDateString("id-ID", { weekday: "short" }),
      date: day.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      total: totals.total,
      completed: totals.completed,
      status,
      statusColor,
    })
  }

  upcoming.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  return {
    today: {
      total: todayTasks.length,
      completed: todayCompleted,
      tasks: todayTasks.map(mapTask),
    },
    weekly: {
      total: weeklyTotal,
      completed: weeklyCompleted,
      completionRate: weeklyTotal ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0,
      breakdown: weeklyBreakdown,
    },
    upcoming: upcoming.slice(0, 5).map(mapTask),
  }
}

module.exports = {
  getExpenseSummaryData,
  getTaskSummaryData,
}


