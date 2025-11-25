const { getExpenseSummaryData, getTaskSummaryData } = require("../services/analyticsService")
const asyncHandler = require("../utils/asyncHandler")

const getOverview = asyncHandler(async (req, res) => {
  const [expenses, tasks] = await Promise.all([
    getExpenseSummaryData(req.user._id),
    getTaskSummaryData(req.user._id),
  ])

  res.json({
    expenses,
    tasks,
  })
})

module.exports = {
  getOverview,
}


